-- Execute este código no SQL Editor do seu projeto Supabase para ligar a segurança!

-- 1. Adicionar coluna user_id às tabelas existentes
ALTER TABLE public.configs ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- 2. Habilitar RLS (Row Level Security)
ALTER TABLE public.configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- 3. Criar políticas de segurança para Configs (apenas dono vê/edita)
CREATE POLICY "Dono pode ver config" ON public.configs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Dono pode inserir config" ON public.configs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Dono pode atualizar config" ON public.configs FOR UPDATE USING (auth.uid() = user_id);

-- 4. Criar políticas de segurança para Quotes (apenas dono vê/edita)
CREATE POLICY "Dono pode ver orcamentos" ON public.quotes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Dono pode inserir orcamentos" ON public.quotes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Dono pode atualizar orcamentos" ON public.quotes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Dono pode deletar orcamentos" ON public.quotes FOR DELETE USING (auth.uid() = user_id);

-- Nota: Os registros criados anteriormente ficarão invisíveis por não terem user_id. 
-- A partir do primeiro login, suas configurações e novos orçamentos ficarão privados para sua conta.
