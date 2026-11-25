// Página de detalle de producto
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { ChevronRight, Home, Package, Tag, BarChart3 } from 'lucide-react';
import { db } from '../utils/firebase';
import { useCategorias } from '../hooks/useCategorias';
import { ImagenConFallback } from '../components/ui/ImagenConFallback';
import { Spinner } from '../components/ui/Spinner';
import type { Producto } from '../types';

export const ProductoPage = () => {
  const { id } = useParams<{ id: string }>();
  const { categorias } = useCategorias();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!id) return;
    const cargar = async () => {
      const snap = await getDoc(doc(db, 'productos', id));
      if (snap.exists()) setProducto({ id: snap.id, ...snap.data() } as Producto);
      setCargando(false);
    };
    cargar();
  }, [id]);

  const categoria = categorias.find(c => c.id === producto?.categoriaId);

  if (cargando) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-500">Producto no encontrado</h2>
        <Link to="/" className="btn-primary mt-6 inline-block">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
        <Link to="/" className="flex items-center gap-1 hover:text-primary transition-colors">
          <Home className="h-4 w-4" />
          Inicio
        </Link>
        {categoria && (
          <>
            <ChevronRight className="h-4 w-4" />
            <Link to={`/categoria/${categoria.id}`} className="hover:text-primary transition-colors">
              {categoria.nombre}
            </Link>
          </>
        )}
        <ChevronRight className="h-4 w-4" />
        <span className="text-dark font-medium">{producto.nombre}</span>
      </nav>

      {/* Detalle del producto */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Imagen */}
          <div className="aspect-square bg-primary-50">
            <ImagenConFallback
              src={producto.imagen}
              alt={producto.nombre}
              className="aspect-square"
            />
          </div>

          {/* Información */}
          <div className="p-8 flex flex-col justify-between">
            <div>
              {producto.destacado && (
                <span className="badge bg-primary-50 text-primary mb-3">⭐ Producto Destacado</span>
              )}
              <h1 className="text-2xl md:text-3xl font-bold text-dark mb-3">{producto.nombre}</h1>
              {categoria && (
                <Link
                  to={`/categoria/${categoria.id}`}
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary mb-4 transition-colors"
                >
                  <Tag className="h-4 w-4" />
                  {categoria.nombre}
                </Link>
              )}
              <p className="text-gray-600 leading-relaxed mb-6">{producto.descripcion}</p>
            </div>

            <div>
              <div className="flex items-end gap-2 mb-6">
                <span className="text-4xl font-bold text-primary">${producto.precio.toFixed(2)}</span>
                <span className="text-gray-400 text-sm mb-1">MXN</span>
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="h-4 w-4 text-gray-400" />
                {producto.stock > 5 && (
                  <span className="text-sm text-green-600 font-medium">En existencia ({producto.stock} unidades)</span>
                )}
                {producto.stock <= 5 && producto.stock > 0 && (
                  <span className="text-sm text-yellow-600 font-medium">Últimas {producto.stock} unidades</span>
                )}
                {producto.stock === 0 && (
                  <span className="text-sm text-red-600 font-medium">Producto agotado</span>
                )}
              </div>

              <Link
                to={`https://wa.me/?text=Hola, me interesa el producto: ${encodeURIComponent(producto.nombre)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full text-center block"
              >
                Consultar disponibilidad
              </Link>

              <Link to={categoria ? `/categoria/${categoria.id}` : '/'} className="btn-secondary w-full text-center block mt-3">
                Ver más productos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
