import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { BadgeCheck, FileSignature, Plus, ScanFace, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FaceIdDialog } from "@/components/FaceIdDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice, useI18n, type Lang } from "@/lib/i18n";
import {
  STATUS_KEYS,
  fetchMyNotaryRequests,
  fetchServicePrices,
  serviceDescription,
  serviceName,
} from "@/lib/notary";
import type { dict } from "@/lib/i18n";
import { findFieldLabel, kindLabel } from "@/lib/property-fields";

export const Route = createFileRoute("/_authenticated/notary/")({
  component: NotaryHub,
  head: () => ({
    meta: [
      { title: "Rasmiylashtirish — Mulk-Go online notarius" },
      {
        name: "description",
        content: "Mulkni onlayn rasmiylashtiring: notarius xizmatlari narxlari, ariza berish va FaceID orqali shaxsni tasdiqlash.",
      },
      { property: "og:title", content: "Online notarius — Mulk-Go" },
      { property: "og:description", content: "Shartnomani onlayn rasmiylashtirish va shaxsni tasdiqlash." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function NotaryHub() {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [faceFor, setFaceFor] = useState<string | null>(null);

  const { data: services, isLoading: loadingServices } = useQuery({
    queryKey: ["service-prices"],
    queryFn: () => fetchServicePrices(true),
  });

  const { data: requests, isLoading } = useQuery({
    queryKey: ["notary-requests", user?.id],
    queryFn: () => fetchMyNotaryRequests(user!.id),
    enabled: Boolean(user),
  });

  const verifyMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notary_requests")
        .update({
          identity_status: "pending",
          identity_method: "myid",
          identity_payload: { captured: true, captured_at: new Date().toISOString() },
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      setFaceFor(null);
      toast.success(t("identityPending"));
      queryClient.invalidateQueries({ queryKey: ["notary-requests", user?.id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="size-5" />
            <span className="text-sm font-semibold uppercase tracking-wide">{t("notaryLong")}</span>
          </div>
          <h1 className="mt-3 font-display text-2xl font-extrabold md:text-3xl">{t("notary")}</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">{t("notarySub")}</p>
          <Button asChild className="mt-5">
            <Link to="/notary/new">
              <Plus className="size-4" />
              {t("newRequest")}
            </Link>
          </Button>
        </div>

        <section className="mt-10">
          <h2 className="text-xl font-bold">{t("servicePrices")}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {loadingServices
              ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
              : services?.map((s) => (
                  <div key={s.id} className="rounded-2xl border border-border bg-card p-5">
                    <p className="font-semibold">{serviceName(s, lang)}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{serviceDescription(s, lang)}</p>
                    <p className="mt-3 font-display text-lg font-bold text-primary">
                      {formatPrice(Number(s.price), s.currency, lang as Lang)}
                    </p>
                  </div>
                ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold">{t("myRequests")}</h2>
          <div className="mt-4 space-y-3">
            {isLoading ? (
              Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
            ) : (requests?.length ?? 0) === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
                {t("noRequests")}
              </div>
            ) : (
              requests!.map((r) => {
                const service = services?.find((s) => s.code === r.service_code);
                return (
                  <div key={r.id} className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 font-semibold">
                          <FileSignature className="size-4 text-primary" />
                          {service ? serviceName(service, lang) : r.service_code}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {kindLabel(r.property_type, lang as Lang)} ·{" "}
                          {r.property_title || r.property_address || "—"}
                        </p>
                        {r.property_details && Object.keys(r.property_details).length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {Object.entries(r.property_details).map(([k, v]) => (
                              <span
                                key={k}
                                className="rounded-lg bg-secondary px-2 py-1 text-xs text-secondary-foreground"
                              >
                                {findFieldLabel(r.property_type, k, lang as Lang)}: {String(v)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-display font-bold">
                          {formatPrice(Number(r.price_snapshot), r.currency, lang as Lang)}
                        </p>
                        <Badge
                          className="mt-1"
                          variant={
                            r.status === "approved" || r.status === "completed"
                              ? "default"
                              : r.status === "rejected"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {t(STATUS_KEYS[r.status] as keyof typeof dict)}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4">
                      {r.identity_status === "verified" ? (
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                          <BadgeCheck className="size-4" />
                          {t("identityVerified")}
                        </span>
                      ) : (
                        <>
                          <span className="text-sm text-muted-foreground">
                            {r.identity_status === "failed" ? t("identityFailed") : t("identityPending")}
                          </span>
                          <Button size="sm" variant="outline" onClick={() => setFaceFor(r.id)}>
                            <ScanFace className="size-4" />
                            {t("verifyFace")}
                          </Button>
                        </>
                      )}
                      {r.admin_comment && (
                        <span className="text-sm text-muted-foreground">— {r.admin_comment}</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>
      <Footer />

      <FaceIdDialog
        open={Boolean(faceFor)}
        onOpenChange={(o) => !o && setFaceFor(null)}
        pending={verifyMutation.isPending}
        onConfirm={() => faceFor && verifyMutation.mutate(faceFor)}
      />
    </div>
  );
}
