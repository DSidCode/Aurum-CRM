import React from 'react';
import { ShieldCheck, Terminal, Users, Kanban, Sparkles } from 'lucide-react';
import type { Tab } from '../App';
import type { DataSource } from '../services/api';

interface NavbarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  cqrsLogCount: number;
  dataSource: DataSource | null;
  onOpenNewCustomer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cqrsLogCount,
  dataSource,
  onOpenNewCustomer
}) => {
  return (
    <header className="border-b border-[#D4AF37]/20 bg-[#0B0F19]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[72px] py-2 flex flex-wrap md:flex-nowrap items-center justify-between gap-3">
        <div className="flex items-center space-x-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#8C6D1F] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20 border border-[#FFF6D1]/30">
            <Sparkles className="w-6 h-6 text-[#080B11] stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl tracking-tight text-white font-['Space_Grotesk']">AURUM</span>
              <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                CRM Enterprise
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <p className="text-[11px] text-slate-400 font-medium">.NET 10 Clean Architecture · React 19 CQRS Suite</p>
              {dataSource === 'api' && (
                <span
                  title="Los datos vienen de la API .NET (Clean Architecture + MediatR)"
                  className="flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  API .NET conectada
                </span>
              )}
              {dataSource === 'demo' && (
                <span
                  title="No hay servidor conectado: los Commands y Queries se simulan en el navegador con datos de ejemplo"
                  className="flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Modo demo · sin servidor
                </span>
              )}
            </div>
          </div>
        </div>

        <nav className="flex items-center gap-1 p-1 rounded-xl bg-[#0F1626]/90 border border-white/10 shadow-inner overflow-x-auto custom-scrollbar max-w-full">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all cursor-pointer ${
              activeTab === 'pipeline'
                ? 'bg-[#D4AF37] text-slate-950 shadow-md shadow-[#D4AF37]/25 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Kanban className="w-4 h-4 flex-shrink-0" />
            <span>Pipeline<span className="hidden sm:inline"> Comercial</span></span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all cursor-pointer ${
              activeTab === 'customers'
                ? 'bg-[#D4AF37] text-slate-950 shadow-md shadow-[#D4AF37]/25 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4 flex-shrink-0" />
            <span><span className="hidden sm:inline">Directorio </span>Clientes</span>
          </button>

          <button
            onClick={() => setActiveTab('inspector')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all cursor-pointer relative ${
              activeTab === 'inspector'
                ? 'bg-[#38BDF8] text-slate-950 shadow-md shadow-[#38BDF8]/25 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Terminal className="w-4 h-4 flex-shrink-0" />
            <span>Auditor<span className="hidden sm:inline"> CQRS</span></span>
            {cqrsLogCount > 0 && (
              <span className={`ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full font-mono ${
                activeTab === 'inspector'
                  ? 'bg-slate-950 text-sky-300'
                  : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
              }`}>
                {cqrsLogCount}
              </span>
            )}
          </button>
        </nav>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenNewCustomer}
            className="gold-button text-xs flex items-center space-x-2 shadow-lg"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>+ Nuevo Cliente VIP</span>
          </button>
        </div>
      </div>
    </header>
  );
};
