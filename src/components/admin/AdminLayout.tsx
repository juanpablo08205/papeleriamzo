// Layout del panel de administración con sidebar
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  MapPin,
  Settings,
  LogOut,
  Menu,
  BookOpen,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/productos', label: 'Productos', icon: Package },
  { to: '/admin/categorias', label: 'Categorías', icon: FolderOpen },
  { to: '/admin/sucursales', label: 'Sucursales', icon: MapPin },
  { to: '/admin/configuracion', label: 'Configuración', icon: Settings },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  titulo: string;
}

export const AdminLayout = ({ children, titulo }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, perfil } = useAuth();
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Sesión cerrada');
    navigate('/login');
  };

  const isActive = (to: string, exact = false) => {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  const Sidebar = () => (
    <aside className="w-64 bg-dark h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">Papelería MZO</p>
            <p className="text-gray-400 text-xs">Panel Admin</p>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon, exact }) => (
          <Link
            key={to}
            to={to}
            onClick={() => setSidebarAbierto(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
              isActive(to, exact)
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon className="h-4.5 w-4.5 h-5 w-5" />
            {label}
            {isActive(to, exact) && (
              <ChevronRight className="ml-auto h-4 w-4" />
            )}
          </Link>
        ))}
      </nav>

      {/* Usuario y logout */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {perfil?.email?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{perfil?.email}</p>
            <p className="text-gray-500 text-xs">Administrador</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors text-sm"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
        <Link
          to="/"
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-gray-400 hover:bg-white/10 hover:text-white transition-colors text-sm mt-1"
        >
          ← Ver tienda
        </Link>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar desktop - sticky para que acompañe el scroll del contenido */}
      <div className="hidden lg:flex lg:flex-col sticky top-0 h-screen shrink-0">
        <Sidebar />
      </div>

      {/* Sidebar mobile (drawer) */}
      {sidebarAbierto && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarAbierto(false)} />
          <div className="relative h-full animate-slide-up">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex items-center gap-4">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setSidebarAbierto(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-bold text-dark flex-1">{titulo}</h1>
          <button
            onClick={handleLogout}
            className="hidden lg:flex items-center gap-2 text-gray-500 hover:text-red-500 text-sm transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Salir
          </button>
        </header>

        {/* Página */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
