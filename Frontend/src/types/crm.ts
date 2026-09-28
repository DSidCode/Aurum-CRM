export type CustomerTier = 1 | 2 | 3;
export type DealStage = 1 | 2 | 3 | 4 | 5 | 6;

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  company: string;
  phone: string;
  tier: CustomerTier;
  createdAt: string;
  activeDealsCount: number;
}

export interface Deal {
  id: string;
  title: string;
  valueAmount: number;
  currency: string;
  stage: DealStage;
  stageName: string;
  customerId: string;
  customerName: string;
  company: string;
  createdAt: string;
  closedAt?: string;
}

export interface DashboardMetrics {
  totalPipelineValue: number;
  totalWonValue: number;
  totalCustomersCount: number;
  activeDealsCount: number;
  wonDealsCount: number;
  conversionRatePercentage: number;
  dealsByStage: {
    stage: string;
    count: number;
    totalValue: number;
  }[];
}

export interface CqrsEventLog {
  id: string;
  timestamp: string;
  type: 'COMMAND' | 'QUERY';
  name: string;
  handler: string;
  layer: 'Aurum.Application' | 'Aurum.Domain' | 'Aurum.Infrastructure';
  payload: any;
  result: any;
  durationMs: number;
}
