import { useState, useEffect } from 'react';
import type { Customer, Deal, DashboardMetrics, CqrsEventLog } from './types/crm';
import { CrmApi, subscribeToCqrsLogs, subscribeToDataSource } from './services/api';
import type { DataSource } from './services/api';
import { Navbar } from './components/Navbar';
import { KpiMetrics } from './components/KpiMetrics';
import { PipelineBoard } from './components/PipelineBoard';
import { CustomersList } from './components/CustomersList';
import { CreateCustomerModal } from './components/CreateCustomerModal';
import { CqrsInspector } from './components/CqrsInspector';

export type Tab = 'pipeline' | 'customers' | 'inspector';

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>('pipeline');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [cqrsLogs, setCqrsLogs] = useState<CqrsEventLog[]>([]);
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<DataSource | null>(null);

  useEffect(() => {
    const unsubLogs = subscribeToCqrsLogs((event) => {
      setCqrsLogs(prev => [event, ...prev.slice(0, 49)]);
    });
    const unsubSource = subscribeToDataSource(setDataSource);
    return () => {
      unsubLogs();
      unsubSource();
    };
  }, []);

  const refreshData = async () => {
    const [m, d, c] = await Promise.all([
      CrmApi.getDashboardMetrics(),
      CrmApi.getDeals(),
      CrmApi.getCustomers()
    ]);
    setMetrics(m);
    setDeals(d);
    setCustomers(c);
  };

  // Carga inicial desde la API (sistema externo): el setState ocurre tras el fetch, no en el efecto
  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    refreshData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#080B11] text-slate-100 selection:bg-[#D4AF37]/30 selection:text-[#D4AF37]">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cqrsLogCount={cqrsLogs.length}
        dataSource={dataSource}
        onOpenNewCustomer={() => setIsNewCustomerOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14">
        <KpiMetrics metrics={metrics} />

        {activeTab === 'pipeline' && (
          <PipelineBoard deals={deals} onDealsUpdated={refreshData} />
        )}

        {activeTab === 'customers' && (
          <CustomersList
            customers={customers}
            onOpenNewCustomer={() => setIsNewCustomerOpen(true)}
          />
        )}

        {activeTab === 'inspector' && (
          <CqrsInspector logs={cqrsLogs} onClear={() => setCqrsLogs([])} />
        )}
      </main>

      {isNewCustomerOpen && (
        <CreateCustomerModal
          onClose={() => setIsNewCustomerOpen(false)}
          onCreated={refreshData}
        />
      )}

      <footer className="border-t border-white/5 py-6 text-center text-xs text-slate-500 bg-[#080B11]">
        <p>
          <strong className="text-slate-300 font-bold">Aurum-CRM Suite</strong> · Arquitectura Limpia en .NET 10 + React 19 CQRS.
        </p>
        <p className="mt-1 text-[11px] text-slate-600">
          Proyecto de portafolio de{' '}
          <a href="https://www.danisid.com" className="text-slate-400 hover:text-[#D4AF37] transition-colors">Daniel García</a>
          {' · '}
          <a href="https://github.com/DSidCode/Aurum-CRM" className="text-slate-400 hover:text-[#D4AF37] transition-colors">Código en GitHub</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
