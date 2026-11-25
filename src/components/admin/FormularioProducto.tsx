// Formulario para agregar/editar productos (imágenes solo por URL, sin Firebase Storage)
import { useState } from 'react';
import { Link2 } from 'lucide-react';
import { Spinner } from '../ui/Spinner';
import type { Producto, FormularioProducto as TFormulario } from '../../types';
import type { Categoria } from '../../types';

interface FormularioProductoProps {
  producto?: Producto;
  categorias: Categoria[];
  onGuardar: (data: TFormulario) => Promise<void>;
  onCancelar: () => void;
}

const valoresIniciales: TFormulario = {
  nombre: '',
  descripcion: '',
  precio: 0,
  imagen: '',
  categoriaId: '',
  stock: 0,
  destacado: false,
};

export const FormularioProducto = ({
  producto,
  categorias,
  onGuardar,
  onCancelar,
}: FormularioProductoProps) => {
  const [form, setForm] = useState<TFormulario>(
    producto
      ? {
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: producto.precio,
          imagen: producto.imagen,
          categoriaId: producto.categoriaId,
          stock: producto.stock,
          destacado: producto.destacado,
        }
      : valoresIniciales
  );
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState<Partial<Record<keyof TFormulario, string>>>({});

  const validar = (): boolean => {
    const nuevosErrores: typeof errores = {};
    if (!form.nombre.trim()) nuevosErrores.nombre = 'El nombre es requerido';
    if (form.precio <= 0) nuevosErrores.precio = 'El precio debe ser mayor a 0';
    if (!form.categoriaId) nuevosErrores.categoriaId = 'Selecciona una categoría';
    if (form.stock < 0) nuevosErrores.stock = 'El stock no puede ser negativo';
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;
    setGuardando(true);
    try {
      await onGuardar(form);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
        <input
          type="text"
          value={form.nombre}
          onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
          className="input-field"
          placeholder="Ej: Cuaderno Scribe 100 hojas"
          disabled={guardando}
        />
        {errores.nombre && <p className="text-red-500 text-xs mt-1">{errores.nombre}</p>}
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea
          value={form.descripcion}
          onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
          className="input-field resize-none"
          rows={3}
          placeholder="Describe el producto..."
          disabled={guardando}
        />
      </div>

      {/* Precio y Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Precio (MXN) *</label>
          <input
            type="number"
            value={form.precio}
            onChange={e => setForm(f => ({ ...f, precio: Number(e.target.value) }))}
            className="input-field"
            min="0"
            step="0.50"
            disabled={guardando}
          />
          {errores.precio && <p className="text-red-500 text-xs mt-1">{errores.precio}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
          <input
            type="number"
            value={form.stock}
            onChange={e => setForm(f => ({ ...f, stock: Number(e.target.value) }))}
            className="input-field"
            min="0"
            disabled={guardando}
          />
          {errores.stock && <p className="text-red-500 text-xs mt-1">{errores.stock}</p>}
        </div>
      </div>

      {/* Categoría */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
        <select
          value={form.categoriaId}
          onChange={e => setForm(f => ({ ...f, categoriaId: e.target.value }))}
          className="input-field"
          disabled={guardando}
        >
          <option value="">Seleccionar categoría...</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
          ))}
        </select>
        {errores.categoriaId && <p className="text-red-500 text-xs mt-1">{errores.categoriaId}</p>}
      </div>

      {/* Imagen por URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL de la imagen
        </label>
        <div className="relative">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="url"
            value={form.imagen}
            onChange={e => setForm(f => ({ ...f, imagen: e.target.value }))}
            className="input-field pl-10"
            placeholder="https://..."
            disabled={guardando}
          />
        </div>
        {/* Vista previa si hay URL */}
        {form.imagen && (
          <img
            src={form.imagen}
            alt="Vista previa"
            className="mt-2 h-24 w-24 rounded-xl object-cover border border-gray-100"
            onError={e => (e.currentTarget.style.display = 'none')}
          />
        )}
        <p className="text-xs text-gray-400 mt-1.5">
          Sube la foto gratis en{' '}
          <a href="https://imgbb.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            imgbb.com
          </a>
          {' '}o{' '}
          <a href="https://postimages.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            postimages.org
          </a>
          {' '}y pega aquí el enlace directo.
        </p>
      </div>

      {/* Destacado */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="destacado"
          checked={form.destacado}
          onChange={e => setForm(f => ({ ...f, destacado: e.target.checked }))}
          className="h-4 w-4 accent-primary"
          disabled={guardando}
        />
        <label htmlFor="destacado" className="text-sm font-medium text-gray-700 cursor-pointer">
          Producto destacado (aparece en la página principal)
        </label>
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancelar} className="btn-secondary flex-1" disabled={guardando}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={guardando}>
          {guardando ? <><Spinner size="sm" color="text-white" /> Guardando...</> : 'Guardar Producto'}
        </button>
      </div>
    </form>
  );
};
