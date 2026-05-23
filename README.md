# Mates Juntos — App de gestión

Sistema web con **login**, **PostgreSQL** y gestión de productos, ventas, stock, caja e historial.

## Requisitos

- Node.js 18+
- Docker (recomendado) o PostgreSQL instalado localmente

## Puesta en marcha (primera vez)

### 1. Variables de entorno

```bash
cp .env.example .env
```

Editá `.env` si necesitás otro usuario/clave de base de datos.

### 2. Base de datos PostgreSQL

```bash
npm install
npm run db:up          # levanta PostgreSQL en Docker
npm run db:init        # crea tablas + usuarios + productos + ventas de ejemplo
```

### 3. Arrancar app (API + frontend)

```bash
npm run dev
```

- Web: http://localhost:5173  
- API: http://localhost:3001  

## Usuarios de prueba

| Usuario | Contraseña   |
|---------|--------------|
| `admin` | `admin123`   |
| `mates` | `matesjuntos`|

Al abrir la app siempre verás la pantalla de **login**. Sin sesión válida no se accede al panel.

## Base de datos (PostgreSQL)

| Tabla | Contenido |
|-------|-----------|
| `users` | Usuarios y contraseñas (hash bcrypt) |
| `products` | Catálogo y stock actual |
| `sales` | Ventas registradas |
| `sale_items` | Detalle de cada venta |
| `stock_movements` | Movimientos de stock (ventas, carga inicial) |

Esquema: `database/schema.sql`  
Datos iniciales: `npm run db:init` → `server/scripts/init-db.js`

## Estructura del proyecto

```
matesjuntosapp/
├── database/schema.sql    → Tablas PostgreSQL
├── docker-compose.yml     → PostgreSQL en Docker
├── server/                → API Node + Express
│   ├── index.js
│   ├── routes/            → auth, products, sales
│   └── scripts/init-db.js
└── src/                   → Frontend React
    ├── api/               → Llamadas a la API
    ├── components/auth/   → Pantalla de login
    └── components/...     → Dashboard, ventas, etc.
```

## Scripts útiles

| Comando | Qué hace |
|---------|----------|
| `npm run dev` | API + Vite en paralelo |
| `npm run dev:client` | Solo frontend |
| `npm run dev:server` | Solo API |
| `npm run db:up` | Inicia PostgreSQL (Docker) |
| `npm run db:init` | Crea tablas y datos de ejemplo |
| `npm run build` | Build de producción del frontend |

## Producción

- Cambiá `JWT_SECRET` en `.env` por una clave larga y aleatoria.
- Usá contraseñas fuertes en PostgreSQL.
- El frontend en producción debe apuntar a la API (`VITE_API_URL=https://tu-api.com`).
