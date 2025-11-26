   -- Supprimer la table existante si elle existe
   drop table if exists public."Activity";
   drop table if exists public."User";
   
   -- Recréer les tables
   create extension if not exists "pgcrypto";
   
   create table if not exists public."User" (
     id uuid primary key default gen_random_uuid(),
     name text not null,
     email text not null unique,
     passwordHash text,
     age integer,
     weightKg double precision,
     heightCm double precision,
     healthGoal text,
     activityLevel text,
     "createdAt" timestamptz not null default now(),
     "updatedAt" timestamptz not null default now()
   );
   
   create table if not exists public."Activity" (
     id uuid primary key default gen_random_uuid(),
     title text not null,
     durationMinutes integer not null,
     tags text[] not null default '{}',
     "completedAt" timestamptz,
     calories double precision,
     intensity text,
     "userId" uuid not null references public."User"(id) on delete cascade,
     "createdAt" timestamptz not null default now()
   );
   
   create index if not exists "Activity_userId_idx" on public."Activity" ("userId");
   
   create or replace function public.set_updated_at()
   returns trigger as $$
   begin
     new."updatedAt" = now();
     return new;
   end;
   $$ language plpgsql;
   
   create trigger set_user_updated_at
     before update on public."User"
     for each row
     execute procedure public.set_updated_at();