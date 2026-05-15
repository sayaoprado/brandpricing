import React, { useState } from 'react';
import type { Config, ScopeItem } from '../types';
import { DEFAULT_SCOPE_ITEMS } from '../hooks/usePricing';

interface Props {
  config: Config | null;
  saveConfig: (c: Config) => void;
}

const DEFAULT_CONFIG: Config = {
  hourlyRate: 150,
  monthlyOverhead: 1000,
  projectsPerMonth: 4,
  profitMargin: 20,
  taxes: 6,
  brandName: 'BrandPricing',
  accentColor: '#d97706',
  pdfFooterText: 'contato@brandpricing.com',
};

const ConfigurationStage: React.FC<Props> = ({ config, saveConfig }) => {
  const [formData, setFormData] = useState<Config>(config || DEFAULT_CONFIG);
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (parseFloat(value) || 0) : value
    }));
    setSaved(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logoUrl: reader.result as string }));
        setSaved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const currentScope = formData.customScope || DEFAULT_SCOPE_ITEMS;

  const handleScopeChange = (id: string, field: 'label' | 'estimatedHours' | 'fixedPrice', value: string | number) => {
    const newScope = currentScope.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    setFormData(prev => ({ ...prev, customScope: newScope }));
    setSaved(false);
  };

  const handleAddScopeItem = () => {
    const newItem: ScopeItem = {
      id: crypto.randomUUID(),
      label: 'Novo Serviço',
      estimatedHours: 2,
      fixedPrice: 300,
      selected: true
    };
    setFormData(prev => ({ ...prev, customScope: [...currentScope, newItem] }));
    setSaved(false);
  };

  const handleRemoveScopeItem = (id: string) => {
    setFormData(prev => ({ ...prev, customScope: currentScope.filter(item => item.id !== id) }));
    setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveConfig(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="card">
      <h2 className="mb-2">Base Financeira</h2>
      <p>Defina seus custos fixos para calcularmos a precificação perfeita.</p>
      
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="form-row">
          <div className="form-group">
            <label>Valor da hora de trabalho (R$)</label>
            <input 
              type="number" 
              name="hourlyRate" 
              value={formData.hourlyRate} 
              onChange={handleChange} 
              min="0"
              step="1"
            />
          </div>
          <div className="form-group">
            <label>
              Custo Fixo Mensal (Aluguel, internet, etc) 
              <span className="label-hint">R$</span>
            </label>
            <input 
              type="number" 
              name="monthlyOverhead" 
              value={formData.monthlyOverhead} 
              onChange={handleChange} 
              min="0"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              Meta de projetos por mês 
              <span className="label-hint">Para ratear o custo fixo</span>
            </label>
            <input 
              type="number" 
              name="projectsPerMonth" 
              value={formData.projectsPerMonth} 
              onChange={handleChange} 
              min="1"
            />
          </div>
          <div className="form-group">
            <label>Margem de lucro (%)</label>
            <input 
              type="number" 
              name="profitMargin" 
              value={formData.profitMargin} 
              onChange={handleChange} 
              min="0"
              max="100"
            />
          </div>
        </div>

        <div className="form-group mb-6">
          <label>Impostos / Regime tributário (%)</label>
          <input 
            type="number" 
            name="taxes" 
            value={formData.taxes} 
            onChange={handleChange} 
            min="0"
            max="100"
          />
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '32px 0' }} />
        
        <h2 className="mb-2">Serviços e Entregas (Escopo)</h2>
        <p>Defina os serviços padrão, a estimativa de horas e o valor fixo (R$) de cada um.</p>

        <div className="mt-6 mb-6">
          {currentScope.map(item => (
            <div key={item.id} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
              <input 
                type="text" 
                value={item.label}
                onChange={(e) => handleScopeChange(item.id, 'label', e.target.value)}
                style={{ flex: 1 }}
                placeholder="Nome do serviço"
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>h:</span>
                <input 
                  type="number" 
                  value={item.estimatedHours}
                  onChange={(e) => handleScopeChange(item.id, 'estimatedHours', Number(e.target.value))}
                  style={{ width: '70px' }}
                  min="1"
                  title="Horas estimadas"
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>R$:</span>
                <input 
                  type="number" 
                  value={item.fixedPrice || 0}
                  onChange={(e) => handleScopeChange(item.id, 'fixedPrice', Number(e.target.value))}
                  style={{ width: '90px' }}
                  min="0"
                  title="Valor fixo (R$)"
                />
              </div>
              <button 
                type="button" 
                onClick={() => handleRemoveScopeItem(item.id)}
                style={{ background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', width: '48px', height: '48px', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                title="Remover serviço"
              >
                ✕
              </button>
            </div>
          ))}
          <button 
            type="button" 
            onClick={handleAddScopeItem}
            style={{ background: 'none', border: '1px dashed var(--color-border)', color: 'var(--color-text-muted)', width: '100%', padding: '12px', borderRadius: 'var(--radius)', cursor: 'pointer', marginTop: '8px' }}
          >
            + Adicionar Serviço
          </button>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '32px 0' }} />
        
        <h2 className="mb-2">Sua Marca (White-Label)</h2>
        <p>Deixe os orçamentos com a sua cara.</p>

        <div className="form-row mt-6">
          <div className="form-group">
            <label>Nome da Agência / Designer</label>
            <input 
              type="text" 
              name="brandName" 
              value={formData.brandName || ''} 
              onChange={handleChange} 
              placeholder="Ex: Studio Sayão"
            />
          </div>
          <div className="form-group">
            <label>Cor Principal (Destaque)</label>
            <input 
              type="color" 
              name="accentColor" 
              value={formData.accentColor || '#d97706'} 
              onChange={handleChange} 
              style={{ padding: '0 8px', cursor: 'pointer' }}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>CNPJ / CPF</label>
            <input 
              type="text" 
              name="cnpj" 
              value={formData.cnpj || ''} 
              onChange={handleChange} 
              placeholder="00.000.000/0001-00"
            />
          </div>
          <div className="form-group">
            <label>Telefone / WhatsApp</label>
            <input 
              type="text" 
              name="phone" 
              value={formData.phone || ''} 
              onChange={handleChange} 
              placeholder="+55 11 99999-9999"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Site</label>
            <input 
              type="text" 
              name="website" 
              value={formData.website || ''} 
              onChange={handleChange} 
              placeholder="www.seusite.com.br"
            />
          </div>
          <div className="form-group">
            <label>E-mail de Contato (Rodapé)</label>
            <input 
              type="text" 
              name="pdfFooterText" 
              value={formData.pdfFooterText || ''} 
              onChange={handleChange} 
              placeholder="contato@seusite.com.br"
            />
          </div>
        </div>

        <div className="form-group mb-6">
          <label>Dados Bancários para o PDF</label>
          <textarea 
            name="bankDetails" 
            value={formData.bankDetails || ''} 
            onChange={handleChange as unknown as React.ChangeEventHandler<HTMLTextAreaElement>} 
            placeholder="Banco Itaú&#10;Agência: 0001&#10;Conta: 12345-6&#10;PIX: seu@email.com"
            rows={4}
            style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'inherit', resize: 'vertical' }}
          />
        </div>

        <div className="form-group mb-6">
          <label>Logotipo (Recomendado fundo transparente)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--color-surface-hover)', padding: '16px', borderRadius: 'var(--radius)' }}>
            {formData.logoUrl && (
              <img src={formData.logoUrl} alt="Preview" style={{ height: '40px', maxWidth: '200px', objectFit: 'contain', background: '#fff', borderRadius: '4px', padding: '4px' }} />
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              style={{ border: 'none', padding: 0, height: 'auto', background: 'transparent' }}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          {saved ? 'Salvo com sucesso!' : 'Salvar configurações'}
        </button>
      </form>
    </div>
  );
};

export default ConfigurationStage;
