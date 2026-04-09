# AGENT — Guía de trabajo para el repo

Este repo contiene una base full‑stack para **Digital Transformation Insights Hub**.

## Principios
- Mantener separación clara entre `backend/` y `frontend/`.
- No mezclar lógica de negocio en controllers: va en `services/`.
- El acceso a DB debe centralizarse en Prisma (`src/db/prisma.js`).
- Usar variables de entorno para configuración (ver `backend/.env.example`).

## Convenciones (backend)
- Rutas en `src/routes/*Routes.js`.
- Controllers en `src/controllers/*Controller.js`.
- Services en `src/services/*Service.js`.
- Manejar errores con middleware Express centralizado.

## Workflow / eventos
- Usar `src/services/eventBus.js` como bus interno.
- Emitir `kpis.calculated` cuando se recalculen KPIs (ej. post-import).
- El workflow genera alertas en memoria (MVP) para devolverlas en `/insights`.

## Comandos útiles
### Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
npm run db:seed
```

### DB
- Requiere PostgreSQL accesible via `DATABASE_URL`.

## Calidad
- Cambios pequeños y coherentes con la arquitectura.
- Evitar refactors no solicitados.
- Antes de entregar: asegurar que el backend arranca y que los endpoints responden.
