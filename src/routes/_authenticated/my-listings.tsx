import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice, useI18n, type Lang } from "@/lib/i18n";
import { PLACEHOLDER_IMAGE, fetchMyListings, type Status } from "@/lib/listings";

export const Route = createFileRoute("/_authenticated/my-listings")({
  component: MyListings,
  head: () => ({
    meta: [
      { title: "Mening elonlarim — Mulk-Go" },
      { name: "description", content: "O'z elonlaringizni boshqaring: tahrirlash, arxivlash, o'chirish." },
      { property: "og:title", content: "Mening elonlarim — Mulk-Go" },
      { property: "og:description", content: "Elonlaringiz holati va statistikasi." },
    ],
  }),
});

function MyListings() {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["my-listings", user?.id],
    queryFn: () => fetchMyListings(user!.id),
    enabled: Boolean(user),
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Status }) => {
      const { error } = await supabase.from("listings").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-listings", user?.id] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("listings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(t("listingDeleted"));
      queryClient.invalidateQueries({ queryKey: ["my-listings", user?.id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t("myListings")}</h1>
          <Button asChild size="sm">
            <Link to="/new-listing">
              <Plus className="size-4" />
              {t("newListing")}
            </Link>
          </Button>
        </div>

        <div className="mt-6 space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
          ) : (data?.length ?? 0) === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
              {t("noListingsYet")}
            </div>
          ) : (
            data!.map((l) => (
              <div
                key={l.id}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center"
              >
                <img
                  src={l.images?.[0] || PLACEHOLDER_IMAGE}
                  alt={l.title}
                  className="h-24 w-full rounded-xl object-cover sm:w-32"
                />
                <div className="min-w-0 flex-1">
                  <Link
                    to="/listings/$id"
                    params={{ id: l.id }}
                    className="line-clamp-1 font-semibold hover:underline"
                  >
                    {l.title}
                  </Link>
                  <p className="mt-1 font-display font-bold">
                    {formatPrice(Number(l.price), l.currency, lang as Lang)}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant={l.status === "active" ? "default" : "secondary"}>
                      {t(l.status)}
                    </Badge>
                    <span>
                      {l.views_count} {t("views")}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {l.status === "active" ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => statusMutation.mutate({ id: l.id, status: "sold" })}
                      >
                        {t("markSold")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => statusMutation.mutate({ id: l.id, status: "archived" })}
                      >
                        {t("archive")}
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => statusMutation.mutate({ id: l.id, status: "active" })}
                    >
                      {t("activate")}
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(l.id)}>
                    {t("delete")}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
