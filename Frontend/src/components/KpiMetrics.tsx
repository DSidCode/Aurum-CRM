import React from 'react';
import type { DashboardMetrics } from '../types/crm';
import { TrendingUp, Award, Users, Target, CircleDollarSign } from 'lucide-react';

interface KpiMetricsProps {
  metrics: DashboardMetrics | null;
}

const formatNumber = (val: number): string => {
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const KpiMetrics: React.FC<KpiMetricsProps> = ({ metrics }) => {
  if (!metrics) return null;

  const cards = [
    {
      label: 'Pipeline Activo (Total)',
      currency: '€',
      value: formatNumber(metrics.totalPipelineValue),
      sub: `${metrics.activeDealsCount} oportunidades en curso`,
      icon: CircleDollarSign,
      iconBg: 'from-amber-400 to-amber-600',
      border: 'border-amber-500/25 hover:border-amber-500/60',
      glow: 'bg-amber-500/5 group-hover:bg-amber-500/10'
    },
    {
      label: 'Ingresos Cerrados (Won)',
      currency: '€',
      value: formatNumber(metrics.totalWonValue),
      sub: `${metrics.wonDealsCount} deals cerrados con éxito`,
      icon: Award,
      iconBg: 'from-emerald-400 to-emerald-600',
      border: 'border-emerald-500/25 hover:border-emerald-500/60',
      glow: 'bg-emerald-500/5 group-hover:bg-emerald-500/10'
    },
    {
      label: 'Cuentas Empresariales',
      currency: '',
      value: metrics.totalCustomersCount.toString(),
      sub: 'Clientes VIP & Corporativos',
      icon: Users,
      iconBg: 'from-sky-400 to-blue-600',
      border: 'border-sky-500/25 hover:border-sky-500/60',
      glow: 'bg-sky-500/5 group-hover:bg-sky-500/10'
    },
    {
      label: 'Tasa de Conversión',
      currency: '',
      value: `${metrics.conversionRatePercentage}%`,
      sub: 'Rendimiento de Pipeline',
      icon: Target,
      iconBg: 'from-violet-400 to-purple-600',
      border: 'border-violet-500/25 hover:border-violet-500/60',
      glow: 'bg-violet-500/5 group-hover:bg-violet-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className={`glass-panel p-5 border ${c.border} transition-all duration-300 relative overflow-hidden group shadow-lg rounded-2xl bg-[#0F1626]/80 backdrop-blur-md`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{c.label}</p>
                <div className="flex items-baseline space-x-1 mt-1.5">
                  {c.currency && (
                    <span className="text-base font-bold text-slate-300 font-['Space_Grotesk']">{c.currency}</span>
                  )}
                  <span className="text-2xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
                    {c.value}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 flex items-center space-x-1 font-medium">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400 inline mr-1 flex-shrink-0" />
                  <span>{c.sub}</span>
                </p>
              </div>
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.iconBg} flex items-center justify-center text-slate-950 shadow-md group-hover:scale-105 transition-transform duration-300 flex-shrink-0`}>
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>
            </div>
            <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-xl transition-colors pointer-events-none ${c.glow}`} />
          </div>
        );
      })}
    </div>
  );
};
