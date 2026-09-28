import { useState, useEffect } from 'react';
import type { Customer, Deal, DashboardMetrics, CqrsEventLog } from './types/crm';
import { CrmApi, subscribeToCqrsLogs } from './services/api';
import { Navbar } from './components/Navbar';
import { KpiMetrics } from './components/KpiMetrics';
import { PipelineBoard } from './components/PipelineBoard';
import { CustomersList } from './components/CustomersList';
import { CreateCustomerModal } from './components/CreateCustomerModal';
import { CqrsInspector } from './components/CqrsInspector';
import { DefenseGuideView } from './components/DefenseGuideView';

export function App() {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'customers' | 'inspector' | 'guide'>('pipeline');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [cqrsLogs, setCqrsLogs] = useState<CqrsEventLog[]>([]);
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState<boolean>(false);

  useEffect(() => {
    const unsub = subscribeToCqrsLogs((event) => {
      setCqrsLogs(prev => [event, ...prev.slice(0, 49)]);
    });
    return unsub;
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

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#080B11] text-slate-100 selection:bg-[#D4AF37]/30 selection:text-[#D4AF37]">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cqrsLogCount={cqrsLogs.length}
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

        {activeTab === 'guide' && (
          <DefenseGuideView />
        )}
      </main>

      <CreateCustomerModal
        isOpen={isNewCustomerOpen}
        onClose={() => setIsNewCustomerOpen(false)}
        onCreated={refreshData}
      />

      <footer className="border-t border-white/5 py-6 text-center text-xs text-slate-500 bg-[#080B11]">
        <p>
          <strong className="text-slate-300 font-bold">Aurum-CRM Suite</strong> · Arquitectura Limpia en .NET 10 + React 19 CQRS.
        </p>
        <p className="mt-1 text-[11px] text-slate-600">
          Diseñado para demostración técnica corporativa y entrevistas de alto impacto por Daniel García.
        </p>
      </footer>
    </div>
  );
}

export default App;
