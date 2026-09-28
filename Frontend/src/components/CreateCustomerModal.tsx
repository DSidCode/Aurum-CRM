import React, { useActionState } from 'react';
import type { CustomerTier } from '../types/crm';
import { CrmApi } from '../services/api';
import { X, Sparkles, User, Mail, Building, Phone, Star } from 'lucide-react';

interface CreateCustomerModalProps {
  onClose: () => void;
  onCreated: () => void;
}

type FormState = { error?: string } | null;

export const CreateCustomerModal: React.FC<CreateCustomerModalProps> = ({ onClose, onCreated }) => {
  const [state, formAction, isPending] = useActionState(
    async (_prevState: FormState, formData: FormData): Promise<FormState> => {
      const fullName = formData.get('fullName') as string;
      const email = formData.get('email') as string;
      const company = formData.get('company') as string;
      const phone = formData.get('phone') as string;
      const tier = parseInt(formData.get('tier') as string, 10) as CustomerTier;

      try {
        await CrmApi.createCustomer({ fullName, email, company, phone, tier });
        onCreated();
        onClose();
        return null;
      } catch (err) {
        return { error: err instanceof Error ? err.message : 'Error al ejecutar CreateCustomerCommand' };
      }
    },
    null
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md p-6 border border-[#D4AF37]/40 shadow-2xl relative bg-[#0F1420]">
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">Alta de Cliente VIP</h3>
            <p className="text-xs text-slate-400">Dispara: <code>CreateCustomerCommand</code> (CQRS)</p>
          </div>
        </div>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Completo</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                name="fullName"
                required
                placeholder="Ej: Baronesa Béatrice de Rothschild"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Corporativo</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                name="email"
                type="email"
                required
                placeholder="beatrice@rothschild-holdings.ch"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Compañía / Organización</label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                name="company"
                required
                placeholder="Rothschild Private Wealth"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono (Opcional)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                name="phone"
                placeholder="+41 22 819 00 00"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Nivel de Cliente (Tier)</label>
            <div className="relative">
              <Star className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <select
                name="tier"
                defaultValue="3"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
              >
                <option value="3">Tier 3: VIP Concierge</option>
                <option value="2">Tier 2: Premium Business</option>
                <option value="1">Tier 1: Standard</option>
              </select>
            </div>
          </div>

          {state?.error && (
            <p className="text-xs text-rose-400 bg-rose-500/10 p-2 rounded border border-rose-500/20">
              {state.error}
            </p>
          )}

          <div className="pt-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="gold-button text-xs flex items-center space-x-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isPending ? 'Ejecutando Command...' : 'Crear en Dominio'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
