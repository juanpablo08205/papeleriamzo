// Aplicación principal - configuración de rutas y providers
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { TiendaProvider } from './context/TiendaContext';
import { Layout } from './components/layout/Layout';
import { PrivateRoute } from './components/layout/PrivateRoute';

// Páginas públicas
import { Home } from './pages/Home';
import { CategoriaPage } from './pages/CategoriaPage';
import { ProductoPage } from './pages/ProductoPage';
import { BuscarPage } from './pages/BuscarPage';
import { ContactoPage } from './pages/ContactoPage';
import { LoginPage } from './pages/LoginPage';

// Páginas de administración
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProductos } from './pages/admin/AdminProductos';
import { AdminCategorias } from './pages/admin/AdminCategorias';
import { AdminSucursales } from './pages/admin/AdminSucursales';
import { AdminConfiguracion } from './pages/admin/AdminConfiguracion';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TiendaProvider>
          <Routes>
            {/* Rutas públicas con layout completo */}
            <Route element={<Layout><Home /></Layout>} path="/" />
            <Route element={<Layout><CategoriaPage /></Layout>} path="/categoria/:id" />
            <Route element={<Layout><ProductoPage /></Layout>} path="/producto/:id" />
            <Route element={<Layout><BuscarPage /></Layout>} path="/buscar" />
            <Route element={<Layout><ContactoPage /></Layout>} path="/contacto" />

            {/* Login (sin layout de tienda) */}
            <Route element={<LoginPage />} path="/login" />

            {/* Rutas de administración (protegidas) */}
            <Route
              path="/admin"
              element={<PrivateRoute><AdminDashboard /></PrivateRoute>}
            />
            <Route
              path="/admin/productos"
              element={<PrivateRoute><AdminProductos /></PrivateRoute>}
            />
            <Route
              path="/admin/categorias"
              element={<PrivateRoute><AdminCategorias /></PrivateRoute>}
            />
            <Route
              path="/admin/sucursales"
              element={<PrivateRoute><AdminSucursales /></PrivateRoute>}
            />
            <Route
              path="/admin/configuracion"
              element={<PrivateRoute><AdminConfiguracion /></PrivateRoute>}
            />

            {/* 404 */}
            <Route
              path="*"
              element={
                <Layout>
                  <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <p className="text-8xl font-bold text-primary-200 mb-4">404</p>
                    <h1 className="text-2xl font-bold text-dark mb-2">Página no encontrada</h1>
                    <p className="text-gray-500 mb-6">La página que buscas no existe.</p>
                    <a href="/" className="btn-primary inline-block">Volver al inicio</a>
                  </div>
                </Layout>
              }
            />
          </Routes>

          {/* Notificaciones toast */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
              },
              success: {
                iconTheme: { primary: '#FF6B00', secondary: '#fff' },
              },
            }}
          />
        </TiendaProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
