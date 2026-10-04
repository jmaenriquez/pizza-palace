import { BASE_URL } from "../authFetch";
import supabase from "../../config/supabase";

interface Variants {
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
    headers: { Authorization: `Bearer ${session?.access_token}` }, // no Content-Type here
    body,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.error ?? "Failed to create product record.");
  }

  return response.json();
}

async function getRequest(filters: any) {
  const response = await fetch(`${BASE_URL}/products`);
}

async function updateRequest(product: Product, id: string) {
  const response = await fetch(`${BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(product),
  });

  return response.json();
}

export default { addRequest, getRequest, updateRequest };
