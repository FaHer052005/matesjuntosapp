# Mates Juntos — App de gestión

Sistema web para manejar **productos**, **ventas**, **stock** y **caja** del emprendimiento Mates Juntos.

Funciona en el celular desde el navegador y se puede **instalar** como app (PWA): en Chrome → menú → *Instalar aplicación* o *Agregar a pantalla de inicio*.

## Cómo correrla en tu computadora

```bash
npm install
npm run dev
```

Abrí la URL que muestra la terminal (por ejemplo `http://localhost:5173`).

## Estructura del proyecto (qué hace cada parte)

```
matesjuntosapp/
├── index.html          → Página HTML base; carga la app React
├── public/
│   └── manifest.json   → Config para instalar como app en el celular
├── src/
│   ├── main.jsx        → Punto de entrada: monta React en el DOM
│   ├── App.jsx         → Cerebro: estado global, navegación, guardado
│   ├── theme.js        → Colores del modo claro/oscuro
│   ├── data/seed.js    → Productos de ejemplo la primera vez
│   ├── utils/
│   │   ├── constants.js → Categorías y métodos de pago
│   │   └── helpers.js     → Formato de precios ($$) y fechas
│   └── components/     → Cada pantalla de la app
│       ├── dashboard/  → Resumen del negocio
│       ├── products/   → Alta y edición de productos
│       ├── sales/      → Punto de venta (carrito)
│       ├── stock/      → Gráficos y alertas
│       ├── caja/       → Totales por método de pago
│       └── layout/     → Menú lateral y barra superior
```

## Conceptos que vas a usar seguido

| Concepto | Para qué sirve |
|----------|----------------|
| **Componente** | Un pedazo de pantalla reutilizable (ej. `SalesView`) |
| **useState** | Guardar datos que cambian (productos, carrito, tema) |
| **useEffect** | Hacer algo al cargar o cuando cambia algo (ej. guardar en localStorage) |
| **Props** | Datos que el padre (`App`) pasa al hijo (una pantalla) |
| **localStorage** | Base de datos del navegador; persiste sin servidor |

## Flujo de datos

1. `App.jsx` tiene `products` y `sales`.
2. Cada pantalla recibe esos datos y funciones para actualizarlos (`setProducts`, `setSales`).
3. Cuando cambian, `useEffect` los guarda en `localStorage`.
4. Al recargar la página, `loadAppData()` en `seed.js` los vuelve a leer.

## Próximos pasos que podés hacer vos (con ayuda)

1. **Exportar ventas a Excel/CSV** — ya hay `dlCSV` en `helpers.js`; conectar un botón en Caja.
2. **Fotos desde el celular** — subir imagen en vez de pegar URL.
3. **Backend real** — Firebase o una API propia para sincronizar entre dos celulares.
4. **Usuarios/login** — si más personas usan la app.

## Build para publicar

```bash
npm run build
npm run preview
```

Los archivos quedan en `dist/`; podés subirlos a Netlify, Vercel o GitHub Pages gratis.
