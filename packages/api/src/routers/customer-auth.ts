import { router, publicProcedure, customerProcedure } from '../trpc';
import { prisma } from '@hotzy/database';
import {
  customerRegisterSchema,
  customerLoginSchema,
  createAddressSchema,
  updateAddressSchema,
} from '@hotzy/validators';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret';

export const customerAuthRouter = router({
  register: publicProcedure.input(customerRegisterSchema).mutation(async ({ input }) => {
    const existing = await prisma.customer.findUnique({ where: { email: input.email } });
    if (existing) {
      throw new TRPCError({ code: 'CONFLICT', message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const customer = await prisma.customer.create({
      data: {
        email: input.email,
        name: input.name,
        passwordHash,
        isGuest: false,
      },
    });

    const token = jwt.sign(
      { id: customer.id, email: customer.email, type: 'customer' },
      JWT_SECRET,
      {
        expiresIn: '30d',
      },
    );

    return { token, customer: { id: customer.id, email: customer.email, name: customer.name } };
  }),

  login: publicProcedure.input(customerLoginSchema).mutation(async ({ input }) => {
    const customer = await prisma.customer.findUnique({ where: { email: input.email } });
    if (!customer || !customer.passwordHash) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(input.password, customer.passwordHash);
    if (!valid) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: customer.id, email: customer.email, type: 'customer' },
      JWT_SECRET,
      {
        expiresIn: '30d',
      },
    );

    return { token, customer: { id: customer.id, email: customer.email, name: customer.name } };
  }),

  me: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.customer) return null;
    return prisma.customer.findUnique({
      where: { id: ctx.customer.id },
      include: { addresses: true },
    });
  }),

  updateProfile: customerProcedure
    .input(z.object({ name: z.string().min(1).optional(), phone: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      return prisma.customer.update({
        where: { id: ctx.customer.id },
        data: input,
      });
    }),

  addAddress: customerProcedure.input(createAddressSchema).mutation(async ({ ctx, input }) => {
    if (input.isDefault) {
      await prisma.address.updateMany({
        where: { customerId: ctx.customer.id },
        data: { isDefault: false },
      });
    }
    return prisma.address.create({
      data: { ...input, customerId: ctx.customer.id },
    });
  }),

  updateAddress: customerProcedure
    .input(updateAddressSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const addr = await prisma.address.findFirst({ where: { id, customerId: ctx.customer.id } });
      if (!addr) throw new TRPCError({ code: 'NOT_FOUND', message: 'Address not found' });
      if (data.isDefault) {
        await prisma.address.updateMany({
          where: { customerId: ctx.customer.id },
          data: { isDefault: false },
        });
      }
      return prisma.address.update({ where: { id }, data });
    }),

  deleteAddress: customerProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const addr = await prisma.address.findFirst({
        where: { id: input.id, customerId: ctx.customer.id },
      });
      if (!addr) throw new TRPCError({ code: 'NOT_FOUND', message: 'Address not found' });
      return prisma.address.delete({ where: { id: input.id } });
    }),
});
