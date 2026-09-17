import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/lib/i18n";
import { CATEGORIES, type Category, type Kind } from "@/lib/listings";

export const Route = createFileRoute("/_authenticated/new-listing")({
  component: NewListing,
  head: () => ({
    meta: [
      { title: "Elon berish — Mulk-Go" },
      { name: "description", content: "Mulkingiz haqida yangi elon joylang: narx, tavsif va rasm." },
      { property: "og:title", content: "Elon berish — Mulk-Go" },
      { property: "og:description", content: "Bir necha daqiqada elon joylang." },
    ],
  }),
});

function NewListing() {
  const { t } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "real_estate" as Category,
    listing_kind: "sale" as Kind,
    price: "",
    location: "",
    image: "",
    contact_phone: "",
  });
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", user.id)
        .maybeSingle();

      const { data, error } = await supabase
        .from("listings")
        .insert({
          seller_id: user.id,
          seller_name: profile?.full_name || user.email || null,
          title: form.title,
          description: form.description,
          category: form.category,
          listing_kind: form.listing_kind,
          price: Number(form.price || 0),
          location: form.location,
          images: form.image ? [form.image] : [],
          contact_phone: form.contact_phone || profile?.phone || null,
        })
        .select("id")
        .single();
      if (error) throw error;
      toast.success(t("listingCreated"));
      navigate({ to: "/listings/$id", params: { id: data.id } });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <h1 className="text-2xl font-bold">{t("newListing")}</h1>

        <form className="mt-6 space-y-5 rounded-2xl border border-border bg-card p-6" onSubmit={submit}>
          <div className="space-y-2">
            <Label htmlFor="title">{t("title")}</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t("description")}</Label>
            <Textarea
              id="description"
              rows={5}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("category")}</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm({ ...form, category: v as Category })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {t(c)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("type")}</Label>
              <Select
                value={form.listing_kind}
                onValueChange={(v) => setForm({ ...form, listing_kind: v as Kind })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">{t("sale")}</SelectItem>
                  <SelectItem value="rent">{t("rent")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">{t("price")} (so'm)</Label>
              <Input
                id="price"
                type="number"
                inputMode="numeric"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">{t("location")}</Label>
              <Input
                id="location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">{t("imageUrl")}</Label>
            <Input
              id="image"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">{t("contactPhone")}</Label>
            <Input
              id="contact"
              value={form.contact_phone}
              onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
              placeholder="+998 90 000 00 00"
            />
          </div>

          <Button type="submit" className="w-full" disabled={busy}>
            {t("publish")}
          </Button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
