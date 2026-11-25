// Página de listado de productos por categoría
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useProductos } from '../hooks/useProductos';
import { useCategorias } from '../hooks/useCategorias';
import { TarjetaProducto, SkeletonProducto, SinProductos } from '../components/catalog/TarjetaProducto';

export const CategoriaPage = () => {
  const { id } = useParams<{ id: string }>();
  const { categorias } = useCategorias();
  const { productos, cargando } = useProductos(id);

  const categoria = categorias.find(c => c.id === id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="flex items-center gap-1 hover:text-primary transition-colors">
          <Home className="h-4 w-4" />
          Inicio
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-dark font-medium">{categoria?.nombre || 'Categoría'}</span>
      </nav>

      {/* Encabezado de categoría */}
      {categoria && (
        <div className="flex items-center gap-4 mb-8 p-6 bg-white rounded-2xl shadow-sm">
          <div className="h-20 w-20 rounded-2xl overflow-hidden shrink-0">
            <img
              src={categoria.imagen}
              alt={categoria.nombre}
              className="h-full w-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-dark">{categoria.nombre}</h1>
            <p className="text-gray-500 mt-1">{categoria.descripcion}</p>
            <p className="text-sm text-primary font-medium mt-2">
              {cargando ? '...' : `${productos.length} producto${productos.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
      )}

      {/* Grid de productos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {cargando
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonProducto key={i} />)
          : productos.length === 0
            ? <SinProductos />
            : productos.map(p => <TarjetaProducto key={p.id} producto={p} />)
        }
      </div>
    </div>
  );
};
