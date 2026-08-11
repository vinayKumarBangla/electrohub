import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Create a Supabase client configured for route handlers
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll() {},
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // Insert order into Supabase database table
    const { error } = await supabase.from('orders').insert({
      order_id: body.orderId,
      user_id: user?.id || null,
      total_amount: body.totalAmount,
      payment_method: body.paymentMethod,
      status: body.status || 'Processing',
      shipping_address: body.shippingAddress,
      items: body.items,
    });

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Order saved to database successfully!' });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Server error saving order.' }, { status: 500 });
  }
}