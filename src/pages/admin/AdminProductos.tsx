// Gestión de productos en el panel de administración
import { useState, useRef, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, Check, X } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { FormularioProducto } from '../../components/admin/FormularioProducto';
import { Modal } from '../../components/ui/Modal';
import { ConfirmarEliminar } from '../../components/ui/ConfirmarEliminar';
import { ImagenConFallback } from '../../components/ui/ImagenConFallback';
import { Spinner } from '../../components/ui/Spinner';
import { useProductos } from '../../hooks/useProductos';
import { useCategorias } from '../../hooks/useCategorias';
import type { Producto, FormularioProducto as TFormulario } from '../../types';

export const AdminProductos = () => {
  const { productos, cargando, agregarProducto, editarProducto, actualizarPrecio, eliminarProducto } = useProductos();
  const { categorias } = useCategorias();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditando, setProductoEditando] = useState<Producto | undefined>();
  const [productoEliminando, setProductoEliminando] = useState<Producto | undefined>();
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');

  // Edición inline de precio
  const [editandoPrecioId, setEditandoPrecioId] = useState<string | null>(null);
  const [nuevoPrecio, setNuevoPrecio] = useState('');
  const precioInputRef = useRef<HTMLInputElement>(null);

  // Filtrado de productos
  const productosFiltrados = productos.filter(p => {
    const matchBusqueda = p.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase());
    const matchCategoria = !filtroCategoria || p.categoriaId === filtroCategoria;
    return matchBusqueda && matchCategoria;
  });

  const handleGuardar = useCallback(async (form: TFormulario) => {
    if (productoEditando) {
      await editarProducto(productoEditando.id, form);
    } else {
      await agregarProducto(form);
    }
    setModalAbierto(false);
    setProductoEditando(undefined);
  }, [productoEditando, editarProducto, agregarProducto]);

  const handleEditar = (producto: Producto) => {
    setProductoEditando(producto);
    setModalAbierto(true);
  };

  const handleEliminar = async () => {
    if (!productoEliminando) return;
    await eliminarProducto(productoEliminando.id);
    setProductoEliminando(undefined);
  };

  // Iniciar edición de precio inline
  const iniciarEditarPrecio = (producto: Producto) => {
    setEditandoPrecioId(producto.id);
    setNuevoPrecio(producto.precio.toFixed(2));
    setTimeout(() => precioInputRef.current?.select(), 50);
  };

  const confirmarPrecio = async (id: string) => {
    const precio = parseFloat(nuevoPrecio);
    if (!isNaN(precio) && precio > 0) {
      await actualizarPrecio(id, precio);
    }
    setEditandoPrecioId(null);
  };

  const getNombreCategoria = (id: string) => categorias.find(c => c.id === id)?.nombre || '—';

  return (
    <AdminLayout titulo="Gestión de Productos">
      <div className="space-y-4">
        {/* Barra de herramientas */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={filtroBusqueda}
              onChange={e => setFiltroBusqueda(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={filtroCategoria}
            onChange={e => setFiltroCategoria(e.target.value)}
            className="input-field sm:w-48"
          >
            <option value="">Todas las categorías</option>
            {categorias.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
          <button
            onClick={() => { setProductoEditando(undefined); setModalAbierto(true); }}
            className="btn-primary flex items-center gap-2 shrink-0"
          >
            <Plus className="h-4 w-4" />
            Nuevo Producto
          </button>
        </div>

        {/* Contador */}
        <p className="text-sm text-gray-500">
          {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? 's' : ''}
          {filtroBusqueda || filtroCategoria ? ' (filtrado)' : ' en total'}
        </p>

        {/* Tabla */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {cargando ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : productosFiltrados.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No hay productos que coincidan con los filtros</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-left">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Producto</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Categoría</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Stock</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {productosFiltrados.map(producto => (
                    <tr key={producto.id} className="hover:bg-gray-50 transition-colors">
                      {/* Producto */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <ImagenConFallback
                            src={producto.imagen}
                            alt={producto.nombre}
                            className="h-10 w-10 rounded-xl shrink-0"
                          />
                          <div>
                            <p className="font-medium text-sm text-dark line-clamp-1">{producto.nombre}</p>
                            {producto.destacado && (
                              <span className="text-xs text-primary font-medium">⭐ Destacado</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Categoría */}
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-sm text-gray-500">{getNombreCategoria(producto.categoriaId)}</span>
                      </td>

                      {/* Precio editable inline */}
                      <td className="px-4 py-3">
                        {editandoPrecioId === producto.id ? (
                          <div className="flex items-center gap-1">
                            <span className="text-gray-400 text-sm">$</span>
                            <input
                              ref={precioInputRef}
                              type="number"
                              value={nuevoPrecio}
                              onChange={e => setNuevoPrecio(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') confirmarPrecio(producto.id);
                                if (e.key === 'Escape') setEditandoPrecioId(null);
                              }}
                              className="w-24 border border-primary rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                              step="0.50"
                              min="0"
                              autoFocus
                            />
                            <button onClick={() => confirmarPrecio(producto.id)} className="p-1 text-green-600 hover:bg-green-50 rounded">
                              <Check className="h-4 w-4" />
                            </button>
                            <button onClick={() => setEditandoPrecioId(null)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => iniciarEditarPrecio(producto)}
                            className="font-semibold text-primary text-sm hover:underline cursor-pointer"
                            title="Clic para editar precio"
                          >
                            ${producto.precio.toFixed(2)}
                          </button>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className={`badge ${
                          producto.stock === 0 ? 'bg-red-50 text-red-600' :
                          producto.stock <= 5 ? 'bg-yellow-50 text-yellow-700' :
                          'bg-green-50 text-green-700'
                        }`}>
                          {producto.stock}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditar(producto)}
                            className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setProductoEliminando(producto)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de formulario */}
      <Modal
        abierto={modalAbierto}
        onCerrar={() => { setModalAbierto(false); setProductoEditando(undefined); }}
        titulo={productoEditando ? 'Editar Producto' : 'Nuevo Producto'}
        ancho="xl"
      >
        <FormularioProducto
          producto={productoEditando}
          categorias={categorias}
          onGuardar={handleGuardar}
          onCancelar={() => { setModalAbierto(false); setProductoEditando(undefined); }}
        />
      </Modal>

      {/* Confirmación de eliminación */}
      <ConfirmarEliminar
        abierto={!!productoEliminando}
        onCerrar={() => setProductoEliminando(undefined)}
        onConfirmar={handleEliminar}
        titulo="Eliminar Producto"
        mensaje={`¿Estás seguro de eliminar "${productoEliminando?.nombre}"? Esta acción no se puede deshacer.`}
      />
    </AdminLayout>
  );
};
