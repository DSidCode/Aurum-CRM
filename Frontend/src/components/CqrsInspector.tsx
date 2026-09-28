import React from 'react';
import type { CqrsEventLog } from '../types/crm';
import { Terminal, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface CqrsInspectorProps {
  logs: CqrsEventLog[];
  onClear: () => void;
}

export const CqrsInspector: React.FC<CqrsInspectorProps> = ({ logs, onClear }) => {
  return (
    <div className="glass-panel p-6 border border-[#38BDF8]/30">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/20 border border-[#38BDF8]/40 flex items-center justify-center text-[#38BDF8]">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-['Space_Grotesk'] flex items-center space-x-2">
              <span>Auditor en Vivo de CQRS & Clean Architecture</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30">
                {logs.length} Eventos Capturados
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Inspecciona en tiempo real los Commands (Escritura/Mutación) y Queries (Lectura) que procesa MediatR.
              Los marcados como <em>Simulado</em> se ejecutan en el navegador porque no hay servidor conectado.
            </p>
          </div>
        </div>
        <button
          onClick={onClear}
          className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          Limpiar Terminal
        </button>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
        {logs.map(log => {
          const isCommand = log.type === 'COMMAND';
          return (
            <div
              key={log.id}
              className={`p-4 rounded-xl border transition-all ${
                isCommand
                  ? 'bg-amber-500/[0.04] border-amber-500/30'
                  : 'bg-sky-500/[0.04] border-sky-500/30'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border flex items-center space-x-1 ${
                      isCommand
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                    }`}
                  >
                    {isCommand ? (
                      <>
                        <ArrowUpRight className="w-3 h-3 inline mr-0.5" />
                        <span>COMMAND (Write)</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownLeft className="w-3 h-3 inline mr-0.5" />
                        <span>QUERY (Read)</span>
                      </>
                    )}
                  </span>
                  <span className="font-mono font-bold text-white text-xs">{log.name}</span>
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      log.source === 'api'
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                        : 'bg-white/5 text-slate-400 border border-white/10'
                    }`}
                  >
                    {log.source === 'api' ? 'API .NET' : 'Simulado'}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">{log.timestamp} · {log.durationMs}ms</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t border-white/5 text-[11px] font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">MediatR Handler Responsable:</span>
                  <span className="text-slate-200">{log.handler}</span>
                  <div className="text-[10px] text-slate-500 mt-0.5">Capa: {log.layer}</div>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Resultado / Estado:</span>
                  <pre className="text-[10px] text-emerald-400 overflow-x-auto bg-black/40 p-1.5 rounded border border-white/5">
                    {typeof log.result === 'string' ? log.result : JSON.stringify(log.result)}
                  </pre>
                </div>
              </div>
            </div>
          );
        })}

        {logs.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <Terminal className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-xs">Sin eventos registrados aún. Realiza una acción en el Pipeline o en Clientes.</p>
          </div>
        )}
      </div>
    </div>
  );
};
