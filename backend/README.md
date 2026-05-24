# AI Commerce Ads Suite — Backend API

Plataforma SaaS de automatización de Meta Ads con IA  
**Creado por Alan Ugarte**

---

## 🔐 Credenciales de administrador

```
Email:      admin@aicommerceads.com
Contraseña: AdminACA2026!#
Rol:        Administrador (acceso total)
```

> ⚠️ Cambiá la contraseña después del primer acceso desde **Panel Admin → Sistema → Credenciales**.

---

## 🚀 Inicio rápido (desarrollo local)

### 1. Clonar e instalar
```bash
git clone https://github.com/alan/ai-commerce-ads-suite
cd ai-commerce-ads-suite/backend
npm install
```

### 2. Variables de entorno
```bash
cp .env.example .env
# Editá .env con tus claves reales
```

### 3. Levantar servicios con Docker
```bash
docker-compose up -d postgres redis mailhog
```

### 4. Correr migraciones y seed
```bash
# El schema se aplica automáticamente via docker-entrypoint
# Para aplicar el seed con el usuario admin:
docker exec -i aca_postgres psql -U aca_user -d ai_commerce_ads < database/seed.sql
```

### 5. Iniciar el servidor
```bash
npm run start:dev
```

La API estará disponible en: **http://localhost:3000**  
Swagger docs: **http://localhost:3000/api/docs**  
MailHog (emails): **http://localhost:8025**

---

## 📁 Estructura del proyecto

```
src/
├── auth/                    # JWT auth, login, register, refresh
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   └── strategies/
│       ├── jwt.strategy.ts
│       └── local.strategy.ts
├── users/                   # Gestión de usuarios
├── campaigns/               # CRUD campañas + publicación Meta
│   ├── campaigns.controller.ts
│   └── campaigns.service.ts
├── creatives/               # Gestión de creativos IA
├── meta-ads/                # Meta Marketing API
│   └── meta-ads.service.ts
├── whatsapp/                # WhatsApp Business API
│   └── whatsapp.service.ts
├── payments/                # Stripe subscriptions
│   └── payments.service.ts
├── ai/                      # Claude/OpenAI integration
│   └── ai.service.ts
├── reports/                 # Reportes + scheduler 20:00
│   └── reports.scheduler.ts
├── admin/                   # Panel admin completo
│   └── admin.service.ts
├── common/
│   ├── constants/
│   │   └── permissions.ts   # PLAN_PERMISSIONS map
│   ├── guards/              # JWT, Roles, Permissions, PlanLimit
│   ├── filters/             # HttpExceptionFilter
│   ├── interceptors/        # TransformInterceptor
│   └── services/
│       └── email.service.ts # Resend transactional emails
├── database/
│   └── database.module.ts   # pg Pool provider
├── config/
│   └── configuration.ts     # App config
├── app.module.ts
└── main.ts
database/
├── schema.sql               # Schema completo PostgreSQL
└── seed.sql                 # Admin user + datos iniciales
```

---

## 🔑 Sistema de permisos por plan

| Permiso                  | Starter | Growth | Scale |
|--------------------------|:-------:|:------:|:-----:|
| campaigns.create         | ✅ | ✅ | ✅ |
| campaigns.delete         | ❌ | ✅ | ✅ |
| creatives.create         | ✅ | ✅ | ✅ |
| ai.analyze               | ✅ | ✅ | ✅ |
| ai.optimize              | ❌ | ✅ | ✅ |
| ai.advanced              | ❌ | ❌ | ✅ |
| reports.schedule         | ❌ | ✅ | ✅ |
| users.invite             | ❌ | ✅ | ✅ |
| users.manage             | ❌ | ❌ | ✅ |
| billing.manage           | ❌ | ✅ | ✅ |
| admin.access             | ❌ | ❌ | ✅ |

> Los permisos del plan se asignan **automáticamente** al crear o cambiar el plan de un usuario.  
> El admin puede agregar permisos extra individuales desde **Panel Admin → Usuarios → Permisos**.

---

## 🌐 Endpoints principales

```
POST   /api/v1/auth/register          Registro
POST   /api/v1/auth/login             Login → access + refresh token
POST   /api/v1/auth/refresh           Renovar token
GET    /api/v1/auth/verify-email      Verificar email
POST   /api/v1/auth/forgot-password   Solicitar reset
POST   /api/v1/auth/reset-password    Resetear contraseña
GET    /api/v1/auth/me                Perfil autenticado

GET    /api/v1/campaigns              Listar campañas
POST   /api/v1/campaigns              Crear campaña
POST   /api/v1/campaigns/:id/analyze  Analizar con IA
POST   /api/v1/campaigns/:id/publish  Publicar en Meta Ads
POST   /api/v1/campaigns/:id/pause    Pausar campaña
POST   /api/v1/campaigns/:id/optimize Optimizar con IA
POST   /api/v1/campaigns/:id/duplicate Duplicar

POST   /api/v1/payments/checkout      Crear sesión Stripe
POST   /api/v1/payments/portal        Portal de facturación
POST   /api/v1/payments/webhook       Webhook Stripe (raw body)
GET    /api/v1/payments/subscription  Suscripción activa

POST   /api/v1/meta-ads/connect       Conectar cuenta Meta
GET    /api/v1/meta-ads/accounts      Listar cuentas conectadas

GET    /api/v1/reports                Listar reportes
POST   /api/v1/reports/generate       Generar reporte on-demand

GET    /api/v1/whatsapp/leads         Listar leads WhatsApp
POST   /api/v1/whatsapp/webhook       Webhook Meta/WA

GET    /api/v1/admin/dashboard        Métricas globales (admin)
GET    /api/v1/admin/users            Usuarios (admin)
POST   /api/v1/admin/users            Crear usuario (admin)
PATCH  /api/v1/admin/users/:id        Editar usuario (admin)
POST   /api/v1/admin/users/:id/suspend    Suspender
POST   /api/v1/admin/users/:id/block      Bloquear
POST   /api/v1/admin/users/:id/activate   Activar
POST   /api/v1/admin/users/:id/impersonate Impersonar
POST   /api/v1/admin/announce         Enviar anuncio masivo
GET    /api/v1/admin/audit            Audit log
GET    /api/v1/admin/feature-flags    Feature flags
PATCH  /api/v1/admin/feature-flags/:id Toggle flag
```

---

## ⚙️ Variables de entorno requeridas

Ver `.env.example` para la lista completa.

**Integraciones externas necesarias:**
- **Stripe** → `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, 3x `STRIPE_PRICE_*`
- **Meta Ads API** → `META_APP_ID`, `META_APP_SECRET`
- **WhatsApp Business API** → configurar en panel de integraciones por usuario
- **Anthropic Claude** → `ANTHROPIC_API_KEY`
- **Resend** (emails) → `RESEND_API_KEY`
- **Cloudflare R2** (archivos) → credenciales R2

---

## 🐳 Deploy en producción

```bash
# Build imagen Docker
docker build -t ai-commerce-ads-api .

# Con Railway/Render: conectar repo, agregar variables de entorno
# La base de datos y Redis pueden ser servicios managed en Railway

# O con VPS:
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📦 Tecnologías

- **Runtime**: Node.js 20 + NestJS 10
- **Base de datos**: PostgreSQL 16
- **Cache/Sessions**: Redis 7
- **Auth**: JWT + Passport + bcrypt
- **Pagos**: Stripe (subscriptions + webhooks)
- **IA**: Claude Sonnet (Anthropic)
- **Email**: Resend
- **Storage**: Cloudflare R2
- **Contenedores**: Docker + Docker Compose
