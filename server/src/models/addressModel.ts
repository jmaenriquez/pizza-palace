import supabase from "../config/supabase";

interface Address {
  name?: string;
  bldg_name?: string;
  houseNum_roomNum?: string;
  street_purok: string;
  barangay: string;
  city: string;
  province: string;
}

async function createAddress(userId: string, address: Address) {
  const { error } = await supabase
    .from("address")
    .insert({
      name: address.name,
      bldg_name: address.bldg_name,
      houseNum_roomNum: address.houseNum_roomNum,
      street_purok: address.street_purok,
      barangay: address.barangay,
      city: address.city,
      province: address.province,
      user_id: userId,
    })
    .single();

  if (error) throw error;
}

async function getAddress(userId: string) {
  const { data, error } = await supabase
    .from("address")
    .select("*")
    .eq("user_id", userId)
  if (error) throw error;

  return data;
}

async function updateAddress(userId: string, id: string, address: Address) {
  const { error } = await supabase
    .from("address")
    .update({
      name: address.name,
      bldg_name: address.bldg_name,
      houseNum_roomNum: address.houseNum_roomNum,
      street_purok: address.street_purok,
      barangay: address.barangay,
      city: address.city,
      province: address.province,
    })
    .eq("id", id)
    .eq("user_id", userId)
    .single();

    if(error) throw error;
}

async function deleteAddress(userId:string, id:string) {

    const { error } = await supabase
    .from("address")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)
    .single();

    if(error) throw error
}

export default { createAddress, getAddress, updateAddress, deleteAddress };
