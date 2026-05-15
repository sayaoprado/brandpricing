import { useState } from 'react';
import type { Quote, ProjectType, ScopeItem, Complexity, Deadline, PaymentMethod, Config } from '../types';
import { DEFAULT_SCOPE_ITEMS } from '../hooks/usePricing';
import { PDFDownloadLink } from '@react-pdf/renderer';
import QuotePDF from './QuotePDF';

interface Props {
  config: Config;
  calculatePrice: (baseAmount: number, pricingMode: 'hours' | 'fixed', complexity: Complexity, deadline: Deadline, bvPercentage: number) => any;
  saveQuote: (quote: Quote) => void;
  updateQuote?: (quote: Quote) => void;
  initialQuote?: Quote | null;
  onSaveSuccess?: () => void;
}

const QuoteBuilder: React.FC<Props> = ({ config, calculatePrice, saveQuote, updateQuote, initialQuote, onSaveSuccess }) => {
  const [clientName, setClientName] = useState(initialQuote?.clientName || '');
  const [projectType, setProjectType] = useState<ProjectType>(initialQuote?.projectType || 'Identidade Visual Essencial');
  const [scope, setScope] = useState<ScopeItem[]>(initialQuote?.scope || config.customScope || DEFAULT_SCOPE_ITEMS);
  const [complexity, setComplexity] = useState<Complexity>(initialQuote?.complexity || 'Média');
  const [deadline, setDeadline] = useState<Deadline>(initialQuote?.deadline || 'Normal');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initialQuote?.paymentMethod || 'À vista');
  const [bvPercentage, setBvPercentage] = useState<number>(initialQuote?.bvPercentage || 0);
  const [pricingMode, setPricingMode] = useState<'hours' | 'fixed'>(initialQuote?.pricingMode || 'hours');
  
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedItems = scope.filter(item => item.selected);
  const totalHours = selectedItems.reduce((acc, item) => acc + item.estimatedHours, 0);
  const totalFixedPrice = selectedItems.reduce((acc, item) => acc + (item.fixedPrice || 0), 0);
  
  const baseAmount = pricingMode === 'hours' ? totalHours : totalFixedPrice;
  const calculation = calculatePrice(baseAmount, pricingMode, complexity, deadline, bvPercentage);

  const estimatedDays = Math.max(7, Math.ceil(totalHours / 6) + 3); 
  const finalDays = deadline === 'Urgente' ? Math.ceil(estimatedDays * 0.7) : estimatedDays;

  const handleToggleScope = (id: string) => {
    setScope(prev => prev.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const handleSave = () => {
    if (!clientName.trim()) {
      alert("Por favor, preencha o nome do cliente antes de salvar.");
      return;
    }
    const quoteData: Quote = {
      id: initialQuote ? initialQuote.id : crypto.randomUUID(),
      clientName,
      projectType,
      date: initialQuote ? initialQuote.date : new Date().toISOString(),
      totalPrice: calculation.roundedFinal,
      status: initialQuote ? initialQuote.status : 'Pendente',
      scope,
      complexity,
      deadline,
      paymentMethod,
      bvPercentage,
      pricingMode
    };

    if (initialQuote && updateQuote) {
      updateQuote(quoteData);
    } else {
      saveQuote(quoteData);
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      if (onSaveSuccess) onSaveSuccess();
    }, 2000);
  };

  const messageText = `Olá, ${clientName || '[Nome do Cliente]'}! Preparei o orçamento para o projeto de ${projectType}. O investimento é de R$ ${calculation.roundedFinal.toLocaleString('pt-BR')}, com entrada de R$ ${(calculation.roundedFinal / 2).toLocaleString('pt-BR')} para iniciarmos.\n\nO prazo estimado de entrega é de ${finalDays} dias úteis.\n\nFico à disposição para conversarmos!\n— ${config.brandName || 'BrandPricing'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setClientName('');
    setProjectType('Identidade Visual Essencial');
    setScope(config.customScope || DEFAULT_SCOPE_ITEMS);
    setComplexity('Média');
    setDeadline('Normal');
    setPaymentMethod('À vista');
    setBvPercentage(0);
    setPricingMode('hours');
    setSaved(false);
  };

  return (
    <div className="split-layout">
      {/* Left Column: Form */}
      <div className="card">
        <h2 className="mb-8">{initialQuote ? 'Editar Orçamento' : 'Montar Orçamento'}</h2>
        
        <div className="form-row">
          <div className="form-group">
            <label>Cliente (Nome)</label>
            <input 
              type="text" 
              value={clientName} 
              onChange={(e) => setClientName(e.target.value)} 
              placeholder="Ex: Acme Corp"
            />
          </div>
          <div className="form-group">
            <label>Tipo de Projeto</label>
            <select 
              value={projectType} 
              onChange={(e) => setProjectType(e.target.value as ProjectType)}
            >
              <option value="Identidade Visual Essencial">Identidade Visual Essencial</option>
              <option value="Identidade Visual Completa">Identidade Visual Completa</option>
              <option value="Rebranding">Rebranding</option>
              <option value="Naming + Identidade">Naming + Identidade</option>
              <option value="Pacote Personalizado">Pacote Personalizado</option>
            </select>
          </div>
        </div>

        <div className="form-group mt-8 mb-4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <label style={{ margin: 0 }}>Escopo do Projeto</label>
            <div className="segmented-control" style={{ margin: 0, fontSize: '0.8rem' }}>
              <input type="radio" id="mode-hours" name="pricingMode" value="hours" checked={pricingMode === 'hours'} onChange={() => setPricingMode('hours')} />
              <label htmlFor="mode-hours" style={{ padding: '4px 12px' }}>Por Horas</label>
              
              <input type="radio" id="mode-fixed" name="pricingMode" value="fixed" checked={pricingMode === 'fixed'} onChange={() => setPricingMode('fixed')} />
              <label htmlFor="mode-fixed" style={{ padding: '4px 12px' }}>Por Valor Fixo</label>
            </div>
          </div>
          <div className="checkbox-list">
            {scope.map(item => (
              <label key={item.id} className={`checkbox-label ${item.selected ? 'selected' : ''}`}>
                <input 
                  type="checkbox" 
                  checked={item.selected} 
                  onChange={() => handleToggleScope(item.id)} 
                />
                <div className="checkbox-content">
                  <span className="checkbox-title">{item.label}</span>
                  <span className="checkbox-desc">
                    {pricingMode === 'hours' 
                      ? `${item.estimatedHours} horas estimadas` 
                      : `R$ ${(item.fixedPrice || 0).toLocaleString('pt-BR')} valor fixo`}
                  </span>
                </div>
                <div className="checkbox-indicator"></div>
              </label>
            ))}
          </div>
        </div>

        <div className="form-row mt-8">
          <div className="form-group">
            <label>{pricingMode === 'hours' ? 'Estimativa de Horas' : 'Soma dos Valores (R$)'}</label>
            <input 
              type="text" 
              value={pricingMode === 'hours' ? totalHours : `R$ ${totalFixedPrice.toLocaleString('pt-BR')}`} 
              readOnly 
              style={{ background: 'var(--color-bg)', cursor: 'not-allowed', color: 'var(--color-text-muted)' }}
            />
          </div>
          <div className="form-group">
            <label>Complexidade do Projeto</label>
            <div className="segmented-control">
              <input type="radio" id="comp-simples" name="complexity" value="Simples" checked={complexity === 'Simples'} onChange={() => setComplexity('Simples')} />
              <label htmlFor="comp-simples">Simples</label>
              
              <input type="radio" id="comp-media" name="complexity" value="Média" checked={complexity === 'Média'} onChange={() => setComplexity('Média')} />
              <label htmlFor="comp-media">Média</label>
              
              <input type="radio" id="comp-alta" name="complexity" value="Alta" checked={complexity === 'Alta'} onChange={() => setComplexity('Alta')} />
              <label htmlFor="comp-alta">Alta</label>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Prazo de Entrega</label>
            <div className="segmented-control">
              <input type="radio" id="prazo-normal" name="deadline" value="Normal" checked={deadline === 'Normal'} onChange={() => setDeadline('Normal')} />
              <label htmlFor="prazo-normal">Normal</label>
              
              <input type="radio" id="prazo-urgente" name="deadline" value="Urgente" checked={deadline === 'Urgente'} onChange={() => setDeadline('Urgente')} />
              <label htmlFor="prazo-urgente">Urgente (+30%)</label>
            </div>
          </div>
          <div className="form-group">
            <label>Forma de Pagamento</label>
            <select 
              value={paymentMethod} 
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            >
              <option value="À vista">À vista</option>
              <option value="2x">2x (Sinal + Entrega)</option>
              <option value="3x">3x</option>
            </select>
          </div>
          <div className="form-group">
            <label>BV / Indicação (%)</label>
            <input 
              type="number" 
              value={bvPercentage} 
              onChange={(e) => setBvPercentage(Number(e.target.value) || 0)} 
              min="0"
              max="100"
              placeholder="Ex: 10"
            />
          </div>
        </div>

      </div>

      {/* Right Column: Result Panel */}
      <div className="sticky-panel">
        <div className="card card-tight">
          <h3 className="mb-4">Resumo da Proposta</h3>
          
          <div className="result-box">
            <div style={{ color: 'var(--color-text-muted)', marginBottom: '8px', fontSize: '0.875rem' }}>Valor Sugerido</div>
            <div className="result-price">
              R$ {calculation.roundedFinal.toLocaleString('pt-BR')}
            </div>
            <div style={{ color: 'var(--color-accent)', fontWeight: 500 }}>
              Sinal de R$ {(calculation.roundedFinal / 2).toLocaleString('pt-BR')} (50%)
            </div>

            <div className="result-breakdown">
              <div className="breakdown-row">
                <span>{pricingMode === 'hours' ? 'Custo Base (Horas/Overhead):' : 'Soma Base (Itens Fixo):'}</span>
                <span>R$ {calculation.base.toFixed(2)}</span>
              </div>
              <div className="breakdown-row">
                <span>Custo com Complexidade:</span>
                <span>R$ {calculation.withComplexity.toFixed(2)}</span>
              </div>
              {deadline === 'Urgente' && (
                <div className="breakdown-row">
                  <span>Adicional de Urgência:</span>
                  <span>R$ {(calculation.withDeadline - calculation.withComplexity).toFixed(2)}</span>
                </div>
              )}
              {bvPercentage > 0 && (
                <div className="breakdown-row" style={{ color: 'var(--color-accent)' }}>
                  <span>BV ({bvPercentage}%):</span>
                  <span>R$ {(calculation.withBV - calculation.withMargin).toFixed(2)}</span>
                </div>
              )}
              <div className="breakdown-row total">
                <span>Valor Final Calculado:</span>
                <span>R$ {calculation.final.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <h4 className="mt-6 mb-2">Mensagem (Pronta para envio)</h4>
          <div className="message-box">
            {messageText}
          </div>

          <div className="grid-2 mt-6">
            <PDFDownloadLink
              document={
                <QuotePDF
                  clientName={clientName}
                  projectType={projectType}
                  scope={scope}
                  deadline={deadline}
                  paymentMethod={paymentMethod}
                  finalDays={finalDays}
                  calculation={calculation}
                  config={config}
                  pricingMode={pricingMode}
                  signatureName={initialQuote?.signatureName}
                  signatureDoc={initialQuote?.signatureDoc}
                  signatureDate={initialQuote?.signatureDate}
                  signatureIp={initialQuote?.signatureIp}
                />
              }
              fileName={`Orcamento_${clientName ? clientName.replace(/\s+/g, '_') : 'Cliente'}.pdf`}
              className="btn btn-primary"
              style={{ textDecoration: 'none', display: 'flex' }}
            >
              {({ loading }) => loading ? 'Gerando PDF...' : 'Baixar PDF'}
            </PDFDownloadLink>
            
            <button onClick={handleCopy} className="btn btn-secondary">
              {copied ? 'Copiado!' : 'Copiar Mensagem'}
            </button>
            
            <button onClick={handleSave} className={`btn ${saved ? 'btn-secondary' : 'btn-accent'}`} disabled={saved}>
              {saved ? 'Salvo!' : (initialQuote ? 'Atualizar Orçamento' : 'Salvar Orçamento')}
            </button>
            
            <button onClick={handleReset} className="btn btn-secondary">
              Limpar Tudo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteBuilder;
