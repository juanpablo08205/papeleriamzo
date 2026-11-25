// Página de contacto con mapa y sucursales
import { MessageCircle, MapPin, Clock, Phone } from 'lucide-react';

const IconInstagram = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const IconFacebook = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
import { useSucursales } from '../hooks/useSucursales';
import { useTienda } from '../context/TiendaContext';
import { MapaSucursales } from '../components/map/MapaSucursales';

export const ContactoPage = () => {
  const { config } = useTienda();
  const { sucursales, cargando } = useSucursales();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark">Contacto y Sucursales</h1>
        <p className="text-gray-500 mt-2">Encuéntranos en Manzanillo, Colima. ¡Estamos para ayudarte!</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Mapa */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-dark mb-4">Mapa de Sucursales</h2>
          {!cargando && <MapaSucursales sucursales={sucursales} altura="450px" />}
        </div>

        {/* Información de contacto y sucursales */}
        <div className="space-y-6">
          {/* Redes sociales */}
          <div className="card p-6">
            <h3 className="font-bold text-dark mb-4">Síguenos y contáctanos</h3>
            <div className="space-y-3">
              <a
                href={config.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group"
              >
                <div className="p-2 bg-green-500 rounded-lg">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">WhatsApp</p>
                  <p className="text-xs text-gray-500">Escríbenos ahora</p>
                </div>
              </a>
              <a
                href={config.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors"
              >
                <div className="p-2 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-lg">
                  <IconInstagram />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">Instagram</p>
                  <p className="text-xs text-gray-500">@papeleriamanzanillo</p>
                </div>
              </a>
              <a
                href={config.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
              >
                <div className="p-2 bg-blue-600 rounded-lg">
                  <IconFacebook />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">Facebook</p>
                  <p className="text-xs text-gray-500">Papelería Manzanillo</p>
                </div>
              </a>
            </div>
          </div>

          {/* Lista de sucursales */}
          <div>
            <h3 className="font-bold text-dark mb-3">Nuestras Sucursales</h3>
            <div className="space-y-4">
              {cargando
                ? Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="card p-4">
                      <div className="skeleton h-4 rounded w-1/2 mb-2" />
                      <div className="skeleton h-3 rounded w-full mb-1" />
                      <div className="skeleton h-3 rounded w-3/4" />
                    </div>
                  ))
                : sucursales.map(suc => (
                    <div key={suc.id} className="card p-4">
                      <h4 className="font-bold text-dark text-sm mb-2">{suc.nombre}</h4>
                      <div className="space-y-1.5">
                        <div className="flex items-start gap-2 text-gray-500 text-xs">
                          <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{suc.direccion}</span>
                        </div>
                        <div className="flex items-start gap-2 text-gray-500 text-xs">
                          <Clock className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{suc.horario}</span>
                        </div>
                        {suc.telefono && (
                          <div className="flex items-center gap-2 text-xs">
                            <Phone className="h-3.5 w-3.5 text-primary" />
                            <a href={`tel:${suc.telefono}`} className="text-primary hover:underline font-medium">
                              {suc.telefono}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
