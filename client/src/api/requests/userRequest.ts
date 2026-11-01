import supabase from "../../config/supabase";
import { BASE_URL } from "../authFetch";

export interface UserCreds {
  fname: string;
  mname?: string;
  lname: string;
  contact: string;
  birthday: string;
}

async function getProfile(){

    const { data: { session } } = await supabase.auth.getSession();

     if(!session) {
        throw new Error('Please login to access profile');
    }

    const response = await fetch(`${BASE_URL}/user_profile`, {
        headers: {Authorization : `Bearer ${session.access_token}`}
    });

    if(!response.ok){
        const data = await response.json();
        throw new Error(data.error ?? "Failed to get user profile.");
    }

    const data = await response.json()
    return data;
}

async function updateProfile(id: string, profile: UserCreds){

    const { data: { session } } = await supabase.auth.getSession();

    if(!session){
        throw new Error('Please login to access profile');
    }

    const response = await fetch(`${BASE_URL}/user_profile/${id}`, {
        method: 'PUT',
        headers: {
            'Content-type' : 'application/json',
            Authorization : `Bearer ${session.access_token}`
        },
        body: JSON.stringify(profile)
    });

    if(!response.ok){
        const data = await response.json();
        throw new Error(data.error ?? "Failed to update profile.");
    }

    return response.json();
}

async function deleteUser(id: string){
    
    const { data: { session } } = await supabase.auth.getSession();

    if(!session){
        throw new Error("You cannot delete an account without signing in.");
    }

    if(id === "5207efef-62e1-41d9-a11d-77848756b7ac"){
        throw new Error("You cannot delete the test account")
    }

    const response = await fetch(`${BASE_URL}/user_profile/${id}`, {
        method: 'DELETE',
        headers: { Authorization : `Bearer ${session.access_token}` }
    })

    if(!response.ok){
        const data = await response.json();
        throw new Error(data.error ?? "Failed to delete account.");
    }
}

export default { getProfile, updateProfile, deleteUser }