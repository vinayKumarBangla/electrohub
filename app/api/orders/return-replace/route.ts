import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { orderId, actionType, reason } = await request.json();

    // Generate a unique 4-digit OTP for this specific pickup/delivery
    const dynamicOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const newStatus = actionType === 'Return' ? 'Return Requested' : 'Replacement Requested';
    const scheduledPickup = 'Saturday, 15 Aug 2026';
    const reverseTrackingId = 'AWB-' + Math.floor(10000000 + Math.random() * 90000000);

    return NextResponse.json({
      success: true,
      message: `Successfully registered ${actionType} request.`,
      data: {
        newStatus,
        reverseTrackingId,
        scheduledPickup,
        pickupOtp: dynamicOtp,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error processing request.' }, { status: 500 });
  }
}