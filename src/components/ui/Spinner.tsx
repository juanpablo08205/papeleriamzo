// Componente spinner de carga
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const Spinner = ({ size = 'md', color = 'text-primary' }: SpinnerProps) => {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };

  return (
    <div className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${sizes[size]} ${color}`} />
  );
};

export const PaginaCargando = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <Spinner size="lg" />
      <p className="text-gray-500 font-medium">Cargando...</p>
    </div>
  </div>
);
