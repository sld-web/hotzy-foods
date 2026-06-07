import { TRPCError } from '@trpc/server';
import { router, publicProcedure } from '../trpc';
import { prisma, Prisma } from '@hotzy/database';
import { createOrderSchema } from '@hotzy/validators';

const MAX_QUANTITY = 99;

function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = crypto.randomUUID().substring(0, 8).toUpperCase();
  return `HZ-${ts}-${rand}`;
}

export const orderRouter = router({
  create: publicProcedure.input(createOrderSchema).mutation(async ({ input, ctx }) => {
    const { items, promoCode, customerEmail, customerName, ...shipping } = input;
    const userAgent = ctx.req?.headers?.get('user-agent') || null;

    // H-07: If authenticated, force their email
    const effectiveEmail = ctx.customer ? ctx.customer.email : customerEmail?.toLowerCase();

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
    if (productIds.length !== items.length) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Duplicate products in order',
      });
    }
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

    // Read shipping config from DB settings (live config, not hardcoded)
    const siteSettings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
    const freeShippingThreshold = siteSettings?.freeShippingThreshold
      ? Number(siteSettings.freeShippingThreshold)
      : 5000;
    const standardShippingCost = siteSettings?.shippingBase
      ? Number(siteSettings.shippingBase)
      : 350;
    const shippingCost = subtotal >= freeShippingThreshold ? 0 : standardShippingCost;
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
        discountAmount = Math.min((subtotal * Number(promo.value)) / 100, subtotal);
      } else if (promo.type === 'FIXED_AMOUNT') {
        discountAmount = Math.min(Number(promo.value), subtotal);
      } else if (promo.type === 'FREE_SHIPPING') {
        freeShipping = true;
      }
    }

    const finalShippingCost = freeShipping ? 0 : shippingCost;
    const total = subtotal - discountAmount + finalShippingCost;

    // C-05: Wrap everything in a serializable transaction with retry for collisions
    const MAX_RETRIES = 3;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const order = await prisma.$transaction(
          async (tx: Prisma.TransactionClient) => {
            // Decrement stock
            for (const item of items) {
              await tx.product.update({
                where: { id: item.productId },
                data: { stockLevel: { decrement: item.quantity } },
              });
            }

            // Customer upsert (need customerId before promo checks)
            let customerId: string | undefined;
            if (ctx.customer) {
              customerId = ctx.customer.id;
            } else if (effectiveEmail) {
              const customer = await tx.customer.upsert({
                where: { email: effectiveEmail },
                update: {},
                create: {
                  email: effectiveEmail,
                  name: customerName || null,
                  isGuest: true,
                },
              });
              customerId = customer.id;
            }

            // Promo usage validation and increment (inside tx for race condition safety)
            if (promoCodeId) {
              const currentPromo = await tx.promoCode.findUnique({ where: { id: promoCodeId } });
              if (!currentPromo) {
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Promo code not found' });
              }
              if (
                currentPromo.maxUses !== null &&
                currentPromo.currentUses >= currentPromo.maxUses
              ) {
                throw new TRPCError({
                  code: 'BAD_REQUEST',
                  message: 'Promo code has reached maximum uses',
                });
              }
              if (currentPromo.maxPerUser !== null && customerId) {
                const existingUsage = await tx.order.count({
                  where: { promoCodeId, customerId },
                });
                if (existingUsage >= currentPromo.maxPerUser) {
                  throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'You have already used this promo code',
                  });
                }
              }
              await tx.promoCode.update({
                where: { id: promoCodeId },
                data: { currentUses: { increment: 1 } },
              });
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
                userAgent,
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
          },
          { isolationLevel: 'Serializable' },
        );

        return order;
      } catch (error: unknown) {
        const prismaError = error as { code?: string };
        if (prismaError.code === 'P2002' || prismaError.code === 'P2034') {
          if (attempt < MAX_RETRIES - 1) continue;
        }
        throw error;
      }
    }
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Order could not be processed. Please try again.',
    });
  }),
});
