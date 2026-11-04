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

  const fallbackBySlug = new Map(fallbackProducts.map((product) => [product.slug, product]));
  const databaseProducts = data.map((product) => {
    const fallback = fallbackBySlug.get(product.slug) ?? {};

    return {
      ...fallback,
      slug: product.slug ?? product.id,
      name: product.name ?? fallback.name,
      price: fallback.featured ? fallback.price : product.price ?? fallback.price,
      image: fallback.featured ? fallback.image : product.image ?? fallback.image,
      stripeLink: fallback.stripeLink ?? product.stripe_link ?? product.stripeLink ?? null,
    };
  });
  const databaseSlugs = new Set(databaseProducts.map((product) => product.slug));
  const localProducts = fallbackProducts.filter((product) => !databaseSlugs.has(product.slug));

  return [...databaseProducts, ...localProducts];
}
