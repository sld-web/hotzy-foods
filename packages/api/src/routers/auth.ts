import { router, publicProcedure } from '../trpc';
import { prisma } from '@hotzy/database';
import { loginSchema } from '@hotzy/validators';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { TRPCError } from '@trpc/server';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export const authRouter = router({
  login: publicProcedure.input(loginSchema).mutation(async ({ input }) => {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, type: 'admin' }, JWT_SECRET, {
      expiresIn: '24h',
    });

    return {
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }),

  me: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.admin) return null;
    return ctx.admin;
  }),
});
