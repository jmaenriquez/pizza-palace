import supabase from "../config/supabase";

interface Variants{
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

export default { addProduct };
