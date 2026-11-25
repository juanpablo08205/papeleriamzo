// Hook para gestión de sucursales con Firestore
import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../utils/firebase';
import type { Sucursal, FormularioSucursal } from '../types';
import toast from 'react-hot-toast';

export const useSucursales = () => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'sucursales'), orderBy('nombre'));

    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Sucursal[];
      setSucursales(data);
      setCargando(false);
    }, () => {
      setCargando(false);
    });

    return unsubscribe;
  }, []);

  const agregarSucursal = async (form: FormularioSucursal) => {
    try {
      await addDoc(collection(db, 'sucursales'), {
        ...form,
        lat: Number(form.lat),
        lng: Number(form.lng),
        creadoEn: new Date(),
      });
      toast.success('Sucursal agregada correctamente');
    } catch {
      toast.error('Error al agregar sucursal');
    }
  };

  const editarSucursal = async (id: string, form: Partial<FormularioSucursal>) => {
    try {
      await updateDoc(doc(db, 'sucursales', id), {
        ...form,
        ...(form.lat && { lat: Number(form.lat) }),
        ...(form.lng && { lng: Number(form.lng) }),
      });
      toast.success('Sucursal actualizada');
    } catch {
      toast.error('Error al actualizar sucursal');
    }
  };

  const eliminarSucursal = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'sucursales', id));
      toast.success('Sucursal eliminada');
    } catch {
      toast.error('Error al eliminar sucursal');
    }
  };

  return {
    sucursales,
    cargando,
    agregarSucursal,
    editarSucursal,
    eliminarSucursal,
  };
};
