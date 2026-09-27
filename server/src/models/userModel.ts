import supabase from '../config/supabase';


interface Users{
    id?: string,
    email: string,
    password: string,
    fname: string,
    mname: string,
    lname: string,
    contact: string,
    birthday: string,
    role: string
}


async function addUsers(users: Users){

    const { data, error } = await supabase
    .from('Users')
    .insert(users)//if going to fetch or update just change the it to update and select.
    .select('email, fname, mname, lname, contact, birthday, role')
    .single()

    if(error){
        throw new Error(error.message);
    }

    return data;
}

export default { addUsers }