import supabase from "../config/supabase";

interface UserProfile {
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

async function editUserProfile(id: string, user: UserProfile ){

    const { data, error: profileError } = await supabase
    .from("user_infos")
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
}

export default { getUser, editUserProfile }