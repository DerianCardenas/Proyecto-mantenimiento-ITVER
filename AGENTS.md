# AGENTS.md — SGM-ITVER frontend

> Última actualización: 2026-10-22
> Generado con: context-generator

---

## Para Codex y agentes: leer esto primero

Antes de cualquier tarea en este proyecto:
1. Leer este archivo completo.
2. Verificar que el plan respeta las convenciones y restricciones documentadas.
3. Reportar conflictos entre código y documentación antes de actuar.
4. No introducir librerías, patrones o herramientas no documentados sin crear un ADR.

---

## Dominio

SGM-ITVER es la interfaz para registrar y dar seguimiento a solicitudes de mantenimiento del Instituto Tecnológico de Veracruz. Presenta tickets, estadísticas, detalle de adjuntos y administración de técnicos según el rol autenticado. Sustituye el seguimiento manual por un flujo digital centralizado.

---

## Stack técnico

### Backend
- Runtime: Node.js 20.
- Framework: Express 4.22.3 con TypeScript estricto.
- Base de datos: PostgreSQL 16 con Row Level Security.
- Acceso a datos: SQL directo mediante `pg`; no hay ORM.
- Autenticación: JWT Bearer.
- Librerías críticas: Zod, bcrypt, Multer y AWS SDK S3.

### Frontend
- Runtime: Node.js durante build; salida estática para producción.
- Framework: Vue 3.5.43 + Vite 5.4.21 + TypeScript 5.9.3.
- Estado: Pinia 2.3.1 mediante stores de composición.
- Cliente HTTP: Axios 1.20.0 configurado en `src/services/api.ts`.
- Librerías críticas: Vue Router 4.6.4, PrimeVue 4.5.5 y Day.js.

---

## Convenciones

### Naming
- Componentes y vistas Vue usan PascalCase; servicios, composables, stores y utilidades usan camelCase.
- TypeScript y JSON usan `camelCase`; los valores enum conservan `snake_case` cuando coinciden con PostgreSQL.
- Los componentes usan Composition API con `<script setup lang="ts">`.

### Estructura de requests y responses
- `src/services/api.ts` centraliza la instancia Axios, JWT y unwrap del envelope `{ success, data, error, message }`.
- Listas paginadas conservan el envelope completo mediante `getPaginated`.
- Services representan endpoints; stores coordinan estado y las vistas no deben llamar Axios directamente.
- Los errores visibles se muestran mediante Toast o mensajes del formulario.

### Headers
- El interceptor agrega `Authorization: Bearer <jwt>` cuando existe token.
- En `FormData`, permitir que Axios/navegador defina `Content-Type` y boundary.

### Valores constantes
- `VITE_API_URL` debe apuntar al backend público incluyendo `/api`; el fallback `/api` solo funciona con proxy/reverse proxy del mismo origen.
- Roles: `admin`, `technician`, `receptionist`.
- Estados y prioridades coinciden exactamente con los enums del backend.

### Ramas y commits
- Rama base y de despliegue: `main`.
- Los mensajes existentes son libres, breves y principalmente en español.
- Para specs nuevas, usar `tipo(scope): NNN-nombre — descripción breve`.

---

## Anti-patrones conocidos

- NO agregar URLs absolutas del backend en componentes; usar `VITE_API_URL` y el cliente central.
- NO interpretar que un servicio Railway “Online” ya está publicado: debe tener dominio público y responder rutas SPA.
- NO desplegar el frontend sin fijar `VITE_API_URL` durante el build; Vite incrusta esas variables en el bundle.
- NO duplicar estado remoto en vistas cuando ya existe un store Pinia.
- NO colocar secretos en variables `VITE_*`; quedan expuestos en JavaScript del navegador.

---

## Restricciones del dominio

- El backend y frontend se despliegan desde repositorios y servicios separados.
- La navegación usa history mode; el hosting debe redirigir rutas desconocidas a `index.html`.
- Técnicos con `mustChangePassword` solo pueden acceder a la pantalla de cambio de contraseña.
- Las rutas administrativas deben conservar guardas de rol tanto en frontend como backend; la UI nunca sustituye la autorización del servidor.
- Adjuntos PDF dependen de Backblaze B2 y de URLs firmadas emitidas por el backend.

---

## Mapa de módulos

```
src/
├── main.ts             ← plugins y componentes globales
├── router/             ← rutas lazy y guardas de sesión/rol
├── services/           ← cliente Axios y adaptadores por recurso
├── stores/             ← estado Pinia de auth y tickets
├── composables/        ← lógica reutilizable de UI
├── views/              ← pantallas asociadas al router
├── components/
│   ├── Auth/           ← formularios de autenticación
│   ├── Dashboard/      ← resumen y estadísticas
│   ├── Tickets/        ← lista, formulario, tarjeta y documentos
│   └── common/         ← layout, botones, temas y confirmaciones
├── types/              ← contratos TypeScript compartidos en el frontend
├── utils/              ← fechas y helpers puros
└── styles/             ← estilos globales y por módulo
public/_redirects       ← fallback SPA cuando el host lo soporta
specs/                  ← specs de cambios
```

---

## Recetas frecuentes

### Consumir un endpoint
1. Agregar o actualizar el tipo en `src/types/index.ts`.
2. Exponer la llamada mediante `src/services/api.ts` y el service del recurso.
3. Coordinar estado persistente en Pinia si más de una vista lo usa.
4. Manejar estados loading/error en la vista o componente.
5. Ejecutar `npm run build`.

### Crear una vista protegida
1. Crear el componente en `src/views/`.
2. Añadir import lazy y metadata en `src/router/index.ts`.
3. Usar `requiresAuth` y `adminOnly` según corresponda.
4. Envolver el contenido con el layout común y validar navegación directa.

### Configurar producción
1. Definir `VITE_API_URL=https://<backend>/api` antes del build.
2. Ejecutar `npm ci && npm run build`.
3. Servir `dist/` con fallback SPA a `index.html`.
4. Validar login, recarga de rutas profundas, CORS y llamadas autenticadas.

---

## ADRs registrados

| ID | Decisión | Fecha | Archivo |
|----|----------|-------|---------|
| — | No hay ADR formal previo | — | — |

---

## Historial de actualizaciones

| Fecha | Sección | Cambio |
|-------|---------|--------|
| 2026-10-22 | Todas | Contexto inicial levantado desde código y configuración de Railway. |
