-- Execute este código no SQL Editor do seu projeto Supabase

-- Adicionar a coluna que vai guardar a sua lista de serviços personalizada (Escopo Dinâmico)
ALTER TABLE public.configs 
ADD COLUMN IF NOT EXISTS custom_scope jsonb;
