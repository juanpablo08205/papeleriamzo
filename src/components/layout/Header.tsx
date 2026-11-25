// Header principal con logo, búsqueda y redes sociales
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, MessageCircle, BookOpen } from 'lucide-react';

const IconInstagram = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const IconFacebook = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
import { useTienda } from '../../context/TiendaContext';
import { useBusqueda } from '../../hooks/useBusqueda';
import { ImagenConFallback } from '../ui/ImagenConFallback';
import type { Producto } from '../../types';

export const Header = () => {
  const { config } = useTienda();
  const { resultados, terminoBusqueda, buscar, limpiarBusqueda } = useBusqueda();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleBusqueda = (valor: string) => {
    buscar(valor);
    setDropdownVisible(valor.length > 0);
  };

  const irAProducto = (producto: Producto) => {
    navigate(`/producto/${producto.id}`);
    limpiarBusqueda();
    setDropdownVisible(false);
  };

  const irABuscar = (e: React.FormEvent) => {
    e.preventDefault();
    if (terminoBusqueda.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(terminoBusqueda)}`);
      setDropdownVisible(false);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      {/* Barra superior con redes sociales */}
      <div className="bg-primary text-white py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
          <span className="font-medium hidden sm:block">{config.slogan}</span>
          <div className="flex items-center gap-3 ml-auto">
            <a
              href={config.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary-100 transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">WhatsApp</span>
            </a>
            <a
              href={config.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary-100 transition-colors"
              aria-label="Instagram"
            >
              <IconInstagram />
              <span className="hidden sm:inline text-xs">Instagram</span>
            </a>
            <a
              href={config.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary-100 transition-colors"
              aria-label="Facebook"
            >
              <IconFacebook />
              <span className="hidden sm:inline text-xs">Facebook</span>
            </a>
          </div>
        </div>
      </div>

      {/* Header principal */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            {config.logoUrl ? (
              <img
                src={config.logoUrl}
                alt={`Logo ${config.nombreTienda}`}
                className="h-12 w-12 object-contain rounded-xl"
              />
            ) : (
              <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
            )}
            <div className="hidden sm:block">
              <p className="font-bold text-dark text-lg leading-tight">{config.nombreTienda}</p>
              <p className="text-xs text-gray-500">Papelería</p>
            </div>
          </Link>

          {/* Búsqueda global */}
          <div className="flex-1 relative" ref={searchRef}>
            <form onSubmit={irABuscar}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={terminoBusqueda}
                  onChange={(e) => handleBusqueda(e.target.value)}
                  onFocus={() => terminoBusqueda && setDropdownVisible(true)}
                  className="input-field pl-10 pr-4 h-11"
                />
                {terminoBusqueda && (
                  <button
                    type="button"
                    onClick={() => { limpiarBusqueda(); setDropdownVisible(false); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </form>

            {/* Dropdown de resultados en tiempo real */}
            {dropdownVisible && terminoBusqueda && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-80 overflow-y-auto animate-slide-up">
                {resultados.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No se encontraron productos para "{terminoBusqueda}"
                  </div>
                ) : (
                  <>
                    <div className="p-2">
                      {resultados.slice(0, 6).map((producto) => (
                        <button
                          key={producto.id}
                          onClick={() => irAProducto(producto)}
                          className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-primary-50 transition-colors text-left"
                        >
                          <ImagenConFallback
                            src={producto.imagen}
                            alt={producto.nombre}
                            className="h-10 w-10 rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-dark truncate">{producto.nombre}</p>
                            <p className="text-xs text-primary font-semibold">${producto.precio.toFixed(2)}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                    {resultados.length > 6 && (
                      <div className="border-t border-gray-100 p-2">
                        <button
                          onClick={() => {
                            navigate(`/buscar?q=${encodeURIComponent(terminoBusqueda)}`);
                            setDropdownVisible(false);
                          }}
                          className="w-full text-center text-sm text-primary font-semibold py-2 hover:bg-primary-50 rounded-xl transition-colors"
                        >
                          Ver todos los resultados ({resultados.length})
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Navegación desktop */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary transition-colors">
              Inicio
            </Link>
            <Link to="/contacto" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary transition-colors">
              Contacto
            </Link>
          </nav>

          {/* Menú hamburguesa mobile */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-label="Menú"
          >
            {menuAbierto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Menú mobile */}
        {menuAbierto && (
          <nav className="md:hidden mt-3 pb-2 border-t border-gray-100 pt-3 flex flex-col gap-1 animate-slide-up">
            <Link
              to="/"
              onClick={() => setMenuAbierto(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary transition-colors"
            >
              Inicio
            </Link>
            <Link
              to="/contacto"
              onClick={() => setMenuAbierto(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary transition-colors"
            >
              Contacto
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};
