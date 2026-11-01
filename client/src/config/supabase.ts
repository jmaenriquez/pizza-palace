import { createClient } from '@supabase/supabase-js';
import type { Database } from '../api/database.types';

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON;

if(!url || !anon){
    throw new Error('Supabase environment materials are required.')
}

const supabase = createClient<Database>(url, anon)
console.log('Connected to Supabase');


export const signInWithOAuth = async (provider: "google" | "facebook") => {

    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: window.location.origin }, });

    if (error){
        console.error(`${provider} sign-in failed`, error.message);
    }
}

export default supabase;
