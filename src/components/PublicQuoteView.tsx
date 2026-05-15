import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Quote, Config } from '../types';

interface PublicQuoteViewProps {
  quoteId: string;
}

const PublicQuoteView: React.FC<PublicQuoteViewProps> = ({ quoteId }) => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);
  
  const [name, setName] = useState('');
  const [doc, setDoc] = useState('');

  useEffect(() => {
    async function fetchPublicQuote() {
      try {
        const { data: quoteData, error: quoteError } = await supabase
          .from('quotes')
          .select('*')
          .eq('id', quoteId)
          .single();

        if (quoteError) throw quoteError;

        if (quoteData) {
          const loadedQuote: Quote = {
            id: quoteData.id,
            clientName: quoteData.client_name,
            projectType: quoteData.project_type,
            date: quoteData.created_at,
            totalPrice: quoteData.total_price,
            status: quoteData.status,
            notes: quoteData.notes,
            scope: quoteData.scope,
            complexity: quoteData.complexity,
            deadline: quoteData.deadline,
            paymentMethod: quoteData.payment_method,
            bvPercentage: quoteData.bv_percentage || 0,
            pricingMode: quoteData.notes?.startsWith('[FIXED]\n') ? 'fixed' : 'hours',
            signatureName: quoteData.signature_name,
            signatureDoc: quoteData.signature_doc,
            signatureDate: quoteData.signature_date,
            signatureIp: quoteData.signature_ip
          };
          setQuote(loadedQuote);

          if (loadedQuote.signatureDate) {
            setSigned(true);
          }

          // Fetch associated config
          const { data: configData, error: configError } = await supabase
            .from('configs')
            .select('*')
            .eq('user_id', quoteData.user_id)
            .single();

          if (!configError && configData) {
            setConfig({
              hourlyRate: configData.hourly_rate,
              monthlyOverhead: configData.monthly_overhead,
              projectsPerMonth: configData.projects_per_month,
              profitMargin: configData.profit_margin,
              taxes: configData.taxes,
              brandName: configData.brand_name || 'BrandPricing',
              accentColor: configData.accent_color || '#d97706',
              pdfFooterText: configData.pdf_footer_text,
              logoUrl: configData.logo_url,
              phone: configData.phone,
              website: configData.website,
              cnpj: configData.cnpj,
              bankDetails: configData.bank_details,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching public quote:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPublicQuote();
  }, [quoteId]);

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !doc) return;
    setSigning(true);
    
    try {
      const signatureDate = new Date().toISOString();
      // Em um cenário real, você capturaria o IP via edge function. Aqui simulamos ou gravamos metadados do navegador.
      const signatureIp = navigator.userAgent;

      const { error } = await supabase
        .from('quotes')
        .update({
          signature_name: name,
          signature_doc: doc,
          signature_date: signatureDate,
          signature_ip: signatureIp,
          status: 'Aprovado'
        })
        .eq('id', quoteId);

      if (error) throw error;
      setSigned(true);
    } catch (err) {
      console.error(err);
      alert('Erro ao assinar proposta. Tente novamente.');
    } finally {
      setSigning(false);
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#666' }}>Carregando proposta segura...</div>;
  if (!quote) return <div style={{ textAlign: 'center', marginTop: '4rem', color: '#ef4444' }}>Proposta não encontrada ou indisponível.</div>;

  const accentColor = config?.accentColor || '#10b981';

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <div className="card" style={{ marginBottom: '24px', borderTop: `4px solid ${accentColor}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          {config?.logoUrl ? (
            <img src={config.logoUrl} alt="Logo" style={{ height: '40px', objectFit: 'contain' }} />
          ) : (
            <h2>{config?.brandName || 'Proposta Comercial'}</h2>
          )}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.875rem', color: '#666' }}>Proposta para:</div>
            <div style={{ fontWeight: 'bold' }}>{quote.clientName}</div>
          </div>
        </div>

        <h1 style={{ marginBottom: '8px' }}>{quote.projectType}</h1>
        <p style={{ color: '#666', marginBottom: '32px' }}>Abaixo estão os detalhes do escopo, investimento e condições comerciais propostas.</p>

        {/* Escopo */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '16px' }}>Escopo do Projeto</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {quote.scope?.filter(s => s.selected).map((item, idx) => (
              <li key={idx} style={{ padding: '12px 0', borderBottom: '1px solid #f5f5f5', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: accentColor, marginRight: '12px', fontSize: '1.2rem' }}>•</span>
                <span style={{ fontWeight: 500, color: '#333' }}>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Prazos */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '16px' }}>Prazos Estimados</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: '#666' }}>Prazo de Entrega</div>
              <div style={{ fontWeight: 'bold' }}>{quote.deadline}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.875rem', color: '#666' }}>Tempo Estimado</div>
              <div style={{ fontWeight: 'bold' }}>
                {(() => {
                  const selectedItems = quote.scope?.filter(item => item.selected) || [];
                  const totalHours = selectedItems.reduce((acc, item) => acc + item.estimatedHours, 0);
                  const estimatedDays = Math.max(7, Math.ceil(totalHours / 6) + 3); 
                  const finalDays = quote.deadline === 'Urgente' ? Math.ceil(estimatedDays * 0.7) : estimatedDays;
                  return `${finalDays} dias úteis`;
                })()}
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: '#fafafa', padding: '24px', borderRadius: '8px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '1.25rem', color: '#444' }}>Investimento Total</span>
            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: accentColor }}>R$ {quote.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div style={{ marginTop: '16px', fontSize: '0.875rem', color: '#666' }}>
            <strong>Condições:</strong> Pagamento via {quote.paymentMethod}. Validade da proposta: 30 dias.
          </div>
        </div>

        {signed ? (
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', padding: '24px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
            <h3 style={{ color: '#10b981', marginBottom: '8px' }}>Proposta Assinada Digitalmente</h3>
            <p style={{ fontSize: '0.875rem', color: '#444' }}>
              Registrado por <strong>{quote.signatureName || name}</strong> (CNPJ/CPF: {quote.signatureDoc || doc})<br />
              Data: {new Date(quote.signatureDate || new Date()).toLocaleString('pt-BR')}
            </p>
            <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '16px' }}>
              Uma cópia em PDF com a chancela digital está disponível com o prestador de serviço.
            </p>
          </div>
        ) : (
          <div>
            <h3 style={{ marginBottom: '16px' }}>Aprovação e Assinatura Digital</h3>
            <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '24px' }}>
              Ao preencher seus dados e clicar em "Assinar Digitalmente", você concorda com os termos, prazos e escopo do serviço proposto. Esta ação possui validade jurídica de aceite contratual.
            </p>

            <form onSubmit={handleSign}>
              <div className="form-row mb-4">
                <div className="form-group">
                  <label>Nome Completo ou Razão Social</label>
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome ou nome da empresa" 
                  />
                </div>
                <div className="form-group">
                  <label>CNPJ / CPF</label>
                  <input 
                    type="text" 
                    required 
                    value={doc}
                    onChange={(e) => setDoc(e.target.value)}
                    placeholder="000.000.000-00" 
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={signing}
                style={{ 
                  width: '100%', 
                  padding: '16px', 
                  background: accentColor, 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontSize: '1.1rem', 
                  fontWeight: 'bold', 
                  cursor: signing ? 'not-allowed' : 'pointer',
                  opacity: signing ? 0.7 : 1
                }}
              >
                {signing ? 'Registrando assinatura...' : 'Assinar Digitalmente'}
              </button>
            </form>
          </div>
        )}
      </div>
      <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#999' }}>
        Gerado de forma segura via BrandPricing © {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default PublicQuoteView;
