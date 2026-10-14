import supabase from "../../config/supabase";
import { BASE_URL } from "../authFetch";

interface Cart{
    variantId: string;
    quantity: number;
}

async function addToCart(item: Cart ){

    const { data: {session}} = await supabase.auth.getSession()

    const response = await fetch(`${BASE_URL}/cart`, {
        method: 'POST',
        headers: { 
            'Content-type' : 'application/json', 
            Authorization : `Bearer ${session?.access_token}` 
        },
        body: JSON.stringify(item)
    })

    if(!response.ok){
        const data = await response.json()

        throw new Error( data?.error ?? "Failed to add item to cart.")
    }

    return response.json();
}

export default { addToCart }