import { supabase } from "@/integrations/supabase/client";

export type ServicePrice = {
  id: string;
  code: string;
  name_uz: string;
  name_ru: string;
  description_uz: string;
  description_ru: string;
  price: number;
  currency: string;
  is_active: boolean;
  sort_order: number;
};

export type NotaryStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "completed";

export type IdentityStatus = "pending" | "verified" | "failed";

export type NotaryRequest = {
  id: string;
  user_id: string;
  listing_id: string | null;
  service_code: string;
  price_snapshot: number;
  currency: string;
  property_type: string;
  property_title: string;
  property_address: string;
  property_area: number | null;
  cadastre_number: string | null;
  property_value: number;
  seller_full_name: string;
  seller_passport: string;
  seller_pinfl: string;
  seller_phone: string;
  buyer_full_name: string;
  buyer_passport: string;
  buyer_pinfl: string;
  buyer_phone: string;
  notes: string;
  identity_status: IdentityStatus;
  identity_method: string;
  identity_verified_at: string | null;
  status: NotaryStatus;
  admin_comment: string;
  created_at: string;
};

export async function fetchServicePrices(onlyActive = true): Promise<ServicePrice[]> {
  let q = supabase.from("service_prices").select("*").order("sort_order", { ascending: true });
  if (onlyActive) q = q.eq("is_active", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as ServicePrice[];
}

export async function fetchMyNotaryRequests(userId: string): Promise<NotaryRequest[]> {
  const { data, error } = await supabase
    .from("notary_requests")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as NotaryRequest[];
}

export async function fetchAllNotaryRequests(): Promise<NotaryRequest[]> {
  const { data, error } = await supabase
    .from("notary_requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as NotaryRequest[];
}

export async function fetchIsAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) return false;
  return Boolean(data);
}

export function serviceName(s: ServicePrice, lang: string) {
  return lang === "ru" ? s.name_ru : s.name_uz;
}

export function serviceDescription(s: ServicePrice, lang: string) {
  return lang === "ru" ? s.description_ru : s.description_uz;
}

export const STATUS_KEYS: Record<NotaryStatus, string> = {
  draft: "status_draft",
  submitted: "status_submitted",
  under_review: "status_under_review",
  approved: "status_approved",
  rejected: "status_rejected",
  completed: "status_completed",
};
