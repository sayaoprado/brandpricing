export interface Config {
  hourlyRate: number;
  monthlyOverhead: number;
  projectsPerMonth: number;
  profitMargin: number;
  taxes: number;
  brandName?: string;
  accentColor?: string;
  pdfFooterText?: string;
  logoUrl?: string;
  phone?: string;
  website?: string;
  cnpj?: string;
  bankDetails?: string;
  customScope?: ScopeItem[];
}

export type ProjectType = 'Identidade Visual Essencial' | 'Identidade Visual Completa' | 'Rebranding' | 'Naming + Identidade' | 'Pacote Personalizado';
export type Complexity = 'Simples' | 'Média' | 'Alta';
export type Deadline = 'Normal' | 'Urgente';
export type PaymentMethod = 'À vista' | '2x' | '3x';

export interface ScopeItem {
  id: string;
  label: string;
  estimatedHours: number;
  fixedPrice?: number;
  selected: boolean;
}

export type QuoteStatus = 'Pendente' | 'Aprovado' | 'Rejeitado';

export interface Quote {
  id: string;
  clientName: string;
  projectType: ProjectType;
  date: string;
  totalPrice: number;
  status: QuoteStatus;
  notes?: string;
  scope?: ScopeItem[];
  complexity?: Complexity;
  deadline?: Deadline;
  paymentMethod?: PaymentMethod;
  bvPercentage?: number;
  pricingMode?: 'hours' | 'fixed';
  signatureName?: string;
  signatureDoc?: string;
  signatureDate?: string;
  signatureIp?: string;
}
