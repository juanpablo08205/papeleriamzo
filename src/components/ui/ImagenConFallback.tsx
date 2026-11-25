// Imagen con placeholder de carga y fallback en caso de error
import { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface ImagenConFallbackProps {
  src: string;
  alt: string;
  className?: string;
}

export const ImagenConFallback = ({ src, alt, className = '' }: ImagenConFallbackProps) => {
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-primary-50 ${className}`}>
        <div className="flex flex-col items-center gap-2 text-primary-300">
          <ImageOff className="h-8 w-8" />
          <span className="text-xs">Sin imagen</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {cargando && (
        <div className={`absolute inset-0 skeleton`} />
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${cargando ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setCargando(false)}
        onError={() => { setCargando(false); setError(true); }}
      />
    </div>
  );
};
