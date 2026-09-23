# ITVER - Sistema de Gestión y Seguimiento de Mantenimiento (SGM-ITVER)

## Visión General

Plataforma web para gestión y seguimiento de tickets de mantenimiento de sistemas de climatización (aires acondicionados) del Instituto Tecnológico de Veracruz (ITVER). Reemplaza el manejo manual de documentos SISAD por un flujo digital con almacenamiento de archivos, trazabilidad y reportes en tiempo real.

## Stack Tecnológico

| Capa | Tecnología | Detalle |
|------|-----------|---------|
| Frontend | Vue.js 3 + TypeScript + PrimeVue | Composition API / Script Setup |
| Iconografía | Material Design Icons | `@mdi/font` |
| Build | Vite | TS + Vue plugin |
| Estado | Pinia | Stores reactivos |
| Backend | Node.js + Express.js + TypeScript | Strict mode |
| Base de Datos | PostgreSQL 16+ | Row Level Security habilitado |
| Object Storage | Backblaze B2 (S3-compatible) | 10GB free tier |
| Autenticación | JWT + bcrypt | Roles: admin, technician, receptionist |
| Upload | Multer + stream a S3 | Archivos PDF de SISAD |
| Infra | Docker Compose | Desarrollo local → Cloudflare |

## Convenciones de Nomenclatura

- **Código (TS/JSON)**: `camelCase`
- **Base de Datos (PostgreSQL)**: `snake_case`
- **Transformación**: Middleware en backend convierte `snake_case` ↔ `camelCase` transparentemente

## Arquitectura del Backend (`Proyecto-mantenimiento-ITVER-backend`)

### Estructura
```
backend/
├── package.json
├── tsconfig.json (strict mode)
├── .env.example
├── docker-compose.yml
├── Dockerfile
├── src/
│   ├── index.ts                    # Entry point (carga dotenv PRIMERO)
│   ├── app.ts                      # Express app configuration
│   ├── config/
│   │   ├── database.ts             # PostgreSQL pool (pg) + withServiceClient (bypass RLS solo auth)
│   │   ├── s3.ts                   # Backblaze B2 client
│   │   └── auth.ts                 # JWT utilities (expiresIn numérico = segundos)
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   ├── validate.ts             # Zod validation
│   │   ├── authMiddleware.ts       # JWT verification + requireRole
│   │   └── dbContext.ts            # RLS por request (set_config, transp. por request)
│   ├── modules/
│   │   ├── auth/                   # routes/controller/service/dto
│   │   ├── tickets/                # routes/controller/service/dto
│   │   ├── documents/              # routes/controller/service/dto (multer memoryStorage)
│   │   └── buildings/              # routes/controller/service
│   ├── types/
│   │   ├── index.ts                # Common types
│   │   └── express.d.ts            # Augmentation: req.user, req.dbClient
│   └── utils/
│       ├── snakeCase.ts            # DB ↔ API transformer
│       └── response.ts             # Standard API response wrapper
├── scripts/
│   └── seed.ts                     # Crea admin y tecnico1 (bcrypt real)
└── migrations/
    ├── 001_initial_schema.sql      # Schemas, enums, RLS policies, seed buildings
    └── 002_force_rls.sql           # FORCE RLS + policies INSERT/UPDATE buildings
```

> **Nota crítica RLS:** el backend se conecta con el rol `sgm_app` (NO superuser, NO bypassrls). Los superusuarios (p.ej. `postgres`) omiten RLS siempre, incluso con `FORCE ROW LEVEL SECURITY`.

### Endpoints API (JSON camelCase)

```
AUTH
  POST   /api/auth/register            # público (bypass RLS vía service context)
  POST   /api/auth/login               # público (bypass RLS vía service context)
  GET    /api/auth/me                  # requiere JWT
  GET    /api/auth                     # requiere JWT + rol admin

TICKETS                                # todo requiere JWT (authMiddleware + dbContext)
  GET    /api/tickets                  # list con filtros: status, priority, buildingName, technicianName, page, limit, sort
  GET    /api/tickets/stats            # estadísticas por status/priority/building (ANTES de /:id)
  GET    /api/tickets/:id              # detalle único (incluye documentos)
  POST   /api/tickets                  # crear (created_by = usuario autenticado)
  PUT    /api/tickets/:id              # actualizar
  DELETE /api/tickets/:id              # eliminar
  PATCH  /api/tickets/:id/status       # cambiar solo el estado

DOCUMENTS                              # montado en /api/documents (auth + dbContext)
  POST   /api/documents/:ticketId      # subir archivo (multipart 'file', max 10MB)
  GET    /api/documents/:ticketId      # listar documentos del ticket
  GET    /api/documents/download/:fileKey   # devuelve { downloadUrl } firmado por B2 (ANTES de /:ticketId)

BUILDINGS                              # auth + dbContext
  GET    /api/buildings                # listar edificios
```

> Middleware por request: `authMiddleware` (JWT) → `dbContext` (BEGIN + set_config app.current_user_id/role). Todas las queries del request usan `req.dbClient`. Auth (login/register) usa `withServiceClient` con `app.bypass_rls='true'`.

### Modelo de Datos (PostgreSQL snake_case)

**Enums:**
- `user_role`: `admin` | `technician` | `receptionist`
- `ticket_status`: `pending` | `in_progress` | `resolved` | `closed` | `cancelled`
- `ticket_priority`: `low` | `medium` | `high` | `urgent`

**Tablas:**
- `users` — id, username, email, password_hash, role, full_name, is_active, created_at, updated_at
- `buildings` — id, name, location, created_at
- `tickets` — id, title, description, building_id, building_name, technician_name, attention_date, recommendations, observations, status, priority, created_by, assigned_to, created_at, updated_at
- `ticket_documents` — id, ticket_id, file_key, original_name, mime_type, file_size, uploaded_by, uploaded_at

**RLS:** Habilitado (+ `FORCE ROW LEVEL SECURITY`) en todas las tablas. El backend establece el contexto por request:

```sql
BEGIN;
SELECT set_config('app.current_user_id', $1, true);   -- uuid del usuario (o NULL_ID para guest)
SELECT set_config('app.current_user_role', $1, true); -- admin | technician | receptionist
-- ...queries (todas con req.dbClient)...
COMMIT;
```

- Políticas: usuarios ven/editan solo tickets propios o asignados; admins ven todo.
- Auth (login/register): `withServiceClient` usa `set_config('app.bypass_rls','true')` para operar sin sesión.
- **Rol de BD:** `sgm_app` (NOSUPERUSER NOBYPASSRLS) — los superusuarios omiten RLS siempre.
- Crear rol y grants:
  ```sql
  CREATE ROLE sgm_app LOGIN PASSWORD '...' NOSUPERUSER NOBYPASSRLS;
  GRANT USAGE ON SCHEMA public TO sgm_app;
  GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO sgm_app;
  GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO sgm_app;
  GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO sgm_app;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO sgm_app;
  ```
- **Importante:** `SET LOCAL app.x = $1` NO acepta parámetros bind en PostgreSQL; usar siempre `set_config()`. Y `import 'dotenv/config'` debe ser el primer import de `index.ts`.

## Arquitectura del Frontend (`Proyecto-mantenimiento-ITVER`)

### Estructura
```
frontend/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── .env.example
├── public/
│   └── favicon.ico
└── src/
    ├── main.ts
    ├── App.vue
    ├── router/
    │   └── index.ts
    ├── stores/
    │   ├── auth.ts
    │   └── tickets.ts
    ├── composables/
    │   ├── useApi.ts
    │   └── useAuth.ts
    ├── services/
    │   ├── api.ts
    │   ├── auth.service.ts
    │   └── ticket.service.ts
    ├── components/
    │   ├── common/
    │   │   ├── BaseLayout.vue
    │   │   ├── BaseButton.vue
    │   │   └── BaseCard.vue
    │   ├── Auth/
    │   │   ├── LoginForm.vue
    │   │   └── RegisterForm.vue
    │   ├── Tickets/
    │   │   ├── TicketList.vue
    │   │   ├── TicketForm.vue
    │   │   ├── TicketCard.vue
    │   │   └── DocumentUpload.vue
    │   └── Dashboard/
    │       ├── StatsCards.vue
    │       └── DashboardOverview.vue
    ├── views/
    │   ├── LoginView.vue
    │   ├── DashboardView.vue
    │   ├── TicketsView.vue
    │   ├── TicketDetailView.vue
    │   └── NotFoundView.vue
    ├── layouts/
    │   └── MainLayout.vue
    ├── types/
    │   └── index.ts
    └── styles/
        ├── main.css
        └── variables.css
```

### Vistas Principales
1. **Login** — Formulario de autenticación
2. **Dashboard** — Estadísticas (total tickets, pendientes, resueltos, por técnico)
3. **Tickets** — DataTable con filtros avanzados (estado, prioridad, edificio, técnico, fecha)
4. **TicketForm** — Alta y edición de incidencias
5. **TicketDetail** — Visualización completa + documentos adjuntos

## Pipeline de Desarrollo (Spec-Kit)

1. ✅ **Definir**: Este archivo + preguntas cerradas
2. ✅ **Especificar**: DTOs, entidades, endpoints (en este orden)
3. ✅ **DB Schema**: `migrations/001_initial_schema.sql` con RLS + `002_force_rls.sql`
4. ✅ **Backend**: Rutas → Controller → Service → DTO → Validators (compila con `tsc` strict)
5. ✅ **Frontend**: Types → Services → Views → Components → Router (compila con `vue-tsc` + build Vite)
6. ✅ **Integración**: API probada end-to-end local (login, RLS admin/técnico, CRUD tickets, stats)
7. 🔄 **Integración S3**: subir/descargar PDFs requiere credenciales Backblaze B2 reales
8. 🔄 **Despliegue**: Docker Compose → Cloudflare

## Reglas de Seguridad

- Contraseñas: bcrypt (12 rounds)
- JWT: HS256, exp 24h, refresh token 7 días
- RLS habilitado en producción
- Archivos: validación MIME (solo PDF), max 10MB
- CORS configurado para el dominio del frontend
- Variables de entorno sensibles nunca en código

## Variables de Entorno

### Backend (.env)
```
# Rol de aplicación (NOSUPERUSER NOBYPASSRLS); nunca postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sgm_itver
DB_USER=sgm_app
DB_PASSWORD=your_app_password
S3_ENDPOINT=https://s3.us-west-004.backblazeb2.com
S3_BUCKET=itver-maintenance
S3_ACCESS_KEY=
S3_SECRET_KEY=
JWT_SECRET=
JWT_EXPIRES_IN=86400            # segundos (número, no string con ms)
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
PORT=3000
SEED_ADMIN_PASSWORD=admin123    # usados por scripts/seed.ts
SEED_TECH_PASSWORD=tecnico123
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
VITE_APP_TITLE=SGM-ITVER
```

## Historial de Decisiones

| Fecha | Decisión | Razón |
|-------|----------|---------|
| 2026-09-23 | Backblaze B2 | Capacidad, S3-compatible, costo |
| 2026-09-23 | PostgreSQL con RLS | Seguridad institucional |
| 2026-09-23 | Vue 3 + PrimeVue | Componentes UI ricos, PrimeVue DataTable nativo |
| 2026-09-23 | TypeScript estricto | Calidad y mantenibilidad |
| 2026-09-23 | Dos repos separados | Separa responsabilidades de deploy |
