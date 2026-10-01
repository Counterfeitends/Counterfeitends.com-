import { createClient } from "@supabase/supabase-js";
import { products as fallbackProducts } from "./products";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
        },
      })
    : null;

export async function getProducts() {
  if (!supabase) {
    return fallbackProducts;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Supabase products query failed:", error.message);
    return fallbackProducts;
  }

  if (!data || data.length === 0) {
    return fallbackProducts;
  }

  return data.map((product) => ({
    slug: product.slug ?? product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    stripeLink: product.stripe_link ?? product.stripeLink,
  }));
}
