# PRD — Digital Transformation Insights Hub

## 1. Visión
Construir una plataforma que simule un entorno empresarial donde se integran datos de CRM/ventas/marketing, se calculan KPIs, se generan insights automáticos y se ejecutan automatizaciones simples.

## 2. Objetivos
- Centralizar datos operativos (clientes, oportunidades, transacciones).
- Calcular KPIs clave y servirlos por API.
- Generar insights por reglas (detectar caídas o umbrales).
- Simular automatizaciones tipo workflow basadas en eventos.

## 3. Usuarios y casos de uso
- **Analista de negocio**: ver KPIs y tendencias en dashboard.
- **Sales ops / Rev ops**: detectar caída de conversión y revenue.
- **Equipo de transformación digital**: experimentar con reglas de automatización.

## 4. Requisitos funcionales
### 4.1 Backend (API REST)
- Estructura modular (controllers/services/routes).
- Endpoints:
  - `GET /kpis`
  - `GET /insights`
  - `POST /data/import`
- Lógica:
  - Cálculo de KPIs a partir de DB.
  - Generación de insights con reglas (ej. conversión < umbral).
  - Workflow: si `conversion_rate < threshold` → generar alerta.
  - Simulación de eventos (bus interno) para disparar workflows.

### 4.2 Datos (Prisma)
Modelos mínimos:
- `Customer`
- `Opportunity`
- `Transaction`

### 4.3 Frontend (React)
- Dashboard principal.
- Vistas:
  - KPIs (cards + gráfico simple)
  - Lista de insights
- Consumo del backend con `fetch` o `axios`.

## 5. Requisitos no funcionales
- Código limpio y organizado.
- Variables de entorno (sin secretos hardcodeados).
- Separación de responsabilidades.
- Estructura de carpetas clara.

## 6. Fuera de alcance (por ahora)
- Autenticación/roles.
- Multi‑tenant.
- Persistencia de insights/alertas en DB (se permite in‑memory en MVP).
- ETL real/ingestas complejas.

## 7. Criterios de aceptación (MVP)
- `GET /kpis` responde JSON con revenue y conversion rate.
- `GET /insights` responde lista con al menos 1 regla implementada.
- `POST /data/import` permite importar un payload JSON y recalcular KPIs.
- Frontend muestra KPIs y lista de insights consumiendo API.
