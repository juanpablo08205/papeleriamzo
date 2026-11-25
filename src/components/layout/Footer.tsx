// Footer de la tienda con información de contacto y redes sociales
import { Link } from 'react-router-dom';
import { MessageCircle, BookOpen, MapPin, Phone } from 'lucide-react';
import { useTienda } from '../../context/TiendaContext';

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

export const Footer = () => {
  const { config } = useTienda();

  return (
    <footer className="bg-dark text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo e info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center">
                {config.logoUrl ? (
                  <img src={config.logoUrl} alt="Logo" className="h-10 w-10 object-contain rounded-lg" />
                ) : (
                  <BookOpen className="h-7 w-7 text-white" />
                )}
              </div>
              <div>
                <p className="font-bold text-lg">{config.nombreTienda}</p>
                <p className="text-sm text-gray-400">Papelería</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {config.slogan}. Tu destino favorito para material escolar, de oficina y arte en Manzanillo.
            </p>
          </div>

          {/* Links rápidos */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-primary mb-4">Navegación</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">Inicio</Link></li>
              <li><Link to="/contacto" className="text-gray-400 hover:text-white text-sm transition-colors">Sucursales y Contacto</Link></li>
              <li><Link to="/buscar?q=" className="text-gray-400 hover:text-white text-sm transition-colors">Todos los Productos</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-white text-sm transition-colors">Administración</Link></li>
            </ul>
          </div>

          {/* Redes sociales y contacto */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-primary mb-4">Síguenos</h4>
            <div className="flex flex-col gap-3">
              <a
                href={config.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-400 hover:text-green-400 transition-colors group"
              >
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-green-500/20 transition-colors">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <span className="text-sm">WhatsApp</span>
              </a>
              <a
                href={config.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-400 hover:text-pink-400 transition-colors group"
              >
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-pink-500/20 transition-colors">
                  <IconInstagram />
                </div>
                <span className="text-sm">Instagram</span>
              </a>
              <a
                href={config.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition-colors group"
              >
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                  <IconFacebook />
                </div>
                <span className="text-sm">Facebook</span>
              </a>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Manzanillo, Colima, México</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span>314 123 4567</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-gray-500 text-xs">
          <p>© {new Date().getFullYear()} {config.nombreTienda}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
