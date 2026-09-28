# Registro de Cambios y Tareas Pendientes (Changelog / Agenda)

## Estado actual (28-09-2026) · Hilo cerrado
Proyecto terminado como pieza de portafolio.
- **Repositorio público:** https://github.com/DSidCode/Aurum-CRM (rama `main`).
- **Portafolio:** ficha 09 en danisid.com con capturas y botón "Ver Código en GitHub". **Sin demo en vivo** (decisión: quien quiera verlo, va al repositorio).
- **Material privado de estudio** (excluido de Git en `.gitignore`): `GUIA_MAESTRA_ARQUITECTURA.md`, `DEFENSA_ENTREVISTA_AURUM.md`, `AURUM_CRM_GUIA_VISUAL_MOVIL.pdf`.

## 28-09-2026 · Preparación para portafolio
- **Git/GitHub:** repositorio inicializado y publicado; `.gitignore` con `bin/`, `obj/`, `node_modules/`, `dist/` y el material privado.
- **Dominio:** `Deal.AdvanceStage` valida transiciones (sin retrocesos ni cambios tras cerrar); `DomainException`; `Money` inmutable.
- **API:** errores RFC 7807 (ProblemDetails) → 400 regla de negocio / 404 no encontrado. Swagger siempre visible (API de demostración).
- **Tests:** 22 tests xUnit (`Aurum.Domain.Tests`, `Aurum.Application.Tests`) → `dotnet test Backend/AurumCRM.slnx`.
- **Frontend:** URL de API configurable (`VITE_API_URL`, en desarrollo vía `.env.development`), indicador honesto "Modo demo · sin servidor" / "API .NET conectada", eventos del Auditor marcados como *API .NET* o *Simulado*, errores de la API visibles (ya no se finge éxito), fix de rules-of-hooks en el modal, pestaña "Guía de Defensa" eliminada, pie con enlaces a danisid.com y GitHub, metadatos para compartir, pestañas compactas en móvil.
- **Limpieza:** `Class1.cs`, `App.css`, assets y README de plantilla eliminados.
- **Capturas:** `docs/screenshots/` (6 imágenes, 1920×1080 + móvil), mostradas en el README. Copias en el portafolio: `proyecto_danisid.com/public/screenshots/aurum/`.

## Pendientes (opcionales, si se retoma)
- [ ] **Guía de entrevista, pregunta 4:** menciona FluentValidation y Pipeline Behaviors de MediatR, que **no existen** en el código. Implementarlos o ajustar la respuesta.
- [ ] **Portafolio:** el icono de GitHub del pie de danisid.com apunta a `github.com/DaniSidCode`, pero Aurum está en `github.com/DSidCode`. Confirmar cuál es la cuenta correcta.
- [ ] **Portafolio:** publicar en danisid.com los cambios de la ficha 09 (de momento solo están en local).

## Cómo arrancarlo en local
```bash
cd Backend && dotnet run --project src/Aurum.Api     # API + Swagger en http://localhost:5000
cd Frontend && npm run dev                           # App en http://localhost:5173 (o el siguiente puerto libre)
```

## Historial
- **25-09-2026:** estructura base (Frontend React + Vite, Backend .NET), README y guías de estudio.
- **28-09-2026:** Git + GitHub, preparación para portafolio (ver arriba).
