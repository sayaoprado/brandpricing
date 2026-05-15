-- Execute este código no SQL Editor do seu projeto Supabase

-- Adicionar as novas colunas de personalização à tabela configs
ALTER TABLE public.configs 
ADD COLUMN IF NOT EXISTS brand_name text DEFAULT 'BrandPricing',
ADD COLUMN IF NOT EXISTS accent_color text DEFAULT '#d97706',
ADD COLUMN IF NOT EXISTS pdf_footer_text text DEFAULT 'contato@brandpricing.com',
ADD COLUMN IF NOT EXISTS logo_url text;

-- Isso manterá todos os seus dados atuais intactos e apenas adicionará essas novas opções!
