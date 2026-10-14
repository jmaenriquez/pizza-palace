import { BASE_URL } from "../authFetch";
import supabase from "../../config/supabase";

import type { Tables } from "../database.types";

interface Variants {
  id?: string;
  price: number;
  stocks: number;
  label?: string;
}

export interface Product {
  img: File | null;
  name: string;
  description: string;
  category: string; // Meat, Vegetarian, Classic, Others, Beverages Dropwon
  variants: Variants[];
}

export type ProductWithVariants = Tables<"products"> & {
  product_variants: Tables<"product_variants">[];
};


async function addRequest(product: Product) {
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const body = new FormData();
  body.append("name", product.name);
  body.append("description", product.description);
  body.append("category", product.category);
  body.append("variants", JSON.stringify(product.variants));
  if (product.img) body.append("img", product.img);

  const response = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: { Authorization: `Bearer ${session?.access_token}` },
    body,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.error ?? "Failed to create product record.");
  }

  return response.json();
}

async function getRequest(
  filters: { category?: string; search?: string } = {},
) {

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const parameter = new URLSearchParams();

  if (filters.category) {
    parameter.set("category", filters.category);
  }

  if (filters.search) {
    parameter.set("search", filters.search);
  }

  const response = await fetch(`${BASE_URL}/products?${parameter}`, {
    headers: {'Authorization' : `Bearer ${session?.access_token}`}
  });

  if (!response.ok) {
    const productError = await response.json().catch(() => null);
    throw new Error(productError?.error ?? "Failed to get product records.");
  }

  return (await response.json()) as ProductWithVariants[];
}

async function updateRequest(product: Product, id: string) {

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const body = new FormData;

  body.append("name", product.name);
  body.append("description", product.description);
  body.append("category", product.category);
  body.append("variants", JSON.stringify(product.variants));
  if(product.img) body.append("img", product.img)

  const response = await fetch(`${BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: { "Authorization" : `Bearer ${session?.access_token}` },
    body,
  });

  if(!response.ok){
    const updateErr = await response.json().catch(() => null);
    throw new Error (updateErr?.error ?? "Failed to save product.");
  }
  return response.json();
}

export default { addRequest, getRequest, updateRequest };
