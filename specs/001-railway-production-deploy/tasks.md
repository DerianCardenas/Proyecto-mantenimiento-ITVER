# Tasks: Publicación del frontend en Railway

## Estado general: 🔄 En progreso

## Frontend

- [x] Confirmar build con `VITE_API_URL` productivo.
- [ ] Retirar `DATABASE_URL` del servicio frontend.
- [ ] Configurar `VITE_API_URL` y conservar `VITE_APP_TITLE`.
- [x] Generar dominio público.
- [ ] Redeployar con las variables productivas.
- [ ] Validar raíz, login y recarga de una ruta profunda.

## Principal (post-integración)

- [ ] Sincronizar el dominio con `CORS_ORIGIN` del backend.
- [ ] Verificar el contrato frontend↔backend.
- [ ] Smoke test del flujo autenticado.
- [ ] Actualizar spec y plan con hallazgos reales.
- [ ] Crear commit y enviar `main`.

## Documentación

- [x] Crear `spec.md`.
- [x] Crear `plan.md`.
- [x] Crear `tasks.md`.
- [x] Confirmar que no requiere ADR inicialmente.
- [x] Confirmar que no cambia el contrato HTTP.

## Pendiente (fuera de scope)

- [ ] Añadir hosting explícito solo si Railpack falla el fallback SPA.
