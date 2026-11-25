# Papelería Manzanillo — Store Catalog & Admin Panel

An online catalog for a stationery store in Manzanillo, Mexico, with a protected admin panel to manage products, categories and branches.

## Features

- **Catalog:** home page, categories, product detail pages and product search.
- **Branch map:** an interactive map of the store's branches (Leaflet).
- **Admin panel:** protected by login (Firebase Authentication), with CRUD for products, categories and branches, plus store settings.
- **Live data:** the catalog and the admin panel update in real time with Firestore listeners (`onSnapshot`).
- **Small touches:** image fallbacks, delete confirmations, loading states and toast notifications.

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS · Firebase (Auth, Firestore, Storage) · React Router 7 · Leaflet / React-Leaflet

## Project structure

```
src/
  components/  ui, layout, catalog, admin, map
  context/     AuthContext, TiendaContext
  hooks/       useProductos, useCategorias, useSucursales, useBusqueda
  pages/       public pages + admin/
  utils/       firebase.ts, seedData.ts
```

## Run locally

```bash
npm install
cp .env.example .env   # fill in your Firebase web config
npm run dev
```

Firebase setup (Auth, Firestore, Storage and security rules) is described step by step in [SETUP.md](SETUP.md).

## Author

Juan Pablo Vázquez Lara Herrera
