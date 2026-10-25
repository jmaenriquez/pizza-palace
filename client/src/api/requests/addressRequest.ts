import supabase from "../../config/supabase";
import { BASE_URL } from "../authFetch";

export interface Address {
  name?: string;
  bldg_name?: string;
  houseNum_roomNum?: string;
  street_purok: string;
  barangay: string;
  city: string;
  province: string;
}

async function createAddress(address: Address){
    const { data: {session} } = await supabase.auth.getSession();

    if(!session){
        throw new Error('Please login to access address');
    }

    const response = await fetch(`${BASE_URL}/address`, {
        method: 'POST',
        headers: {
            'Content-type' : 'application/json',
            Authorization : `Bearer ${session.access_token}`
        },
        body: JSON.stringify(address)
    })

    if(!response.ok){
        const data = await response.json();
        throw new Error(data.error ?? "Failed to create address.");
    }

    return response.json();
}

async function updateAddress(id:string, address: Address){
    const { data: {session} } = await supabase.auth.getSession();

    if(!session){
        throw new Error('Please login to access address');
    }

    const response = await fetch(`${BASE_URL}/address/${id}`, {
        method: 'PUT',
        headers: {
            'Content-type' : 'application/json',
            Authorization : `Bearer ${session.access_token}`
        },
        body: JSON.stringify(address)
    });

    if(!response.ok){
        const data = await response.json();
        throw new Error(data.error ?? "Failed to create address.");
    }

    return response.json();
}

async function getAddress(){

    const { data: {session} } = await supabase.auth.getSession();

    if(!session){
        throw new Error('Please login to access address');
    }

    const response = await fetch(`${BASE_URL}/address`,{
        headers: {Authorization : `Bearer ${session.access_token}`}
    });
    
    if(!response.ok){
        const data = await response.json();
        throw new Error(data.error ?? "Failed to get address");
    }

    return response.json();
}

async function deleteAddress(id:string){
    const { data: {session} } = await supabase.auth.getSession();

    if(!session){
        throw new Error('Please login to access address');
    }

    const response = await fetch(`${BASE_URL}/address/${id}`,{
        method: 'DELETE',
        headers: {Authorization : `Bearer ${session.access_token}`}
    });

    if(!response.ok){
        const data = await response.json();
        throw new Error(data.error ?? "Failed to delete address");
    }

    return response.json();
    
}

export default { createAddress, updateAddress, getAddress, deleteAddress } 