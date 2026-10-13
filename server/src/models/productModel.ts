import { error } from "node:console";
import supabase from "../config/supabase";
import { randomUUID } from "node:crypto";

interface Variants{
  id?:string;
  price: number;
  stocks: number;
  label?: string;
}

interface Product {
  img: Express.Multer.File | null,
  name: string;
  description: string;
  category: string; // Meat, Vegetarian, Classic, Others, Beverages Dropwon
  variants: Variants[]
}

interface Filters{
  category?: string | undefined;
  search?: string | undefined;
}

const BUCKET = 'menu_images';

const prefix = (name: string) => {
    const initials = name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase();
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2,"0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${initials}-${month}${day}${date.getFullYear()}`
}

const countSkus = async (skuPrefix: string) => {
  const { count, error } = await supabase
    .from('product_variants')
    .select('*', { count: 'exact', head: true })
    .like('sku', `${skuPrefix}-%`)

  if (error) throw error
  return count ?? 0
}

async function addProduct(product: Product, userId: string) {

//---------------------------- Get sku values --------------------------
 
  const skuPrefix = prefix(product.name);
  const skuStart = await countSkus(skuPrefix);

//   ------------------------------ Image Bucket Set Up ---------------------------------------
  let imagePath: string | null = null;
  let imageURL: string | null = null;

  
  if(product.img){
      
      const ext = product.img.originalname.split('.').pop()
      imagePath = `${crypto.randomUUID()}.${ext}`

      const { error: imgError } = await supabase.storage.from(BUCKET).upload(imagePath, product.img.buffer, {contentType: product.img.mimetype });

      if(imgError){
        console.error(imgError.message)
        throw imgError
      }
      
      imageURL = supabase.storage.from(BUCKET).getPublicUrl(imagePath).data.publicUrl;

    }

    const removeImage = async () => {
      if(imagePath) {
          await supabase.storage.from(BUCKET).remove([imagePath])
      }
    }
    
//   --------------------------------------------- Product -------------------------------------------
  
  const { data: productItem, error: productError } = await supabase
    .from("products")
    .insert({
        user_id: userId,
        image_url: imageURL,
        name: product.name,
        description: product.description || null,
        category: product.category
    })
    .select("id")
    .single();

  if (productError) {
    console.error("Error creating product record:", productError.message);
    await removeImage();

    throw productError
  }

  console.log(`[addProduct] product created: `, productItem.id);


//   ------------------------------------- Variants -----------------------------

  const variants = product.variants.map((variant, index) => ({
    product_id: productItem.id,
    label: variant.label || null,
    sku: `${skuPrefix}-${String(skuStart + index + 1).padStart(2, '0')}`,
    stocks: variant.stocks,
    price: variant.price,
    sort_order: index
  }))


  const { error:variantError } = await supabase
  .from('product_variants')
  .insert(variants)

  if(variantError){

    console.error(variantError.message)

    await supabase.from('products').delete().eq('id', productItem!.id);
    await removeImage();

    throw variantError;
  }

  return productItem.id as string
}

async function getProducts(filter: Filters){

  let query = supabase
    .from('products')
    .select('*, product_variants(*)')
    .order('sort_order', { referencedTable: 'product_variants' });

    if(filter.search){
      query = query.ilike("name", `%${filter.search}%` );
    }
    if(filter.category){
      query = query.eq("category", filter.category);
    }

    const { data, error } = await query;

    if(error) throw error;

    return data;
}

async function updateProducts(id: string, product: Product){

  // ------------ get current data values ---------------------

  const { data: productData, error: productError } = await supabase
  .from('products')
  .select("image_url, product_variants(id, sku)")
  .eq("id", id)
  .single();
  if(productError) throw productError;

  // ------------------ set new image path --------------------------

  let newImgPath: string | null = null;
  let imgUrl = productData.image_url

  if(product.img){
    const ext = product.img.originalname.split('.').pop();
    newImgPath = `${crypto.randomUUID()}.${ext}`

    const { error: imgError } = await supabase
    .storage
    .from(BUCKET)
    .upload(newImgPath, product.img.buffer, { contentType: product.img.mimetype });

    if(imgError) throw imgError;

    imgUrl = supabase.storage.from(BUCKET).getPublicUrl(newImgPath).data.publicUrl
  }


  // ------------------------------ update products row --------------------------

  const { error: productRowError } = await supabase
  .from("products")
  .update({
    name: product.name,
    image_url: imgUrl,
    description: product.description,
    category: product.category
  })
  .eq("id", id)
  .single()

  if(productRowError){
    if(newImgPath) await supabase.storage.from(BUCKET).remove([newImgPath])
    throw productRowError
  } 

  // ---------------------------------------- update variants ---------------------------------- 

  const keepId = product.variants.flatMap((v) => (v.id ? [v.id] : []));
  const removeId = productData.product_variants.map((variant) => variant.id).filter((varId) => !keepId.includes(varId))

  if(removeId.length){
    const {error: deleteVarError} = await supabase.from("product_variants").delete().in("id", removeId);

    if(deleteVarError) throw deleteVarError
  }

  for(const [i, v] of product.variants.entries()){
    if(!v.id) continue;

    const { error: variantUpdateError} = await supabase
    .from("product_variants")
    .update({
      label: v.label || null,
      price: v.price,
      stocks: v.stocks,
      sort_order: i
    })
    .eq("id", v.id)
    .eq("product_id", id);

    if(variantUpdateError) throw variantUpdateError
  }

  const existingSkus = productData.product_variants.map((v) => v.sku);
  const skuPrefix = existingSkus[0]?.replace(/-\d+$/, "") ?? prefix(product.name);
  let skuNumber = Math.max(0, ...existingSkus.map((s) => Number(s.split("-").pop())));

  const fresh = product.variants
    .map((v, i) => ({ v, i }))
    .filter(({ v }) => !v.id)
    .map(({ v, i }) => ({
      product_id: id,
      label: v.label || null,
      sku: `${skuPrefix}-${String(++skuNumber).padStart(2, "0")}`,
      price: v.price,
      stocks: v.stocks,
      sort_order: i,
    }));

  if (fresh.length) {
    const { error: insError } = await supabase.from("product_variants").insert(fresh);
    if (insError) throw insError;
  }

  if (newImgPath && productData.image_url) {
    const oldPath = productData.image_url.split(`/${BUCKET}/`)[1];
    if (oldPath) await supabase.storage.from(BUCKET).remove([oldPath]);
  }

}

export default { addProduct, getProducts, updateProducts };
