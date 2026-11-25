// Mapa interactivo de sucursales usando Leaflet + OpenStreetMap
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { MapPin, Clock, Phone } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import type { Sucursal } from '../../types';

// Corregir icono de marcador (problema conocido de Leaflet con bundlers)
const markerIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapaSucursalesProps {
  sucursales: Sucursal[];
  altura?: string;
}

export const MapaSucursales = ({ sucursales, altura = '400px' }: MapaSucursalesProps) => {
  // Centro del mapa: Manzanillo, Colima
  const centro: [number, number] = sucursales.length > 0
    ? [sucursales[0].lat, sucursales[0].lng]
    : [19.1052, -104.3188];

  if (sucursales.length === 0) {
    return (
      <div
        style={{ height: altura }}
        className="flex items-center justify-center bg-primary-50 rounded-2xl text-gray-400"
      >
        <div className="flex flex-col items-center gap-2">
          <MapPin className="h-8 w-8 opacity-40" />
          <p>No hay sucursales registradas</p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={centro}
      zoom={13}
      style={{ height: altura }}
      className="rounded-2xl z-10"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {sucursales.map((sucursal) => (
        <Marker
          key={sucursal.id}
          position={[sucursal.lat, sucursal.lng]}
          icon={markerIcon}
        >
          <Popup>
            <div className="min-w-[200px]">
              <h3 className="font-bold text-dark text-sm mb-2">{sucursal.nombre}</h3>
              <div className="flex items-start gap-1.5 text-gray-600 text-xs mb-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <span>{sucursal.direccion}</span>
              </div>
              <div className="flex items-start gap-1.5 text-gray-600 text-xs mb-1.5">
                <Clock className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <span>{sucursal.horario}</span>
              </div>
              {sucursal.telefono && (
                <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  <a href={`tel:${sucursal.telefono}`} className="hover:text-primary">
                    {sucursal.telefono}
                  </a>
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
