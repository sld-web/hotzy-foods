import { router, publicProcedure } from '../trpc';
import { prisma } from '@hotzy/database';
import { createOrderSchema } from '@hotzy/validators';

function generateOrderNumber(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `HZ-${num}`;
}

export const orderRouter = router({
  create: publicProcedure.input(createOrderSchema).mutation(async ({ input }) => {
    const { items, promoCode, customerEmail, customerName, ...shipping } = input;

    let customerId: string | undefined;
    if (customerEmail) {
      const customer = await prisma.customer.upsert({
        where: { email: customerEmail },
        update: {},
        create: { email: customerEmail, name: customerName || null, isGuest: !input.customerName },
      });
      customerId = customer.id;
    }

    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    let discountAmount = 0;

    let promoCodeId: string | undefined;
    if (promoCode) {
      const promo = await prisma.promoCode.findUnique({ where: { code: promoCode.toUpperCase() } });
      if (promo && promo.status === 'ACTIVE') {
        promoCodeId = promo.id;
        if (promo.type === 'PERCENTAGE') {
          discountAmount = (subtotal * Number(promo.value)) / 100;
        } else if (promo.type === 'FIXED_AMOUNT') {
          discountAmount = Number(promo.value);
        }
        await prisma.promoCode.update({
          where: { id: promo.id },
          data: { currentUses: { increment: 1 } },
        });
      }
    }

    const shippingCost = subtotal >= 5000 ? 0 : 350;
    const total = subtotal - discountAmount + shippingCost;

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId,
        subtotal,
        shippingCost,
        tax: 0,
        total,
        promoCodeId,
        discountAmount,
        ...shipping,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.unitPrice * item.quantity,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    // Update customer totals
    if (customerId) {
      await prisma.customer.update({
        where: { id: customerId },
        data: {
          totalOrders: { increment: 1 },
          totalSpent: { increment: total },
        },
      });
    }

    return order;
  }),
});
