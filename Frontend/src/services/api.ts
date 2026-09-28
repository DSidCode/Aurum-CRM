import type { Customer, Deal, DashboardMetrics, CqrsEventLog, DealStage, CustomerTier } from '../types/crm';

const API_BASE_URL = 'http://localhost:5000/api';

let mockCustomers: Customer[] = [
  {
    id: 'c1-7f9a-412e',
    fullName: 'Elena Rostova',
    email: 'elena@luxurycouture.ch',
    company: 'Maison Rostova Ginebra',
    phone: '+41 22 731 00 22',
    tier: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    activeDealsCount: 2
  },
  {
    id: 'c2-9b2c-881a',
    fullName: 'Carlos Benítez',
    email: 'cbenitez@ibericaholdings.es',
    company: 'Ibérica Capital Partners',
    phone: '+34 91 555 43 21',
    tier: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    activeDealsCount: 1
  },
  {
    id: 'c3-4d5e-667f',
    fullName: 'Alexander Vance',
    email: 'vance@quantumhorizons.co.uk',
    company: 'Vance Global Logistics',
    phone: '+44 20 7946 0912',
    tier: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    activeDealsCount: 1
  },
  {
    id: 'c4-1a2b-334c',
    fullName: 'Sofía Alarcón',
    email: 's.alarcon@artatelier.paris',
    company: 'Alarcón Haute Horlogerie',
    phone: '+33 1 42 68 55 00',
    tier: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    activeDealsCount: 1
  }
];

let mockDeals: Deal[] = [
  {
    id: 'd1-a1b2',
    title: 'Implementación CRM Global & Clúster Privado',
    valueAmount: 48500,
    currency: 'EUR',
    stage: 4,
    stageName: 'InNegotiation',
    customerId: 'c1-7f9a-412e',
    customerName: 'Elena Rostova',
    company: 'Maison Rostova Ginebra',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString()
  },
  {
    id: 'd2-c3d4',
    title: 'Auditoría de Seguridad e Infraestructura de Nodos',
    valueAmount: 18000,
    currency: 'EUR',
    stage: 5,
    stageName: 'Won',
    customerId: 'c2-9b2c-881a',
    customerName: 'Carlos Benítez',
    company: 'Ibérica Capital Partners',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    closedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
  },
  {
    id: 'd3-e5f6',
    title: 'Despliegue E-Commerce Luxury High-Concurrency',
    valueAmount: 32500,
    currency: 'EUR',
    stage: 3,
    stageName: 'ProposalSent',
    customerId: 'c3-4d5e-667f',
    customerName: 'Alexander Vance',
    company: 'Vance Global Logistics',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString()
  },
  {
    id: 'd4-g7h8',
    title: 'Consultoría UI/UX y Plataforma Exclusiva',
    valueAmount: 9200,
    currency: 'EUR',
    stage: 2,
    stageName: 'Contacted',
    customerId: 'c4-1a2b-334c',
    customerName: 'Sofía Alarcón',
    company: 'Alarcón Haute Horlogerie',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString()
  },
  {
    id: 'd5-i9j0',
    title: 'Soporte Anual VIP & Monitoreo 24/7',
    valueAmount: 14000,
    currency: 'EUR',
    stage: 1,
    stageName: 'Lead',
    customerId: 'c1-7f9a-412e',
    customerName: 'Elena Rostova',
    company: 'Maison Rostova Ginebra',
    createdAt: new Date().toISOString()
  }
];

export type EventCallback = (event: CqrsEventLog) => void;
const listeners: EventCallback[] = [];

export function subscribeToCqrsLogs(cb: EventCallback) {
  listeners.push(cb);
  return () => {
    const idx = listeners.indexOf(cb);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

function emitCqrs(event: Omit<CqrsEventLog, 'id' | 'timestamp'>) {
  const fullEvent: CqrsEventLog = {
    ...event,
    id: 'evt-' + Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toLocaleTimeString()
  };
  listeners.forEach(l => l(fullEvent));
}

export const STAGE_LABELS: Record<DealStage, string> = {
  1: 'Lead',
  2: 'Contactado',
  3: 'Propuesta',
  4: 'Negociación',
  5: 'Ganado',
  6: 'Perdido'
};

export const CrmApi = {
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const start = performance.now();
    try {
      const res = await fetch(`${API_BASE_URL}/dashboard/metrics`, { signal: AbortSignal.timeout(1000) });
      if (res.ok) {
        const data = await res.json();
        emitCqrs({
          type: 'QUERY',
          name: 'GetDashboardMetricsQuery',
          handler: 'GetDashboardMetricsQueryHandler',
          layer: 'Aurum.Application',
          payload: {},
          result: data,
          durationMs: Math.round(performance.now() - start)
        });
        return data;
      }
    } catch { }

    const active = mockDeals.filter(d => d.stage !== 5 && d.stage !== 6);
    const won = mockDeals.filter(d => d.stage === 5);
    const totalPipeline = active.reduce((acc, d) => acc + d.valueAmount, 0);
    const totalWon = won.reduce((acc, d) => acc + d.valueAmount, 0);
    const rate = mockDeals.length > 0 ? (won.length / mockDeals.length) * 100 : 0;

    const data: DashboardMetrics = {
      totalPipelineValue: totalPipeline,
      totalWonValue: totalWon,
      totalCustomersCount: mockCustomers.length,
      activeDealsCount: active.length,
      wonDealsCount: won.length,
      conversionRatePercentage: Math.round(rate * 10) / 10,
      dealsByStage: [1, 2, 3, 4, 5, 6].map(s => ({
        stage: STAGE_LABELS[s as DealStage],
        count: mockDeals.filter(d => d.stage === s).length,
        totalValue: mockDeals.filter(d => d.stage === s).reduce((sum, d) => sum + d.valueAmount, 0)
      }))
    };

    emitCqrs({
      type: 'QUERY',
      name: 'GetDashboardMetricsQuery',
      handler: 'GetDashboardMetricsQueryHandler',
      layer: 'Aurum.Application',
      payload: {},
      result: { totalPipeline, totalWon, customers: mockCustomers.length },
      durationMs: Math.round(performance.now() - start)
    });

    return data;
  },

  async getCustomers(): Promise<Customer[]> {
    const start = performance.now();
    try {
      const res = await fetch(`${API_BASE_URL}/customers`, { signal: AbortSignal.timeout(1000) });
      if (res.ok) {
        const data = await res.json();
        emitCqrs({
          type: 'QUERY',
          name: 'GetCustomersQuery',
          handler: 'GetCustomersQueryHandler',
          layer: 'Aurum.Application',
          payload: {},
          result: `${data.length} clientes recuperados vía .NET API`,
          durationMs: Math.round(performance.now() - start)
        });
        return data;
      }
    } catch { }

    emitCqrs({
      type: 'QUERY',
      name: 'GetCustomersQuery',
      handler: 'GetCustomersQueryHandler',
      layer: 'Aurum.Application',
      payload: {},
      result: `${mockCustomers.length} clientes (Modo CQRS InMemory)`,
      durationMs: Math.round(performance.now() - start)
    });
    return [...mockCustomers];
  },

  async createCustomer(data: { fullName: string; email: string; company: string; phone?: string; tier?: CustomerTier }): Promise<string> {
    const start = performance.now();
    const newId = 'cust-' + Math.random().toString(36).substring(2, 9);
    const newCustomer: Customer = {
      id: newId,
      fullName: data.fullName,
      email: data.email,
      company: data.company,
      phone: data.phone || '',
      tier: data.tier || 1,
      createdAt: new Date().toISOString(),
      activeDealsCount: 0
    };

    try {
      const res = await fetch(`${API_BASE_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(1500)
      });
      if (res.ok) {
        const json = await res.json();
        emitCqrs({
          type: 'COMMAND',
          name: 'CreateCustomerCommand',
          handler: 'CreateCustomerCommandHandler',
          layer: 'Aurum.Application',
          payload: data,
          result: json,
          durationMs: Math.round(performance.now() - start)
        });
        return json.id || newId;
      }
    } catch { }

    mockCustomers.unshift(newCustomer);
    emitCqrs({
      type: 'COMMAND',
      name: 'CreateCustomerCommand',
      handler: 'CreateCustomerCommandHandler',
      layer: 'Aurum.Application',
      payload: { ...data, CommandId: newId },
      result: { Status: 'Created', Entity: 'Customer', Id: newId },
      durationMs: Math.round(performance.now() - start)
    });
    return newId;
  },

  async getDeals(): Promise<Deal[]> {
    const start = performance.now();
    try {
      const res = await fetch(`${API_BASE_URL}/deals`, { signal: AbortSignal.timeout(1000) });
      if (res.ok) {
        const data = await res.json();
        emitCqrs({
          type: 'QUERY',
          name: 'GetDealsQuery',
          handler: 'GetDealsQueryHandler',
          layer: 'Aurum.Application',
          payload: {},
          result: `${data.length} deals en pipeline vía .NET`,
          durationMs: Math.round(performance.now() - start)
        });
        return data;
      }
    } catch { }

    emitCqrs({
      type: 'QUERY',
      name: 'GetDealsQuery',
      handler: 'GetDealsQueryHandler',
      layer: 'Aurum.Application',
      payload: {},
      result: `${mockDeals.length} deals en pipeline (CQRS Query)`,
      durationMs: Math.round(performance.now() - start)
    });
    return [...mockDeals];
  },

  async updateDealStage(dealId: string, newStage: DealStage): Promise<boolean> {
    const start = performance.now();
    try {
      const res = await fetch(`${API_BASE_URL}/deals/${dealId}/stage`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newStage }),
        signal: AbortSignal.timeout(1500)
      });
      if (res.ok) {
        emitCqrs({
          type: 'COMMAND',
          name: 'UpdateDealStageCommand',
          handler: 'UpdateDealStageCommandHandler',
          layer: 'Aurum.Application',
          payload: { dealId, newStage, stageLabel: STAGE_LABELS[newStage] },
          result: { success: true },
          durationMs: Math.round(performance.now() - start)
        });
        return true;
      }
    } catch { }

    const deal = mockDeals.find(d => d.id === dealId);
    if (deal) {
      deal.stage = newStage;
      deal.stageName = STAGE_LABELS[newStage];
      if (newStage === 5 || newStage === 6) {
        deal.closedAt = new Date().toISOString();
      }
    }

    emitCqrs({
      type: 'COMMAND',
      name: 'UpdateDealStageCommand',
      handler: 'UpdateDealStageCommandHandler',
      layer: 'Aurum.Application',
      payload: { dealId, newStage: STAGE_LABELS[newStage] },
      result: { Mutation: 'StateUpdated', Target: 'Aurum.Domain.Entities.Deal' },
      durationMs: Math.round(performance.now() - start)
    });
    return true;
  }
};
