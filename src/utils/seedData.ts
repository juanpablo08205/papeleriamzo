// Datos de ejemplo para inicializar la aplicación
import { collection, addDoc, getDocs, query, limit, setDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import type { Categoria, Producto, Sucursal, ConfigTienda } from '../types';

// Datos iniciales de categorías
const categoriasIniciales: Omit<Categoria, 'id'>[] = [
  {
    nombre: 'Cuadernos y Libretas',
    descripcion: 'Cuadernos escolares, libretas, agendas y más',
    imagen: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400',
    orden: 1,
    creadoEn: new Date(),
  },
  {
    nombre: 'Lápices y Plumas',
    descripcion: 'Lápices, plumas, marcadores y bolígrafos de todas las marcas',
    imagen: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400',
    orden: 2,
    creadoEn: new Date(),
  },
  {
    nombre: 'Arte y Manualidades',
    descripcion: 'Pinturas, pinceles, colores y materiales para arte',
    imagen: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400',
    orden: 3,
    creadoEn: new Date(),
  },
  {
    nombre: 'Mochilas y Bolsos',
    descripcion: 'Mochilas escolares, maletines y estuches',
    imagen: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    orden: 4,
    creadoEn: new Date(),
  },
  {
    nombre: 'Tintas y Cartuchos',
    descripcion: 'Tintas para impresora, cartuchos y tóners compatibles',
    imagen: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400',
    orden: 5,
    creadoEn: new Date(),
  },
];

// Datos iniciales de productos
const getProductosIniciales = (categorias: Categoria[]): Omit<Producto, 'id'>[] => {
  const getCatId = (nombre: string) => categorias.find(c => c.nombre === nombre)?.id || '';

  return [
    // Cuadernos
    {
      nombre: 'Cuaderno Scribe Profesional 100 Hojas',
      descripcion: 'Cuaderno universitario profesional con 100 hojas cuadriculadas, pasta dura y espiral metálico. Ideal para estudiantes y profesionales.',
      precio: 45.00,
      imagen: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400',
      categoriaId: getCatId('Cuadernos y Libretas'),
      stock: 150,
      destacado: true,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    },
    {
      nombre: 'Libreta Oxford A5 Rayas',
      descripcion: 'Libreta compacta A5 con hojas rayadas de alta calidad, cubierta resistente y encuadernación cosida.',
      precio: 28.50,
      imagen: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
      categoriaId: getCatId('Cuadernos y Libretas'),
      stock: 80,
      destacado: false,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    },
    {
      nombre: 'Agenda Semanal 2024',
      descripcion: 'Agenda semanal con vista mensual, espacio para notas, portada de tela y marcador de página.',
      precio: 95.00,
      imagen: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=400',
      categoriaId: getCatId('Cuadernos y Libretas'),
      stock: 40,
      destacado: true,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    },
    {
      nombre: 'Block de Notas Adhesivas Colores',
      descripcion: 'Set de 4 bloques de notas adhesivas en colores pastel, 100 hojas cada uno.',
      precio: 32.00,
      imagen: 'https://images.unsplash.com/photo-1586892478025-2b5472316f22?w=400',
      categoriaId: getCatId('Cuadernos y Libretas'),
      stock: 200,
      destacado: false,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    },
    // Lápices y plumas
    {
      nombre: 'Set Lápices Faber-Castell 12 piezas',
      descripcion: 'Set de 12 lápices de grafito con durómetros del 2H al 8B, ideales para dibujo técnico y artístico.',
      precio: 120.00,
      imagen: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400',
      categoriaId: getCatId('Lápices y Plumas'),
      stock: 60,
      destacado: true,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    },
    {
      nombre: 'Pluma Pilot BPS-GP Medium',
      descripcion: 'Pluma de tinta líquida de punta media, escritura suave y fluida. Resistente y cómoda para uso diario.',
      precio: 15.00,
      imagen: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400',
      categoriaId: getCatId('Lápices y Plumas'),
      stock: 300,
      destacado: false,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    },
    {
      nombre: 'Marcadores Expo Punta Gruesa x4',
      descripcion: 'Set de 4 marcadores para pizarrón de punta gruesa en colores negro, rojo, azul y verde.',
      precio: 55.00,
      imagen: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400',
      categoriaId: getCatId('Lápices y Plumas'),
      stock: 90,
      destacado: false,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    },
    {
      nombre: 'Bolígrafo Gel Sakura Gelly Roll',
      descripcion: 'Bolígrafo de gel de alta calidad con tinta de secado rápido, punta de 0.5mm para escritura precisa.',
      precio: 22.00,
      imagen: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=400',
      categoriaId: getCatId('Lápices y Plumas'),
      stock: 120,
      destacado: true,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    },
    // Arte y Manualidades
    {
      nombre: 'Set Acuarelas Profesionales 24 colores',
      descripcion: 'Set de 24 acuarelas profesionales en pastilla con colores vibrantes y larga duración.',
      precio: 185.00,
      imagen: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400',
      categoriaId: getCatId('Arte y Manualidades'),
      stock: 35,
      destacado: true,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    },
    {
      nombre: 'Colores Prismacolor Premier 36 piezas',
      descripcion: 'Set de 36 lápices de colores Prismacolor con núcleo suave para mezcla y capas perfectas.',
      precio: 420.00,
      imagen: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=400',
      categoriaId: getCatId('Arte y Manualidades'),
      stock: 20,
      destacado: true,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    },
    {
      nombre: 'Canvas Lienzo 30x40cm',
      descripcion: 'Lienzo de algodón de alta calidad sobre bastidor de madera, listo para pintar.',
      precio: 65.00,
      imagen: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400',
      categoriaId: getCatId('Arte y Manualidades'),
      stock: 50,
      destacado: false,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    },
    {
      nombre: 'Set Pinceles Artist Redondo x10',
      descripcion: 'Set de 10 pinceles para acuarela y acrílico, cerdas sintéticas de alta calidad.',
      precio: 78.00,
      imagen: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
      categoriaId: getCatId('Arte y Manualidades'),
      stock: 45,
      destacado: false,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    },
    // Mochilas
    {
      nombre: 'Mochila Escolar Nike Heritage',
      descripcion: 'Mochila ergonómica con compartimento principal amplio, bolsillo para laptop hasta 15" y correas acolchadas.',
      precio: 650.00,
      imagen: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
      categoriaId: getCatId('Mochilas y Bolsos'),
      stock: 25,
      destacado: true,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    },
    {
      nombre: 'Estuche Porta Lápices Oxford',
      descripcion: 'Estuche ergonómico con múltiples compartimentos, cierre de cremallera resistente y material lavable.',
      precio: 95.00,
      imagen: 'https://images.unsplash.com/photo-1581952976147-5a2d15560349?w=400',
      categoriaId: getCatId('Mochilas y Bolsos'),
      stock: 70,
      destacado: false,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    },
    {
      nombre: 'Mochila Urbana Antirrobo 30L',
      descripcion: 'Mochila con cierre oculto en la espalda, puerto USB externo, material impermeable.',
      precio: 850.00,
      imagen: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400',
      categoriaId: getCatId('Mochilas y Bolsos'),
      stock: 15,
      destacado: false,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    },
    {
      nombre: 'Porta Laptop Maletín 15.6"',
      descripcion: 'Maletín de tela con compartimentos organizados, asa y correa de hombro, protección para laptop.',
      precio: 320.00,
      imagen: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=400',
      categoriaId: getCatId('Mochilas y Bolsos'),
      stock: 30,
      destacado: true,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    },
    // Tintas
    {
      nombre: 'Tinta Epson T544 Negro Original',
      descripcion: 'Cartucho de tinta negra original Epson para impresoras EcoTank. Alto rendimiento.',
      precio: 180.00,
      imagen: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400',
      categoriaId: getCatId('Tintas y Cartuchos'),
      stock: 80,
      destacado: true,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    },
    {
      nombre: 'Tinta HP 664 Tri-color Original',
      descripcion: 'Cartucho tricolor original HP para series 2100, 2600, 3700. Colores vivos y duraderos.',
      precio: 215.00,
      imagen: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
      categoriaId: getCatId('Tintas y Cartuchos'),
      stock: 60,
      destacado: false,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    },
    {
      nombre: 'Set Tintas Recargables Epson 4 colores',
      descripcion: 'Set de 4 tintas recargables compatibles Epson en negro, cian, magenta y amarillo.',
      precio: 320.00,
      imagen: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400',
      categoriaId: getCatId('Tintas y Cartuchos'),
      stock: 45,
      destacado: false,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    },
    {
      nombre: 'Tóner Canon 045H Negro',
      descripcion: 'Tóner de alto rendimiento para impresoras láser Canon LBP610, MF630. Rinde hasta 2,800 páginas.',
      precio: 890.00,
      imagen: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400',
      categoriaId: getCatId('Tintas y Cartuchos'),
      stock: 20,
      destacado: false,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    },
  ];
};

// Sucursales de ejemplo en Manzanillo, Colima
const sucursalesIniciales: Omit<Sucursal, 'id'>[] = [
  {
    nombre: 'Sucursal Centro',
    direccion: 'Av. México 123, Centro, Manzanillo, Col.',
    lat: 19.1052,
    lng: -104.3188,
    horario: 'Lun-Sáb: 9:00am - 8:00pm | Dom: 10:00am - 6:00pm',
    telefono: '314 123 4567',
    creadoEn: new Date(),
  },
  {
    nombre: 'Sucursal Las Brisas',
    direccion: 'Blvd. Costera Miguel de la Madrid 500, Las Brisas, Manzanillo, Col.',
    lat: 19.0901,
    lng: -104.3302,
    horario: 'Lun-Sáb: 9:00am - 7:00pm | Dom: Cerrado',
    telefono: '314 987 6543',
    creadoEn: new Date(),
  },
];

// Configuración inicial de la tienda
const configInicial: ConfigTienda = {
  logoUrl: '',
  nombreTienda: 'Papelería Manzanillo',
  whatsapp: 'https://wa.me/523141234567',
  instagram: 'https://instagram.com/papeleriamanzanillo',
  facebook: 'https://facebook.com/papeleriamanzanillo',
  slogan: 'Todo para tu escuela, oficina y arte',
};

// Función principal para sembrar datos en Firestore
export const sembrarDatos = async () => {
  try {
    // Verificar si ya existen datos
    const catQuery = query(collection(db, 'categorias'), limit(1));
    const catSnap = await getDocs(catQuery);

    if (!catSnap.empty) {
      console.log('Los datos ya existen en Firestore');
      return;
    }

    console.log('Sembrando datos iniciales...');

    // Crear categorías
    const categoriasCreadas: Categoria[] = [];
    for (const cat of categoriasIniciales) {
      const ref = await addDoc(collection(db, 'categorias'), cat);
      categoriasCreadas.push({ ...cat, id: ref.id } as Categoria);
    }

    // Crear productos
    const productos = getProductosIniciales(categoriasCreadas);
    for (const prod of productos) {
      await addDoc(collection(db, 'productos'), prod);
    }

    // Crear sucursales
    for (const suc of sucursalesIniciales) {
      await addDoc(collection(db, 'sucursales'), suc);
    }

    // Guardar configuración inicial
    await setDoc(doc(db, 'config', 'tienda'), configInicial);

    console.log('Datos sembrados exitosamente');
  } catch (error) {
    console.error('Error al sembrar datos:', error);
  }
};
