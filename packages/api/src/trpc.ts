import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { prisma } from '@hotzy/database';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';

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

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.NEXT_PUBLIC_SITE_URL,
  process.env.NEXT_PUBLIC_ADMIN_URL,
].filter(Boolean) as string[];

export async function createTRPCContext(req: Request) {
  const origin = req.headers.get('origin');
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    const referer = req.headers.get('referer');
    const allowedReferer = ALLOWED_ORIGINS.some((o) => referer?.startsWith(o));
    if (!allowedReferer) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `Origin not allowed: ${origin}`,
      });
    }
  }

  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  let admin: AdminUser | null = null;
  let customer: CustomerUser | null = null;

  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET as string) as {
        id: string;
        email: string;
        type: 'admin' | 'customer';
      };

      if (payload.type === 'admin') {
        const user = await prisma.user.findUnique({ where: { id: payload.id } });
        if (user) {
          admin = { id: user.id, email: user.email, name: user.name, role: user.role };
        }
      } else if (payload.type === 'customer') {
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
