// Diálogo de confirmación para eliminaciones
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

interface ConfirmarEliminarProps {
  abierto: boolean;
  onCerrar: () => void;
  onConfirmar: () => void;
  titulo: string;
  mensaje: string;
  cargando?: boolean;
}

export const ConfirmarEliminar = ({
  abierto,
  onCerrar,
  onConfirmar,
  titulo,
  mensaje,
  cargando = false,
}: ConfirmarEliminarProps) => (
  <Modal abierto={abierto} onCerrar={onCerrar} titulo={titulo} ancho="sm">
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="p-3 bg-red-50 rounded-full">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>
      <p className="text-gray-600">{mensaje}</p>
      <div className="flex gap-3 w-full">
        <button onClick={onCerrar} className="btn-secondary flex-1" disabled={cargando}>
          Cancelar
        </button>
        <button onClick={onConfirmar} className="btn-danger flex-1" disabled={cargando}>
          {cargando ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>
    </div>
  </Modal>
);
