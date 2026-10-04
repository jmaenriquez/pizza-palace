import 'dotenv/config'
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_KEY;

if(!url || !key){
    throw new Error('Supabase environment materials missing.');
}

const supabase = createClient(url,key);
console.log('Connected to Supabase');

export default supabase