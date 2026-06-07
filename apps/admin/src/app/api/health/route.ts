import { NextResponse } from 'next/server';
import { prisma } from '@hotzy/database';

export async function GET() {
  try {
    const dbOk = await prisma.$queryRaw`SELECT 1 as ok`;
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
      dbCheck: dbOk,
    });
  } catch (e) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: e instanceof Error ? e.message : String(e),
      },
      { status: 500 },
    );
  }
}
