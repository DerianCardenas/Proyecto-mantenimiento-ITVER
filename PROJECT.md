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
│   ├── index.ts                    # Entry point
│   ├── app.ts                      # Express app configuration
│   ├── config/
│   │   ├── database.ts             # PostgreSQL pool (pg)
│   │   ├── s3.ts                   # Backblaze B3 client
│   │   └── auth.ts                 # JWT utilities
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   ├── validate.ts             # Zod validation
│   │   ├── cors.ts
│   │   └── authMiddleware.ts       # JWT verification
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.dto.ts
│   │   │   └── auth.middleware.ts
│   │   ├── tickets/
│   │   │   ├── tickets.routes.ts
│   │   │   ├── tickets.controller.ts
│   │   │   ├── tickets.service.ts
│   │   │   ├── tickets.dto.ts
│   │   │   └── tickets.validator.ts
│   │   ├── documents/
│   │   │   ├── documents.routes.ts
│   │   │   ├── documents.controller.ts
│   │   │   ├── documents.service.ts
│   │   │   └── documents.dto.ts
│   │   └── buildings/
│   │       ├── buildings.routes.ts
│   │       ├── buildings.controller.ts
│   │       └── buildings.service.ts
│   ├── types/
│   │   └── index.ts                # Common types
│   └── utils/
│       ├── snakeCase.ts            # DB ↔ API transformer
│       └── response.ts             # Standard API response wrapper
└── migrations/
    └── 001_initial_schema.sql
```

### Endpoints API (JSON camelCase)

```
AUTH
  POST   /api/auth/register
  POST   /api/auth/login
  GET    /api/auth/me
  GET    /api/auth/users

TICKETS
  GET    /api/tickets                    # list with filters/pagination/sort
  GET    /api/tickets/:id
  POST   /api/tickets                    # create
  PUT    /api/tickets/:id                # update
  DELETE /api/tickets/:id
  PATCH  /api/tickets/:id/status         # update status

DOCUMENTS
  POST   /api/tickets/:id/documents      # upload PDF
  GET    /api/tickets/:id/documents      # list documents
  GET    /api/documents/:fileKey          # download/view

BUILDINGS
  GET    /api/buildings
```

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

**RLS:** Habilitado en todas las tablas. Políticas basadas en rol y relación usuario-ticket.

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
2. 🔄 **Especificar**: DTOs, entidades, endpoints (en este orden)
3. 🔄 **DB Schema**: `migrations/001_initial_schema.sql` con RLS
4. 🔄 **Backend**: Rutas → Controller → Service → DTO → Validators
5. 🔄 **Frontend**: Types → Services → Views → Components → Router
6. 🔄 **Integración**: Conexión frontend-backend + DB + S3
7. 🔄 **Despliegue**: Docker Compose → Cloudflare

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
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sgm_itver
DB_USER=postgres
DB_PASSWORD=yourpassword
S3_ENDPOINT=https://s3.us-west-004.backblazeb2.com
S3_BUCKET=itver-maintenance
S3_ACCESS_KEY=
S3_SECRET_KEY=
JWT_SECRET=
JWT_EXPIRES_IN=86400
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
PORT=3000
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
