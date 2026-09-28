import type { Customer, Deal, DashboardMetrics, CqrsEventLog, DealStage, CustomerTier } from '../types/crm';

// URL de la API .NET. Si no se define (p. ej. en la demo pública), la app
// funciona entera en el navegador con datos de ejemplo ("modo demo").
const API_BASE_URL: string | undefined = import.meta.env.VITE_API_URL || undefined;

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

export type DataSource = 'api' | 'demo';

type EventCallback = (event: CqrsEventLog) => void;
const listeners: EventCallback[] = [];

export function subscribeToCqrsLogs(cb: EventCallback) {
  listeners.push(cb);
  return () => {
    const idx = listeners.indexOf(cb);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

type SourceCallback = (source: DataSource) => void;
const sourceListeners: SourceCallback[] = [];

export function subscribeToDataSource(cb: SourceCallback) {
  sourceListeners.push(cb);
  return () => {
    const idx = sourceListeners.indexOf(cb);
    if (idx !== -1) sourceListeners.splice(idx, 1);
  };
}

function emitCqrs(event: Omit<CqrsEventLog, 'id' | 'timestamp' | 'layer'>) {
  const fullEvent: CqrsEventLog = {
    ...event,
    layer: event.source === 'api' ? 'Aurum.Application (.NET)' : 'Navegador · simulación demo',
    id: 'evt-' + Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toLocaleTimeString()
  };
  sourceListeners.forEach(l => l(event.source));
  listeners.forEach(l => l(fullEvent));
}

// Error de negocio devuelto por la API (ProblemDetails, RFC 7807).
export class ApiError extends Error {}

const OFFLINE = Symbol('offline');

// Devuelve OFFLINE solo si no hay API configurada o no responde; si la API
// responde con un error, lo propaga para no "inventar" un éxito en el cliente.
async function request<T>(path: string, init?: RequestInit, timeoutMs = 1500): Promise<T | typeof OFFLINE> {
  if (!API_BASE_URL) return OFFLINE;

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
      signal: AbortSignal.timeout(timeoutMs)
    });
  } catch {
    return OFFLINE;
  }

  if (!res.ok) {
    const problem = await res.json().catch(() => null);
    throw new ApiError(problem?.detail ?? problem?.message ?? problem?.title ?? `Error ${res.status} de la API`);
  }
  return res.json() as Promise<T>;
}

const elapsed = (start: number) => Math.round(performance.now() - start);

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
    const apiData = await request<DashboardMetrics>('/dashboard/metrics');
    if (apiData !== OFFLINE) {
      emitCqrs({
        type: 'QUERY',
        source: 'api',
        name: 'GetDashboardMetricsQuery',
        handler: 'GetDashboardMetricsQueryHandler',
        payload: {},
        result: apiData,
        durationMs: elapsed(start)
      });
      return apiData;
    }

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
      source: 'demo',
      name: 'GetDashboardMetricsQuery',
      handler: 'GetDashboardMetricsQueryHandler',
      payload: {},
      result: { totalPipeline, totalWon, customers: mockCustomers.length },
      durationMs: elapsed(start)
    });
    return data;
  },

  async getCustomers(): Promise<Customer[]> {
    const start = performance.now();
    const apiData = await request<Customer[]>('/customers');
    const source: DataSource = apiData !== OFFLINE ? 'api' : 'demo';
    const customers = apiData !== OFFLINE ? apiData : [...mockCustomers];

    emitCqrs({
      type: 'QUERY',
      source,
      name: 'GetCustomersQuery',
      handler: 'GetCustomersQueryHandler',
      payload: {},
      result: `${customers.length} clientes recuperados`,
      durationMs: elapsed(start)
    });
    return customers;
  },

  async createCustomer(data: { fullName: string; email: string; company: string; phone?: string; tier?: CustomerTier }): Promise<string> {
    const start = performance.now();
    const apiData = await request<{ id: string }>('/customers', { method: 'POST', body: JSON.stringify(data) });
    if (apiData !== OFFLINE) {
      emitCqrs({
        type: 'COMMAND',
        source: 'api',
        name: 'CreateCustomerCommand',
        handler: 'CreateCustomerCommandHandler',
        payload: data,
        result: apiData,
        durationMs: elapsed(start)
      });
      return apiData.id;
    }

    // Mismas reglas que la entidad Customer del dominio .NET
    if (!data.fullName.trim()) throw new ApiError('El nombre del cliente no puede estar vacío.');
    if (!data.email.includes('@')) throw new ApiError('Formato de email inválido.');

    const newId = 'cust-' + Math.random().toString(36).substring(2, 9);
    mockCustomers.unshift({
      id: newId,
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      company: data.company.trim(),
      phone: data.phone?.trim() || '',
      tier: data.tier || 1,
      createdAt: new Date().toISOString(),
      activeDealsCount: 0
    });
    emitCqrs({
      type: 'COMMAND',
      source: 'demo',
      name: 'CreateCustomerCommand',
      handler: 'CreateCustomerCommandHandler',
      payload: data,
      result: { id: newId },
      durationMs: elapsed(start)
    });
    return newId;
  },

  async getDeals(): Promise<Deal[]> {
    const start = performance.now();
    const apiData = await request<Deal[]>('/deals');
    const source: DataSource = apiData !== OFFLINE ? 'api' : 'demo';
    const deals = apiData !== OFFLINE ? apiData : mockDeals.map(d => ({ ...d }));

    emitCqrs({
      type: 'QUERY',
      source,
      name: 'GetDealsQuery',
      handler: 'GetDealsQueryHandler',
      payload: {},
      result: `${deals.length} oportunidades en el pipeline`,
      durationMs: elapsed(start)
    });
    return deals;
  },

  async updateDealStage(dealId: string, newStage: DealStage): Promise<void> {
    const start = performance.now();
    const payload = { dealId, newStage, stageLabel: STAGE_LABELS[newStage] };
    const apiData = await request<{ message: string }>(`/deals/${dealId}/stage`, {
      method: 'PUT',
      body: JSON.stringify({ newStage })
    });
    if (apiData !== OFFLINE) {
      emitCqrs({
        type: 'COMMAND',
        source: 'api',
        name: 'UpdateDealStageCommand',
        handler: 'UpdateDealStageCommandHandler',
        payload,
        result: apiData,
        durationMs: elapsed(start)
      });
      return;
    }

    // Mismas reglas que Deal.AdvanceStage del dominio .NET
    const deal = mockDeals.find(d => d.id === dealId);
    if (!deal) throw new ApiError('Oportunidad no encontrada.');
    if (deal.stage === 5 || deal.stage === 6) throw new ApiError('La oportunidad ya está cerrada y no puede cambiar de fase.');
    if (newStage !== 6 && newStage <= deal.stage) throw new ApiError('No se puede retroceder de fase.');

    deal.stage = newStage;
    deal.stageName = STAGE_LABELS[newStage];
    if (newStage === 5 || newStage === 6) {
      deal.closedAt = new Date().toISOString();
    }

    emitCqrs({
      type: 'COMMAND',
      source: 'demo',
      name: 'UpdateDealStageCommand',
      handler: 'UpdateDealStageCommandHandler',
      payload,
      result: { stage: deal.stageName },
      durationMs: elapsed(start)
    });
  }
};
