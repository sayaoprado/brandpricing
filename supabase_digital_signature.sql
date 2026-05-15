-- Execute este código no SQL Editor do seu projeto Supabase para habilitar a Assinatura Digital

ALTER TABLE public.quotes 
ADD COLUMN IF NOT EXISTS signature_name text,
ADD COLUMN IF NOT EXISTS signature_doc text,
ADD COLUMN IF NOT EXISTS signature_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS signature_ip text;
