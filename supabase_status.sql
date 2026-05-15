-- Execute este código no SQL Editor do seu projeto Supabase

-- Adicionar a coluna de status aos orçamentos
ALTER TABLE public.quotes 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'Pendente';
