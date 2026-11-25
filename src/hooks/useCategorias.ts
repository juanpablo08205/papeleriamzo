// Hook para gestión de categorías con Firestore (sin Firebase Storage)
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
import type { Categoria, FormularioCategoria } from '../types';
import toast from 'react-hot-toast';

export const useCategorias = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'categorias'), orderBy('orden'));

    const unsubscribe = onSnapshot(q, (snap) => {
      setCategorias(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Categoria[]);
      setCargando(false);
    }, (err) => {
      setError(err.message);
      setCargando(false);
    });

    return unsubscribe;
  }, []);

  const agregarCategoria = async (form: FormularioCategoria) => {
    try {
      await addDoc(collection(db, 'categorias'), { ...form, creadoEn: new Date() });
      toast.success('Categoría creada correctamente');
    } catch {
      toast.error('Error al crear categoría');
    }
  };

  const editarCategoria = async (id: string, form: Partial<FormularioCategoria>) => {
    try {
      await updateDoc(doc(db, 'categorias', id), form);
      toast.success('Categoría actualizada');
    } catch {
      toast.error('Error al actualizar categoría');
    }
  };

  const eliminarCategoria = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categorias', id));
      toast.success('Categoría eliminada');
    } catch {
      toast.error('Error al eliminar categoría');
    }
  };

  return { categorias, cargando, error, agregarCategoria, editarCategoria, eliminarCategoria };
};
