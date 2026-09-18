import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowLeft, Eye, Heart, MapPin, Phone, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ListingChat } from "@/components/ListingChat";
import { ListingComments } from "@/components/ListingComments";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice, useI18n, type Lang } from "@/lib/i18n";
import {
  PLACEHOLDER_IMAGE,
  fetchFavoriteIds,
  fetchListing,
  toggleFavorite,
} from "@/lib/listings";

export const Route = createFileRoute("/listings/$id")({
  component: ListingDetail,
  head: () => ({
    meta: [
      { title: "Elon — Mulk-Go" },
      { name: "description", content: "Mulk-Go platformasidagi elon haqida to'liq ma'lumot." },
      { property: "og:title", content: "Elon — Mulk-Go" },
      { property: "og:description", content: "Narx, tavsif, rasmlar va sotuvchi bilan aloqa." },
    ],
  }),
});

function ListingDetail() {
  const { id } = Route.useParams();
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeImage, setActiveImage] = useState(0);

  const { data: listing, isLoading } = useQuery({
    queryKey: ["listing", id],
    queryFn: () => fetchListing(id),
  });

  const { data: favIds } = useQuery({
    queryKey: ["favorite-ids", user?.id],
    queryFn: () => fetchFavoriteIds(user!.id),
    enabled: Boolean(user),
  });

  useEffect(() => {
    supabase.rpc("increment_listing_views", { _listing_id: id });
  }, [id]);

  const isFav = Boolean(favIds?.includes(id));

  const favMutation = useMutation({
    mutationFn: () => toggleFavorite(user!.id, id, isFav),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorite-ids", user?.id] }),
  });


  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
          <Skeleton className="h-96 w-full rounded-2xl" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-20 text-center">
          <p className="text-muted-foreground">{t("nothingFound")}</p>
          <Button asChild className="mt-6">
            <Link to="/listings">{t("backToListings")}</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const images = listing.images?.length ? listing.images : [PLACEHOLDER_IMAGE];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link to="/listings">
            <ArrowLeft className="size-4" />
            {t("backToListings")}
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="overflow-hidden rounded-2xl border border-border bg-muted">
              <img
                src={images[activeImage]}
                alt={listing.title}
                className="aspect-16/10 w-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {images.map((src, i) => (
                  <button
                    key={src + i}
                    onClick={() => setActiveImage(i)}
                    className={`size-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                      i === activeImage ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Badge variant={listing.listing_kind === "rent" ? "secondary" : "default"}>
                {t(listing.listing_kind)}
              </Badge>
              <Badge variant="outline">{t(listing.category)}</Badge>
            </div>

            <h1 className="mt-3 text-2xl font-bold md:text-3xl">{listing.title}</h1>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-4" />
                {listing.location || "—"}
              </span>
              <span className="inline-flex items-center gap-1">
                <Eye className="size-4" />
                {listing.views_count} {t("views")}
              </span>
            </div>

            <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-foreground/90">
              {listing.description}
            </p>
          </div>

          <aside className="h-fit space-y-4 rounded-2xl border border-border bg-card p-6 shadow-soft lg:sticky lg:top-24">
            <p className="font-display text-3xl font-extrabold">
              {formatPrice(Number(listing.price), listing.currency, lang as Lang)}
            </p>

            <div className="rounded-xl bg-secondary p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("seller")}</p>
              <p className="mt-1 font-semibold">{listing.seller_name || "—"}</p>
            </div>

            {listing.seller_id && (
              <ListingChat
                listingId={id}
                sellerId={listing.seller_id}
                sellerName={listing.seller_name}
              />
            )}

            {listing.contact_phone && (
              <Button asChild variant="outline" className="w-full">
                <a href={`tel:${listing.contact_phone.replace(/\s/g, "")}`}>
                  <Phone className="size-4" />
                  {listing.contact_phone}
                </a>
              </Button>
            )}

            <Button
              variant={isFav ? "secondary" : "outline"}
              className="w-full"
              onClick={() => {
                if (!user) {
                  toast.info(t("loginRequired"));
                  navigate({ to: "/auth" });
                  return;
                }
                favMutation.mutate();
              }}
            >
              <Heart className={`size-4 ${isFav ? "fill-current" : ""}`} />
              {isFav ? t("inFavorites") : t("addFavorite")}
            </Button>

            <Button
              className="w-full"
              onClick={() => {
                if (!user) {
                  toast.info(t("loginRequired"));
                  navigate({ to: "/auth" });
                  return;
                }
                navigate({ to: "/notary/new", search: { listing: id } });
              }}
            >
              <ShieldCheck className="size-4" />
              {t("formalize")}
            </Button>

          </aside>
        </div>

        <ListingComments listingId={id} />
      </main>
      <Footer />
    </div>
  );
}
