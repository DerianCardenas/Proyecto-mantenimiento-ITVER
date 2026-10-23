# Spec: Publicación del frontend en Railway

## Contexto

El servicio Railway `hearty-caring` despliega `DerianCardenas/Proyecto-mantenimiento-ITVER` desde `main` con Railpack. El build actual está en línea, pero el servicio no tiene dominio público. Solo están configuradas `DATABASE_URL` y `VITE_APP_TITLE`; `DATABASE_URL` no corresponde al frontend y falta `VITE_API_URL`.

## Impacto estimado

- Alcance: variables de build, dominio público, integración CORS y smoke test de SPA.
- Riesgo: medio — no cambia lógica de negocio, pero una URL incorrecta deja inutilizable toda la interfaz.
- Usuarios afectados: todos los usuarios web.
- Dependencias: dominio y healthcheck del backend, autenticación y configuración CORS.

## Problema

El estado “Online” solo indica que el proceso del servicio vive. Sin dominio público no existe una URL utilizable y, al faltar `VITE_API_URL`, el bundle intenta resolver `/api` contra el propio host del frontend. La variable `DATABASE_URL` no debe estar expuesta al frontend ni es utilizada por su código.

## Causa raíz

El servicio se conectó al repositorio, pero no se completó la configuración de publicación e integración entre ambos orígenes.

## Solución propuesta

### Backend

- Consumir el dominio HTTPS público creado en la spec hermana del backend.
- Configurar el backend para aceptar únicamente el origen público del frontend.

### Frontend

- Definir `VITE_API_URL=https://<backend>/api` antes de reconstruir el bundle.
- Retirar `DATABASE_URL` del servicio frontend.
- Generar un dominio público HTTPS y redeployar.
- Validar el fallback SPA, login, recarga de rutas profundas y llamadas autenticadas.
- Conservar Railpack mientras el smoke test confirme que sirve correctamente el artefacto Vite; si falla el fallback, actualizar primero este plan antes de añadir configuración de hosting al repositorio.

## Análisis de impacto

No cambian componentes, rutas ni contratos. Vite incrusta `VITE_API_URL` durante el build, por lo que cualquier corrección exige un nuevo despliegue. El dominio público deberá coincidir exactamente con `CORS_ORIGIN` en el backend.

## Archivos que se van a modificar

| Archivo | Tipo de cambio | Capa |
|---------|----------------|------|
| configuración del servicio Railway | modificar | infraestructura/frontend |
| código fuente | ninguno previsto | frontend |

## Pendiente condicionado

- Si Railpack no resuelve rutas SPA después del despliegue, se añadirá configuración explícita de servidor estático en una actualización del plan antes de implementarla.
