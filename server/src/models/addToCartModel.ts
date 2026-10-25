import supabase from "../config/supabase";

interface Cart {
    variantId: string;
    quantity: number;
}

async function addToCart(item: Cart, userId: string){

    const { data: existing, error: cartError } = await supabase
    .from("cart")
    .select("id, quantity, product_variants(product_id)")
    .eq("user_id", userId)
    .eq("product_variant_id", item.variantId)
    .maybeSingle();

    if(cartError) throw cartError

    if(existing){

      const { error: updateError } = await supabase
      .from("cart")
      .update({ quantity: Math.min(existing.quantity + item.quantity, 30) })
      .eq("id", existing.id)

      if(updateError) throw updateError
      return { updated: true };
    }

    const { error } = await supabase
    .from("cart")
    .insert({
        user_id: userId,
        product_variant_id: item.variantId,
        quantity: item.quantity
    })
    .single()

    if(error) throw error
}


async function getCartItems(userId: string, cartItemsId?: string[]) {

  let query = supabase
    .from("cart")
    .select(`
      *,
      product_variants(id, label,price, stocks,
        products(
          id,
          image_url,
          name,
          description,
          category
        )
      )
    `)
    .eq("user_id", userId);

    if(cartItemsId){
      query = query.in("id", cartItemsId);
    }

  const { data: cartItems, error: cartError } = await query

  if (cartError) throw cartError;

  if (!cartItems?.length) return [];

  // Collect the product IDs.
  const productIds = [
    ...new Set(
      cartItems
        .map((item) => item.product_variants?.products?.id)
        .filter((id): id is string => Boolean(id))
    ),
  ];

  if (!productIds.length) return [];

  // Fetch variants belonging to these products.
  const { data: variants, error: variantsError } = await supabase
    .from("product_variants")
    .select("id, label, price, stocks, product_id")
    .in("product_id", productIds);

  if (variantsError) throw variantsError;

  // Attach variants to each cart item.
  const result = cartItems.map((item) => {
    const productId = item.product_variants?.products?.id;

    return {
      ...item,
      available_variants: (variants ?? [])
        .filter((variant) => variant.product_id === productId)
        .filter((variant) => Number(variant.stocks) > 0),
    };
  });

  return result;
}

async function updateItem(
  id: string,
  userId: string,
  item: Cart
) {
  const updateData = {
    ...(item.variantId !== undefined && {
      product_variant_id: item.variantId,
    }),
    ...(item.quantity !== undefined && {
      quantity: item.quantity,
    }),
  };

  const { error } = await supabase
    .from("cart")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
}

async function removeFromCart(itemId: string, userId: string){

    const { error } = await supabase
    .from("cart")
    .delete()
    .eq("id", itemId)
    .eq("user_id", userId);

    if(error) throw error
}

export default { addToCart, getCartItems, updateItem, removeFromCart }