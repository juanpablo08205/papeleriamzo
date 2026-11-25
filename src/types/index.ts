// Tipos principales de la aplicación Papelería Manzanillo

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categoriaId: string;
  stock: number;
  destacado: boolean;
  creadoEn: Date | any;
  actualizadoEn: Date | any;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  orden: number;
  creadoEn: Date | any;
}

export interface Sucursal {
  id: string;
  nombre: string;
  direccion: string;
  lat: number;
  lng: number;
  horario: string;
  telefono: string;
  creadoEn: Date | any;
}

export interface ConfigTienda {
  logoUrl: string;
  nombreTienda: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  slogan: string;
}

export interface Usuario {
  uid: string;
  email: string;
  role: 'admin' | 'user';
  nombre: string;
  creadoEn: Date | any;
}

// Estado de carga genérico
export type EstadoCarga = 'idle' | 'cargando' | 'exitoso' | 'error';

// Formulario de producto
export type FormularioProducto = Omit<Producto, 'id' | 'creadoEn' | 'actualizadoEn'>;

// Formulario de categoría
export type FormularioCategoria = Omit<Categoria, 'id' | 'creadoEn'>;

// Formulario de sucursal
export type FormularioSucursal = Omit<Sucursal, 'id' | 'creadoEn'>;
