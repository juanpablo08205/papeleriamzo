// Página de resultados de búsqueda global
import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Home, ChevronRight } from 'lucide-react';
import { useBusqueda } from '../hooks/useBusqueda';
import { TarjetaProducto, SkeletonProducto } from '../components/catalog/TarjetaProducto';

export const BuscarPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { resultados, buscando, buscar } = useBusqueda();

  useEffect(() => {
    buscar(query);
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="flex items-center gap-1 hover:text-primary transition-colors">
          <Home className="h-4 w-4" />
          Inicio
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-dark font-medium">
          {query ? `Resultados para "${query}"` : 'Todos los productos'}
        </span>
      </nav>

      {/* Encabezado */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary-50 rounded-xl">
          <Search className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-dark">
            {query ? `Resultados para "${query}"` : 'Todos los productos'}
          </h1>
          {!buscando && (
            <p className="text-gray-500 text-sm mt-0.5">
              {resultados.length === 0 && query
                ? 'No se encontraron resultados'
                : `${resultados.length} producto${resultados.length !== 1 ? 's' : ''} encontrado${resultados.length !== 1 ? 's' : ''}`
              }
            </p>
          )}
        </div>
      </div>

      {/* Resultados */}
      {buscando ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonProducto key={i} />)}
        </div>
      ) : resultados.length === 0 && query ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Search className="h-16 w-16 mb-4 opacity-30" />
          <p className="text-lg font-medium">No encontramos "{query}"</p>
          <p className="text-sm mt-1">Intenta con otras palabras clave</p>
          <Link to="/" className="btn-primary mt-6">
            Ver categorías
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {resultados.map(p => <TarjetaProducto key={p.id} producto={p} />)}
        </div>
      )}
    </div>
  );
};
