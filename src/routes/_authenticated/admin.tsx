import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { formatPrice, useI18n, type Lang, type dict } from "@/lib/i18n";
import {
  STATUS_KEYS,
  fetchAllNotaryRequests,
  fetchServicePrices,
  serviceName,
  type NotaryStatus,
} from "@/lib/notary";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPanel,
  head: () => ({
    meta: [
      { title: "Admin panel — Mulk-Go" },
      { name: "description", content: "Xizmat narxlarini belgilash va rasmiylashtirish arizalarini boshqarish." },
      { property: "og:title", content: "Admin panel — Mulk-Go" },
      { property: "og:description", content: "Narxlar va arizalar boshqaruvi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function AdminPanel() {
  const { t, lang } = useI18n();
  const isAdmin = useIsAdmin();
  const queryClient = useQueryClient();
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const { data: services, isLoading } = useQuery({
    queryKey: ["service-prices-all"],
    queryFn: () => fetchServicePrices(false),
    enabled: isAdmin,
  });

  const { data: requests } = useQuery({
    queryKey: ["notary-requests-all"],
    queryFn: fetchAllNotaryRequests,
    enabled: isAdmin,
  });

  const priceMutation = useMutation({
    mutationFn: async ({
      id,
      patch,
    }: {
      id: string;
      patch: { price?: number; is_active?: boolean };
    }) => {
      const { error } = await supabase.from("service_prices").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(t("saved"));
      queryClient.invalidateQueries({ queryKey: ["service-prices-all"] });
      queryClient.invalidateQueries({ queryKey: ["service-prices"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const requestMutation = useMutation({
    mutationFn: async ({
      id,
      patch,
    }: {
      id: string;
      patch: {
        status?: NotaryStatus;
        identity_status?: "pending" | "verified" | "failed";
        identity_verified_at?: string;
      };
    }) => {
      const { error } = await supabase.from("notary_requests").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(t("saved"));
      queryClient.invalidateQueries({ queryKey: ["notary-requests-all"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-20 text-center">
          <ShieldAlert className="mx-auto size-10 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">{t("loginRequired")}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <h1 className="text-2xl font-bold">{t("adminPanel")}</h1>

        <section className="mt-8">
          <h2 className="text-xl font-bold">{t("managePrices")}</h2>
          <div className="mt-4 space-y-3">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)
              : services?.map((s) => (
                  <div
                    key={s.id}
                    className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{serviceName(s, lang)}</p>
                      <p className="text-xs text-muted-foreground">{s.code}</p>
                    </div>
                    <Input
                      className="sm:w-48"
                      type="number"
                      value={drafts[s.id] ?? String(s.price)}
                      onChange={(e) => setDrafts({ ...drafts, [s.id]: e.target.value })}
                    />
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={s.is_active}
                        onCheckedChange={(v) =>
                          priceMutation.mutate({ id: s.id, patch: { is_active: v } })
                        }
                      />
                      <span className="text-sm text-muted-foreground">{t("activeService")}</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() =>
                        priceMutation.mutate({
                          id: s.id,
                          patch: { price: Number(drafts[s.id] ?? s.price) },
                        })
                      }
                    >
                      {t("save")}
                    </Button>
                  </div>
                ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold">{t("allRequests")}</h2>
          <div className="mt-4 space-y-3">
            {(requests?.length ?? 0) === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
                {t("noRequests")}
              </div>
            ) : (
              requests!.map((r) => (
                <div key={r.id} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold">{r.property_title || r.service_code}</p>
                      <p className="text-sm text-muted-foreground">{r.property_address}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {t("sellerInfo")}: {r.seller_full_name} · {r.seller_passport}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("buyerInfo")}: {r.buyer_full_name || "—"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-bold">
                        {formatPrice(Number(r.price_snapshot), r.currency, lang as Lang)}
                      </p>
                      <Badge className="mt-1" variant="secondary">
                        {t(STATUS_KEYS[r.status] as keyof typeof dict)}
                      </Badge>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {t("identity")}: {r.identity_status}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        requestMutation.mutate({
                          id: r.id,
                          patch: {
                            identity_status: "verified",
                            identity_verified_at: new Date().toISOString(),
                          },
                        })
                      }
                    >
                      {t("identityVerified")}
                    </Button>
                    {(["under_review", "approved", "rejected", "completed"] as NotaryStatus[]).map(
                      (st) => (
                        <Button
                          key={st}
                          size="sm"
                          variant={r.status === st ? "default" : "ghost"}
                          onClick={() => requestMutation.mutate({ id: r.id, patch: { status: st } })}
                        >
                          {t(STATUS_KEYS[st] as keyof typeof dict)}
                        </Button>
                      ),
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
