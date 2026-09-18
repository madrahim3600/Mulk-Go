import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
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
import { formatPrice, useI18n, type Lang } from "@/lib/i18n";
import { fetchFavorites, fetchListing } from "@/lib/listings";
import { fetchServicePrices, serviceName } from "@/lib/notary";
import {
  AREA_KINDS,
  PROPERTY_FIELDS,
  PROPERTY_KINDS,
  categoryToKind,
  fieldLabel,
  type PropertyKind,
} from "@/lib/property-fields";

type Search = { listing?: string | undefined };

export const Route = createFileRoute("/_authenticated/notary/new")({
  component: NewNotaryRequest,
  validateSearch: (search: Record<string, unknown>): Search => ({
    listing: typeof search['listing'] === "string" ? (search['listing'] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Yangi rasmiylashtirish arizasi — Mulk-Go" },
      {
        name: "description",
        content: "Elon bo'yicha yoki elonda yo'q mulk uchun online notarius arizasini to'ldiring.",
      },
      { property: "og:title", content: "Rasmiylashtirish arizasi — Mulk-Go" },
      { property: "og:description", content: "Mulk, tomonlar va shaxs ma'lumotlarini kiriting." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function NewNotaryRequest() {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();
  const search = Route.useSearch();

  const [source, setSource] = useState<"favorites" | "listing" | "manual">(
    search.listing ? "listing" : "favorites",
  );
  const [listingId, setListingId] = useState(search.listing ?? "");
  const [serviceCode, setServiceCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [kind, setKind] = useState<PropertyKind>("real_estate");
  const [details, setDetails] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    property_title: "",
    property_address: "",
    property_area: "",
    cadastre_number: "",
    property_value: "",
    seller_full_name: "",
    seller_passport: "",
    seller_pinfl: "",
    seller_phone: "",
    buyer_full_name: "",
    buyer_passport: "",
    buyer_pinfl: "",
    buyer_phone: "",
    notes: "",
  });

  const { data: services } = useQuery({
    queryKey: ["service-prices"],
    queryFn: () => fetchServicePrices(true),
  });

  const { data: favorites } = useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: () => fetchFavorites(user!.id),
    enabled: Boolean(user),
  });

  useEffect(() => {
    if (!serviceCode && services?.length) setServiceCode(services[0]!.code);
  }, [services, serviceCode]);

  async function applyListing(id: string) {
    const listing = await fetchListing(id.trim());
    if (!listing) {
      toast.error(t("listingNotFound"));
      return;
    }
    setListingId(listing.id);
    setKind(categoryToKind(listing.category));
    setForm((f) => ({
      ...f,
      property_title: listing.title,
      property_address: listing.location,
      property_value: String(listing.price ?? ""),
      seller_full_name: f.seller_full_name || listing.seller_name || "",
      seller_phone: f.seller_phone || listing.contact_phone || "",
    }));
    toast.success(t("listingLoaded"));
  }

  useEffect(() => {
    if (search.listing) void applyListing(search.listing);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.listing]);

  const selected = services?.find((s) => s.code === serviceCode);
  const kindFields = PROPERTY_FIELDS[kind];
  const showArea = AREA_KINDS.includes(kind);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !selected) return;
    setBusy(true);
    try {
      const { data, error } = await supabase
        .from("notary_requests")
        .insert({
          user_id: user.id,
          listing_id: source === "manual" ? null : listingId || null,
          service_code: selected.code,
          price_snapshot: Number(selected.price),
          currency: selected.currency,
          property_type: kind,
          property_details: Object.fromEntries(
            Object.entries(details).filter(([, v]) => String(v).trim() !== ""),
          ),
          property_title: form.property_title,
          property_address: form.property_address,
          property_area: showArea && form.property_area ? Number(form.property_area) : null,
          cadastre_number: (showArea && form.cadastre_number) || null,
          property_value: Number(form.property_value || 0),
          seller_full_name: form.seller_full_name,
          seller_passport: form.seller_passport,
          seller_pinfl: form.seller_pinfl,
          seller_phone: form.seller_phone,
          buyer_full_name: form.buyer_full_name,
          buyer_passport: form.buyer_passport,
          buyer_pinfl: form.buyer_pinfl,
          buyer_phone: form.buyer_phone,
          notes: form.notes,
          status: "submitted",
        })
        .select("id")
        .single();
      if (error) throw error;
      if (data) toast.success(t("requestSent"));
      navigate({ to: "/notary" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <h1 className="text-2xl font-bold">{t("newRequest")}</h1>
        <p className="mt-1 text-muted-foreground">{t("notarySub")}</p>

        <form className="mt-6 space-y-8" onSubmit={submit}>
          <section className="space-y-4 rounded-2xl border border-border bg-card p-6">
            <div className="space-y-2">
              <Label>{t("chooseService")}</Label>
              <Select value={serviceCode} onValueChange={setServiceCode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {services?.map((s) => (
                    <SelectItem key={s.code} value={s.code}>
                      {serviceName(s, lang)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selected && (
              <div className="flex items-center justify-between rounded-xl bg-secondary px-4 py-3">
                <span className="text-sm text-muted-foreground">{t("serviceFee")}</span>
                <span className="font-display font-bold">
                  {formatPrice(Number(selected.price), selected.currency, lang as Lang)}
                </span>
              </div>
            )}
          </section>

          <section className="space-y-4 rounded-2xl border border-border bg-card p-6">
            <Label>{t("propertySource")}</Label>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["favorites", t("fromFavorites")],
                  ["listing", t("fromListing")],
                  ["manual", t("manualProperty")],
                ] as const
              ).map(([key, label]) => (
                <Button
                  key={key}
                  type="button"
                  size="sm"
                  variant={source === key ? "default" : "outline"}
                  onClick={() => setSource(key)}
                >
                  {label}
                </Button>
              ))}
            </div>

            {source === "favorites" && (
              <div className="space-y-2">
                <Label>{t("favorites")}</Label>
                <Select value={listingId} onValueChange={(v) => void applyListing(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("fromFavorites")} />
                  </SelectTrigger>
                  <SelectContent>
                    {(favorites ?? []).map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(favorites?.length ?? 0) === 0 && (
                  <p className="text-sm text-muted-foreground">{t("noListingsYet")}</p>
                )}
              </div>
            )}

            {source === "listing" && (
              <div className="space-y-2">
                <Label htmlFor="lid">{t("listingId")}</Label>
                <div className="flex gap-2">
                  <Input
                    id="lid"
                    value={listingId}
                    onChange={(e) => setListingId(e.target.value)}
                    placeholder="0000-0000-..."
                  />
                  <Button type="button" variant="outline" onClick={() => void applyListing(listingId)}>
                    {t("loadListing")}
                  </Button>
                </div>
              </div>
            )}
          </section>

          <section className="space-y-4 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold">{t("propertyTitle")}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t("propertyType")}</Label>
                <Select
                  value={kind}
                  onValueChange={(v) => {
                    setKind(v as PropertyKind);
                    setDetails({});
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_KINDS.map((k) => (
                      <SelectItem key={k.value} value={k.value}>
                        {k.label[lang as Lang]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ptitle">{t("propertyTitle")}</Label>
                <Input
                  id="ptitle"
                  value={form.property_title}
                  onChange={(e) => setForm({ ...form, property_title: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paddr">{t("propertyAddress")}</Label>
              <Input
                id="paddr"
                value={form.property_address}
                onChange={(e) => setForm({ ...form, property_address: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {kindFields.map((f) => (
                <div key={f.key} className="space-y-2">
                  <Label htmlFor={`d-${f.key}`}>{fieldLabel(f, lang as Lang)}</Label>
                  <Input
                    id={`d-${f.key}`}
                    type={f.type === "number" ? "number" : "text"}
                    value={details[f.key] ?? ""}
                    placeholder={f.placeholder ?? ""}
                    required={Boolean(f.required)}
                    onChange={(e) => setDetails({ ...details, [f.key]: e.target.value })}
                  />
                </div>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {showArea && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="parea">{t("propertyArea")}</Label>
                    <Input
                      id="parea"
                      type="number"
                      value={form.property_area}
                      onChange={(e) => setForm({ ...form, property_area: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cad">{t("cadastre")}</Label>
                    <Input
                      id="cad"
                      value={form.cadastre_number}
                      onChange={(e) => setForm({ ...form, cadastre_number: e.target.value })}
                    />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="pval">{t("propertyValue")}</Label>
                <Input
                  id="pval"
                  type="number"
                  value={form.property_value}
                  onChange={(e) => setForm({ ...form, property_value: e.target.value })}
                  required
                />
              </div>
            </div>
          </section>


          <section className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
              <h2 className="font-semibold">{t("sellerInfo")}</h2>
              <div className="space-y-2">
                <Label htmlFor="sname">{t("fullName")}</Label>
                <Input
                  id="sname"
                  value={form.seller_full_name}
                  onChange={(e) => setForm({ ...form, seller_full_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spass">{t("passport")}</Label>
                <Input
                  id="spass"
                  value={form.seller_passport}
                  onChange={(e) => setForm({ ...form, seller_passport: e.target.value })}
                  placeholder="AA1234567"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spinfl">{t("pinfl")}</Label>
                <Input
                  id="spinfl"
                  value={form.seller_pinfl}
                  onChange={(e) => setForm({ ...form, seller_pinfl: e.target.value })}
                  inputMode="numeric"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sphone">{t("phone")}</Label>
                <Input
                  id="sphone"
                  value={form.seller_phone}
                  onChange={(e) => setForm({ ...form, seller_phone: e.target.value })}
                  placeholder="+998 90 000 00 00"
                />
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
              <h2 className="font-semibold">{t("buyerInfo")}</h2>
              <div className="space-y-2">
                <Label htmlFor="bname">{t("fullName")}</Label>
                <Input
                  id="bname"
                  value={form.buyer_full_name}
                  onChange={(e) => setForm({ ...form, buyer_full_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bpass">{t("passport")}</Label>
                <Input
                  id="bpass"
                  value={form.buyer_passport}
                  onChange={(e) => setForm({ ...form, buyer_passport: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bpinfl">{t("pinfl")}</Label>
                <Input
                  id="bpinfl"
                  value={form.buyer_pinfl}
                  onChange={(e) => setForm({ ...form, buyer_pinfl: e.target.value })}
                  inputMode="numeric"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bphone">{t("phone")}</Label>
                <Input
                  id="bphone"
                  value={form.buyer_phone}
                  onChange={(e) => setForm({ ...form, buyer_phone: e.target.value })}
                  placeholder="+998 90 000 00 00"
                />
              </div>
            </div>
          </section>

          <section className="space-y-2 rounded-2xl border border-border bg-card p-6">
            <Label htmlFor="notes">{t("notes")}</Label>
            <Textarea
              id="notes"
              rows={4}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </section>

          <Button type="submit" className="w-full" disabled={busy}>
            {t("submitRequest")}
          </Button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
