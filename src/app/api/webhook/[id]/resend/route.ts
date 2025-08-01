import { type NextRequest, NextResponse } from 'next/server';
import { resendWebhookDelivery } from '@/lib/webhooks/outbound';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    if (!body.logId) {
      return NextResponse.json(
        { error: 'Missing logId in request body' },
        { status: 400 }
      );
    }
    const result = await resendWebhookDelivery((await params).id, body);
    return NextResponse.json(result);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to resend webhook delivery',
      },
      { status: 400 }
    );
  }
}
