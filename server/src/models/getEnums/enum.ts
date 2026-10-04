import supabase from "../../config/supabase";

async function getEnum(name: string){

    const { data, error } = await supabase.rpc('get_enum_values', {enum_name: name })

    if(error){
        console.error('Failed to fetch enum: ', error.message);
        throw error
    }

    return data
}

export default getEnum