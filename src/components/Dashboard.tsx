import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import type { Quote, QuoteStatus } from '../types';
import type { View } from '../App';

interface Props {
  quotes: Quote[];
  navigate: (view: View) => void;
  onDeleteQuote: (id: string) => void;
  onUpdateStatus: (id: string, status: QuoteStatus) => void;
  onEditQuote: (quote: Quote) => void;
}

const Dashboard: React.FC<Props> = ({ quotes, navigate, onDeleteQuote, onUpdateStatus, onEditQuote }) => {
  const [statusFilter, setStatusFilter] = useState<'Todos' | QuoteStatus>('Todos');
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthQuotes = quotes.filter(q => {
    const d = new Date(q.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const approvedThisMonth = thisMonthQuotes.filter(q => q.status === 'Aprovado');
  const pendingThisMonth = thisMonthQuotes.filter(q => q.status === 'Pendente');
  
  const approvedTotal = approvedThisMonth.reduce((acc, q) => acc + q.totalPrice, 0);
  const pendingTotal = pendingThisMonth.reduce((acc, q) => acc + q.totalPrice, 0);
  const conversionRate = thisMonthQuotes.length > 0 
    ? (approvedThisMonth.length / thisMonthQuotes.length) * 100 
    : 0;

  // Chart Data Calculations
  const rejectedTotal = quotes.filter(q => q.status === 'Rejeitado').reduce((acc, q) => acc + q.totalPrice, 0);
  const allApprovedTotal = quotes.filter(q => q.status === 'Aprovado').reduce((acc, q) => acc + q.totalPrice, 0);
  const allPendingTotal = quotes.filter(q => q.status === 'Pendente').reduce((acc, q) => acc + q.totalPrice, 0);

  const statusData = [
    { name: 'Aprovado', value: allApprovedTotal, color: '#10b981' },
    { name: 'Pendente', value: allPendingTotal, color: 'var(--color-accent)' },
    { name: 'Rejeitado', value: rejectedTotal, color: '#ef4444' },
  ].filter(d => d.value > 0);

  const activeQuotes = quotes.filter(q => q.status !== 'Rejeitado');
  const revenueByType = activeQuotes.reduce((acc, q) => {
    acc[q.projectType] = (acc[q.projectType] || 0) + q.totalPrice;
    return acc;
  }, {} as Record<string, number>);

  const projectTypeData = Object.entries(revenueByType)
    .map(([name, value]) => ({ 
      name: name.replace('Identidade Visual', 'IDV'), // shorten for display
      value 
    }))
    .sort((a, b) => b.value - a.value);

  const filteredQuotes = quotes.filter(q => statusFilter === 'Todos' || q.status === statusFilter);

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2>Dashboard</h2>
        <button onClick={() => navigate('quote')} className="btn btn-primary" style={{ width: 'auto' }}>
          + Novo Orçamento
        </button>
      </div>

      <div className="form-row mb-6">
        <div className="result-box" style={{ marginTop: 0, padding: 'var(--spacing-4)', border: '1px solid #10b981' }}>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Faturamento (Aprovado)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#10b981' }}>R$ {approvedTotal.toLocaleString('pt-BR')}</div>
        </div>
        <div className="result-box" style={{ marginTop: 0, padding: 'var(--spacing-4)', border: '1px solid var(--color-accent)' }}>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Pipeline (Pendente)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-accent)' }}>R$ {pendingTotal.toLocaleString('pt-BR')}</div>
        </div>
        <div className="result-box" style={{ marginTop: 0, padding: 'var(--spacing-4)' }}>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Conversão no Mês</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{conversionRate.toFixed(0)}%</div>
        </div>
      </div>

      {quotes.length > 0 && (
        <div className="grid-2 mb-8">
          <div className="card card-tight">
            <h3 className="mb-4" style={{ fontSize: '1rem' }}>Faturamento por Status (Geral)</h3>
            <div style={{ height: 250, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: any) => `R$ ${Number(value).toLocaleString('pt-BR')}`} 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card card-tight">
            <h3 className="mb-4" style={{ fontSize: '1rem' }}>Receita por Tipo (Ativos)</h3>
            <div style={{ height: 250, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectTypeData} layout="vertical" margin={{ left: 0, right: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={110} tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    formatter={(value: any) => `R$ ${Number(value).toLocaleString('pt-BR')}`} 
                    cursor={{ fill: 'var(--color-surface-hover)' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="value" fill="var(--color-accent)" radius={[0, 4, 4, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mt-8 mb-4">
        <h3 style={{ margin: 0 }}>Histórico e Gestão</h3>
        <div className="segmented-control" style={{ width: 'auto' }}>
          {(['Todos', 'Pendente', 'Aprovado', 'Rejeitado'] as const).map(tab => (
            <React.Fragment key={tab}>
              <input 
                type="radio" 
                id={`filter-${tab}`} 
                checked={statusFilter === tab} 
                onChange={() => setStatusFilter(tab)} 
              />
              <label htmlFor={`filter-${tab}`} style={{ padding: '4px 12px' }}>{tab}</label>
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="mt-4" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filteredQuotes.length === 0 ? (
          <p className="text-center mt-6">Nenhum orçamento encontrado.</p>
        ) : (
          filteredQuotes.map(q => {
            const isApproved = q.status === 'Aprovado';
            const isRejected = q.status === 'Rejeitado';
            
            return (
              <div 
                key={q.id} 
                className="card card-tight" 
                onClick={(e) => {
                  // Se clicou nos botões de ação, não abre o modo edição
                  if ((e.target as HTMLElement).closest('button')) return;
                  onEditQuote(q);
                }}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  opacity: isRejected ? 0.6 : 1,
                  borderLeft: isApproved ? '4px solid #10b981' : isRejected ? '4px solid #ef4444' : '4px solid var(--color-accent)',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = ''}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', textDecoration: isRejected ? 'line-through' : 'none' }}>
                      {q.clientName}
                    </h4>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      padding: '2px 6px', 
                      borderRadius: '4px',
                      background: isApproved ? 'rgba(16, 185, 129, 0.1)' : isRejected ? 'rgba(239, 68, 68, 0.1)' : 'var(--color-accent-light)',
                      color: isApproved ? '#10b981' : isRejected ? '#ef4444' : 'var(--color-accent)'
                    }}>
                      {q.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    {q.projectType} • {new Date(q.date).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>
                    R$ {q.totalPrice.toLocaleString('pt-BR')}
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      const url = `${window.location.origin}/?proposta=${q.id}`;
                      navigator.clipboard.writeText(url);
                      alert('Link do portal do cliente copiado!');
                    }}
                    style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-pill)', padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                    title="Copiar Link para o Cliente Assinar"
                  >
                    🔗 Copiar Link Cliente
                  </button>

                  {/* Status Buttons */}
                  <div style={{ display: 'flex', gap: '4px', background: 'var(--color-bg)', padding: '4px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--color-border)' }}>
                    <button 
                      onClick={() => onUpdateStatus(q.id, 'Pendente')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: q.status === 'Pendente' ? 1 : 0.3 }}
                      title="Marcar Pendente"
                    >🕒</button>
                    <button 
                      onClick={() => onUpdateStatus(q.id, 'Aprovado')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: q.status === 'Aprovado' ? 1 : 0.3 }}
                      title="Aprovar"
                    >✅</button>
                    <button 
                      onClick={() => onUpdateStatus(q.id, 'Rejeitado')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: q.status === 'Rejeitado' ? 1 : 0.3 }}
                      title="Rejeitar"
                    >❌</button>
                  </div>

                  <button 
                    onClick={() => {
                      if (window.confirm(`Tem certeza que deseja excluir o orçamento de ${q.clientName}?`)) {
                        onDeleteQuote(q.id);
                      }
                    }}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.25rem', opacity: 0.7, marginLeft: '8px' }}
                    title="Excluir orçamento"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Dashboard;
