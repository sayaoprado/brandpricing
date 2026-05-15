import React, { useState } from 'react';
import type { Quote, QuoteStatus } from '../types';

interface Props {
  quote: Quote;
  onClose: () => void;
  onSave: (updated: Quote) => void;
  onDelete: (id: string) => void;
}

const QuoteDetailModal: React.FC<Props> = ({ quote, onClose, onSave, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [clientName, setClientName] = useState(quote.clientName);
  const [projectType, setProjectType] = useState(quote.projectType);
  const [totalPrice, setTotalPrice] = useState(quote.totalPrice);
  const [status, setStatus] = useState<QuoteStatus>(quote.status);
  const [notes, setNotes] = useState(quote.notes || '');

  const handleSave = () => {
    onSave({ ...quote, clientName, projectType, totalPrice, status, notes });
    setEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Excluir orçamento de ${quote.clientName}? Essa ação não pode ser desfeita.`)) {
      onDelete(quote.id);
      onClose();
    }
  };

  const statusColor = {
    Pendente: { bg: 'rgba(217,119,6,0.1)', text: '#d97706', border: 'rgba(217,119,6,0.3)' },
    Aprovado: { bg: 'rgba(16,185,129,0.1)', text: '#10b981', border: 'rgba(16,185,129,0.3)' },
    Rejeitado: { bg: 'rgba(239,68,68,0.1)', text: '#ef4444', border: 'rgba(239,68,68,0.3)' },
  }[status];

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: '#0f0f0f', border: '1px solid #222', borderRadius: '28px',
        width: '100%', maxWidth: '560px', padding: '2.5rem',
        boxShadow: '0 40px 80px rgba(0,0,0,0.6)', position: 'relative'
      }}>
        {/* Close */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#64748b', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}
        >×</button>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{
              fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: '99px',
              background: statusColor.bg, color: statusColor.text, border: `1px solid ${statusColor.border}`
            }}>{status}</span>
            <span style={{ color: '#374151', fontSize: '0.85rem' }}>
              {new Date(quote.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
          </div>
          {editing ? (
            <input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              style={{
                width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px',
                padding: '0.75rem 1rem', color: '#fff', fontSize: '1.5rem', fontWeight: 800
              }}
            />
          ) : (
            <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em' }}>{clientName}</h2>
          )}
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {/* Project Type */}
          <div>
            <label style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tipo de Projeto</label>
            {editing ? (
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value as any)}
                style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '0.75rem 1rem', color: '#fff', fontSize: '1rem' }}
              >
                {['Identidade Visual Essencial','Identidade Visual Completa','Rebranding','Naming + Identidade','Pacote Personalizado'].map(t => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            ) : (
              <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '0.75rem 1rem', color: '#e2e8f0' }}>{projectType}</div>
            )}
          </div>

          {/* Value */}
          <div>
            <label style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Valor Total</label>
            {editing ? (
              <input
                type="number"
                value={totalPrice}
                onChange={(e) => setTotalPrice(Number(e.target.value))}
                style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '0.75rem 1rem', color: '#d97706', fontSize: '1.5rem', fontWeight: 800 }}
              />
            ) : (
              <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '0.75rem 1rem', color: '#d97706', fontSize: '1.5rem', fontWeight: 800 }}>
                R$ {totalPrice.toLocaleString('pt-BR')}
              </div>
            )}
          </div>

          {/* Status */}
          {editing && (
            <div>
              <label style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {(['Pendente', 'Aprovado', 'Rejeitado'] as QuoteStatus[]).map(s => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    style={{
                      flex: 1, padding: '0.6rem', borderRadius: '10px', border: `1px solid ${status === s ? statusColor.border : '#333'}`,
                      background: status === s ? statusColor.bg : 'transparent',
                      color: status === s ? statusColor.text : '#64748b',
                      fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.2s'
                    }}
                  >{s}</button>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Observações</label>
            {editing ? (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Adicione observações sobre o projeto, cliente, prazo..."
                style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '0.75rem 1rem', color: '#e2e8f0', fontSize: '0.95rem', resize: 'vertical', boxSizing: 'border-box' }}
              />
            ) : (
              <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '0.75rem 1rem', color: notes ? '#e2e8f0' : '#374151', minHeight: '60px', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {notes || 'Nenhuma observação adicionada.'}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {editing ? (
            <>
              <button
                onClick={handleSave}
                style={{ flex: 1, padding: '0.9rem', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg,#d97706,#b45309)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}
              >Salvar alterações</button>
              <button
                onClick={() => { setEditing(false); setClientName(quote.clientName); setProjectType(quote.projectType); setTotalPrice(quote.totalPrice); setStatus(quote.status); setNotes(quote.notes || ''); }}
                style={{ padding: '0.9rem 1.5rem', borderRadius: '14px', border: '1px solid #333', background: 'transparent', color: '#94a3b8', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}
              >Cancelar</button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                style={{ flex: 1, padding: '0.9rem', borderRadius: '14px', border: '1px solid #333', background: '#1a1a1a', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}
              >✏️ Editar</button>
              <button
                onClick={handleDelete}
                style={{ padding: '0.9rem 1.25rem', borderRadius: '14px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)', color: '#ef4444', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}
              >🗑️</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteDetailModal;
