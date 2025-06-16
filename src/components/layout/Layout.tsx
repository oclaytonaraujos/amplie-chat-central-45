
import { useAuth } from "@/hooks/useAuth";
import { usePrimeiroAcesso } from "@/hooks/usePrimeiroAcesso";
import { RedefinirSenhaDialog } from "@/components/auth/RedefinirSenhaDialog";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export function Layout({ children, title, description }: LayoutProps) {
  const { user, loading: authLoading } = useAuth();
  const { isPrimeiroAcesso, loading: primeiroAcessoLoading, marcarSenhaRedefinida } = usePrimeiroAcesso();

  if (authLoading || primeiroAcessoLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:pl-72">
        <Header />
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                {title}
              </h1>
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            </div>
            {children}
          </div>
        </main>
      </div>
      
      <RedefinirSenhaDialog
        open={isPrimeiroAcesso}
        onSenhaRedefinida={marcarSenhaRedefinida}
      />
    </div>
  );
}
