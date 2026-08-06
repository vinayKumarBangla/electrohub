-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

DROP EXTENSION pg_net;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT DELETE, INSERT, SELECT, UPDATE ON TABLES TO anon;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT, USAGE ON SEQUENCES TO anon;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON ROUTINES TO anon;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT DELETE, INSERT, SELECT, UPDATE ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT, USAGE ON SEQUENCES TO authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON ROUTINES TO authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT DELETE, INSERT, SELECT, UPDATE ON TABLES TO service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT, USAGE ON SEQUENCES TO service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON ROUTINES TO service_role;

CREATE TABLE public.addresses (
  id             uuid                        DEFAULT gen_random_uuid() NOT NULL,
  profile_id     uuid                        NOT NULL,
  address_line_1 text                        NOT NULL,
  address_line_2 text,
  city           character varying(100)      NOT NULL,
  state          character varying(100)      NOT NULL,
  postal_code    character varying(20)       NOT NULL,
  country        character varying(100)      NOT NULL,
  landmark       character varying(255),
  is_default     boolean                     DEFAULT false,
  created_at     timestamp without time zone DEFAULT now()
);

ALTER TABLE public.addresses
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.addresses
  ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);

GRANT ALL ON public.addresses TO anon;

GRANT ALL ON public.addresses TO authenticated;

GRANT ALL ON public.addresses TO service_role;

CREATE TABLE public.brands (
  id          uuid                        DEFAULT gen_random_uuid() NOT NULL,
  name        character varying(100)      NOT NULL,
  logo_url    text,
  description text,
  is_active   boolean                     DEFAULT true,
  created_at  timestamp without time zone DEFAULT now()
);

ALTER TABLE public.brands
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.brands
  ADD CONSTRAINT brands_name_key UNIQUE (name);

ALTER TABLE public.brands
  ADD CONSTRAINT brands_pkey PRIMARY KEY (id);

GRANT ALL ON public.brands TO anon;

GRANT ALL ON public.brands TO authenticated;

GRANT ALL ON public.brands TO service_role;

CREATE TABLE public.cart (
  id         uuid                        DEFAULT gen_random_uuid() NOT NULL,
  profile_id uuid                        NOT NULL,
  product_id uuid                        NOT NULL,
  quantity   integer                     DEFAULT 1 NOT NULL,
  created_at timestamp without time zone DEFAULT now()
);

ALTER TABLE public.cart
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.cart
  ADD CONSTRAINT cart_pkey PRIMARY KEY (id);

ALTER TABLE public.cart
  ADD CONSTRAINT unique_cart_item UNIQUE (profile_id, product_id);

GRANT ALL ON public.cart TO anon;

GRANT ALL ON public.cart TO authenticated;

GRANT ALL ON public.cart TO service_role;

CREATE TABLE public.categories (
  id          uuid                        DEFAULT gen_random_uuid() NOT NULL,
  name        character varying(100)      NOT NULL,
  description text,
  image_url   text,
  is_active   boolean                     DEFAULT true,
  created_at  timestamp without time zone DEFAULT now()
);

ALTER TABLE public.categories
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.categories
  ADD CONSTRAINT categories_name_key UNIQUE (name);

ALTER TABLE public.categories
  ADD CONSTRAINT categories_pkey PRIMARY KEY (id);

GRANT ALL ON public.categories TO anon;

GRANT ALL ON public.categories TO authenticated;

GRANT ALL ON public.categories TO service_role;

CREATE TABLE public.coupons (
  id                   uuid                        DEFAULT gen_random_uuid() NOT NULL,
  code                 character varying(50)       NOT NULL,
  description          text,
  discount_type        character varying(20)       NOT NULL,
  discount_value       numeric(10,2)               NOT NULL,
  minimum_order_amount numeric(10,2),
  start_date           timestamp without time zone,
  end_date             timestamp without time zone,
  is_active            boolean                     DEFAULT true
);

ALTER TABLE public.coupons
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.coupons
  ADD CONSTRAINT coupons_code_key UNIQUE (code);

ALTER TABLE public.coupons
  ADD CONSTRAINT coupons_pkey PRIMARY KEY (id);

GRANT ALL ON public.coupons TO anon;

GRANT ALL ON public.coupons TO authenticated;

GRANT ALL ON public.coupons TO service_role;

CREATE TABLE public.delivery_tasks (
  id                  uuid                        DEFAULT gen_random_uuid() NOT NULL,
  order_id            uuid                        NOT NULL,
  delivery_partner_id uuid                        NOT NULL,
  task_type           character varying(50)       NOT NULL,
  task_status         character varying(50)       DEFAULT 'Assigned'::character varying,
  assigned_at         timestamp without time zone DEFAULT now(),
  completed_at        timestamp without time zone
);

ALTER TABLE public.delivery_tasks
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.delivery_tasks
  ADD CONSTRAINT delivery_tasks_pkey PRIMARY KEY (id);

GRANT ALL ON public.delivery_tasks TO anon;

GRANT ALL ON public.delivery_tasks TO authenticated;

GRANT ALL ON public.delivery_tasks TO service_role;

CREATE TABLE public.inventory (
  id         uuid                        DEFAULT gen_random_uuid() NOT NULL,
  product_id uuid                        NOT NULL,
  quantity   integer                     DEFAULT 0 NOT NULL,
  updated_at timestamp without time zone DEFAULT now()
);

ALTER TABLE public.inventory
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.inventory
  ADD CONSTRAINT inventory_pkey PRIMARY KEY (id);

GRANT ALL ON public.inventory TO anon;

GRANT ALL ON public.inventory TO authenticated;

GRANT ALL ON public.inventory TO service_role;

CREATE TABLE public.notifications (
  id         uuid                        DEFAULT gen_random_uuid() NOT NULL,
  profile_id uuid                        NOT NULL,
  title      character varying(200)      NOT NULL,
  message    text                        NOT NULL,
  is_read    boolean                     DEFAULT false,
  created_at timestamp without time zone DEFAULT now()
);

ALTER TABLE public.notifications
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.notifications
  ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);

GRANT ALL ON public.notifications TO anon;

GRANT ALL ON public.notifications TO authenticated;

GRANT ALL ON public.notifications TO service_role;

CREATE TABLE public.order_items (
  id          uuid          DEFAULT gen_random_uuid() NOT NULL,
  order_id    uuid          NOT NULL,
  product_id  uuid          NOT NULL,
  quantity    integer       NOT NULL,
  unit_price  numeric(10,2) NOT NULL,
  total_price numeric(10,2) NOT NULL
);

ALTER TABLE public.order_items
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.order_items
  ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);

GRANT ALL ON public.order_items TO anon;

GRANT ALL ON public.order_items TO authenticated;

GRANT ALL ON public.order_items TO service_role;

CREATE TABLE public.order_status_history (
  id         uuid                        DEFAULT gen_random_uuid() NOT NULL,
  order_id   uuid                        NOT NULL,
  status     character varying(50)       NOT NULL,
  updated_by uuid                        NOT NULL,
  remarks    text,
  created_at timestamp without time zone DEFAULT now()
);

ALTER TABLE public.order_status_history
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.order_status_history
  ADD CONSTRAINT order_status_history_pkey PRIMARY KEY (id);

GRANT ALL ON public.order_status_history TO anon;

GRANT ALL ON public.order_status_history TO authenticated;

GRANT ALL ON public.order_status_history TO service_role;

CREATE TABLE public.orders (
  id              uuid                        DEFAULT gen_random_uuid() NOT NULL,
  customer_id     uuid                        NOT NULL,
  address_id      uuid                        NOT NULL,
  coupon_id       uuid,
  subtotal        numeric(10,2)               NOT NULL,
  discount        numeric(10,2)               DEFAULT 0,
  delivery_charge numeric(10,2)               DEFAULT 0,
  total_amount    numeric(10,2)               NOT NULL,
  payment_method  character varying(50)       NOT NULL,
  order_status    character varying(50)       DEFAULT 'Pending'::character varying,
  created_at      timestamp without time zone DEFAULT now(),
  updated_at      timestamp without time zone DEFAULT now()
);

ALTER TABLE public.orders
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.orders
  ADD CONSTRAINT orders_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.addresses(id);

ALTER TABLE public.orders
  ADD CONSTRAINT orders_coupon_id_fkey FOREIGN KEY (coupon_id) REFERENCES public.coupons(id);

ALTER TABLE public.orders
  ADD CONSTRAINT orders_pkey PRIMARY KEY (id);

ALTER TABLE public.delivery_tasks
  ADD CONSTRAINT delivery_tasks_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;

ALTER TABLE public.order_items
  ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;

ALTER TABLE public.order_status_history
  ADD CONSTRAINT order_status_history_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;

GRANT ALL ON public.orders TO anon;

GRANT ALL ON public.orders TO authenticated;

GRANT ALL ON public.orders TO service_role;

CREATE TABLE public.payments (
  id              uuid                        DEFAULT gen_random_uuid() NOT NULL,
  order_id        uuid                        NOT NULL,
  transaction_id  character varying(255),
  payment_gateway character varying(50)       NOT NULL,
  payment_status  character varying(30)       DEFAULT 'Pending'::character varying,
  amount          numeric(10,2)               NOT NULL,
  paid_at         timestamp without time zone
);

ALTER TABLE public.payments
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.payments
  ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;

ALTER TABLE public.payments
  ADD CONSTRAINT payments_pkey PRIMARY KEY (id);

ALTER TABLE public.payments
  ADD CONSTRAINT payments_transaction_id_key UNIQUE (transaction_id);

GRANT ALL ON public.payments TO anon;

GRANT ALL ON public.payments TO authenticated;

GRANT ALL ON public.payments TO service_role;

CREATE TABLE public.product_images (
  id            uuid    DEFAULT gen_random_uuid() NOT NULL,
  product_id    uuid    NOT NULL,
  image_url     text    NOT NULL,
  display_order integer DEFAULT 1
);

ALTER TABLE public.product_images
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.product_images
  ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);

GRANT ALL ON public.product_images TO anon;

GRANT ALL ON public.product_images TO authenticated;

GRANT ALL ON public.product_images TO service_role;

CREATE TABLE public.products (
  id              uuid                        DEFAULT gen_random_uuid() NOT NULL,
  seller_id       uuid                        NOT NULL,
  category_id     uuid                        NOT NULL,
  brand_id        uuid                        NOT NULL,
  name            character varying(200)      NOT NULL,
  slug            character varying(220)      NOT NULL,
  description     text,
  price           numeric(10,2)               NOT NULL,
  discount_price  numeric(10,2),
  sku             character varying(100)      NOT NULL,
  warranty_months integer                     DEFAULT 12,
  is_active       boolean                     DEFAULT true,
  created_at      timestamp without time zone DEFAULT now(),
  updated_at      timestamp without time zone DEFAULT now()
);

ALTER TABLE public.products
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.products
  ADD CONSTRAINT products_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id);

ALTER TABLE public.products
  ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);

ALTER TABLE public.products
  ADD CONSTRAINT products_pkey PRIMARY KEY (id);

ALTER TABLE public.cart
  ADD CONSTRAINT cart_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

ALTER TABLE public.inventory
  ADD CONSTRAINT inventory_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

ALTER TABLE public.order_items
  ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);

ALTER TABLE public.product_images
  ADD CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

ALTER TABLE public.products
  ADD CONSTRAINT products_sku_key UNIQUE (sku);

ALTER TABLE public.products
  ADD CONSTRAINT products_slug_key UNIQUE (slug);

GRANT ALL ON public.products TO anon;

GRANT ALL ON public.products TO authenticated;

GRANT ALL ON public.products TO service_role;

CREATE TABLE public.profiles (
  id            uuid                        DEFAULT gen_random_uuid() NOT NULL,
  full_name     character varying(150)      NOT NULL,
  email         character varying(255)      NOT NULL,
  phone         character varying(20),
  role          character varying(30)       NOT NULL,
  profile_image text,
  is_active     boolean                     DEFAULT true,
  created_at    timestamp without time zone DEFAULT now(),
  updated_at    timestamp without time zone DEFAULT now()
);

ALTER TABLE public.profiles
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_email_key UNIQUE (email);

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);

ALTER TABLE public.addresses
  ADD CONSTRAINT addresses_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.cart
  ADD CONSTRAINT cart_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.delivery_tasks
  ADD CONSTRAINT delivery_tasks_delivery_partner_id_fkey FOREIGN KEY (delivery_partner_id) REFERENCES public.profiles(id);

ALTER TABLE public.notifications
  ADD CONSTRAINT notifications_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.order_status_history
  ADD CONSTRAINT order_status_history_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.profiles(id);

ALTER TABLE public.orders
  ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.products
  ADD CONSTRAINT products_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

GRANT ALL ON public.profiles TO anon;

GRANT ALL ON public.profiles TO authenticated;

GRANT ALL ON public.profiles TO service_role;

CREATE TABLE public.reviews (
  id         uuid                        DEFAULT gen_random_uuid() NOT NULL,
  product_id uuid                        NOT NULL,
  profile_id uuid                        NOT NULL,
  order_id   uuid                        NOT NULL,
  rating     integer                     NOT NULL,
  review     text,
  created_at timestamp without time zone DEFAULT now()
);

ALTER TABLE public.reviews
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.reviews
  ADD CONSTRAINT reviews_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;

ALTER TABLE public.reviews
  ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);

ALTER TABLE public.reviews
  ADD CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

ALTER TABLE public.reviews
  ADD CONSTRAINT reviews_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.reviews
  ADD CONSTRAINT reviews_rating_check CHECK (rating >= 1 AND rating <= 5);

GRANT ALL ON public.reviews TO anon;

GRANT ALL ON public.reviews TO authenticated;

GRANT ALL ON public.reviews TO service_role;

CREATE TABLE public.wishlist (
  id         uuid                        DEFAULT gen_random_uuid() NOT NULL,
  profile_id uuid                        NOT NULL,
  product_id uuid                        NOT NULL,
  created_at timestamp without time zone DEFAULT now()
);

ALTER TABLE public.wishlist
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.wishlist
  ADD CONSTRAINT unique_wishlist_item UNIQUE (profile_id, product_id);

ALTER TABLE public.wishlist
  ADD CONSTRAINT wishlist_pkey PRIMARY KEY (id);

ALTER TABLE public.wishlist
  ADD CONSTRAINT wishlist_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

ALTER TABLE public.wishlist
  ADD CONSTRAINT wishlist_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

GRANT ALL ON public.wishlist TO anon;

GRANT ALL ON public.wishlist TO authenticated;

GRANT ALL ON public.wishlist TO service_role;
