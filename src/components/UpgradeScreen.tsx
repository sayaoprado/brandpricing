import React from 'react';

interface Props {
  onSubscribe: () => void;
  onContinueFree: () => void;
  loading?: boolean;
  trialDaysLeft?: number;
}

const UpgradeScreen: React.FC<Props> = ({ onSubscribe, onContinueFree, loading, trialDaysLeft }) => {
  const isInTrial = trialDaysLeft !== undefined && trialDaysLeft > 0;

  return (
    <div style={{
      minHeight: '100vh', background: '#050505', color: '#fff',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '2rem', fontFamily: 'Inter, sans-serif'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <img src="/logo.svg" alt="BrandPricing" style={{ height: '32px' }} />
      </div>

      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '0.75rem', textAlign: 'center' }}>
        Escolha seu plano
      </h1>
      <p style={{ color: '#64748b', marginBottom: '3rem', textAlign: 'center', maxWidth: '480px' }}>
        {isInTrial
          ? `Você tem ${trialDaysLeft} dias de trial Pro restantes. Assine para não perder o acesso.`
          : 'Comece gratuitamente ou desbloqueie o poder completo do BrandPricing.'}
      </p>

      {/* Plans Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', width: '100%', maxWidth: '720px' }}>

        {/* FREE PLAN */}
        <div style={{
          background: '#0f0f0f', border: '1px solid #222', borderRadius: '28px',
          padding: '2.5rem', display: 'flex', flexDirection: 'column'
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#64748b', marginBottom: '1rem' }}>GRÁTIS</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
              <span style={{ fontSize: '3rem', fontWeight: 900 }}>R$0</span>
              <span style={{ color: '#64748b' }}>/mês</span>
            </div>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', flex: 1 }}>
            {[
              { label: 'Até 3 orçamentos/mês', ok: true },
              { label: 'Cálculo de overhead', ok: true },
              { label: 'Dashboard básico', ok: true },
              { label: 'Download de PDF', ok: false },
              { label: 'Gráficos e métricas completas', ok: false },
              { label: 'White-label personalizado', ok: false },
            ].map((f, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.55rem 0', borderBottom: '1px solid #1a1a1a', fontSize: '0.95rem', color: f.ok ? '#cbd5e1' : '#374151' }}>
                <span style={{ flexShrink: 0, color: f.ok ? '#22c55e' : '#374151' }}>{f.ok ? '✓' : '✕'}</span>
                {f.label}
              </li>
            ))}
          </ul>

          <button
            onClick={onContinueFree}
            style={{
              width: '100%', padding: '1rem', borderRadius: '14px',
              background: 'transparent', border: '1px solid #333',
              color: '#94a3b8', fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#94a3b8'; }}
          >
            Continuar no Free
          </button>
        </div>

        {/* PRO PLAN */}
        <div style={{
          background: '#0f0f0f', border: '1px solid rgba(217,119,6,0.4)', borderRadius: '28px',
          padding: '2.5rem', display: 'flex', flexDirection: 'column', position: 'relative',
          boxShadow: '0 0 40px rgba(217,119,6,0.08)'
        }}>
          {/* Popular badge */}
          <div style={{
            position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #d97706, #b45309)',
            color: '#fff', borderRadius: '99px', padding: '4px 20px',
            fontSize: '0.78rem', fontWeight: 700, whiteSpace: 'nowrap'
          }}>
            ✦ MAIS POPULAR
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#d97706', marginBottom: '1rem' }}>PRO</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
              <span style={{ fontSize: '3rem', fontWeight: 900 }}>R$15</span>
              <span style={{ color: '#64748b' }}>/mês</span>
            </div>
            <div style={{
              display: 'inline-block', marginTop: '0.75rem',
              background: 'rgba(34,197,94,0.1)', color: '#22c55e',
              border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: '99px', padding: '3px 12px', fontSize: '0.78rem', fontWeight: 700
            }}>
              🎁 15 dias grátis para testar
            </div>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', flex: 1 }}>
            {[
              'Orçamentos ilimitados',
              'Download de PDF profissional',
              'White-label com logo e cores',
              'Dashboard CRM completo',
              'Gráficos e métricas avançadas',
              'Biblioteca de serviços customizável',
            ].map((f, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.55rem 0', borderBottom: '1px solid #1a1a1a', color: '#cbd5e1', fontSize: '0.95rem' }}>
                <span style={{ color: '#d97706', fontWeight: 700, flexShrink: 0 }}>✓</span>
                {f}
              </li>
            ))}
          </ul>

          <button
            onClick={onSubscribe}
            disabled={loading}
            style={{
              width: '100%', padding: '1.1rem', borderRadius: '14px', border: 'none',
              background: loading ? '#333' : 'linear-gradient(135deg, #d97706, #b45309)',
              color: '#fff', fontSize: '1rem', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease', boxShadow: '0 4px 20px rgba(217,119,6,0.25)'
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {loading ? 'Redirecionando...' : 'Começar trial gratuito de 15 dias'}
          </button>
          <p style={{ color: '#374151', fontSize: '0.78rem', marginTop: '0.75rem', textAlign: 'center' }}>
            🔒 Stripe · Cartão ou PIX · Cancele quando quiser
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpgradeScreen;
