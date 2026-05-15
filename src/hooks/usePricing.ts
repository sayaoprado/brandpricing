import { useState, useEffect } from 'react';
import type { Config, Quote, ProjectType, ScopeItem, Complexity, Deadline, QuoteStatus, PaymentMethod } from '../types';
import { supabase } from '../lib/supabase';

export const DEFAULT_SCOPE_ITEMS: ScopeItem[] = [
  { id: 'research', label: 'Pesquisa e imersão', estimatedHours: 4, fixedPrice: 600, selected: true },
  { id: 'naming', label: 'Naming', estimatedHours: 8, fixedPrice: 1200, selected: false },
  { id: 'concept', label: 'Conceito criativo', estimatedHours: 6, fixedPrice: 900, selected: true },
  { id: 'logo', label: 'Logotipo + variações', estimatedHours: 8, fixedPrice: 1200, selected: true },
  { id: 'palette', label: 'Paleta de cores', estimatedHours: 2, fixedPrice: 300, selected: true },
  { id: 'typography', label: 'Tipografia', estimatedHours: 2, fixedPrice: 300, selected: true },
  { id: 'stationery', label: 'Papelaria (cartão, envelope, etc)', estimatedHours: 4, fixedPrice: 600, selected: false },
  { id: 'manual_basic', label: 'Manual de identidade (Básico)', estimatedHours: 4, fixedPrice: 600, selected: true },
  { id: 'manual_full', label: 'Manual de identidade (Completo)', estimatedHours: 8, fixedPrice: 1200, selected: false },
  { id: 'social', label: 'Templates para redes sociais', estimatedHours: 4, fixedPrice: 600, selected: false },
  { id: 'presentation', label: 'Apresentação do projeto', estimatedHours: 3, fixedPrice: 450, selected: true },
  { id: 'revisions', label: 'Revisões adicionais', estimatedHours: 2, fixedPrice: 300, selected: false },
];

export function usePricing(userId?: string) {
  const [config, setConfig] = useState<Config | null>(null);
  const [configId, setConfigId] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    async function loadData() {
      setIsLoading(true);
      try {
        // Fetch config
        const { data: configData, error: configError } = await supabase
          .from('configs')
          .select('*')
          .eq('user_id', userId)
          .limit(1)
          .single();
        
        if (configError && configError.code !== 'PGRST116') {
          console.error('Error fetching config:', configError);
        }

        if (configData) {
          setConfig({
            hourlyRate: configData.hourly_rate,
            monthlyOverhead: configData.monthly_overhead,
            projectsPerMonth: configData.projects_per_month,
            profitMargin: configData.profit_margin,
            taxes: configData.taxes,
            brandName: configData.brand_name || 'BrandPricing',
            accentColor: configData.accent_color || '#d97706',
            pdfFooterText: configData.pdf_footer_text || 'contato@brandpricing.com',
            logoUrl: configData.logo_url || undefined,
            phone: configData.phone || undefined,
            website: configData.website || undefined,
            cnpj: configData.cnpj || undefined,
            bankDetails: configData.bank_details || undefined,
            customScope: configData.custom_scope || undefined,
          });
          setConfigId(configData.id);
        }

        // Fetch quotes
        const { data: quotesData, error: quotesError } = await supabase
          .from('quotes')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        if (quotesError) {
          console.error('Error fetching quotes:', quotesError);
        }

        if (quotesData) {
          setQuotes(quotesData.map(q => {
            let notes = q.notes || '';
            let pricingMode: 'hours' | 'fixed' = 'hours';
            if (notes.startsWith('[FIXED]\n')) {
              pricingMode = 'fixed';
              notes = notes.replace('[FIXED]\n', '');
            }
            return {
              id: q.id,
              clientName: q.client_name,
              projectType: q.project_type as ProjectType,
              date: q.created_at,
              totalPrice: q.total_price,
              status: q.status || 'Pendente',
              notes: notes,
              pricingMode: pricingMode,
              scope: q.scope,
              complexity: q.complexity as Complexity,
              deadline: q.deadline as Deadline,
              paymentMethod: q.payment_method as PaymentMethod,
              bvPercentage: q.bv_percentage || 0,
              signatureName: q.signature_name,
              signatureDoc: q.signature_doc,
              signatureDate: q.signature_date,
              signatureIp: q.signature_ip
            };
          }) || []);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    // Attach fetchQuotes to window temporarily if needed for external calls or just loadData
    loadData();
  }, [userId]);
  const saveConfig = async (newConfig: Config) => {
    if (!userId) return;
    setConfig(newConfig); // optimistic update
    
    if (configId) {
      await supabase
        .from('configs')
        .update({
          hourly_rate: newConfig.hourlyRate,
          monthly_overhead: newConfig.monthlyOverhead,
          projects_per_month: newConfig.projectsPerMonth,
          profit_margin: newConfig.profitMargin,
          taxes: newConfig.taxes,
          brand_name: newConfig.brandName,
          accent_color: newConfig.accentColor,
          pdf_footer_text: newConfig.pdfFooterText,
          logo_url: newConfig.logoUrl,
          phone: newConfig.phone,
          website: newConfig.website,
          cnpj: newConfig.cnpj,
          bank_details: newConfig.bankDetails,
          custom_scope: newConfig.customScope,
          updated_at: new Date().toISOString()
        })
        .eq('id', configId);
    } else {
      const { data } = await supabase
        .from('configs')
        .insert({
          user_id: userId,
          hourly_rate: newConfig.hourlyRate,
          monthly_overhead: newConfig.monthlyOverhead,
          projects_per_month: newConfig.projectsPerMonth,
          profit_margin: newConfig.profitMargin,
          taxes: newConfig.taxes,
          brand_name: newConfig.brandName,
          accent_color: newConfig.accentColor,
          pdf_footer_text: newConfig.pdfFooterText,
          logo_url: newConfig.logoUrl,
          phone: newConfig.phone,
          website: newConfig.website,
          cnpj: newConfig.cnpj,
          bank_details: newConfig.bankDetails,
          custom_scope: newConfig.customScope,
        })
        .select()
        .single();
      
      if (data) setConfigId(data.id);
    }
  };

  const saveQuote = async (quote: Quote) => {
    if (!userId) return;
    setQuotes((prev) => [quote, ...prev]); // optimistic update
    
    await supabase
      .from('quotes')
      .insert({
        id: quote.id,
        user_id: userId,
        client_name: quote.clientName,
        project_type: quote.projectType,
        total_price: quote.totalPrice,
        status: quote.status,
        notes: quote.pricingMode === 'fixed' ? `[FIXED]\n${quote.notes || ''}` : (quote.notes || ''),
        scope: quote.scope,
        complexity: quote.complexity,
        deadline: quote.deadline,
        payment_method: quote.paymentMethod,
        bv_percentage: quote.bvPercentage || 0
      });
  };

  const deleteQuote = async (id: string) => {
    if (!userId) return;
    setQuotes((prev) => prev.filter(q => q.id !== id)); // optimistic update
    
    await supabase
      .from('quotes')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
  };

  const updateQuoteStatus = async (id: string, status: QuoteStatus) => {
    if (!userId) return;
    setQuotes((prev) => prev.map(q => q.id === id ? { ...q, status } : q));
    await supabase.from('quotes').update({ status }).eq('id', id).eq('user_id', userId);
  };

  const updateQuote = async (updated: Quote) => {
    if (!userId) return;
    setQuotes((prev) => prev.map(q => q.id === updated.id ? updated : q));
    await supabase
      .from('quotes')
      .update({
        client_name: updated.clientName,
        project_type: updated.projectType,
        total_price: updated.totalPrice,
        status: updated.status,
        notes: updated.pricingMode === 'fixed' ? `[FIXED]\n${updated.notes || ''}` : (updated.notes || ''),
        scope: updated.scope,
        complexity: updated.complexity,
        deadline: updated.deadline,
        payment_method: updated.paymentMethod,
        bv_percentage: updated.bvPercentage || 0
      })
      .eq('id', updated.id)
      .eq('user_id', userId);
  };

  const signQuote = async (quoteId: string, name: string, doc: string) => {
    try {
      const signatureDate = new Date().toISOString();
      const { error } = await supabase
        .from('quotes')
        .update({
          signature_name: name,
          signature_doc: doc,
          signature_date: signatureDate,
          status: 'Aprovado'
        })
        .eq('id', quoteId);

      if (error) throw error;
      setQuotes((prev) => prev.map(q => q.id === quoteId ? {
        ...q,
        signatureName: name,
        signatureDoc: doc,
        signatureDate: signatureDate,
        status: 'Aprovado'
      } : q));
      return true;
    } catch (err) {
      console.error('Error signing quote:', err);
      return false;
    }
  };

  const calculatePrice = (
    baseAmount: number,
    pricingMode: 'hours' | 'fixed',
    complexity: Complexity,
    deadline: Deadline,
    bvPercentage: number = 0
  ) => {
    if (!config) return null;

    let baseCost = 0;
    if (pricingMode === 'hours') {
      const overheadPerProject = config.monthlyOverhead / Math.max(1, config.projectsPerMonth);
      baseCost = (baseAmount * config.hourlyRate) + overheadPerProject;
    } else {
      baseCost = baseAmount;
    }

    let complexityMultiplier = 1;
    if (complexity === 'Média') complexityMultiplier = 1.2;
    if (complexity === 'Alta') complexityMultiplier = 1.5;
    
    let costWithComplexity = baseCost * complexityMultiplier;
    let urgencyMultiplier = deadline === 'Urgente' ? 1.3 : 1.0;
    let costWithDeadline = costWithComplexity * urgencyMultiplier;
    let priceWithMargin = costWithDeadline * (1 + (config.profitMargin / 100));
    let priceWithBV = priceWithMargin / (1 - (bvPercentage / 100));
    let finalPrice = priceWithBV / (1 - (config.taxes / 100));
    const roundedPrice = Math.ceil(finalPrice / 50) * 50;

    return {
      base: baseCost,
      withComplexity: costWithComplexity,
      withDeadline: costWithDeadline,
      withMargin: priceWithMargin,
      withBV: priceWithBV,
      final: finalPrice,
      roundedFinal: roundedPrice,
      taxesAmount: roundedPrice - priceWithBV
    };
  };

  return {
    config,
    quotes,
    isLoading,
    saveConfig,
    saveQuote,
    deleteQuote,
    updateQuoteStatus,
    updateQuote,
    signQuote,
    calculatePrice
  };
}
