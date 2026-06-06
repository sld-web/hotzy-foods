import { TRPCError } from '@trpc/server';
import { router, publicProcedure } from '../trpc';
import { prisma } from '@hotzy/database';
import { createOrderSchema } from '@hotzy/validators';

const MAX_QUANTITY = 99;
const FREE_SHIPPING_THRESHOLD = 5000;
const STANDARD_SHIPPING_COST = 350;

function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `HZ-${ts}-${rand}`;
}

export const orderRouter = router({
  create: publicProcedure.input(createOrderSchema).mutation(async ({ input }) => {
    const { items, promoCode, customerEmail, customerName, ...shipping } = input;

    // M-12: Validate max quantity
    for (const item of items) {
      if (item.quantity > MAX_QUANTITY) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Quantity ${item.quantity} exceeds maximum of ${MAX_QUANTITY}`,
        });
      }
    }

    // C-02: Fetch products from DB to verify prices and check stock
    const productIds = [...new Set(items.map((i) => i.productId))];
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    let subtotal = 0;
    for (const item of items) {
      const dbProduct = productMap.get(item.productId);
      if (!dbProduct) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Product ${item.productId} not found`,
        });
      }
      if (!dbProduct.isActive) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Product "${dbProduct.name}" is not available`,
        });
      }
      // C-04: Check stock
      if (dbProduct.stockLevel < item.quantity) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Insufficient stock for "${dbProduct.name}": ${dbProduct.stockLevel} available`,
        });
      }
      // C-02: Use DB price, ignore client-provided unitPrice
      const dbPrice = Number(dbProduct.price);
      subtotal += dbPrice * item.quantity;
    }

    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
    let discountAmount = 0;
    let freeShipping = false;
    let promoCodeId: string | undefined;

    // C-03 + H-05: Full promo validation
    if (promoCode) {
      const promo = await prisma.promoCode.findUnique({ where: { code: promoCode.toUpperCase() } });
      if (!promo) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid promo code' });
      }
      if (promo.status !== 'ACTIVE') {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Promo code is not active' });
      }
      // Check expiry
      const now = new Date();
      if (promo.startsAt && promo.startsAt > now) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Promo code has not started yet' });
      }
      if (promo.expiresAt && promo.expiresAt < now) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Promo code has expired' });
      }
      // Check max uses
      if (promo.maxUses !== null && promo.currentUses >= promo.maxUses) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Promo code has reached maximum uses',
        });
      }
      // Check min order amount
      const minAmount = Number(promo.minOrderAmount || 0);
      if (subtotal < minAmount) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Minimum order amount of ${minAmount} required for this promo code`,
        });
      }

      promoCodeId = promo.id;
      if (promo.type === 'PERCENTAGE') {
        discountAmount = (subtotal * Number(promo.value)) / 100;
      } else if (promo.type === 'FIXED_AMOUNT') {
        discountAmount = Number(promo.value);
      } else if (promo.type === 'FREE_SHIPPING') {
        freeShipping = true;
      }
    }

    const finalShippingCost = freeShipping ? 0 : shippingCost;
    const total = subtotal - discountAmount + finalShippingCost;

    // C-05: Wrap everything in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Decrement stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockLevel: { decrement: item.quantity } },
        });
      }

      // Increment promo usage
      if (promoCodeId) {
        await tx.promoCode.update({
          where: { id: promoCodeId },
          data: { currentUses: { increment: 1 } },
        });
      }

      // Customer upsert
      let customerId: string | undefined;
      if (customerEmail) {
        const customer = await tx.customer.upsert({
          where: { email: customerEmail },
          update: {},
          create: {
            email: customerEmail,
            name: customerName || null,
            isGuest: !input.customerName,
          },
        });
        customerId = customer.id;
      }

      // Create order
      const order = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          customerId,
          subtotal,
          shippingCost: finalShippingCost,
          tax: 0,
          total,
          promoCodeId,
          discountAmount,
          ...shipping,
          items: {
            create: items.map((item) => {
              const dbPrice = Number(productMap.get(item.productId)!.price);
              return {
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: dbPrice,
                subtotal: dbPrice * item.quantity,
              };
            }),
          },
        },
        include: { items: { include: { product: true } } },
      });

      // Update customer totals
      if (customerId) {
        await tx.customer.update({
          where: { id: customerId },
          data: {
            totalOrders: { increment: 1 },
            totalSpent: { increment: total },
          },
        });
      }

      return order;
    });

    return order;
  }),
});
