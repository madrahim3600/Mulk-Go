-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'notary', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY user_roles_read_own ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users WHERE email = 'madrahim3600@gmail.com'
ON CONFLICT DO NOTHING;

-- Service prices
CREATE TABLE public.service_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name_uz text NOT NULL,
  name_ru text NOT NULL,
  description_uz text NOT NULL DEFAULT '',
  description_ru text NOT NULL DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'UZS',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.service_prices TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_prices TO authenticated;
GRANT ALL ON public.service_prices TO service_role;
ALTER TABLE public.service_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY service_prices_public_read ON public.service_prices FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY service_prices_admin_write ON public.service_prices FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER service_prices_updated_at BEFORE UPDATE ON public.service_prices
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.service_prices (code, name_uz, name_ru, description_uz, description_ru, price, sort_order) VALUES
  ('realestate_sale', 'Ko''chmas mulk oldi-sotdi shartnomasi', 'Договор купли-продажи недвижимости', 'Uy, kvartira, yer uchastkasi oldi-sotdisini notarial rasmiylashtirish', 'Нотариальное оформление купли-продажи дома, квартиры, участка', 1500000, 1),
  ('realestate_rent', 'Ko''chmas mulk ijara shartnomasi', 'Договор аренды недвижимости', 'Ijara shartnomasini notarial tasdiqlash va ro''yxatga olish', 'Нотариальное удостоверение и регистрация договора аренды', 800000, 2),
  ('vehicle_sale', 'Transport vositasi oldi-sotdisi', 'Купля-продажа транспортного средства', 'Avtomobil va boshqa transport vositalari uchun shartnoma', 'Договор для автомобилей и другого транспорта', 700000, 3),
  ('movable_sale', 'Ko''char mulk shartnomasi', 'Договор на движимое имущество', 'Texnika, mebel va boshqa ko''char mulk uchun shartnoma', 'Договор на технику, мебель и иное движимое имущество', 400000, 4),
  ('power_of_attorney', 'Ishonchnoma rasmiylashtirish', 'Оформление доверенности', 'Mulkni boshqarish yoki sotish uchun ishonchnoma', 'Доверенность на управление или продажу имущества', 300000, 5);

-- Notary requests
CREATE TYPE public.notary_status AS ENUM ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'completed');
CREATE TYPE public.identity_status AS ENUM ('pending', 'verified', 'failed');

CREATE TABLE public.notary_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id uuid REFERENCES public.listings(id) ON DELETE SET NULL,
  service_code text NOT NULL REFERENCES public.service_prices(code),
  price_snapshot numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'UZS',
  property_type text NOT NULL DEFAULT '',
  property_title text NOT NULL DEFAULT '',
  property_address text NOT NULL DEFAULT '',
  property_area numeric,
  cadastre_number text,
  property_value numeric NOT NULL DEFAULT 0,
  seller_full_name text NOT NULL DEFAULT '',
  seller_passport text NOT NULL DEFAULT '',
  seller_pinfl text NOT NULL DEFAULT '',
  seller_phone text NOT NULL DEFAULT '',
  buyer_full_name text NOT NULL DEFAULT '',
  buyer_passport text NOT NULL DEFAULT '',
  buyer_pinfl text NOT NULL DEFAULT '',
  buyer_phone text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  identity_status public.identity_status NOT NULL DEFAULT 'pending',
  identity_method text NOT NULL DEFAULT 'myid',
  identity_verified_at timestamptz,
  identity_payload jsonb,
  status public.notary_status NOT NULL DEFAULT 'draft',
  admin_comment text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.notary_requests TO authenticated;
GRANT ALL ON public.notary_requests TO service_role;
ALTER TABLE public.notary_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY notary_requests_own_read ON public.notary_requests FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'notary'));
CREATE POLICY notary_requests_own_insert ON public.notary_requests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY notary_requests_own_update ON public.notary_requests FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'notary'))
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'notary'));
CREATE POLICY notary_requests_own_delete ON public.notary_requests FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER notary_requests_updated_at BEFORE UPDATE ON public.notary_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX notary_requests_user_idx ON public.notary_requests(user_id, created_at DESC);
CREATE INDEX notary_requests_status_idx ON public.notary_requests(status, created_at DESC);