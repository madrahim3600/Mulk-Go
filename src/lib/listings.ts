import { supabase } from "@/integrations/supabase/client";

export type Category = "real_estate" | "vehicles" | "electronics" | "furniture" | "other";
export type Kind = "sale" | "rent";
export type Status = "active" | "archived" | "sold";

export const CATEGORIES: Category[] = ["real_estate", "vehicles", "electronics", "furniture", "other"];

export type Listing = {
  id: string;
  seller_id: string | null;
  seller_name: string | null;
  title: string;
  description: string;
  category: Category;
  listing_kind: Kind;
  price: number;
  currency: string;
  images: string[];
  location: string;
  contact_phone: string | null;
  status: Status;
  views_count: number;
  created_at: string;
};

export type ListingFilters = {
  q?: string;
  category?: Category | "all";
  kind?: Kind | "all";
  priceMin?: number;
  priceMax?: number;
  sort?: "new" | "cheap" | "expensive";
  limit?: number;
};

export async function fetchListings(filters: ListingFilters = {}): Promise<Listing[]> {
  let query = supabase.from("listings").select("*").eq("status", "active");

  if (filters.q) query = query.or(`title.ilike.%${filters.q}%,location.ilike.%${filters.q}%`);
  if (filters.category && filters.category !== "all") query = query.eq("category", filters.category);
  if (filters.kind && filters.kind !== "all") query = query.eq("listing_kind", filters.kind);
  if (filters.priceMin != null) query = query.gte("price", filters.priceMin);
  if (filters.priceMax != null) query = query.lte("price", filters.priceMax);

  if (filters.sort === "cheap") query = query.order("price", { ascending: true });
  else if (filters.sort === "expensive") query = query.order("price", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  if (filters.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Listing[];
}

export async function fetchListing(id: string): Promise<Listing | null> {
  const { data, error } = await supabase.from("listings").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as Listing) ?? null;
}

export async function fetchMyListings(userId: string): Promise<Listing[]> {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("seller_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Listing[];
}

export async function fetchFavorites(userId: string): Promise<Listing[]> {
  const { data, error } = await supabase
    .from("favorites")
    .select("listing_id, listings(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as Array<{ listings: Listing | null }>)
    .map((row) => row.listings)
    .filter((l): l is Listing => Boolean(l));
}

export async function fetchFavoriteIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase.from("favorites").select("listing_id").eq("user_id", userId);
  if (error) throw error;
  return (data ?? []).map((r: { listing_id: string }) => r.listing_id);
}

export async function toggleFavorite(userId: string, listingId: string, isFav: boolean) {
  if (isFav) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", userId)
      .eq("listing_id", listingId);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("favorites").insert({ user_id: userId, listing_id: listingId });
    if (error) throw error;
  }
}

export const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=60";
