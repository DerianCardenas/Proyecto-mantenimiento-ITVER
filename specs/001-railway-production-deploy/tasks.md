# Tasks: Publicación del frontend en Railway

## Estado general: ✅ Completado

## Frontend

- [x] Confirmar build con `VITE_API_URL` productivo.
- [x] Retirar `DATABASE_URL` del servicio frontend.
- [x] Configurar `VITE_API_URL` y conservar `VITE_APP_TITLE`.
- [x] Generar dominio público.
- [x] Redeployar con las variables productivas.
- [x] Validar raíz, login y recarga de una ruta profunda.

## Principal (post-integración)

- [x] Sincronizar el dominio con `CORS_ORIGIN` del backend.
- [x] Verificar el contrato frontend↔backend.
- [x] Smoke test del flujo autenticado.
- [x] Actualizar spec y plan con hallazgos reales.
- [x] Crear commit y enviar `main`.

## Documentación

- [x] Crear `spec.md`.
- [x] Crear `plan.md`.
- [x] Crear `tasks.md`.
- [x] Confirmar que no requiere ADR inicialmente.
- [x] Confirmar que no cambia el contrato HTTP.

## Pendiente (fuera de scope)

- [ ] Añadir hosting explícito solo si Railpack falla el fallback SPA.
