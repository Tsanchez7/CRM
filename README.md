# Digital Transformation Insights Hub


Plataforma full‑stack que simula un entorno empresarial integrando datos de CRM, ventas y marketing para calcular KPIs, generar insights automáticos y ejecutar automatizaciones (workflows).

## Arquitectura
- **Backend**: Node.js + Express + Prisma + TypeScript
- **DB**: PostgreSQL
- **Frontend**: React (hooks) + Vite
- **Estructura**: separación clara `backend/` y `frontend/`

## Estructura de carpetas
```
.
├─ backend/
│  ├─ prisma/
│  ├─ src/
│  │  ├─ controllers/
│  │  ├─ routes/
│  │  ├─ services/
│  │  └─ db/
│  └─ package.json
└─ frontend/
   └─ src/
      ├─ api/
      ├─ components/
      └─ pages/
```

## Backend (API)
## Prerrequisitos
- Node.js (incluye `npm`)
- PostgreSQL (para `DATABASE_URL`)

### Endpoints
- `GET /kpis` → métricas (revenue, conversion rate, etc.)
- `GET /insights` → insights generados (reglas + workflow)
- `POST /data/import` → importa datos (JSON/mock)

### Ejemplo de import (JSON)
```bash
curl -X POST http://localhost:4000/data/import \
   -H "Content-Type: application/json" \
   -d "{\"customers\":[{\"id\":\"cust_demo\",\"name\":\"Demo\"}],\"opportunities\":[{\"id\":\"opp_demo\",\"customerId\":\"cust_demo\",\"stage\":\"WON\",\"amount\":1000}],\"transactions\":[{\"id\":\"tx_demo\",\"customerId\":\"cust_demo\",\"opportunityId\":\"opp_demo\",\"amount\":1000}] }"
```

### Variables de entorno
Copia `backend/.env.example` a `backend/.env` y completa:
- `DATABASE_URL`
- `CORS_ORIGIN`
- `CONVERSION_RATE_THRESHOLD`

### Arranque
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

> Nota: en la siguiente iteración se añadió persistencia de insights en DB (modelo `Insight`). Ejecuta `npx prisma migrate dev` para aplicar el esquema.

### Poblar DB (seed)
```bash
cd backend
npm run db:seed
```

## Frontend
### Variables de entorno
Copia `frontend/.env.example` a `frontend/.env` si quieres cambiar la URL del backend.

### Arranque
```bash
cd frontend
npm install
npm run dev
```

## Notas
- Prisma gestiona el esquema en `backend/prisma/schema.prisma`.
- La automatización (workflow) está basada en eventos del backend.
