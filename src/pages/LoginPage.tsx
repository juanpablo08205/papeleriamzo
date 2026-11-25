// Página de inicio de sesión para administradores
import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { BookOpen, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/ui/Spinner';
import toast from 'react-hot-toast';

export const LoginPage = () => {
  const { login, usuario, esAdmin, cargando } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  // Si ya está autenticado como admin, redirigir
  if (!cargando && usuario && esAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Por favor ingresa tu correo y contraseña');
      return;
    }

    setEnviando(true);
    try {
      await login(email.trim(), password);
      toast.success('¡Bienvenido de vuelta!');
      navigate('/admin');
    } catch (err: any) {
      const mensajes: Record<string, string> = {
        'auth/user-not-found': 'Usuario no encontrado',
        'auth/wrong-password': 'Contraseña incorrecta',
        'auth/invalid-email': 'Correo electrónico inválido',
        'auth/invalid-credential': 'Credenciales incorrectas',
        'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos.',
      };
      setError(mensajes[err.code] || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <BookOpen className="h-9 w-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-dark">Panel de Administración</h1>
          <p className="text-gray-500 text-sm mt-1">Papelería Manzanillo</p>
        </div>

        {/* Formulario */}
        <div className="card p-8">
          <h2 className="text-lg font-semibold text-dark mb-6">Iniciar Sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@papeleria.com"
                  className="input-field pl-10"
                  autoComplete="email"
                  disabled={enviando}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type={verPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                  autoComplete="current-password"
                  disabled={enviando}
                />
                <button
                  type="button"
                  onClick={() => setVerPassword(!verPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {verPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {enviando ? (
                <>
                  <Spinner size="sm" color="text-white" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          Acceso exclusivo para administradores autorizados
        </p>
      </div>
    </div>
  );
};
