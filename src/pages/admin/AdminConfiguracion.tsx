// Configuración de tienda - logo (base64, sin Firebase Storage) y redes sociales
import { useState, useRef, useEffect } from 'react';
import { setDoc, doc } from 'firebase/firestore';
import { Globe, MessageCircle, BookOpen, Save, Upload, X } from 'lucide-react';

const IconInstagram = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const IconFacebook = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

import { AdminLayout } from '../../components/admin/AdminLayout';
import { Spinner } from '../../components/ui/Spinner';
import { useTienda } from '../../context/TiendaContext';
import { db } from '../../utils/firebase';
import toast from 'react-hot-toast';

// Convierte un File a base64 para guardarlo directamente en Firestore (sin Storage)
const fileABase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const LIMITE_LOGO_MB = 0.5;

export const AdminConfiguracion = () => {
  const { config, cargando } = useTienda();
  const [form, setForm] = useState(config);
  const [logoFile, setLogoFile] = useState<File | undefined>();
  const [logoPreview, setLogoPreview] = useState(config.logoUrl);
  const [guardando, setGuardando] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const inicializado = useRef(false);

  // Sincroniza el form una sola vez cuando Firestore termina de cargar
  useEffect(() => {
    if (!cargando && !inicializado.current) {
      inicializado.current = true;
      setForm(config);
      setLogoPreview(config.logoUrl);
    }
  }, [cargando, config]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeMB = file.size / 1024 / 1024;
    if (sizeMB > LIMITE_LOGO_MB) {
      toast.error(`El logo debe pesar menos de ${LIMITE_LOGO_MB * 1000}KB. Este pesa ${(sizeMB * 1000).toFixed(0)}KB.`);
      return;
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    // Limpiar el campo URL para no mezclar
    setForm(f => ({ ...f, logoUrl: '' }));
  };

  const limpiarLogo = () => {
    setLogoFile(undefined);
    setLogoPreview('');
    setForm(f => ({ ...f, logoUrl: '' }));
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    try {
      let logoUrl = form.logoUrl;

      // Si hay un archivo seleccionado, lo convertimos a base64 (no requiere Storage)
      if (logoFile) {
        logoUrl = await fileABase64(logoFile);
      }

      await setDoc(doc(db, 'config', 'tienda'), { ...form, logoUrl });

      setForm(f => ({ ...f, logoUrl }));
      setLogoPreview(logoUrl);
      setLogoFile(undefined);
      if (fileRef.current) fileRef.current.value = '';

      toast.success('Configuración guardada correctamente');
    } catch {
      toast.error('Error al guardar la configuración');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <AdminLayout titulo="Configuración de la Tienda">
      <form onSubmit={handleGuardar} className="max-w-2xl space-y-6">

        {/* Logo */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-dark mb-1 flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Logo de la Tienda
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Sube un archivo desde tu equipo (máx. 500KB) o pega una URL. No requiere Firebase Storage.
          </p>

          <div className="flex items-start gap-6">
            {/* Vista previa */}
            <div className="relative h-24 w-24 rounded-2xl bg-primary-50 flex items-center justify-center overflow-hidden shrink-0 border-2 border-dashed border-primary-200">
              {logoPreview ? (
                <>
                  <img src={logoPreview} alt="Logo" className="h-full w-full object-contain p-1" />
                  <button
                    type="button"
                    onClick={limpiarLogo}
                    className="absolute top-1 right-1 p-0.5 bg-black/50 text-white rounded-full hover:bg-black/70"
                    title="Quitar logo"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </>
              ) : (
                <BookOpen className="h-10 w-10 text-primary-300" />
              )}
            </div>

            <div className="flex-1 space-y-3">
              {/* Botón para subir archivo */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="btn-secondary flex items-center gap-2 text-sm px-4 py-2"
                  disabled={guardando}
                >
                  <Upload className="h-4 w-4" />
                  {logoFile ? 'Cambiar archivo' : 'Subir desde mi equipo'}
                </button>
                {logoFile && (
                  <span className="text-xs text-green-600 font-medium">{logoFile.name}</span>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" onChange={handleLogoChange} className="hidden" />

              {/* Separador */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">o</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Campo URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL del logo</label>
                <input
                  type="url"
                  value={logoFile ? '' : form.logoUrl}
                  onChange={e => {
                    setLogoFile(undefined);
                    if (fileRef.current) fileRef.current.value = '';
                    setForm(f => ({ ...f, logoUrl: e.target.value }));
                    setLogoPreview(e.target.value);
                  }}
                  className="input-field text-sm"
                  placeholder="https://..."
                  disabled={guardando || !!logoFile}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Info de la tienda */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-dark mb-4">Información de la Tienda</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la tienda</label>
              <input
                type="text"
                value={form.nombreTienda}
                onChange={e => setForm(f => ({ ...f, nombreTienda: e.target.value }))}
                className="input-field"
                disabled={guardando}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slogan</label>
              <input
                type="text"
                value={form.slogan}
                onChange={e => setForm(f => ({ ...f, slogan: e.target.value }))}
                className="input-field"
                placeholder="Ej: Todo para tu escuela, oficina y arte"
                disabled={guardando}
              />
            </div>
          </div>
        </div>

        {/* Redes sociales */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-dark mb-4">Redes Sociales y Contacto</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-green-500" />
                WhatsApp (URL completa)
              </label>
              <input
                type="url"
                value={form.whatsapp}
                onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
                className="input-field"
                placeholder="https://wa.me/52XXXXXXXXXX"
                disabled={guardando}
              />
              <p className="text-xs text-gray-400 mt-1">Formato: https://wa.me/52XXXXXXXXXX (sin espacios ni guiones)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <IconInstagram />
                Instagram (URL)
              </label>
              <input
                type="url"
                value={form.instagram}
                onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))}
                className="input-field"
                placeholder="https://instagram.com/tunombre"
                disabled={guardando}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <IconFacebook />
                Facebook (URL)
              </label>
              <input
                type="url"
                value={form.facebook}
                onChange={e => setForm(f => ({ ...f, facebook: e.target.value }))}
                className="input-field"
                placeholder="https://facebook.com/tupagina"
                disabled={guardando}
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary flex items-center gap-2" disabled={guardando}>
          {guardando ? (
            <><Spinner size="sm" color="text-white" /> Guardando...</>
          ) : (
            <><Save className="h-4 w-4" /> Guardar Configuración</>
          )}
        </button>
      </form>
    </AdminLayout>
  );
};
