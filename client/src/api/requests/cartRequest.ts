import supabase from "../../config/supabase";
import { BASE_URL } from "../authFetch";

interface Cart{
    variantId?: string;
    quantity?: number;
    isChecked?: boolean;
}

async function addToCart(item: Cart ){

    const { data: {session}} = await supabase.auth.getSession();

    if(!session) {
        throw new Error('Please login to access cart');
    }

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

async function getCartItems( search?: string | undefined){

    const { data: {session}} = await supabase.auth.getSession();

    if(!session) {
        throw new Error('Please login to access cart');
    }

    const url = search ? `${BASE_URL}/cart?search=${encodeURIComponent(search)} ` : `${BASE_URL}/cart`;

    const response = await fetch(url, {
        headers: { Authorization : `Bearer ${session.access_token}` }
    });

    if(!response.ok){
        const data = await response.json();
        throw new Error(data.error ?? "Failed to get items from cart.");
    }

    return response.json();
}

async function updateItem(id:string, item:Cart){
    const { data: { session } } = await supabase.auth.getSession();

    if(!session) {
        throw new Error('Please login to access cart');
    }

    const response = await fetch(`${BASE_URL}/cart/${id}`, {
        method: 'PUT',
        headers: {
            'Content-type' : 'application/json',
            Authorization : `Bearer ${session.access_token}`
        },
        body: JSON.stringify(item),
    });

    if(!response.ok){
        const data = await response.json();
        throw new Error (data.error ?? "Failed to update item in cart");
    }

    return response.json();
}

async function removeFromCart(id:string){

    const { data: { session } } = await supabase.auth.getSession();

    if(!session) {
        throw new Error('Please login to access cart');
    }

    const response = await fetch(`${BASE_URL}/cart/${id}`, {
        method: 'DELETE',
        headers: {Authorization : `Bearer ${session.access_token}`}
    })

    if(!response.ok){
        const data = await response.json();
        throw new Error(data.error ?? "Failed to remove item from cart");
    }

    return response.json();
}

export default { addToCart, getCartItems, updateItem, removeFromCart }