import React from 'react';

interface Props {
  onStart: () => void;
}

const Landing: React.FC<Props> = ({ onStart }) => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>
      {/* Sticky Header */}
      <header style={{ 
        position: 'fixed', top: 0, width: '100%', zIndex: 100,
        background: 'rgba(var(--color-bg), 0.8)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--color-border)', padding: '1rem 2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="/logo.svg" alt="BrandPricing" style={{ height: '32px' }} />
        </div>
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="#features" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Recursos</a>
          <a href="#how-it-works" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Metodologia</a>
          <button 
            onClick={onStart}
            className="btn btn-secondary"
            style={{ width: 'auto', padding: '0.5rem 1.5rem', fontSize: '0.9rem', background: '#fff', color: '#000', border: 'none' }}
          >
            Entrar
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-gradient" style={{ paddingTop: '160px', paddingBottom: '100px', textAlign: 'center', paddingLeft: '24px', paddingRight: '24px' }}>
        <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ 
            display: 'inline-block', padding: '6px 16px', borderRadius: '99px', 
            background: 'var(--color-accent-light)', color: 'var(--color-accent)', 
            fontSize: '0.8rem', fontWeight: 700, marginBottom: '24px', border: '1px solid var(--color-accent-light)'
          }}>
            O fim do "Quanto eu cobro?"
          </div>
          <h2 style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)', lineHeight: 1.0, letterSpacing: '-0.05em', fontWeight: 800, marginBottom: '1.5rem' }}>
            Chega de chutar preço e <br/> torcer para <span style={{ color: 'var(--color-accent)' }}>dar lucro.</span>
          </h2>
          <p style={{ fontSize: '1.4rem', color: 'var(--color-text-muted)', maxWidth: '700px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
            A ferramenta para designers que cansaram de "pagar para trabalhar". Calcule seu custo real e gere propostas que transmitem autoridade.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button 
              onClick={onStart}
              className="btn btn-primary"
              style={{ width: 'auto', padding: '1.25rem 3rem', fontSize: '1.1rem', fontWeight: 800, borderRadius: '16px' }}
            >
              Criar meu primeiro orçamento
            </button>
          </div>

          {/* App Screenshot */}
          <div className="animate-float" style={{ marginTop: '5rem', position: 'relative', maxWidth: '1100px', margin: '5rem auto 0 auto' }}>
            <img 
              src="/app-screenshot.png" 
              alt="BrandPricing App Screenshot" 
              style={{ 
                width: '100%', borderRadius: '24px', 
                boxShadow: '0 40px 100px rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.08)' 
              }} 
            />
            <div style={{ 
              position: 'absolute', inset: 0, background: 'linear-gradient(to top, #050505 0%, transparent 40%)',
              pointerEvents: 'none', borderRadius: '24px'
            }}></div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{ padding: '5rem 2rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', overflow: 'hidden' }}>
        <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '3rem', textAlign: 'center', textTransform: 'uppercase' }}>O que designers dizem sobre o BrandPricing</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
          {[
            { name: 'Camila Torres', role: 'Brand Designer Freelancer · SP', avatar: 'CT', text: 'Antes eu cobrava R$1.500 por identidade visual sem saber se estava ganhando ou perdendo. Com o BrandPricing descobri que meu custo real era R$2.200. Mudou tudo.' },
            { name: 'Rafael Mendes', role: 'Designer & Motion · RJ', avatar: 'RM', text: 'A funcionalidade de PDF me poupou horas. O cliente recebe uma proposta tão profissional que a aprovação subiu muito. Parece que trabalho em uma agência grande.' },
            { name: 'Bia Carvalho', role: 'UI/UX Designer · BH', avatar: 'BC', text: 'Finalmente consigo ver meu funil de vendas. Sei exatamente quantos projetos estão em negociação e qual é o meu pipeline real. Essencial para planejar o mês.' },
            { name: 'Lucas Faria', role: 'Diretor de Arte · Curitiba', avatar: 'LF', text: 'O cálculo de overhead me abriu os olhos. Eu literalmente cobrava menos do que meus custos. Hoje meu ticket médio é 60% maior e o cliente nem questionou.' },
            { name: 'Ana Luz', role: 'Designer de Marca · Floripa', avatar: 'AL', text: 'A parte de white-label é incrível. Customizo com minhas cores e logo e a proposta parece desenvolvida por uma agência top. Transmite muito mais credibilidade.' },
            { name: 'Pedro Costa', role: 'Freelancer Full Stack Creative · RS', avatar: 'PC', text: 'Simples, rápido, bonito. Gero um orçamento completo em menos de 5 minutos. Antes perdia tempo criando tabelas no Excel que nem fechavam direito.' }
          ].map((t, i) => (
            <div key={i} style={{ 
              padding: '2rem', background: '#0e0e0e', border: '1px solid #1e1e1e',
              borderRadius: '20px', cursor: 'default', transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(217,119,6,0.5)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(217,119,6,0.15), 0 0 0 1px rgba(217,119,6,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#1e1e1e';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ 
                  width: '44px', height: '44px', borderRadius: '50%', 
                  background: 'linear-gradient(135deg, var(--color-accent), #92400e)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.85rem', color: '#fff', flexShrink: 0
                }}>{t.avatar}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>{t.name}</div>
                  <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{t.role}</div>
                </div>
              </div>
              <p style={{ color: '#94a3b8', lineHeight: 1.7, margin: 0, fontSize: '0.95rem' }}>"{t.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '120px 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>Menos achismo, mais lucro.</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>Funcionalidades desenhadas por quem vive o dia a dia do design e sabe onde o dinheiro some.</p>
        </div>
        
        <div className="landing-grid">
          {[
            { title: 'Custo da sua hora', desc: 'Esqueça a média do mercado. Calcule sua hora baseada no seu custo de vida real.' },
            { title: 'Portal do Cliente & Assinatura Digital', desc: 'Envie um link único para o cliente aprovar e assinar a proposta online, com registro de IP e validade.' },
            { title: 'PDFs Profissionais com Selo Mágico', desc: 'Gere propostas comerciais em PDF com a sua marca e selo de autenticidade digital em um clique.' },
            { title: 'Gestão de Pipeline', desc: 'Saiba o que foi aprovado, o que está na mesa e o que foi perdido. Controle total.' },
            { title: 'Biblioteca de Escopos', desc: 'Crie seus próprios pacotes com estimativas de horas sempre prontas para usar.' },
            { title: 'Saúde do Negócio', desc: 'Visualize seu faturamento mensal, ticket médio e taxa de conversão real.' }
          ].map((f, i) => (
            <div key={i} className="card" style={{ 
              padding: '3rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)',
              transition: 'all 0.3s ease', cursor: 'default', borderRadius: '24px'
            }} onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.borderColor = 'var(--color-accent)';
            }} 
               onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--color-border)';
            }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--color-accent-light)', borderRadius: '10px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)', fontWeight: 800 }}>
                {i + 1}
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>{f.title}</h3>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0, fontSize: '1rem' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" style={{ background: 'var(--color-bg)', padding: '120px 2rem', borderTop: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 800 }}>O processo é simples.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '5rem' }}>
            {[
              { step: '01', title: 'Configuração', desc: 'Insira seus custos fixos e sua meta de faturamento mensal.' },
              { step: '02', title: 'Criação', desc: 'Monte o escopo do projeto e defina a complexidade.' },
              { step: '03', title: 'Aprovação', desc: 'Envie o link seguro para o cliente assinar online e baixe o contrato final.' }
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '5rem', fontWeight: 900, opacity: 0.05, marginBottom: '-2rem', color: 'var(--color-accent)' }}>{s.step}</div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', position: 'relative', fontWeight: 700 }}>{s.title}</h3>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, fontSize: '1.1rem' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section style={{ padding: '140px 2rem', textAlign: 'center' }}>
        <div style={{ 
          maxWidth: '900px', margin: '0 auto', padding: '5rem 3rem', borderRadius: '40px',
          background: 'linear-gradient(135deg, var(--color-accent), #b45309)',
          color: '#fff', position: 'relative', overflow: 'hidden',
          boxShadow: '0 30px 60px rgba(217, 119, 6, 0.2)'
        }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2.5rem', position: 'relative', zIndex: 1, letterSpacing: '-0.03em' }}>Pronto para parar de perder dinheiro?</h2>
          <button 
            onClick={onStart}
            style={{ 
              background: '#fff', color: '#b45309', border: 'none', 
              padding: '1.25rem 4rem', borderRadius: '18px', 
              fontSize: '1.2rem', fontWeight: 800, cursor: 'pointer',
              position: 'relative', zIndex: 1, transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Começar Gratuitamente
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '60px 2rem', borderTop: '1px solid var(--color-border)', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
          <a href="#" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Termos</a>
          <a href="#" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Privacidade</a>
          <a href="#" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Contato</a>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          &copy; {new Date().getFullYear()} BrandPricing. Criado para designers, por designers.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
