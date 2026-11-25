# Guía de Configuración - Papelería Manzanillo

## Requisitos previos

- Node.js 18 o superior
- npm 9 o superior
- Cuenta de Google (para Firebase)

---

## 1. Clonar e instalar dependencias

```bash
npm install
```

---

## 2. Crear proyecto Firebase

1. Ve a [https://console.firebase.google.com](https://console.firebase.google.com)
2. Crea un nuevo proyecto (ej: `papeleria-manzanillo`)
3. En el menú lateral activa los siguientes servicios:

### a) Authentication
- Ve a **Build → Authentication → Sign-in method**
- Activa **Email/Password**

### b) Firestore Database
- Ve a **Build → Firestore Database → Create database**
- Elige **Start in test mode** (luego aplica las reglas de seguridad de abajo)
- Región recomendada: `us-central1`

### c) Storage
- Ve a **Build → Storage → Get started**
- Elige **Start in test mode**

### d) Obtener credenciales
- Ve a **Project settings (⚙️) → General → Your apps**
- Haz clic en el ícono de Web (`</>`)
- Registra la app con un nombre (ej: "papeleria-web")
- Copia el objeto `firebaseConfig`

---

## 3. Configurar variables de entorno

Crea el archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Rellena con tus credenciales de Firebase:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=papeleria-manzanillo.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=papeleria-manzanillo
VITE_FIREBASE_STORAGE_BUCKET=papeleria-manzanillo.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

---

## 4. Crear usuario administrador

### Opción A: Desde Firebase Console
1. Ve a **Authentication → Users → Add user**
2. Ingresa email y contraseña del admin
3. Copia el **User UID** que se genera
4. Ve a **Firestore Database** y crea el documento:
   - Colección: `users`
   - ID del documento: *(pega el UID del usuario)*
   - Campos:
     ```
     email: "tu@email.com"
     role: "admin"
     nombre: "Administrador"
     creadoEn: (timestamp actual)
     ```

### Opción B: Usando el script de seed
La primera vez que abras la app en el navegador con las credenciales configuradas, los datos de ejemplo (categorías, productos, sucursales) se cargarán automáticamente.

---

## 5. Reglas de Seguridad de Firestore

Copia y pega estas reglas en **Firestore → Rules**:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Función auxiliar para verificar si el usuario es admin
    function esAdmin() {
      return request.auth != null &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Categorías: lectura pública, escritura solo admins
    match /categorias/{id} {
      allow read: if true;
      allow write: if esAdmin();
    }
    
    // Productos: lectura pública, escritura solo admins
    match /productos/{id} {
      allow read: if true;
      allow write: if esAdmin();
    }
    
    // Sucursales: lectura pública, escritura solo admins
    match /sucursales/{id} {
      allow read: if true;
      allow write: if esAdmin();
    }
    
    // Configuración: lectura pública, escritura solo admins
    match /config/{id} {
      allow read: if true;
      allow write: if esAdmin();
    }
    
    // Usuarios: solo el propio usuario o admin puede leer su perfil
    match /users/{userId} {
      allow read: if request.auth != null && (request.auth.uid == userId || esAdmin());
      allow write: if esAdmin();
    }
  }
}
```

---

## 6. Reglas de Seguridad de Storage

En **Storage → Rules**:

```
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    
    // Función para verificar admin en Firestore
    function esAdmin() {
      return request.auth != null &&
             firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Imágenes de productos - lectura pública, escritura solo admins
    match /productos/{allPaths=**} {
      allow read: if true;
      allow write: if esAdmin();
    }
    
    // Imágenes de categorías
    match /categorias/{allPaths=**} {
      allow read: if true;
      allow write: if esAdmin();
    }
    
    // Logo de la tienda
    match /config/{allPaths=**} {
      allow read: if true;
      allow write: if esAdmin();
    }
  }
}
```

---

## 7. Ejecutar el proyecto

```bash
npm run dev
```

La app estará disponible en [http://localhost:5173](http://localhost:5173)

El panel de administración está en [http://localhost:5173/admin](http://localhost:5173/admin)

---

## 8. Construir para producción

```bash
npm run build
```

El build se genera en la carpeta `dist/`. Puedes desplegarlo en:
- **Firebase Hosting**: `firebase deploy`
- **Vercel**: conecta el repositorio y Vercel detecta Vite automáticamente
- **Netlify**: arrastra la carpeta `dist/` o conecta el repo

---

## Estructura del proyecto

```
src/
├── components/
│   ├── admin/        # Componentes del panel de admin
│   ├── catalog/      # Tarjetas de productos y categorías
│   ├── layout/       # Header, Footer, Layout, PrivateRoute
│   ├── map/          # Mapa de sucursales (Leaflet)
│   └── ui/           # Componentes reutilizables (Modal, Spinner, etc.)
├── context/
│   ├── AuthContext.tsx    # Autenticación Firebase
│   └── TiendaContext.tsx  # Config global de la tienda
├── hooks/
│   ├── useBusqueda.ts     # Búsqueda global en tiempo real
│   ├── useCategorias.ts   # CRUD de categorías
│   ├── useProductos.ts    # CRUD de productos
│   └── useSucursales.ts   # CRUD de sucursales
├── pages/
│   ├── admin/             # Páginas del panel admin
│   ├── Home.tsx
│   ├── CategoriaPage.tsx
│   ├── ProductoPage.tsx
│   ├── BuscarPage.tsx
│   ├── ContactoPage.tsx
│   └── LoginPage.tsx
├── types/index.ts         # Tipos TypeScript
└── utils/
    ├── firebase.ts        # Configuración Firebase
    └── seedData.ts        # Datos de ejemplo
```

---

## Soporte y contacto

Si tienes dudas sobre la configuración, revisa la [documentación oficial de Firebase](https://firebase.google.com/docs).
