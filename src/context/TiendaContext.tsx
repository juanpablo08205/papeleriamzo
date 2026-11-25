// Contexto de la tienda - configuración global y datos compartidos
import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../utils/firebase';
import type { ConfigTienda } from '../types';

const configDefault: ConfigTienda = {
  logoUrl: '',
  nombreTienda: 'Papelería Manzanillo',
  whatsapp: 'https://wa.me/523141234567',
  instagram: 'https://instagram.com/papeleriamanzanillo',
  facebook: 'https://facebook.com/papeleriamanzanillo',
  slogan: 'Todo para tu escuela, oficina y arte',
};

interface TiendaContextType {
  config: ConfigTienda;
  cargando: boolean;
}

const TiendaContext = createContext<TiendaContextType>({
  config: configDefault,
  cargando: true,
});

export const TiendaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ConfigTienda>(configDefault);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Suscripción en tiempo real a la configuración de la tienda
    const unsubscribe = onSnapshot(doc(db, 'config', 'tienda'), (snap) => {
      if (snap.exists()) {
        setConfig(snap.data() as ConfigTienda);
      }
      setCargando(false);
    }, () => {
      setCargando(false);
    });

    return unsubscribe;
  }, []);

  return (
    <TiendaContext.Provider value={{ config, cargando }}>
      {children}
    </TiendaContext.Provider>
  );
};

export const useTienda = () => useContext(TiendaContext);
