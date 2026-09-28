# Registro de Cambios y Tareas Pendientes (Changelog / Agenda)

## Estado Actual (25-09-2026)
- Estructura base del proyecto inicializada.
- Carpetas `Frontend/` (React + Vite) y `Backend/` preparadas.
- Documentación principal generada: `README.md`, `GUIA_MAESTRA_ARQUITECTURA.md`, y `DEFENSA_ENTREVISTA_AURUM.md`.

## 28-09-2026 · Preparación para portafolio
- Dominio: `Deal.AdvanceStage` valida transiciones (sin retrocesos ni cambios tras cerrar); `DomainException`; `Money` inmutable.
- API: errores RFC 7807 (ProblemDetails) → 400 regla de negocio / 404 no encontrado.
- Tests: 22 tests xUnit (`Aurum.Domain.Tests`, `Aurum.Application.Tests`).
- Frontend: URL de API configurable (`VITE_API_URL`), indicador "Modo demo" honesto, errores de la API visibles, fix de hooks en el modal, pestaña de guía de entrevista eliminada, metadatos para compartir, pestañas compactas en móvil.

## Próximos pasos
- [ ] Publicar demo en Netlify (`aurum.danisid.com`).
- [ ] Capturas finales y tarjeta del proyecto en danisid.com.

## Tareas Agendadas (Próximos Pasos)
- [x] **Control de Versiones:** Inicializar el repositorio Git en la carpeta raíz (`git init`).
- [x] **Primer Commit:** Añadir los archivos base y realizar el commit inicial.
- [x] **GitHub:** (subido a https://github.com/DSidCode/Aurum-CRM el 28-09-2026) Crear un repositorio en la cuenta de GitHub (perfil `garciadanielsid` / `DSidCode`), enlazarlo como origen remoto (`git remote add origin`) y subir el código (`git push`).

---
*Nota: Este archivo sirve para retomar el hilo de desarrollo y no olvidar la integración pendiente con GitHub.*
