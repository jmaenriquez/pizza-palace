import supabase from "../config/supabase";

interface UserCreds {
  email: string;
  fname: string;
  mname: string;
  lname: string;
  contact: string;
  birthday: string;
}

async function getUser(userId: string){

    const { data: profile, error: profileError } = await supabase
    .from("user_infos")
    .select("*")
    .eq("id", userId)
    .single();

    if(profileError) throw profileError;

    const { data, error } = await supabase
    .auth
    .admin
    .getUserById(profile.id)

    if(error) throw error

    const { data: orders, error: orderError } = await supabase
    .from("order")
    .select("*, address(*), order_items(*, product_variants(id, label, price, products(id, image_url, name, description, category)))")
    .eq("user_id", userId);

    if(orderError) throw orderError;

    return {
        profile: profile,
        data: data.user,
        orders: orders,
    };
}

async function editUserProfile(id: string, user: UserCreds ){

    const { data, error: profileError } = await supabase
    .from("user_info")
    .update({
        fname: user.fname,
        mname: user.mname,
        lname: user.lname,
        contact: user.contact,
        birthday: user.birthday,
    })
    .eq("id", id)
    .select("id")
    .single();

    if(profileError) throw profileError;

    const { error: updateError } = await supabase
    .auth
    .admin
    .updateUserById(data.id, { email: user.email })

    if (updateError) throw updateError;

    return data.id as string;
}

export default { getUser, editUserProfile }