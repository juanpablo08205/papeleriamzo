// Gestión de sucursales en el panel de administración
import { useState } from 'react';
import { Plus, Pencil, Trash2, MapPin, Clock, Phone } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Modal } from '../../components/ui/Modal';
import { ConfirmarEliminar } from '../../components/ui/ConfirmarEliminar';
import { Spinner } from '../../components/ui/Spinner';
import { MapaSucursales } from '../../components/map/MapaSucursales';
import { useSucursales } from '../../hooks/useSucursales';
import type { Sucursal, FormularioSucursal } from '../../types';

const SUCURSAL_VACIA: FormularioSucursal = {
  nombre: '',
  direccion: '',
  lat: 19.1052,
  lng: -104.3188,
  horario: '',
  telefono: '',
};

const FormSucursal = ({
  sucursal,
  onGuardar,
  onCancelar,
}: {
  sucursal?: Sucursal;
  onGuardar: (data: FormularioSucursal) => Promise<void>;
  onCancelar: () => void;
}) => {
  const [form, setForm] = useState<FormularioSucursal>(
    sucursal
      ? { nombre: sucursal.nombre, direccion: sucursal.direccion, lat: sucursal.lat, lng: sucursal.lng, horario: sucursal.horario, telefono: sucursal.telefono }
      : SUCURSAL_VACIA
  );
  const [guardando, setGuardando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    try {
      await onGuardar(form);
    } finally {
      setGuardando(false);
    }
  };

  const campo = (
    key: keyof FormularioSucursal,
    label: string,
    tipo: string = 'text',
    placeholder = '',
    requerido = false
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label} {requerido && '*'}</label>
      <input
        type={tipo}
        value={String(form[key])}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        className="input-field"
        placeholder={placeholder}
        required={requerido}
        disabled={guardando}
        step={tipo === 'number' ? 'any' : undefined}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {campo('nombre', 'Nombre de la sucursal', 'text', 'Ej: Sucursal Centro', true)}
      {campo('direccion', 'Dirección completa', 'text', 'Ej: Av. México 123, Centro', true)}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Latitud *</label>
          <input
            type="number"
            value={form.lat}
            onChange={e => setForm(f => ({ ...f, lat: Number(e.target.value) }))}
            className="input-field"
            step="any"
            placeholder="19.1052"
            required
            disabled={guardando}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Longitud *</label>
          <input
            type="number"
            value={form.lng}
            onChange={e => setForm(f => ({ ...f, lng: Number(e.target.value) }))}
            className="input-field"
            step="any"
            placeholder="-104.3188"
            required
            disabled={guardando}
          />
        </div>
      </div>

      <p className="text-xs text-gray-400 -mt-2">
        💡 Busca tu ubicación en{' '}
        <a href="https://www.openstreetmap.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          openstreetmap.org
        </a>{' '}
        y haz clic derecho para obtener las coordenadas.
      </p>

      {campo('horario', 'Horario de atención', 'text', 'Ej: Lun-Sáb: 9am - 8pm | Dom: 10am - 6pm', true)}
      {campo('telefono', 'Teléfono', 'tel', 'Ej: 314 123 4567')}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancelar} className="btn-secondary flex-1" disabled={guardando}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={guardando}>
          {guardando ? <><Spinner size="sm" color="text-white" /> Guardando...</> : 'Guardar Sucursal'}
        </button>
      </div>
    </form>
  );
};

export const AdminSucursales = () => {
  const { sucursales, cargando, agregarSucursal, editarSucursal, eliminarSucursal } = useSucursales();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [sucursalEditando, setSucursalEditando] = useState<Sucursal | undefined>();
  const [sucursalEliminando, setSucursalEliminando] = useState<Sucursal | undefined>();

  const handleGuardar = async (form: FormularioSucursal) => {
    if (sucursalEditando) {
      await editarSucursal(sucursalEditando.id, form);
    } else {
      await agregarSucursal(form);
    }
    setModalAbierto(false);
    setSucursalEditando(undefined);
  };

  return (
    <AdminLayout titulo="Gestión de Sucursales">
      <div className="space-y-6">
        {/* Botón agregar */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">{sucursales.length} sucursal{sucursales.length !== 1 ? 'es' : ''}</p>
          <button
            onClick={() => { setSucursalEditando(undefined); setModalAbierto(true); }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nueva Sucursal
          </button>
        </div>

        {/* Mapa */}
        {!cargando && sucursales.length > 0 && (
          <MapaSucursales sucursales={sucursales} altura="300px" />
        )}

        {/* Lista de sucursales */}
        {cargando ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : (
          <div className="grid gap-4">
            {sucursales.map(suc => (
              <div key={suc.id} className="bg-white rounded-2xl shadow-sm p-5 flex items-start gap-4">
                <div className="p-3 bg-primary-50 rounded-xl shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-dark">{suc.nombre}</p>
                  <div className="space-y-1 mt-2">
                    <div className="flex items-start gap-2 text-gray-500 text-sm">
                      <MapPin className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                      <span>{suc.direccion}</span>
                    </div>
                    <div className="flex items-start gap-2 text-gray-500 text-sm">
                      <Clock className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                      <span>{suc.horario}</span>
                    </div>
                    {suc.telefono && (
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{suc.telefono}</span>
                      </div>
                    )}
                    <p className="text-xs text-gray-400">
                      📍 {suc.lat}, {suc.lng}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => { setSucursalEditando(suc); setModalAbierto(true); }}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary-50 rounded-xl transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setSucursalEliminando(suc)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {sucursales.length === 0 && (
              <div className="text-center py-12 text-gray-400 bg-white rounded-2xl">
                No hay sucursales. ¡Agrega la primera!
              </div>
            )}
          </div>
        )}
      </div>

      <Modal
        abierto={modalAbierto}
        onCerrar={() => { setModalAbierto(false); setSucursalEditando(undefined); }}
        titulo={sucursalEditando ? 'Editar Sucursal' : 'Nueva Sucursal'}
        ancho="lg"
      >
        <FormSucursal
          sucursal={sucursalEditando}
          onGuardar={handleGuardar}
          onCancelar={() => { setModalAbierto(false); setSucursalEditando(undefined); }}
        />
      </Modal>

      <ConfirmarEliminar
        abierto={!!sucursalEliminando}
        onCerrar={() => setSucursalEliminando(undefined)}
        onConfirmar={async () => {
          if (sucursalEliminando) await eliminarSucursal(sucursalEliminando.id);
          setSucursalEliminando(undefined);
        }}
        titulo="Eliminar Sucursal"
        mensaje={`¿Eliminar la sucursal "${sucursalEliminando?.nombre}"?`}
      />
    </AdminLayout>
  );
};
