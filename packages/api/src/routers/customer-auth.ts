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

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 10;

function getClientIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(req: Request): void {
  const now = Date.now();
  if (rateLimitMap.size > 1000) {
    for (const [ip, entry] of rateLimitMap) {
      if (now > entry.resetAt) rateLimitMap.delete(ip);
    }
  }
  const ip = getClientIp(req);
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return;
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many attempts. Please try again later.',
    });
  }
  entry.count++;
}

export const customerAuthRouter = router({
  register: publicProcedure.input(customerRegisterSchema).mutation(async ({ input, ctx }) => {
    checkRateLimit(ctx.req);
    const email = input.email.toLowerCase();
    const existing = await prisma.customer.findUnique({ where: { email } });
    if (existing) {
      throw new TRPCError({ code: 'CONFLICT', message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const customer = await prisma.customer.create({
      data: {
        email,
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

  login: publicProcedure.input(customerLoginSchema).mutation(async ({ input, ctx }) => {
    checkRateLimit(ctx.req);
    const email = input.email.toLowerCase();
    const customer = await prisma.customer.findUnique({ where: { email } });
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
      omit: { passwordHash: true },
    });
  }),

  updateProfile: customerProcedure
    .input(z.object({ name: z.string().min(1).optional(), phone: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      return prisma.customer.update({
        where: { id: ctx.customer.id },
        data: input,
        omit: { passwordHash: true },
      });
    }),

  changePassword: customerProcedure
    .input(z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(6) }))
    .mutation(async ({ ctx, input }) => {
      const customer = await prisma.customer.findUnique({ where: { id: ctx.customer.id } });
      if (!customer || !customer.passwordHash) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot change password for guest accounts',
        });
      }
      const valid = await bcrypt.compare(input.currentPassword, customer.passwordHash);
      if (!valid) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Current password is incorrect' });
      }
      const passwordHash = await bcrypt.hash(input.newPassword, 12);
      return prisma.customer.update({
        where: { id: ctx.customer.id },
        data: { passwordHash },
        omit: { passwordHash: true },
      });
    }),

  addAddress: customerProcedure.input(createAddressSchema).mutation(async ({ ctx, input }) => {
    return prisma.$transaction(async (tx) => {
      if (input.isDefault) {
        await tx.address.updateMany({
          where: { customerId: ctx.customer.id },
          data: { isDefault: false },
        });
      }
      return tx.address.create({
        data: { ...input, customerId: ctx.customer.id },
      });
    });
  }),

  updateAddress: customerProcedure
    .input(updateAddressSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const addr = await prisma.address.findFirst({ where: { id, customerId: ctx.customer.id } });
      if (!addr) throw new TRPCError({ code: 'NOT_FOUND', message: 'Address not found' });
      return prisma.$transaction(async (tx) => {
        if (data.isDefault) {
          await tx.address.updateMany({
            where: { customerId: ctx.customer.id },
            data: { isDefault: false },
          });
        }
        return tx.address.update({ where: { id }, data });
      });
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
