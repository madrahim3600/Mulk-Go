CREATE SEQUENCE public.listing_number_seq
  AS bigint
  START WITH 100000000000
  MINVALUE 100000000000
  MAXVALUE 999999999999
  NO CYCLE;

ALTER TABLE public.listings ADD COLUMN listing_number bigint;

UPDATE public.listings
SET listing_number = nextval('public.listing_number_seq');

ALTER TABLE public.listings
  ALTER COLUMN listing_number SET DEFAULT nextval('public.listing_number_seq'),
  ALTER COLUMN listing_number SET NOT NULL,
  ADD CONSTRAINT listings_listing_number_digits CHECK (listing_number BETWEEN 100000000000 AND 999999999999),
  ADD CONSTRAINT listings_listing_number_key UNIQUE (listing_number);

CREATE INDEX listings_listing_number_idx ON public.listings (listing_number);

ALTER SEQUENCE public.listing_number_seq
  OWNED BY public.listings.listing_number;

CREATE POLICY "listings_admin_read" ON public.listings
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "listings_admin_update" ON public.listings
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "listings_admin_delete" ON public.listings
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));