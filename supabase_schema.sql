-- Execute este código no SQL Editor do seu projeto Supabase

-- Tabela de configurações
CREATE TABLE IF NOT EXISTS public.configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hourly_rate numeric NOT NULL DEFAULT 150,
  monthly_overhead numeric NOT NULL DEFAULT 1000,
  projects_per_month integer NOT NULL DEFAULT 4,
  profit_margin numeric NOT NULL DEFAULT 20,
  taxes numeric NOT NULL DEFAULT 6,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Tabela de orçamentos (quotes)
CREATE TABLE IF NOT EXISTS public.quotes (
  id uuid PRIMARY KEY,
  client_name text NOT NULL,
  project_type text NOT NULL,
  total_price numeric NOT NULL,
  date timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  scope jsonb,
  complexity text,
  deadline text,
  payment_method text,
  bv_percentage numeric DEFAULT 0
);

-- Desabilitar RLS (Row Level Security) TEMPORARIAMENTE para facilitar o uso sem login
-- ATENÇÃO: Se for publicar para acesso externo, recomendamos ativar o RLS e configurar políticas!
ALTER TABLE public.configs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes DISABLE ROW LEVEL SECURITY;

-- Inserir uma configuração padrão inicial (apenas se a tabela estiver vazia)
INSERT INTO public.configs (hourly_rate, monthly_overhead, projects_per_month, profit_margin, taxes)
SELECT 150, 1000, 4, 20, 6
WHERE NOT EXISTS (SELECT 1 FROM public.configs);
