import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search, Building2, Car, Laptop, Sofa, Package, ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/lib/i18n";
import { CATEGORIES, fetchListings, type Category } from "@/lib/listings";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Mulk-Go — mulk oldi-sotdisi va ijara platformasi" },
      {
        name: "description",
        content:
          "O'zbekistonda ko'chmas mulk, transport, elektronika va mebel elonlari. Elon joylang, xaridor toping, kelishing.",
      },
      { property: "og:title", content: "Mulk-Go — mulk oldi-sotdisi va ijara platformasi" },
      {
        property: "og:description",
        content: "Ko'chmas mulk, transport va boshqa aktivlar uchun online bozor.",
      },
    ],
  }),
});

const CATEGORY_ICONS: Record<Category, typeof Building2> = {
  real_estate: Building2,
  vehicles: Car,
  electronics: Laptop,
  furniture: Sofa,
  other: Package,
};

function Index() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["listings", "home"],
    queryFn: () => fetchListings({ limit: 8 }),
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <section className="hero-gradient relative overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground/70">
              {t("tagline")}
            </p>
            <h1 className="text-balance-tight mt-4 text-4xl font-extrabold leading-tight text-primary-foreground md:text-5xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-4 max-w-xl text-base text-primary-foreground/80">{t("heroSub")}</p>

            <form
              className="mt-8 flex flex-col gap-2 rounded-2xl bg-card p-2 shadow-lg sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                navigate({ to: "/listings", search: { q: q || undefined } });
              }}
            >
              <div className="flex flex-1 items-center gap-2 px-2">
                <Search className="size-4 shrink-0 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t("searchPlaceholder")}
                  className="border-0 shadow-none focus-visible:ring-0"
                />
              </div>
              <Button type="submit" size="lg">
                {t("search")}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4">
        <section className="py-12">
          <h2 className="text-xl font-bold">{t("categories")}</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {CATEGORIES.map((c) => {
              const Icon = CATEGORY_ICONS[c];
              return (
                <Link
                  key={c}
                  to="/listings"
                  search={{ category: c }}
                  className="card-lift flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:-translate-y-0.5"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-secondary-foreground">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-sm font-semibold">{t(c)}</span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="pb-6">
          <div className="flex items-end justify-between">
            <h2 className="text-xl font-bold">{t("freshListings")}</h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/listings">
                {t("seeAll")}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-72 rounded-2xl" />
                ))
              : (data ?? []).map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        </section>

        <section className="py-14">
          <h2 className="text-xl font-bold">{t("howItWorks")}</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              { n: "01", tt: "step1t", dd: "step1d" },
              { n: "02", tt: "step2t", dd: "step2d" },
              { n: "03", tt: "step3t", dd: "step3d" },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-border bg-card p-6">
                <span className="font-display text-sm font-bold text-accent">{s.n}</span>
                <h3 className="mt-2 text-lg font-semibold">{t(s.tt as "step1t")}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t(s.dd as "step1d")}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
