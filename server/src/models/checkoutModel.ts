import supabase from "../config/supabase";

interface Items {
  variantId: string;
  price: number;
  quantity: number;
}

type OrderStatus =
  | "Pending"
  | "Preparing"
  | "Ready"
  | "Out for Delivery"
  | "Delivered"
  | "Picked Up"
  | "Canceled";

type PaymentStatus = | "Pending Payment" | "Completed"

interface OrderStatusUpdate{
  order_status?: OrderStatus;
  payment_status?: PaymentStatus;
}

interface OrderDetails {
  cartItemsId: string[];
  addressId?: string | null;
  payment_method: string;
  order_timing: string;
  scheduled_order_date?: string;
  scheduled_order_time?: string;
  order_instructions?: string;
  order_items: Items[];
  delivery_method: string;
  promo_code?: string;
  totals: {
    subtotal: number;
    discount?: number;
    delivery_fee?: number;
    total: number;
  };
}

async function placeOrder(order: OrderDetails, userId: string) {
  const { data: orderData, error: orderError } = await supabase
    .from("order")
    .insert({
      user_id: userId,
      total_amount: order.totals.total,
      subtotal: order.totals.subtotal,
      discount: order.totals.discount,
      delivery_fee: order.totals.delivery_fee,
      promo_code: order.promo_code,
      payment_method: order.payment_method,
      order_timing: order.order_timing,
      scheduled_order_date: order.scheduled_order_date,
      scheduled_order_time: order.scheduled_order_time,
      order_instructions: order.order_instructions,
      delivery_method: order.delivery_method,
      addressId: order.addressId,
    })
    .select("id")
    .single();

  if (orderError || !orderData) {
    throw orderError ?? new Error("Order was not created.");
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    order.order_items.map((i) => ({
      order_id: orderData.id,
      product_variant_id: i.variantId,
      price_at_purchase: i.price,
      quantity: i.quantity,
    })),
  );

  if (itemsError) {
    await supabase.from("order").delete().eq("id", orderData.id);
    throw itemsError;
  }

  const { error: cartError } = await supabase
    .from("cart")
    .delete()
    .eq("user_id", userId)
    .in("id", order.cartItemsId);

  if (cartError) throw cartError;

  return orderData.id as string;
}

const ORDER_SELECT =
  "*, address(*), order_items(*, product_variants(id, label, price, products(id, image_url, name, description, category)))";

  const ADMIN_ORDER_SELECT = `${ORDER_SELECT}, user_infos(fname, lname)`;


async function getOrder(userId: string, id?: string) {

  const { data, error } = await supabase
    .from("order")
    .select(ORDER_SELECT)
    .eq("user_id", userId)
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

//get all orders of a user
async function getAllOrders(userId: string) {

  const { data, error } = await supabase
    .from("order")
    .select(ORDER_SELECT)
    .eq("user_id", userId);

  if (error) throw error;

  return data;
}

// get all users' order
async function getAllUserOrders() {

  const { data, error } = await supabase
    .from("order")
    .select(ADMIN_ORDER_SELECT);

  if (error) throw error;

  return data;
}

async function updateUserOrderStatus(id: string, orderStatusUpdate: OrderStatusUpdate){

  const { error } = await supabase
  .from("order")
  .update(orderStatusUpdate)
  .eq("id", id)
  .single()

  if(error) throw error
}

export default { placeOrder, getOrder, getAllOrders, getAllUserOrders, updateUserOrderStatus };
