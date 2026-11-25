// Hook para gestión de productos con Firestore (sin Firebase Storage)
import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '../utils/firebase';
import type { Producto, FormularioProducto } from '../types';
import toast from 'react-hot-toast';

export const useProductos = (categoriaId?: string) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = categoriaId
      ? query(collection(db, 'productos'), where('categoriaId', '==', categoriaId), orderBy('nombre'))
      : query(collection(db, 'productos'), orderBy('nombre'));

    const unsubscribe = onSnapshot(q, (snap) => {
      setProductos(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Producto[]);
      setCargando(false);
    }, (err) => {
      setError(err.message);
      setCargando(false);
    });

    return unsubscribe;
  }, [categoriaId]);

  const agregarProducto = async (form: FormularioProducto) => {
    try {
      await addDoc(collection(db, 'productos'), {
        ...form,
        creadoEn: new Date(),
        actualizadoEn: new Date(),
      });
      toast.success('Producto agregado correctamente');
    } catch {
      toast.error('Error al agregar producto');
      throw new Error('agregarProducto falló');
    }
  };

  const editarProducto = async (id: string, form: Partial<FormularioProducto>) => {
    try {
      await updateDoc(doc(db, 'productos', id), {
        ...form,
        actualizadoEn: new Date(),
      });
      toast.success('Producto actualizado correctamente');
    } catch {
      toast.error('Error al actualizar producto');
      throw new Error('editarProducto falló');
    }
  };

  const actualizarPrecio = async (id: string, precio: number) => {
    try {
      await updateDoc(doc(db, 'productos', id), { precio, actualizadoEn: new Date() });
      toast.success('Precio actualizado');
    } catch {
      toast.error('Error al actualizar precio');
    }
  };

  const eliminarProducto = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'productos', id));
      toast.success('Producto eliminado');
    } catch {
      toast.error('Error al eliminar producto');
    }
  };

  return { productos, cargando, error, agregarProducto, editarProducto, actualizarPrecio, eliminarProducto };
};
