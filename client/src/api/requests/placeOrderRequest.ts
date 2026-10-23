import supabase from "../../config/supabase";
import { BASE_URL } from "../authFetch";

interface OrderDetails {
  cartItemsId: string[];
  delivery_method: "pickup" | "deliver";
  payment_method: string;
  order_timing: "asap" | "schedule";
  scheduled_order_date?: string;
  scheduled_order_time?: string;
  order_instructions?: string;
  addressId: string | null;
  promo_code?: string;
}

async function placeOrderRequest(order: OrderDetails){

    const { data: { session } } = await supabase.auth.getSession();

    if (!session){
        throw new Error('Please login to place order.');
    }

    const response = await fetch(`${BASE_URL}/order`, {
        method: 'POST',
        headers: {
            'Content-type' : 'application/json',
            Authorization : `Bearer ${session?.access_token}`
        },
        body: JSON.stringify(order)
    });

    if(!response.ok){
        const data = await response.json()
        throw new Error(data.error ?? "Failed to place order" );
    }

    return response.json();
}

async function getOrderReceipt(id:string){

    const { data: {session} } = await supabase.auth.getSession();

    if(!session){
        throw new Error("Please login to get your receipt");
    }

    const response = await fetch(`${BASE_URL}/order/${id}`, {
        headers: { Authorization : `Bearer ${session.access_token}` },
    });
    
    if(!response.ok){
        const data = await response.json();
        throw new Error(data.error ?? "Failed to get specific order by order id");
    }

    return response.json();
}

async function getAllOrder(){

    const { data: {session} } = await supabase.auth.getSession();

    if(!session){
        throw new Error("Please login to get your receipt");
    }

    const response = await fetch(`${BASE_URL}/order`);
    
    if(!response.ok){
        const data = await response.json();
        throw new Error(data.error ?? "Failed to get specific order by order id");
    }

    return response.json();
}

export default { placeOrderRequest, getOrderReceipt, getAllOrder }