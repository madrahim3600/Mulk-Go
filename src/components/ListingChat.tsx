import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Msg = {
  id: string;
  sender_id: string;
  receiver_id: string;
  body: string;
  created_at: string;
};

export function ListingChat({
  listingId,
  sellerId,
  sellerName,
}: {
  listingId: string;
  sellerId: string;
  sellerName: string | null;
}) {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const [peer, setPeer] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const isOwner = user?.id === sellerId;

  const { data: messages } = useQuery({
    queryKey: ["listing-chat", listingId, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("id, sender_id, receiver_id, body, created_at")
        .eq("listing_id", listingId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Msg[];
    },
    enabled: Boolean(user),
    refetchInterval: 8000,
  });

  const peers = useMemo(() => {
    if (!isOwner || !user) return [] as string[];
    const set = new Set<string>();
    (messages ?? []).forEach((m) => {
      const other = m.sender_id === user.id ? m.receiver_id : m.sender_id;
      if (other !== user.id) set.add(other);
    });
    return [...set];
  }, [messages, isOwner, user]);

  const activePeer = isOwner ? (peer ?? peers[0] ?? null) : sellerId;

  const { data: peerNames } = useQuery({
    queryKey: ["chat-peer-names", peers.join(",")],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", peers);
      if (error) throw error;
      const map: Record<string, string> = {};
      (data ?? []).forEach((p: { id: string; full_name: string | null }) => {
        if (p.full_name) map[p.id] = p.full_name;
      });
      return map;
    },
    enabled: isOwner && peers.length > 0,
  });

  const thread = useMemo(
    () =>
      (messages ?? []).filter(
        (m) =>
          activePeer &&
          (m.sender_id === activePeer || m.receiver_id === activePeer),
      ),
    [messages, activePeer],
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "nearest" });
  }, [thread.length]);

  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!user || !activePeer) throw new Error(t("loginRequired"));
      const { error } = await supabase.from("messages").insert({
        listing_id: listingId,
        sender_id: user.id,
        receiver_id: activePeer,
        body: text.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setText("");
      queryClient.invalidateQueries({ queryKey: ["listing-chat", listingId, user?.id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-3 rounded-xl border border-border p-4">
      <div>
        <p className="text-sm font-semibold">
          {isOwner ? t("messages") : t("chatWithSeller")}
          {!isOwner && sellerName ? ` · ${sellerName}` : ""}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{t("chatPrivateNote")}</p>
      </div>

      {!user ? (
        <Button asChild variant="outline" className="w-full">
          <Link to="/auth">{t("signIn")}</Link>
        </Button>
      ) : (
        <>
          {isOwner && (
            <div className="flex flex-wrap gap-2">
              {peers.length === 0 ? (
                <span className="text-xs text-muted-foreground">{t("noBuyersYet")}</span>
              ) : (
                peers.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeer(p)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      p === activePeer
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:bg-secondary"
                    }`}
                  >
                    {peerNames?.[p] ?? `${t("userLabel")} ${p.slice(0, 6)}`}
                  </button>
                ))
              )}
            </div>
          )}

          <div className="max-h-72 space-y-2 overflow-y-auto rounded-lg bg-secondary/50 p-3">
            {thread.length === 0 ? (
              <p className="py-6 text-center text-xs text-muted-foreground">{t("chatEmpty")}</p>
            ) : (
              thread.map((m) => {
                const mine = m.sender_id === user.id;
                return (
                  <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                        mine
                          ? "bg-primary text-primary-foreground"
                          : "border border-border bg-card"
                      }`}
                    >
                      <p className="whitespace-pre-line">{m.body}</p>
                      <p className="mt-1 text-[10px] opacity-70">
                        {new Date(m.created_at).toLocaleString(lang === "ru" ? "ru-RU" : "uz-UZ")}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("messagePlaceholder")}
            rows={2}
            disabled={isOwner && !activePeer}
          />
          <Button
            className="w-full"
            disabled={!text.trim() || !activePeer || sendMutation.isPending}
            onClick={() => sendMutation.mutate()}
          >
            <Send className="size-4" />
            {t("sendMessage")}
          </Button>
        </>
      )}
    </div>
  );
}
