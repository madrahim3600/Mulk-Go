import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ListingCard } from "@/components/ListingCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/lib/i18n";
import { fetchFavorites } from "@/lib/listings";

export const Route = createFileRoute("/_authenticated/favorites")({
  component: FavoritesPage,
  head: () => ({
    meta: [
      { title: "Sevimlilar — Mulk-Go" },
      { name: "description", content: "Saqlangan elonlaringiz ro'yxati." },
      { property: "og:title", content: "Sevimlilar — Mulk-Go" },
      { property: "og:description", content: "Siz saqlagan mulk elonlari." },
    ],
  }),
});

function FavoritesPage() {
  const { t } = useI18n();
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: () => fetchFavorites(user!.id),
    enabled: Boolean(user),
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        <h1 className="text-2xl font-bold">{t("favorites")}</h1>
        <div className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-72 rounded-2xl" />
              ))}
            </div>
          ) : (data?.length ?? 0) === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
              {t("nothingFound")}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {data!.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
