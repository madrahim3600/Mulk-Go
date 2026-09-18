CREATE TABLE public.listing_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.listing_comments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.listing_comments TO authenticated;
GRANT ALL ON public.listing_comments TO service_role;

ALTER TABLE public.listing_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "comments_public_read" ON public.listing_comments FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "comments_insert_own" ON public.listing_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments_update_own" ON public.listing_comments FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments_delete_own_or_admin" ON public.listing_comments FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX listing_comments_listing_idx ON public.listing_comments(listing_id, created_at DESC);

CREATE TRIGGER listing_comments_updated_at BEFORE UPDATE ON public.listing_comments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();