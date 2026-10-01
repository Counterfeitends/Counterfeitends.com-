begin;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  price text not null,
  image text not null,
  stripe_link text not null,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
grant select on public.products to anon, authenticated;

create policy "Products are viewable by everyone"
  on public.products
  for select
  to anon, authenticated
  using (true);

insert into public.products (slug, name, price, image, stripe_link, created_at)
values
  (
    'flair-liner-jacket',
    'Flair Liner Jacket',
    '$800',
    '/products/jadenimage2.jpg',
    'https://buy.stripe.com/dRm8wP2RMbha3EHdvzaAw01',
    now() - interval '1 second'
  ),
  (
    'waffle-knit-ruffle-top',
    'Waffle Knit Ruffle Top',
    '$87',
    '/products/IMG_1189.jpeg',
    'https://buy.stripe.com/6oU5kDake3OI3EH3UZaAw03',
    now()
  )
on conflict (slug) do nothing;

commit;