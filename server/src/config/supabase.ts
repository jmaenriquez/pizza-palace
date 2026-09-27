import 'dotenv/config'
import { createClient } from "@supabase/supabase-js";

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_KEY;

if(!url || !key){
    throw new Error('Supabase environment materials missing.');
}

const supabase = createClient(url,key);

export default supabase