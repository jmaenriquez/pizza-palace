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


    return {
        profile: profile,
        data: data.user
    };
}

async function editUserProfile(id: string, user: UserCreds ){

    const { error: profileError } = await supabase
    .from("user_info")
    .update({
        fname: user.fname,
        mname: user.mname,
        lname: user.lname,
        contact: user.contact,
        birthday: user.birthday,
    })
    .eq("id", id)
    .single();

    if(profileError) throw profileError;
    
}

export default { getUser, editUserProfile }