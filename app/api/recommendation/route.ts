import { NextRequest, NextResponse } from 'next/server';
import { getSolutions } from '@/lib/solutions';
import { getRecommendation } from '@/lib/recommendation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const solutions = await getSolutions();
    const result = getRecommendation(body ?? {}, solutions);

    return NextResponse.json({
      ok: true,
      recommendation: result.recommendation,
      bestMatch: result.bestMatch,
      matches: result.matches,
      count: result.matches.length,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
