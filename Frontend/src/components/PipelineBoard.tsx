import React, { useOptimistic, useState, useTransition } from 'react';
import type { Deal, DealStage } from '../types/crm';
import { CrmApi, STAGE_LABELS } from '../services/api';
import { AlertTriangle, ArrowRight, Building, CheckCircle2 } from 'lucide-react';

interface PipelineBoardProps {
  deals: Deal[];
  onDealsUpdated: () => void;
}

const STAGES: { id: DealStage; title: string; color: string }[] = [
  { id: 1, title: 'Leads / Prospección', color: 'border-slate-500 text-slate-300 bg-slate-500/10' },
  { id: 2, title: 'Primer Contacto', color: 'border-sky-500 text-sky-400 bg-sky-500/10' },
  { id: 3, title: 'Propuesta Enviada', color: 'border-amber-500 text-amber-400 bg-amber-500/10' },
  { id: 4, title: 'En Negociación', color: 'border-indigo-500 text-indigo-400 bg-indigo-500/10' },
  { id: 5, title: 'Cerrado Ganado (Won)', color: 'border-emerald-500 text-emerald-400 bg-emerald-500/10' }
];

export const PipelineBoard: React.FC<PipelineBoardProps> = ({ deals, onDealsUpdated }) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [optimisticDeals, setOptimisticDeals] = useOptimistic(
    deals,
    (state, update: { dealId: string; nextStage: DealStage }) =>
      state.map(d => (d.id === update.dealId ? { ...d, stage: update.nextStage, stageName: STAGE_LABELS[update.nextStage] } : d))
  );

  const handleAdvance = (dealId: string, currentStage: DealStage) => {
    if (currentStage >= 5) return;
    const nextStage = (currentStage + 1) as DealStage;

    setError(null);
    startTransition(async () => {
      setOptimisticDeals({ dealId, nextStage });
      try {
        await CrmApi.updateDealStage(dealId, nextStage);
      } catch (err) {
        // Al terminar la transición sin cambios, useOptimistic revierte la tarjeta sola
        setError(err instanceof Error ? err.message : 'No se pudo actualizar la oportunidad.');
      }
      onDealsUpdated();
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2 font-['Space_Grotesk']">
            <span>Pipeline de Oportunidades Comerciales</span>
            <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">
              React 19 Optimistic UI
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Mueve las oportunidades entre fases. Cada avance dispara un <code>UpdateDealStageCommand</code> de CQRS.
          </p>
        </div>
      </div>

      {error && (
        <div role="alert" className="mb-4 flex items-center gap-2 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-xl px-3 py-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {STAGES.map(stage => {
          const stageDeals = optimisticDeals.filter(d => d.stage === stage.id);
          const totalVal = stageDeals.reduce((sum, d) => sum + d.valueAmount, 0);
          const formattedTotal = totalVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

          return (
            <div key={stage.id} className="glass-panel-subtle p-3.5 flex flex-col h-full min-h-[400px] rounded-2xl bg-[#0B101D]/70 border border-white/5">
              <div className="pb-3 mb-3 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${stage.color}`}>
                    {stage.title}
                  </span>
                  <span className="text-xs font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded-full border border-white/5">
                    {stageDeals.length}
                  </span>
                </div>
                <div className="flex items-baseline space-x-1 mt-2">
                  <span className="text-xs font-bold text-slate-400 font-['Space_Grotesk']">€</span>
                  <span className="text-sm font-bold text-slate-100 font-['Space_Grotesk']">
                    {formattedTotal}
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-1">
                {stageDeals.map(deal => {
                  const dealFormatted = deal.valueAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                  return (
                    <div
                      key={deal.id}
                      className="glass-panel p-3.5 border border-white/10 hover:border-[#D4AF37]/50 transition-all rounded-xl shadow-md group relative bg-[#131A2B]/90"
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-bold text-white leading-snug group-hover:text-amber-200 transition-colors">
                          {deal.title}
                        </h4>
                      </div>

                      <p className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1">
                        <Building className="w-3 h-3 text-slate-500 mr-1 flex-shrink-0" />
                        <span className="truncate">{deal.company || deal.customerName}</span>
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-baseline space-x-0.5">
                          <span className="text-xs font-bold text-slate-400 font-['Space_Grotesk']">€</span>
                          <span className="text-sm font-extrabold text-amber-300 font-['Space_Grotesk']">
                            {dealFormatted}
                          </span>
                        </div>

                        {stage.id < 5 ? (
                          <button
                            onClick={() => handleAdvance(deal.id, deal.stage)}
                            disabled={isPending}
                            title="Avanzar a siguiente fase (CQRS Command)"
                            className="flex items-center space-x-1 text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#D4AF37] text-slate-300 hover:text-slate-950 font-bold transition-all border border-white/10 hover:border-[#D4AF37] cursor-pointer"
                          >
                            <span>Avanzar</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="flex items-center space-x-1 text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Cerrado</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {stageDeals.length === 0 && (
                  <div className="h-28 flex flex-col items-center justify-center border border-dashed border-slate-700/40 rounded-xl text-center p-3 bg-slate-900/20">
                    <span className="text-[11px] font-medium text-slate-500">Sin acuerdos en curso</span>
                    <span className="text-[9px] text-slate-600 mt-0.5">Avanza desde la etapa anterior</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
