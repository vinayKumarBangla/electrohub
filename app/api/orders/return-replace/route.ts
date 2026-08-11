import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, actionType, reason, userId } = body;

    // 1. Validation
    if (!orderId || !actionType || !reason) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields (orderId, actionType, reason)' },
        { status: 400 }
      );
    }

    // Determine new status based on action type
    const newStatus = actionType === 'Return' ? 'Return Requested' : 'Replacement Requested';

    // 2. Database & Logistics Simulation (In production, update your SQL/NoSQL DB here)
    const trackingId = 'REV-' + Math.floor(100000 + Math.random() * 900000);
    const pickupDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    // 3. Financial / Refund Hook Trigger (Simulated for Return)
    let financialAction = null;
    if (actionType === 'Return') {
      financialAction = {
        refundStatus: 'Initiated to Original Payment Source',
        estimatedTimeline: '5-7 Business Days',
      };
    } else {
      financialAction = {
        replacementStatus: 'New Item Queued for Dispatch upon Pickup Scan',
      };
    }

    // Response payload back to client
    return NextResponse.json({
      success: true,
      message: `Successfully registered ${actionType} request.`,
      data: {
        orderId,
        actionType,
        newStatus,
        reason,
        reverseTrackingId: trackingId,
        scheduledPickup: pickupDate,
        financialDetails: financialAction,
        timestamp: new Date().toISOString(),
      },
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal Server Error', error: String(error) },
      { status: 500 }
    );
  }
}