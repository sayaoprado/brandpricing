-- Execute este código no SQL Editor do seu projeto Supabase para suportar os novos dados da proposta

ALTER TABLE public.configs 
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS website text,
ADD COLUMN IF NOT EXISTS cnpj text,
ADD COLUMN IF NOT EXISTS bank_details text;
