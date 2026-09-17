import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/lib/i18n";

type MessageRow = {
  id: string;
  listing_id: string;
  sender_id: string;
  receiver_id: string;
  body: string;
  created_at: string;
  listings: { title: string } | null;
};

export const Route = createFileRoute("/_authenticated/messages")({
  component: MessagesPage,
  head: () => ({
    meta: [
      { title: "Xabarlar — Mulk-Go" },
      { name: "description", content: "Xaridor va sotuvchilar bilan yozishmalaringiz." },
      { property: "og:title", content: "Xabarlar — Mulk-Go" },
      { property: "og:description", content: "Elonlar bo'yicha kelgan va yuborilgan xabarlar." },
    ],
  }),
});

function MessagesPage() {
  const { t, lang } = useI18n();
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["messages", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("id, listing_id, sender_id, receiver_id, body, created_at, listings(title)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as MessageRow[];
    },
    enabled: Boolean(user),
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <h1 className="text-2xl font-bold">{t("messages")}</h1>
        <div className="mt-6 space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
          ) : (data?.length ?? 0) === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
              {t("noMessages")}
            </div>
          ) : (
            data!.map((m) => (
              <div key={m.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                  <Link
                    to="/listings/$id"
                    params={{ id: m.listing_id }}
                    className="font-semibold text-primary hover:underline"
                  >
                    {m.listings?.title ?? t("listings")}
                  </Link>
                  <span>
                    {new Date(m.created_at).toLocaleString(lang === "ru" ? "ru-RU" : "uz-UZ")}
                  </span>
                </div>
                <p className="mt-2 text-sm">
                  <span className="font-medium">
                    {m.sender_id === user?.id ? (lang === "ru" ? "Вы" : "Siz") : t("seller")}:
                  </span>{" "}
                  {m.body}
                </p>
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
