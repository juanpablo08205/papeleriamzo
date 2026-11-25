// Tarjeta de categoría para la página principal
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ImagenConFallback } from '../ui/ImagenConFallback';
import type { Categoria } from '../../types';

interface TarjetaCategoriaProps {
  categoria: Categoria;
}

export const TarjetaCategoria = ({ categoria }: TarjetaCategoriaProps) => (
  <Link
    to={`/categoria/${categoria.id}`}
    className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 block bg-white"
  >
    <div className="aspect-[4/3] overflow-hidden">
      <ImagenConFallback
        src={categoria.imagen}
        alt={categoria.nombre}
        className="aspect-[4/3] group-hover:scale-110 transition-transform duration-500"
      />
    </div>
    {/* Overlay gradiente */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
    {/* Contenido */}
    <div className="absolute bottom-0 left-0 right-0 p-4">
      <h3 className="text-white font-bold text-base mb-1">{categoria.nombre}</h3>
      <p className="text-white/80 text-xs mb-2 line-clamp-1">{categoria.descripcion}</p>
      <div className="flex items-center gap-1 text-primary-300 text-xs font-semibold">
        <span>Ver productos</span>
        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </Link>
);

// Skeleton de carga para categoría
export const SkeletonCategoria = () => (
  <div className="rounded-2xl overflow-hidden shadow-sm">
    <div className="aspect-[4/3] skeleton" />
    <div className="p-4 space-y-2">
      <div className="skeleton h-4 rounded-lg w-2/3" />
      <div className="skeleton h-3 rounded-lg w-full" />
    </div>
  </div>
);
