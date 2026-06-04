export async function POST(request: Request) {
  const { appRouter, createTRPCContext } = await import('@hotzy/api');
  const { fetchRequestHandler } = await import('@trpc/server/adapters/fetch');

  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    createContext: () => createTRPCContext(request),
  });
}

export async function GET(request: Request) {
  return POST(request);
}
