// Hook para búsqueda global de productos en tiempo real
import { useState, useEffect, useCallback } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../utils/firebase';
import type { Producto } from '../types';

export const useBusqueda = () => {
  const [todosProductos, setTodosProductos] = useState<Producto[]>([]);
  const [resultados, setResultados] = useState<Producto[]>([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [buscando, setBuscando] = useState(false);

  // Cargar todos los productos una sola vez
  useEffect(() => {
    const q = query(collection(db, 'productos'), orderBy('nombre'));
    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Producto[];
      setTodosProductos(data);
    });
    return unsubscribe;
  }, []);

  // Buscar en tiempo real mientras el usuario escribe
  const buscar = useCallback((termino: string) => {
    setTerminoBusqueda(termino);

    if (!termino.trim()) {
      setResultados([]);
      setBuscando(false);
      return;
    }

    setBuscando(true);
    const terminoLower = termino.toLowerCase().trim();

    const filtrados = todosProductos.filter(p =>
      p.nombre.toLowerCase().includes(terminoLower) ||
      p.descripcion.toLowerCase().includes(terminoLower)
    );

    setResultados(filtrados);
    setBuscando(false);
  }, [todosProductos]);

  const limpiarBusqueda = () => {
    setTerminoBusqueda('');
    setResultados([]);
  };

  return {
    resultados,
    terminoBusqueda,
    buscando,
    buscar,
    limpiarBusqueda,
  };
};
