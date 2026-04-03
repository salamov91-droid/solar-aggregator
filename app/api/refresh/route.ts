import { NextRequest, NextResponse } from 'next/server';
import { refreshSolutions } from '@/lib/solutions';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const secret = process.env.REFRESH_SECRET;
  const authHeader = request.headers.get('authorization');

  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const items = await refreshSolutions();
    return NextResponse.json(
      { ok: true, count: items.length, items },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
