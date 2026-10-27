# Memoria de trabajo — SGM-ITVER Frontend

Actualizada: 2026-10-26. Este archivo registra el estado operativo verificado en producción y decisiones clave del proyecto.

## Estado en producción (Railway)
- **Frontend activo**: `https://hearty-caring-production.up.railway.app`
- **Backend conectado**: `https://captivating-tenderness-production-6777.up.railway.app/api`
- **Build**: Vite + Vue 3 + PrimeVue servido con Railpack y fallback SPA verificado.
- **Runtime de compilación**: Fijado a Node.js `22.23.4` (`.node-version`) el 2026-10-26 ante la vulnerabilidad crítica CVE-2026-111497.
- **Flujos validados**: Raíz, rutas profundas (`/tickets`), login y cambio obligatorio de contraseña del administrador.
