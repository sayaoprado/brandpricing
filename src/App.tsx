import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Login from './components/Login';
import Landing from './components/Landing';
import { usePricing } from './hooks/usePricing';
import ConfigurationStage from './components/ConfigurationStage';
import QuoteBuilder from './components/QuoteBuilder';
import Dashboard from './components/Dashboard';
import PublicQuoteView from './components/PublicQuoteView';

export type View = 'dashboard' | 'config' | 'quote';

function App() {
  const [currentView, setCurrentView] = useState<View>('quote');
  const [editingQuote, setEditingQuote] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [publicQuoteId, setPublicQuoteId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
  });
  
  const pricingProps = usePricing(session?.user?.id);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const quoteId = urlParams.get('proposta');
    if (quoteId) {
      setPublicQuoteId(quoteId);
      setIsCheckingAuth(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsCheckingAuth(false);
      // Check subscription on load
      if (session?.user?.id) checkSubscription(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user?.id) checkSubscription(session.user.id);
    });

    // Check if returning from successful checkout
    if (window.location.search.includes('subscribed=true')) {
      window.history.replaceState({}, '', window.location.pathname);
    }

    return () => subscription.unsubscribe();
  }, []);

  const checkSubscription = async (_userId: string) => {
    // Treat as free / Pro temporarily without checking
  };

  if (isCheckingAuth) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>Verificando sessão...</p>
      </div>
    );
  }

  if (publicQuoteId) {
    return <PublicQuoteView quoteId={publicQuoteId} />;
  }

  if (!session) {
    if (showLogin) {
      return <Login onLogin={() => setShowLogin(false)} onBack={() => setShowLogin(false)} />;
    }
    return <Landing onStart={() => setShowLogin(true)} />;
  }

  if (pricingProps.isLoading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>Carregando dados do Supabase...</p>
      </div>
    );
  }

  // Show upgrade screen if not subscribed
  // Comment out this block to disable paywall during development
  // if (showPlanSelect) {
  //   return (
  //     <UpgradeScreen
  //       onSubscribe={handleSubscribe}
  //       onContinueFree={() => setShowPlanSelect(false)}
  //       loading={subscribeLoading}
  //       trialDaysLeft={trialDaysLeft}
  //     />
  //   );
  // }

  const accentColor = pricingProps.config?.accentColor || '#d97706';


  return (
    <div 
      className="container" 
      style={{ 
        '--color-accent': accentColor,
        '--color-accent-hover': accentColor, // We could darken it, but keeping simple for now
        '--color-accent-light': `${accentColor}25` // 15% opacity hex
      } as React.CSSProperties}
    >
      <header className="header">
        <div>
          <img src="/logo.svg" alt="BrandPricing" style={{ height: '36px', display: 'block' }} />
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Propostas Comerciais
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: 'var(--color-text)' }}
            title={`Mudar para modo ${theme === 'dark' ? 'claro' : 'escuro'}`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <div className="nav-tabs" style={{ marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>
            <button 
              className={`nav-tab ${currentView === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentView('dashboard')}
            >
              Dashboard
            </button>
            <button
 
              className={`nav-tab ${currentView === 'quote' ? 'active' : ''}`}
              onClick={() => { setEditingQuote(null); setCurrentView('quote'); }}
            >
              Novo Orçamento
            </button>
            <button 
              className={`nav-tab ${currentView === 'config' ? 'active' : ''}`}
              onClick={() => setCurrentView('config')}
            >
              Configurações
            </button>
          </div>
          <button 
            onClick={() => supabase.auth.signOut()} 
            style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '0.875rem' }}
          >
            Sair
          </button>
        </div>
      </header>

      <main>
        {currentView === 'dashboard' && (
          <Dashboard 
            quotes={pricingProps.quotes} 
            navigate={setCurrentView} 
            onDeleteQuote={pricingProps.deleteQuote} 
            onUpdateStatus={pricingProps.updateQuoteStatus}
            onEditQuote={(quote) => {
              setEditingQuote(quote);
              setCurrentView('quote');
            }}
          />
        )}
        {currentView === 'config' && <ConfigurationStage {...pricingProps} />}
        {currentView === 'quote' && (
          pricingProps.config ? 
            <QuoteBuilder {...pricingProps} config={pricingProps.config} initialQuote={editingQuote} onSaveSuccess={() => { setEditingQuote(null); setCurrentView('dashboard'); }} /> : 
            <div className="card text-center">
              <h2>Quase lá!</h2>
              <p>Você precisa configurar sua base de preços antes de gerar orçamentos.</p>
              <button onClick={() => setCurrentView('config')} className="btn btn-primary" style={{ width: 'auto', marginTop: 16 }}>
                Ir para Configurações
              </button>
            </div>
        )}
      </main>
    </div>
  );
}

export default App;
