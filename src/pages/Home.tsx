// Página principal - banner, categorías, destacados y mapa
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, ShieldCheck, Headphones } from 'lucide-react';
import { useCategorias } from '../hooks/useCategorias';
import { useProductos } from '../hooks/useProductos';
import { useSucursales } from '../hooks/useSucursales';
import { TarjetaCategoria, SkeletonCategoria } from '../components/catalog/TarjetaCategoria';
import { TarjetaProducto, SkeletonProducto } from '../components/catalog/TarjetaProducto';
import { MapaSucursales } from '../components/map/MapaSucursales';
import { useTienda } from '../context/TiendaContext';

const beneficios = [
  { icono: Star, titulo: 'Calidad Garantizada', desc: 'Las mejores marcas del mercado' },
  { icono: Truck, titulo: 'Entrega Local', desc: 'Contáctanos para entregas a domicilio' },
  { icono: ShieldCheck, titulo: 'Precios Justos', desc: 'Los mejores precios de Manzanillo' },
  { icono: Headphones, titulo: 'Atención Personalizada', desc: 'Te asesoramos en tu compra' },
];

export const Home = () => {
  const { config } = useTienda();
  const { categorias, cargando: cargandoCats } = useCategorias();
  const { productos, cargando: cargandoProds } = useProductos();
  const { sucursales } = useSucursales();

  const destacados = productos.filter(p => p.destacado).slice(0, 8);

  return (
    <div>
      {/* Banner Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary to-primary-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 h-40 w-40 rounded-full bg-white" />
          <div className="absolute bottom-0 right-20 h-60 w-60 rounded-full bg-white" />
          <div className="absolute top-1/2 left-1/3 h-20 w-20 rounded-full bg-white" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <p className="text-primary-100 font-semibold mb-2 text-sm uppercase tracking-widest">
              Bienvenido a
            </p>
            <h1 className="text-white font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-4">
              {config.nombreTienda}
            </h1>
            <p className="text-primary-100 text-lg md:text-xl mb-8 leading-relaxed">
              {config.slogan}. Encuentra todo lo que necesitas para la escuela, la oficina y tus proyectos creativos.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/buscar?q="
                className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3"
              >
                Ver productos
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/contacto" className="bg-white/20 text-white border-2 border-white/40 px-8 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-200 inline-flex items-center gap-2">
                Nuestras sucursales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="bg-white py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {beneficios.map(({ icono: Icono, titulo, desc }) => (
              <div key={titulo} className="flex items-center gap-3 py-2">
                <div className="p-2.5 bg-primary-50 rounded-xl shrink-0">
                  <Icono className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-dark text-sm">{titulo}</p>
                  <p className="text-gray-500 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-dark">Nuestras Categorías</h2>
            <p className="text-gray-500 text-sm mt-1">Explora nuestra amplia selección de productos</p>
          </div>
          <Link to="/buscar?q=" className="text-primary font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
            Ver todo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {cargandoCats
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonCategoria key={i} />)
            : categorias.map(cat => <TarjetaCategoria key={cat.id} categoria={cat} />)
          }
        </div>
      </section>

      {/* Productos destacados */}
      <section className="bg-primary-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-dark">Productos Destacados</h2>
              <p className="text-gray-500 text-sm mt-1">Los favoritos de nuestros clientes</p>
            </div>
            <Link to="/buscar?q=" className="text-primary font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
              Ver todos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {cargandoProds
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonProducto key={i} />)
              : destacados.map(p => <TarjetaProducto key={p.id} producto={p} />)
            }
          </div>
        </div>
      </section>

      {/* Mapa de sucursales */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-dark">Nuestras Sucursales</h2>
          <p className="text-gray-500 text-sm mt-1">Encuéntranos en Manzanillo, Colima</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <MapaSucursales sucursales={sucursales} altura="380px" />
          </div>
          <div className="flex flex-col gap-4">
            {sucursales.map(suc => (
              <div key={suc.id} className="card p-4">
                <h3 className="font-bold text-dark mb-1">{suc.nombre}</h3>
                <p className="text-gray-500 text-sm mb-2">{suc.direccion}</p>
                <p className="text-xs text-gray-400">{suc.horario}</p>
                {suc.telefono && (
                  <a href={`tel:${suc.telefono}`} className="text-primary text-sm font-medium mt-1 block hover:underline">
                    {suc.telefono}
                  </a>
                )}
              </div>
            ))}
            <Link to="/contacto" className="btn-secondary text-center text-sm">
              Ver todas las sucursales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
