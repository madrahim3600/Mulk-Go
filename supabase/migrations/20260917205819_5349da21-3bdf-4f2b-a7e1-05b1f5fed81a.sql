
CREATE TYPE public.listing_category AS ENUM ('real_estate','vehicles','electronics','furniture','other');
CREATE TYPE public.listing_kind AS ENUM ('sale','rent');
CREATE TYPE public.listing_status AS ENUM ('active','archived','sold');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  address text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_public_read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_name text,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category public.listing_category NOT NULL DEFAULT 'other',
  listing_kind public.listing_kind NOT NULL DEFAULT 'sale',
  price numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'UZS',
  images text[] NOT NULL DEFAULT '{}',
  location text NOT NULL DEFAULT '',
  contact_phone text,
  status public.listing_status NOT NULL DEFAULT 'active',
  views_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.listings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.listings TO authenticated;
GRANT ALL ON public.listings TO service_role;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "listings_public_read_active" ON public.listings FOR SELECT USING (status = 'active');
CREATE POLICY "listings_owner_read" ON public.listings FOR SELECT TO authenticated USING (auth.uid() = seller_id);
CREATE POLICY "listings_owner_insert" ON public.listings FOR INSERT TO authenticated WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "listings_owner_update" ON public.listings FOR UPDATE TO authenticated USING (auth.uid() = seller_id) WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "listings_owner_delete" ON public.listings FOR DELETE TO authenticated USING (auth.uid() = seller_id);
CREATE INDEX listings_category_idx ON public.listings (category);
CREATE INDEX listings_created_idx ON public.listings (created_at DESC);

CREATE TABLE public.favorites (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, listing_id)
);
GRANT SELECT, INSERT, DELETE ON public.favorites TO authenticated;
GRANT ALL ON public.favorites TO service_role;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "favorites_own" ON public.favorites FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "messages_participants_read" ON public.messages FOR SELECT TO authenticated USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "messages_send" ON public.messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "messages_mark_read" ON public.messages FOR UPDATE TO authenticated USING (auth.uid() = receiver_id) WITH CHECK (auth.uid() = receiver_id);

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER listings_updated_at BEFORE UPDATE ON public.listings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'phone')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.increment_listing_views(_listing_id uuid) RETURNS void
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.listings SET views_count = views_count + 1 WHERE id = _listing_id;
$$;
GRANT EXECUTE ON FUNCTION public.increment_listing_views(uuid) TO anon, authenticated;

INSERT INTO public.listings (seller_name, title, description, category, listing_kind, price, currency, images, location, contact_phone, views_count) VALUES
('Aziz Karimov','3 xonali kvartira, Chilonzor','Yangi ta''mirlangan, 78 m², 5/9-qavat. Metro yaqinida, hovli obod.','real_estate','sale',850000000,'UZS','{"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200"}','Toshkent, Chilonzor','+998 90 123 45 67',412),
('Dilnoza Rahimova','Chevrolet Malibu 2021','Probeg 42 000 km, to''liq komplektatsiya, avariyasiz.','vehicles','sale',285000000,'UZS','{"https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200"}','Samarqand','+998 91 222 33 44',287),
('Jasur Umarov','Ofis ijaraga, Yunusobod','120 m² ochiq ofis maydoni, parkovka va qo''riqlash bilan. Oylik to''lov.','real_estate','rent',12000000,'UZS','{"https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200"}','Toshkent, Yunusobod','+998 93 555 66 77',96),
('Kamola Yusupova','MacBook Pro 14" M3','Kafolat amal qiladi, quti va hujjatlari bilan. Ideal holatda.','electronics','sale',21500000,'UZS','{"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200"}','Toshkent','+998 94 777 88 99',153),
('Bekzod Sobirov','Yumshoq mebel to''plami','Divan va ikkita kreslo, tabiiy teri. Bir yil ishlatilgan.','furniture','sale',9800000,'UZS','{"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200"}','Buxoro','+998 97 101 20 30',64),
('Nodira Tosheva','Hovli uy ijaraga, Zomin','Tabiat qo''ynida, 6 kishilik, sauna va mangal maydonchasi bilan. Kunlik.','real_estate','rent',1500000,'UZS','{"https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200"}','Jizzax, Zomin','+998 98 404 50 60',221);
