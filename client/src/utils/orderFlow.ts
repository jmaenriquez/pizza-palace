export type OrderStatus =
  | "Pending"
  | "Preparing"
  | "Ready"
  | "Out for Delivery"
  | "Delivered"
  | "Picked Up"
  | "Canceled";

export type PaymentStatus = | "Pending Payment" | "Completed"

export interface OrderStatusUpdate {
  order_status?: OrderStatus;
  payment_status?: PaymentStatus
}

export interface OrderItem {
  id: string;
  quantity: number;
  product_variants: {
    price: number;
    label: string;
    products: { name: string, image_url: string };
  };
}

export interface OrderDetails {
  id: string;
  order_status: OrderStatus;
  order_timing: "asap" | "schedule";
  delivery_method: "pickup" | "deliver";
  total_amount: number;
  subtotal: number;
  delivery_fee: number;
  discount: number;
  ordered_date: string;
  user_infos: {
    fname: string;
    lname: string;
  };
  order_items: OrderItem[];
  promo_code: string | null;
  payment_method: string;
  payment_status: string;
  address: {
    name: string | null;
    bldg_name: string | null;
    houseNum_roomNum: string | null;
    street_purok: string;
    barangay: string;
    city: string;
    province: string;
  } | null;
  scheduled_order_date: string | null;
  scheduled_order_time: string | null;
  order_instructions: string | null;
}



const PICKUP_FLOW: OrderStatus[] = [
  "Pending",
  "Preparing",
  "Ready",
  "Picked Up",
];
const DELIVERY_FLOW: OrderStatus[] = [
  "Pending",
  "Preparing",
  "Ready",
  "Out for Delivery",
  "Delivered",
];

export function getNextStatus(
  current: OrderStatus,
  method: "pickup" | "deliver",
): OrderStatus | null {
  const flow = method === "pickup" ? PICKUP_FLOW : DELIVERY_FLOW;
  const i = flow.indexOf(current);
  return i >= 0 && i < flow.length - 1 ? flow[i + 1]! : null; // null = finished or canceled
}

export const canCancel = (s: OrderStatus) =>
  s !== "Delivered" && s !== "Picked Up" && s !== "Canceled";
