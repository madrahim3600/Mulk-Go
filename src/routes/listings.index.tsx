import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";
import { CATEGORIES, fetchListings, type Category, type Kind } from "@/lib/listings";

type SearchParams = {
  q?: string;
  category?: Category | "all";
  kind?: Kind | "all";
  min?: number;
  max?: number;
  sort?: "new" | "cheap" | "expensive";
};

export const Route = createFileRoute("/listings/")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    q: typeof search["q"] === "string" ? search["q"] : undefined,
    category: (search["category"] as SearchParams["category"]) ?? undefined,
    kind: (search["kind"] as SearchParams["kind"]) ?? undefined,
    min: search["min"] != null ? Number(search["min"]) : undefined,
    max: search["max"] != null ? Number(search["max"]) : undefined,
    sort: (search["sort"] as SearchParams["sort"]) ?? undefined,
  }),
  component: ListingsPage,
  head: () => ({
    meta: [
      { title: "Elonlar — Mulk-Go" },
      {
        name: "description",
        content: "Kategoriya, narx va joylashuv bo'yicha mulk elonlarini qidiring va saralang.",
      },
      { property: "og:title", content: "Elonlar — Mulk-Go" },
      { property: "og:description", content: "Mulk-Go platformasidagi barcha faol elonlar." },
    ],
  }),
});

function ListingsPage() {
  const { t } = useI18n();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/listings" });
  const [qInput, setQInput] = useState(search.q ?? "");

  const { data, isLoading } = useQuery({
    queryKey: ["listings", search],
    queryFn: () =>
      fetchListings({
        q: search.q,
        category: search.category,
        kind: search.kind,
        priceMin: search.min,
        priceMax: search.max,
        sort: search.sort,
      }),
  });

  const update = (patch: Partial<SearchParams>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }) });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        <h1 className="text-2xl font-bold">{t("allListings")}</h1>

        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit space-y-4 rounded-2xl border border-border bg-card p-5">
            <p className="font-display text-sm font-bold uppercase tracking-wide">{t("filters")}</p>

            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                update({ q: qInput || undefined });
              }}
            >
              <Input
                value={qInput}
                onChange={(e) => setQInput(e.target.value)}
                placeholder={t("searchPlaceholder")}
              />
              <Button type="submit" size="icon" aria-label={t("search")}>
                <Search className="size-4" />
              </Button>
            </form>

            <div className="space-y-2">
              <Label>{t("category")}</Label>
              <Select
                value={search.category ?? "all"}
                onValueChange={(v) => update({ category: v as Category | "all" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allCategories")}</SelectItem>
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
                value={search.kind ?? "all"}
                onValueChange={(v) => update({ kind: v as Kind | "all" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allTypes")}</SelectItem>
                  <SelectItem value="sale">{t("sale")}</SelectItem>
                  <SelectItem value="rent">{t("rent")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>{t("priceFrom")}</Label>
                <Input
                  type="number"
                  inputMode="numeric"
                  value={search.min ?? ""}
                  onChange={(e) => update({ min: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("priceTo")}</Label>
                <Input
                  type="number"
                  inputMode="numeric"
                  value={search.max ?? ""}
                  onChange={(e) => update({ max: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("sortNew")}</Label>
              <Select
                value={search.sort ?? "new"}
                onValueChange={(v) => update({ sort: v as SearchParams["sort"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">{t("sortNew")}</SelectItem>
                  <SelectItem value="cheap">{t("sortCheap")}</SelectItem>
                  <SelectItem value="expensive">{t("sortExpensive")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setQInput("");
                navigate({ search: {} });
              }}
            >
              {t("reset")}
            </Button>
          </aside>

          <section>
            <p className="mb-4 text-sm text-muted-foreground">
              {isLoading ? t("loading") : `${data?.length ?? 0} ${t("results")}`}
            </p>
            {isLoading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-72 rounded-2xl" />
                ))}
              </div>
            ) : (data?.length ?? 0) === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
                {t("nothingFound")}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {data!.map((l) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
