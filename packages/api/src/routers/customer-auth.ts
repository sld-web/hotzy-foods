import { router, publicProcedure } from '../trpc';
import { prisma } from '@hotzy/database';
import { customerRegisterSchema, customerLoginSchema } from '@hotzy/validators';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { TRPCError } from '@trpc/server';

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

    const token = jwt.sign({ id: customer.id, email: customer.email, type: 'customer' }, JWT_SECRET, {
      expiresIn: '30d',
    });

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

    const token = jwt.sign({ id: customer.id, email: customer.email, type: 'customer' }, JWT_SECRET, {
      expiresIn: '30d',
    });

    return { token, customer: { id: customer.id, email: customer.email, name: customer.name } };
  }),

  me: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.customer) return null;
    return prisma.customer.findUnique({
      where: { id: ctx.customer.id },
      include: { addresses: true },
    });
  }),
});
