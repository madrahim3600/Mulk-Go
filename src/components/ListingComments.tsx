import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { MessageCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type CommentRow = {
  id: string;
  user_id: string;
  body: string;
  created_at: string;
};

export function ListingComments({ listingId }: { listingId: string }) {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [text, setText] = useState("");

  const { data: comments } = useQuery({
    queryKey: ["listing-comments", listingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listing_comments")
        .select("id, user_id, body, created_at")
        .eq("listing_id", listingId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as CommentRow[];
    },
  });

  const authorIds = [...new Set((comments ?? []).map((c) => c.user_id))];

  const { data: names } = useQuery({
    queryKey: ["comment-authors", listingId, authorIds.join(",")],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", authorIds);
      if (error) throw error;
      const map: Record<string, string> = {};
      (data ?? []).forEach((p: { id: string; full_name: string | null }) => {
        if (p.full_name) map[p.id] = p.full_name;
      });
      return map;
    },
    enabled: authorIds.length > 0,
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error(t("loginRequired"));
      const { error } = await supabase
        .from("listing_comments")
        .insert({ listing_id: listingId, user_id: user.id, body: text.trim() });
      if (error) throw error;
    },
    onSuccess: () => {
      setText("");
      queryClient.invalidateQueries({ queryKey: ["listing-comments", listingId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("listing_comments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["listing-comments", listingId] }),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <section className="mt-10 rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="size-5 text-primary" />
        <h2 className="text-lg font-semibold">
          {t("comments")} ({comments?.length ?? 0})
        </h2>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{t("commentsPublicNote")}</p>

      {user ? (
        <div className="mt-4 space-y-2">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("commentPlaceholder")}
            rows={3}
          />
          <Button
            disabled={!text.trim() || addMutation.isPending}
            onClick={() => addMutation.mutate()}
          >
            {t("addComment")}
          </Button>
        </div>
      ) : (
        <Button asChild variant="outline" className="mt-4">
          <Link to="/auth">{t("signIn")}</Link>
        </Button>
      )}

      <div className="mt-6 space-y-3">
        {(comments?.length ?? 0) === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">{t("noComments")}</p>
        ) : (
          comments!.map((c) => (
            <div key={c.id} className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {c.user_id === user?.id
                    ? t("you")
                    : (names?.[c.user_id] ?? `${t("userLabel")} ${c.user_id.slice(0, 6)}`)}
                </span>
                <span className="flex items-center gap-2">
                  {new Date(c.created_at).toLocaleString(lang === "ru" ? "ru-RU" : "uz-UZ")}
                  {c.user_id === user?.id && (
                    <button
                      onClick={() => deleteMutation.mutate(c.id)}
                      className="text-muted-foreground transition-colors hover:text-destructive"
                      aria-label={t("deleteAction")}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </span>
              </div>
              <p className="mt-2 whitespace-pre-line text-sm">{c.body}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
