import { NextResponse } from 'next/server';
import { getSolutions } from '@/lib/solutions';

export const dynamic = 'force-dynamic';

export async function GET() {
  const solutions = await getSolutions();
  return NextResponse.json(
    { items: solutions, count: solutions.length },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    },
  );
}
