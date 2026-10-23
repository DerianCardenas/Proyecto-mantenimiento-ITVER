# Plan técnico: Publicación del frontend en Railway

## Flujo de datos

1. El backend recibe un dominio público y supera `/health`.
2. Railway define `VITE_API_URL` con ese dominio y sufijo `/api` en el servicio frontend.
3. Un redeploy ejecuta `npm ci` y `npm run build`; Vite incorpora la URL al bundle.
4. Railway publica el artefacto estático bajo un dominio HTTPS.
5. El backend actualiza `CORS_ORIGIN` con el origen exacto del frontend.
6. El navegador carga la SPA, obtiene JWT por login y envía llamadas Axios al backend público.

## Decisiones técnicas

- Mantener Railpack porque el build actual ya termina y el servicio está en línea.
- No añadir un servidor estático ni Dockerfile hasta que una prueba de ruta profunda demuestre que Railpack no cubre el fallback SPA.
- El frontend no recibe conexiones ni credenciales de PostgreSQL.

## Configuración Railway prevista

- Eliminar `DATABASE_URL` del servicio frontend.
- Mantener `VITE_APP_TITLE=SGM-ITVER`.
- Añadir `VITE_API_URL=https://<dominio-backend>/api`.
- Generar dominio público HTTPS.
- Redeployar después de conocer el dominio del backend.

## Verificación

- La raíz pública responde HTML y carga assets sin errores.
- `/login`, `/tickets` y una ruta profunda recargada sirven `index.html`.
- Login devuelve y persiste un JWT válido.
- Dashboard, edificios, técnicos y tickets consumen el backend público.
- El navegador no reporta errores CORS ni mixed content.
- Ninguna variable con credenciales de base de datos aparece en el bundle.

## Hallazgos durante implementación

- Pendiente de completar durante la implementación.

## Archivos involucrados

| Archivo | Tipo de cambio |
|---------|----------------|
| Railway frontend | variables, dominio y redeploy |
| Railway backend | sincronización de `CORS_ORIGIN` |
