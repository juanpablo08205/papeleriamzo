// Tarjeta de producto para el catálogo
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { ImagenConFallback } from '../ui/ImagenConFallback';
import type { Producto } from '../../types';

interface TarjetaProductoProps {
  producto: Producto;
}

export const TarjetaProducto = ({ producto }: TarjetaProductoProps) => (
  <Link
    to={`/producto/${producto.id}`}
    className="card group overflow-hidden block"
  >
    <div className="aspect-square overflow-hidden bg-primary-50">
      <ImagenConFallback
        src={producto.imagen}
        alt={producto.nombre}
        className="aspect-square group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-dark text-sm leading-snug mb-1 line-clamp-2">
        {producto.nombre}
      </h3>
      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{producto.descripcion}</p>
      <div className="flex items-center justify-between">
        <span className="text-primary font-bold text-lg">${producto.precio.toFixed(2)}</span>
        {producto.stock <= 5 && producto.stock > 0 && (
          <span className="badge bg-yellow-50 text-yellow-700">
            Últimas {producto.stock}
          </span>
        )}
        {producto.stock === 0 && (
          <span className="badge bg-red-50 text-red-600">Agotado</span>
        )}
      </div>
      {producto.destacado && (
        <span className="badge bg-primary-50 text-primary mt-2">⭐ Destacado</span>
      )}
    </div>
  </Link>
);

// Skeleton de carga para tarjeta de producto
export const SkeletonProducto = () => (
  <div className="card overflow-hidden">
    <div className="aspect-square skeleton" />
    <div className="p-4 space-y-2">
      <div className="skeleton h-4 rounded-lg w-3/4" />
      <div className="skeleton h-3 rounded-lg w-full" />
      <div className="skeleton h-6 rounded-lg w-1/3 mt-2" />
    </div>
  </div>
);

// Componente sin productos
export const SinProductos = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
    <Package className="h-16 w-16 mb-4 opacity-40" />
    <p className="text-lg font-medium">No hay productos disponibles</p>
    <p className="text-sm">Pronto agregaremos más productos</p>
  </div>
);
