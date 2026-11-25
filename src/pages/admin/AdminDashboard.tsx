// Dashboard del panel de administración
import { useEffect, useState } from 'react';
import { collection, getCountFromServer } from 'firebase/firestore';
import { Package, FolderOpen, MapPin, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../../utils/firebase';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Spinner } from '../../components/ui/Spinner';

interface Estadisticas {
  productos: number;
  categorias: number;
  sucursales: number;
}

const tarjetasAccion = [
  { to: '/admin/productos', label: 'Gestionar Productos', icon: Package, color: 'bg-orange-50 text-primary' },
  { to: '/admin/categorias', label: 'Gestionar Categorías', icon: FolderOpen, color: 'bg-blue-50 text-blue-600' },
  { to: '/admin/sucursales', label: 'Gestionar Sucursales', icon: MapPin, color: 'bg-green-50 text-green-600' },
];

export const AdminDashboard = () => {
  const [stats, setStats] = useState<Estadisticas | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const [prods, cats, sucs] = await Promise.all([
          getCountFromServer(collection(db, 'productos')),
          getCountFromServer(collection(db, 'categorias')),
          getCountFromServer(collection(db, 'sucursales')),
        ]);
        setStats({
          productos: prods.data().count,
          categorias: cats.data().count,
          sucursales: sucs.data().count,
        });
      } catch (err) {
        console.error('Error al cargar estadísticas:', err);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const statCards = [
    { label: 'Total Productos', value: stats?.productos, icon: Package, color: 'text-primary bg-primary-50' },
    { label: 'Categorías', value: stats?.categorias, icon: FolderOpen, color: 'text-blue-600 bg-blue-50' },
    { label: 'Sucursales', value: stats?.sucursales, icon: MapPin, color: 'text-green-600 bg-green-50' },
  ];

  return (
    <AdminLayout titulo="Dashboard">
      <div className="space-y-6">
        {/* Bienvenida */}
        <div className="bg-gradient-to-r from-primary to-accent text-white rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-6 w-6" />
            <h2 className="text-xl font-bold">Bienvenido al Panel de Administración</h2>
          </div>
          <p className="text-primary-100 text-sm">
            Gestiona productos, categorías, sucursales y configuración de tu tienda desde aquí.
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-500 text-sm font-medium">{label}</p>
                <div className={`p-2.5 rounded-xl ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              {cargando ? (
                <Spinner size="sm" />
              ) : (
                <p className="text-3xl font-bold text-dark">{value ?? '—'}</p>
              )}
            </div>
          ))}
        </div>

        {/* Acciones rápidas */}
        <div>
          <h3 className="font-bold text-dark mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {tarjetasAccion.map(({ to, label, icon: Icon, color }) => (
              <Link
                key={to}
                to={to}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group"
              >
                <div className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-dark">{label}</p>
                  <p className="text-gray-400 text-sm">Administrar →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Configuración tienda */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-dark">Configuración de la Tienda</h3>
              <p className="text-gray-500 text-sm mt-1">Actualiza el logo y las redes sociales</p>
            </div>
            <Link to="/admin/configuracion" className="btn-primary text-sm px-4 py-2">
              Configurar
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
