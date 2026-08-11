// lib/actions/orders.ts
import { supabase } from './products'; // Adjust this import if your supabase client is in a different file

export async function createOrder(userId: string, cart: any[], shippingAddress: any, transactionDetail: string) {
  try {
    // 1. Create the main order record first
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: userId,
        shipping_address: shippingAddress,
        transaction_detail: transactionDetail,
        status: 'Processing',
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Map the cart items dynamically to grab the REAL titles (Fixes the hardcoded 'ElectroBook Pro X' issue)
    const orderItemsPayload = cart.map((item: any) => ({
      order_id: order.id,
      product_id: item.product.id,
      title: item.product.title, // <--- This ensures the actual product name is saved
      price: item.variant?.selling_price || item.product.price || 0,
      quantity: item.quantity,
      image: item.variant?.images?.[0] || item.product.image || ''
    }));

    // 3. Insert the dynamically mapped items into the order_items table
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsPayload);

    if (itemsError) throw itemsError;

    return { success: true, order };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error };
  }
}

// Function to fetch orders for your dashboard
export async function getUserOrders(userId: string) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}