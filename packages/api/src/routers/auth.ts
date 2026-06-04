import { router, adminProcedure } from '../trpc';
import { prisma } from '@hotzy/database';
import { loginSchema } from '@hotzy/validators';
import bcrypt from 'bcryptjs';
import { TRPCError } from '@trpc/server';

export const authRouter = router({
  login: adminProcedure.input(loginSchema).mutation(async ({ input }) => {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid email or password' });
    }

    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }),
});
