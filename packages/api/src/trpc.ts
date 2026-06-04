import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { prisma } from '@hotzy/database';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface CustomerUser {
  id: string;
  email: string;
  name: string | null;
}

export async function createTRPCContext(req: Request) {
  // Extract customer token from Authorization header
  const authHeader = req.headers.get('authorization');
  const customerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  let admin: AdminUser | null = null;
  let customer: CustomerUser | null = null;

  // Validate customer JWT
  if (customerToken) {
    try {
      const payload = jwt.verify(customerToken, JWT_SECRET) as { id: string; email: string; type: 'customer' };
      if (payload.type === 'customer') {
        const user = await prisma.customer.findUnique({ where: { id: payload.id } });
        if (user) {
          customer = { id: user.id, email: user.email, name: user.name };
        }
      }
    } catch {
      // Invalid token — ignore
    }
  }

  return {
    prisma,
    admin,
    customer,
    req,
  };
}

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const adminProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.admin) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Admin authentication required' });
  }
  return next({ ctx: { ...ctx, admin: ctx.admin } });
});

export const customerProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.customer) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Customer authentication required' });
  }
  return next({ ctx: { ...ctx, customer: ctx.customer } });
});
