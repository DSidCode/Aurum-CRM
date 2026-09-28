import React from 'react';
import type { Customer } from '../types/crm';
import { Mail, Phone, Building, Star } from 'lucide-react';

interface CustomersListProps {
  customers: Customer[];
  onOpenNewCustomer: () => void;
}

export const CustomersList: React.FC<CustomersListProps> = ({ customers, onOpenNewCustomer }) => {
  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white font-['Space_Grotesk'] flex items-center space-x-2">
            <span>Directorio de Clientes VIP y Corporativos</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
              {customers.length} Registros
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Entidades de dominio ricas con encapsulación, invariantes y reglas de negocio.
          </p>
        </div>
        <button onClick={onOpenNewCustomer} className="gold-button text-xs">
          + Añadir Cliente
        </button>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 font-semibold tracking-wider uppercase text-[10px]">
              <th className="pb-3 pl-2">Cliente</th>
              <th className="pb-3">Empresa / Organización</th>
              <th className="pb-3">Nivel (Tier)</th>
              <th className="pb-3">Contacto</th>
              <th className="pb-3">Oportunidades</th>
              <th className="pb-3">Fecha Alta</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {customers.map(c => {
              const tierConfig = {
                3: { label: 'VIP Concierge', color: 'bg-gradient-to-r from-[#D4AF37]/20 to-[#AA820A]/20 text-[#D4AF37] border-[#D4AF37]/40' },
                2: { label: 'Premium Business', color: 'bg-sky-500/15 text-sky-400 border-sky-500/30' },
                1: { label: 'Standard', color: 'bg-slate-500/15 text-slate-400 border-slate-500/30' }
              }[c.tier] || { label: 'Standard', color: 'bg-slate-500/15 text-slate-400 border-slate-500/30' };

              return (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 pl-2 font-medium text-white">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37]/30 to-amber-700/30 border border-[#D4AF37]/30 flex items-center justify-center font-bold text-[#D4AF37] text-xs">
                        {c.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">{c.fullName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">ID: {c.id.substring(0, 10)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 font-semibold text-slate-200">
                    <div className="flex items-center space-x-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-500" />
                      <span>{c.company}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${tierConfig.color}`}>
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <span>{tierConfig.label}</span>
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="space-y-0.5 text-[11px]">
                      <div className="flex items-center space-x-1 text-slate-300">
                        <Mail className="w-3 h-3 text-slate-500" />
                        <span>{c.email}</span>
                      </div>
                      {c.phone && (
                        <div className="flex items-center space-x-1 text-slate-400 text-[10px]">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>{c.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 font-mono font-bold text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-black/40 border border-white/5">
                      {c.activeDealsCount} activas
                    </span>
                  </td>
                  <td className="py-4 text-slate-400 text-[11px]">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
