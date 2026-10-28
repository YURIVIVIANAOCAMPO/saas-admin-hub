export type PlanType = 'Starter' | 'Pro' | 'Enterprise';
export type CustomerStatus = 'active' | 'trial' | 'past_due' | 'canceled';
export type InvoiceStatus = 'paid' | 'pending' | 'failed';

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  plan: PlanType;
  status: CustomerStatus;
  mrr: number;
  signupDate: string;
  avatarUrl?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  status: InvoiceStatus;
  date: string;
  dueDate: string;
}

export interface MetricCardData {
  title: string;
  value: string;
  change: number; // percentage
  isPositive: boolean;
  timeframe: string;
  iconName: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'signup' | 'upgrade' | 'payment_failed' | 'webhook';
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  fullKey?: string;
  createdAt: string;
  lastUsed: string;
}
