import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import type { ProjectType, ScopeItem, Deadline, PaymentMethod, Config } from '../types';

// Register standard fonts if needed, Helvetica is built-in
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#333333',
    lineHeight: 1.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '1pt solid #eeeeee',
    paddingBottom: 20,
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    textAlign: 'right',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 9,
    color: '#666666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
    textTransform: 'uppercase',
    borderBottom: '1pt solid #eeeeee',
    paddingBottom: 4,
  },
  paragraph: {
    fontSize: 10,
    marginBottom: 8,
    color: '#444444',
    textAlign: 'justify',
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  itemBullet: {
    width: 12,
    color: '#000000',
    fontWeight: 'bold',
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    fontWeight: 'bold',
    color: '#111111',
  },
  itemPrice: {
    fontSize: 9,
    color: '#888888',
  },
  highlightBox: {
    backgroundColor: '#fafafa',
    padding: 16,
    borderRadius: 4,
    marginTop: 8,
  },
  highlightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  highlightLabel: {
    color: '#666666',
  },
  highlightValue: {
    fontWeight: 'bold',
    color: '#111111',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTop: '1pt solid #dddddd',
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111111',
  },
  termsTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 2,
  },
  termsText: {
    fontSize: 8,
    color: '#666666',
    textAlign: 'justify',
    marginBottom: 4,
  },
  signatureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  signatureBox: {
    width: '45%',
    alignItems: 'center',
  },
  signatureLine: {
    borderTop: '1pt solid #000000',
    width: '100%',
    paddingTop: 4,
    alignItems: 'center',
  },
  signatureName: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  signatureDoc: {
    fontSize: 8,
    color: '#666666',
  },
  digitalStamp: {
    border: '1pt solid #000',
    padding: 10,
    marginTop: 10,
    width: '100%',
    textAlign: 'center',
    backgroundColor: '#fafafa'
  },
  digitalStampText: {
    fontSize: 8,
    color: '#333'
  }
});

interface QuotePDFProps {
  clientName: string;
  projectType: ProjectType;
  scope: ScopeItem[];
  deadline: Deadline;
  paymentMethod: PaymentMethod;
  finalDays: number;
  calculation: any;
  config: Config;
  pricingMode?: 'hours' | 'fixed';
  signatureName?: string;
  signatureDoc?: string;
  signatureDate?: string;
  signatureIp?: string;
}

const QuotePDF: React.FC<QuotePDFProps> = ({ 
  clientName, 
  projectType, 
  scope,
  paymentMethod, 
  finalDays, 
  calculation,
  config,
  pricingMode = 'hours',
  signatureName,
  signatureDoc,
  signatureDate,
  signatureIp
}) => {
  const selectedScope = scope.filter(item => item.selected);
  const brandName = config.brandName || 'Estúdio Design';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {config.logoUrl ? (
              <Image src={config.logoUrl} style={{ height: 30, width: 'auto', maxWidth: 150, objectFit: 'contain', marginTop: 4, marginBottom: 8 }} />
            ) : (
              <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 4 }}>{brandName}</Text>
            )}
            <Text style={styles.infoText}>{config.pdfFooterText || 'contato@email.com'}</Text>
            <Text style={styles.infoText}>{config.website || 'www.seusite.com.br'}</Text>
            <Text style={styles.infoText}>{config.phone || '+55 00 00000-0000'}</Text>
          </View>
          
          <View style={styles.headerRight}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#111' }}>{projectType}</Text>
            <Text style={styles.infoText}>{new Date().toLocaleDateString('pt-BR')}</Text>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#111', marginTop: 12 }}>Cliente:</Text>
            <Text style={styles.infoText}>{clientName || 'Cliente a definir'}</Text>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#111', marginTop: 8 }}>Validade:</Text>
            <Text style={styles.infoText}>30 dias</Text>
          </View>
        </View>

        {/* 1. DESCRIÇÃO DO PROJETO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Descrição do Projeto</Text>
          <Text style={styles.paragraph}>
            Nossa proposta tem como objetivo criar soluções de design focadas em {projectType.toLowerCase()}, garantindo 
            uma estética profissional, unificada e alinhada com os valores da marca. Com um design que transmita 
            confiança e compromisso, buscamos proporcionar uma experiência visual coerente e de alto impacto para o seu público.
          </Text>
        </View>

        {/* 2. INVESTIMENTO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Investimento & Escopo</Text>
          <Text style={[styles.paragraph, { fontWeight: 'bold', marginBottom: 12 }]}>
            Itens contemplados no projeto de {projectType}:
          </Text>
          
          {selectedScope.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemBullet}>•</Text>
              <View style={styles.itemContent}>
                <Text style={styles.itemLabel}>
                  {item.label} 
                  <Text style={styles.itemPrice}>
                    {'  '}- {pricingMode === 'hours' ? `~${item.estimatedHours}h estimadas` : `R$ ${(item.fixedPrice || 0).toLocaleString('pt-BR')}`}
                  </Text>
                </Text>
              </View>
            </View>
          ))}

          <Text style={[styles.paragraph, { marginTop: 12, fontStyle: 'italic', color: '#666' }]}>
            Diferenciais: Com uma equipe dedicada e experiência focada em resultados, estamos comprometidos em 
            oferecer uma solução visual que atenda às suas necessidades e contribua diretamente para a valorização da sua marca.
          </Text>

          <View style={styles.highlightBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Investimento Total do Projeto:</Text>
              <Text style={styles.totalValue}>R$ {calculation.roundedFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
            </View>
          </View>
        </View>

        {/* 3. PRAZOS & 4. PAGAMENTO (Side by Side) */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
          {/* PRAZOS */}
          <View style={{ width: '48%' }}>
            <Text style={styles.sectionTitle}>3. Prazos</Text>
            <View style={styles.highlightRow}>
              <Text style={styles.highlightLabel}>Apresentação Principal</Text>
              <Text style={styles.highlightValue}>{Math.ceil(finalDays * 0.7)} dias úteis</Text>
            </View>
            <View style={styles.highlightRow}>
              <Text style={styles.highlightLabel}>Revisões / Ajustes</Text>
              <Text style={styles.highlightValue}>{Math.floor(finalDays * 0.3)} dias úteis</Text>
            </View>
            <View style={[styles.highlightRow, { marginTop: 8, borderTop: '1pt solid #eee', paddingTop: 4 }]}>
              <Text style={{ fontWeight: 'bold' }}>Prazo Total Estimado</Text>
              <Text style={{ fontWeight: 'bold' }}>{finalDays} dias úteis</Text>
            </View>
            <View style={[styles.highlightRow, { marginTop: 4 }]}>
              <Text style={styles.highlightLabel}>Disponibilidade para Início</Text>
              <Text style={[styles.highlightValue, { color: '#000' }]}>Imediata</Text>
            </View>
          </View>

          {/* PAGAMENTO */}
          <View style={{ width: '48%' }}>
            <Text style={styles.sectionTitle}>4. Pagamento</Text>
            <View style={styles.highlightRow}>
              <Text style={styles.highlightLabel}>Método</Text>
              <Text style={styles.highlightValue}>{paymentMethod}</Text>
            </View>
            <View style={styles.highlightRow}>
              <Text style={styles.highlightLabel}>Sinal para Início</Text>
              <Text style={styles.highlightValue}>R$ {(calculation.roundedFinal / 2).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
            </View>
            
            <Text style={[styles.termsTitle, { marginTop: 12 }]}>DADOS BANCÁRIOS</Text>
            <Text style={{ fontSize: 9, color: '#444' }}>
              {config.bankDetails || 'Chave PIX: email@exemplo.com\nBanco Padrão\nAgência 0001 Conta 1234-5'}
            </Text>
          </View>
        </View>

        {/* 5. CONDIÇÕES GERAIS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Condições Gerais</Text>
          
          <Text style={styles.termsTitle}>Prazos e Serviços de Terceiros</Text>
          <Text style={styles.termsText}>Os prazos estão atrelados ao fornecimento das informações pelo Cliente. Não estão contabilizados atrasos decorrentes da demora na aprovação. Não estão incluídos serviços de terceiros como tradução, revisão, compra de imagens e impressão. A contratação destes é feita pelo Cliente.</Text>
          
          <Text style={styles.termsTitle}>Valores e Cancelamento</Text>
          <Text style={styles.termsText}>O valor desta proposta poderá ser revisto caso ocorram alterações no briefing, na complexidade ou aplicações não especificadas. Se o Cliente cancelar durante a execução, será cobrada uma porcentagem proporcional à parte entregue. Se o Estúdio for impossibilitado de continuar, devolverá o valor proporcional à parte não entregue.</Text>

          <Text style={styles.termsTitle}>Registro de Patente e Propriedade</Text>
          <Text style={styles.termsText}>O contratado não é responsável por nenhum tipo de registro legal de marca (INPI) ou nome, sendo de inteira responsabilidade do Cliente. As artes-finais passam a ser propriedade do Cliente somente após o pagamento total. Aplica-se a Lei nº 9.610/98 (Direito Autoral), podendo o projeto ser usado no portfólio do contratado.</Text>
        </View>

        {/* 6. APROVAÇÃO E ASSINATURAS */}
        <View style={{ marginTop: 20 }}>
          <Text style={styles.sectionTitle}>6. Aprovação da Proposta</Text>
          <Text style={styles.paragraph}>
            A assinatura deste documento caracteriza a aceitação dos termos descritos e a valida como um contrato de prestação de serviços. Após aprovação, o Cliente deve providenciar o pagamento do sinal para que o projeto seja iniciado. Agradecemos a oportunidade e confiança!
          </Text>

          <View style={styles.signatureContainer}>
            {signatureDate ? (
              <View style={styles.digitalStamp}>
                <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 4 }}>✓ DOCUMENTO ASSINADO DIGITALMENTE</Text>
                <Text style={styles.digitalStampText}>
                  Por {signatureName || clientName} (CNPJ/CPF: {signatureDoc || 'Não informado'})
                </Text>
                <Text style={styles.digitalStampText}>
                  Data/Hora: {new Date(signatureDate).toLocaleString('pt-BR')} | IP: {signatureIp || 'Registrado'}
                </Text>
                <Text style={[styles.digitalStampText, { marginTop: 4, color: '#666' }]}>
                  Prestador: {brandName} (CNPJ/CPF: {config.cnpj || 'Não informado'})
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.signatureBox}>
                  <View style={styles.signatureLine}>
                    <Text style={styles.signatureName}>{clientName || 'Contratante'}</Text>
                    <Text style={styles.signatureDoc}>Cliente</Text>
                  </View>
                </View>

                <View style={styles.signatureBox}>
                  <View style={styles.signatureLine}>
                    <Text style={styles.signatureName}>{brandName}</Text>
                    <Text style={styles.signatureDoc}>CNPJ/CPF: {config.cnpj || 'Não informado'}</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

      </Page>
    </Document>
  );
};

export default QuotePDF;
