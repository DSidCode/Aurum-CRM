import React from 'react';
import { BookOpen, MessageSquare } from 'lucide-react';

export const DefenseGuideView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 border border-[#D4AF37]/30 bg-gradient-to-br from-[#0F1420] to-[#131A2B]">
        <div className="flex items-center space-x-3 mb-2">
          <BookOpen className="w-6 h-6 text-[#D4AF37]" />
          <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
            Guía de Defensa Técnica para Entrevistas: Aurum-CRM
          </h2>
        </div>
        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          Este manual te explica exactamente cómo justificar cada decisión arquitectónica de este proyecto ante un Tech Lead o Reclutador Senior.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 border border-sky-500/20">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold mb-3">1</div>
          <h3 className="text-sm font-bold text-white mb-1">Clean Architecture</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Separación estricta en 4 capas: <code>Domain</code> (entidades puras sin dependencias externas), <code>Application</code> (casos de uso), <code>Infrastructure</code> (EF Core, APIs) y <code>Api</code>. La regla de dependencia apunta hacia adentro.
          </p>
        </div>

        <div className="glass-panel p-5 border border-amber-500/20">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold mb-3">2</div>
          <h3 className="text-sm font-bold text-white mb-1">Patrón CQRS + MediatR</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Separamos intenciones de mutación de estado (<code>Commands</code>) de consultas de solo lectura (<code>Queries</code>). Desacopla controladores de la lógica, optimiza escalabilidad y simplifica tests unitarios.
          </p>
        </div>

        <div className="glass-panel p-5 border border-emerald-500/20">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mb-3">3</div>
          <h3 className="text-sm font-bold text-white mb-1">React 19 Modern Features</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Uso de <code>useOptimistic</code> en el Pipeline para responder en 0ms antes del round-trip de red, y <code>useActionState</code> con <code>Actions</code> para formularios con validación sin estados manuales pesados.
          </p>
        </div>
      </div>

      <div className="glass-panel p-6 space-y-4">
        <h3 className="text-base font-bold text-white font-['Space_Grotesk'] flex items-center space-x-2">
          <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
          <span>Preguntas Trampa Clave y Respuestas Senior</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-xl bg-black/40 border border-white/5">
            <p className="font-bold text-[#D4AF37] mb-1">¿Por qué usar CQRS en un CRM y no un CRUD tradicional?</p>
            <p className="text-slate-300 leading-relaxed">
              <strong>Respuesta:</strong> En un CRM empresarial, el 80% del tráfico son lecturas complejas (dashboards, filtros de pipeline, listados) y el 20% escrituras críticas (cerrar acuerdos, dar de alta clientes). Con CQRS optimizamos las Queries con DTOs planos y rápidos, mientras que los Commands ejecutan la validación rigurosa de reglas de negocio en el Dominio sin sobrecargar la capa de lectura.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5">
            <p className="font-bold text-[#D4AF37] mb-1">¿Cómo aseguraste que la capa de Dominio no tenga acoplamiento?</p>
            <p className="text-slate-300 leading-relaxed">
              <strong>Respuesta:</strong> <code>Aurum.Domain</code> es una biblioteca de clases en C# pura que no tiene ninguna referencia a paquetes NuGet externos ni a Entity Framework ni a ASP.NET. Las entidades tienen encapsulación estricta con propiedades de tipo <code>private set</code> y la modificación del estado solo se realiza a través de métodos de negocio explícitos (ej. <code>AdvanceStage</code> o <code>UpdateContactInfo</code>).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5">
            <p className="font-bold text-[#D4AF37] mb-1">¿Cómo integraste la Inteligencia Artificial en el desarrollo?</p>
            <p className="text-slate-300 leading-relaxed">
              <strong>Respuesta:</strong> Como multiplicador de velocidad para la generación de boilerplate repetitivo (esqueletos de comandos, DTOs y maquetación inicial). Mi rol como desarrollador fue el de arquitecto y auditor: diseñar las fronteras del dominio, auditar que las invariantes de negocio se respeten y verificar la robustez técnica.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
