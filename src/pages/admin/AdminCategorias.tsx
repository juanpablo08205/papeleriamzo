// Gestión de categorías en el panel de administración
import { useState } from 'react';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Modal } from '../../components/ui/Modal';
import { ConfirmarEliminar } from '../../components/ui/ConfirmarEliminar';
import { Spinner } from '../../components/ui/Spinner';
import { useCategorias } from '../../hooks/useCategorias';
import type { Categoria, FormularioCategoria } from '../../types';

const FormCategoria = ({
  categoria,
  onGuardar,
  onCancelar,
}: {
  categoria?: Categoria;
  onGuardar: (data: FormularioCategoria) => Promise<void>;
  onCancelar: () => void;
}) => {
  const [form, setForm] = useState<FormularioCategoria>({
    nombre: categoria?.nombre || '',
    descripcion: categoria?.descripcion || '',
    imagen: categoria?.imagen || '',
    orden: categoria?.orden || 0,
  });
  const [guardando, setGuardando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    setGuardando(true);
    try {
      await onGuardar(form);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
        <input
          type="text"
          value={form.nombre}
          onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
          className="input-field"
          placeholder="Ej: Cuadernos y Libretas"
          required
          disabled={guardando}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea
          value={form.descripcion}
          onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
          className="input-field resize-none"
          rows={2}
          placeholder="Breve descripción de la categoría"
          disabled={guardando}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">URL de imagen</label>
        <input
          type="url"
          value={form.imagen}
          onChange={e => setForm(f => ({ ...f, imagen: e.target.value }))}
          className="input-field"
          placeholder="https://..."
          disabled={guardando}
        />
        {form.imagen && (
          <img src={form.imagen} alt="Vista previa" className="mt-2 h-20 w-full object-cover rounded-xl" />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Orden de aparición</label>
        <input
          type="number"
          value={form.orden}
          onChange={e => setForm(f => ({ ...f, orden: Number(e.target.value) }))}
          className="input-field"
          min="0"
          disabled={guardando}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancelar} className="btn-secondary flex-1" disabled={guardando}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={guardando}>
          {guardando ? <><Spinner size="sm" color="text-white" /> Guardando...</> : 'Guardar'}
        </button>
      </div>
    </form>
  );
};

export const AdminCategorias = () => {
  const { categorias, cargando, agregarCategoria, editarCategoria, eliminarCategoria } = useCategorias();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | undefined>();
  const [categoriaEliminando, setCategoriaEliminando] = useState<Categoria | undefined>();

  const handleGuardar = async (form: FormularioCategoria) => {
    if (categoriaEditando) {
      await editarCategoria(categoriaEditando.id, form);
    } else {
      await agregarCategoria(form);
    }
    setModalAbierto(false);
    setCategoriaEditando(undefined);
  };

  return (
    <AdminLayout titulo="Gestión de Categorías">
      <div className="space-y-4">
        {/* Botón agregar */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">{categorias.length} categoría{categorias.length !== 1 ? 's' : ''}</p>
          <button
            onClick={() => { setCategoriaEditando(undefined); setModalAbierto(true); }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nueva Categoría
          </button>
        </div>

        {/* Lista de categorías */}
        {cargando ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : (
          <div className="grid gap-3">
            {categorias.map(cat => (
              <div key={cat.id} className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
                <GripVertical className="h-5 w-5 text-gray-300 shrink-0" />
                <div className="h-16 w-16 rounded-xl overflow-hidden bg-primary-50 shrink-0">
                  {cat.imagen ? (
                    <img src={cat.imagen} alt={cat.nombre} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-300 text-xs">Sin img</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-dark">{cat.nombre}</p>
                  <p className="text-sm text-gray-500 truncate">{cat.descripcion}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Orden: {cat.orden}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => { setCategoriaEditando(cat); setModalAbierto(true); }}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary-50 rounded-xl transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setCategoriaEliminando(cat)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {categorias.length === 0 && (
              <div className="text-center py-12 text-gray-400 bg-white rounded-2xl">
                No hay categorías. ¡Crea la primera!
              </div>
            )}
          </div>
        )}
      </div>

      <Modal
        abierto={modalAbierto}
        onCerrar={() => { setModalAbierto(false); setCategoriaEditando(undefined); }}
        titulo={categoriaEditando ? 'Editar Categoría' : 'Nueva Categoría'}
      >
        <FormCategoria
          categoria={categoriaEditando}
          onGuardar={handleGuardar}
          onCancelar={() => { setModalAbierto(false); setCategoriaEditando(undefined); }}
        />
      </Modal>

      <ConfirmarEliminar
        abierto={!!categoriaEliminando}
        onCerrar={() => setCategoriaEliminando(undefined)}
        onConfirmar={async () => {
          if (categoriaEliminando) await eliminarCategoria(categoriaEliminando.id);
          setCategoriaEliminando(undefined);
        }}
        titulo="Eliminar Categoría"
        mensaje={`¿Eliminar la categoría "${categoriaEliminando?.nombre}"? Los productos de esta categoría quedarán sin categoría asignada.`}
      />
    </AdminLayout>
  );
};
