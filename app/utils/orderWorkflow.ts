export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

export interface StatusConfig {
  label: string;
  color: string;
  description: string;
}

// Sequence order for progression
export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED'
];

export const STATUS_METADATA: Record<OrderStatus, StatusConfig> = {
  PENDING: { label: 'Order Placed', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', description: 'Your order has been received.' },
  CONFIRMED: { label: 'Order Confirmed', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', description: 'Seller has confirmed your order.' },
  SHIPPED: { label: 'Shipped', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', description: 'Item has left the fulfillment center.' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', description: 'Agent is out with your package.' },
  DELIVERED: { label: 'Delivered', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', description: 'Package successfully delivered.' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-500/10 text-red-400 border-red-500/20', description: 'Order was cancelled.' },
};

// Dynamic Helper: Get the next logical state
export function getNextStatus(currentStatus: OrderStatus): OrderStatus | null {
  const currentIndex = ORDER_STATUS_FLOW.indexOf(currentStatus);
  if (currentIndex !== -1 && currentIndex < ORDER_STATUS_FLOW.length - 1) {
    return ORDER_STATUS_FLOW[currentIndex + 1];
  }
  return null;
}

// Dynamic Helper: Check if a status step is completed relative to the current status
export function isStepCompleted(stepStatus: OrderStatus, currentStatus: OrderStatus): boolean {
  if (currentStatus === 'CANCELLED') return false;
  const stepIndex = ORDER_STATUS_FLOW.indexOf(stepStatus);
  const currentIndex = ORDER_STATUS_FLOW.indexOf(currentStatus);
  return stepIndex <= currentIndex;
}