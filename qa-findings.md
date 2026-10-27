# QA Findings — SGM-ITVER frontend

## Anti-patrones recurrentes

| Patrón | Frecuencia | Riesgo | Archivos ejemplo |
|--------|------------|--------|------------------|
| Servicio Railway sin dominio público | alta en despliegue | El estado “Online” no produce una URL utilizable | configuración Railway |
| Build de producción sin `VITE_API_URL` | alta en despliegue | El navegador intenta usar `/api` en el host del frontend | `src/services/api.ts`, variables Railway |
| Uso amplio de `any` en vistas/componentes | media | Pérdida de garantías del contrato API | `src/views/TicketsView.vue`, componentes de tickets |
| Imports y variables no usadas tolerados por la configuración | baja | Ruido y mantenimiento innecesario | varios services/views |

## Deuda técnica identificada

- [ ] Reducir el chunk principal, actualmente superior a 500 kB minificado.
- [ ] Eliminar el paquete de temas PrimeVue deprecado y conservar `@primeuix/themes`.
- [ ] Revisar las cuatro alertas de seguridad reportadas por npm.
- [ ] Tipar edificios, documentos y errores sin `any`.
- [ ] Añadir pruebas de stores, guardas de router y servicios.

## Áreas sin cobertura de tests

- Login y restauración de sesión.
- Cambio obligatorio de contraseña.
- CRUD y filtros de tickets.
- Administración de técnicos.
- Rutas profundas y fallback SPA en producción.

## Verificación de despliegue 001

- Dominio HTTPS público creado y servicio activo.
- Bundle verificado con la URL pública correcta de la API.
- Raíz y ruta profunda `/tickets` respondieron HTTP 200.
- Login real completado hasta la pantalla de cambio obligatorio de contraseña.
- Persiste como deuda la advertencia de chunk principal mayor a 500 kB.
