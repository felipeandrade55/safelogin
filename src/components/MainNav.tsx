import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Settings, Building2, Network, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MainNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast({
        title: "Erro ao fazer logout",
        description: "Não foi possível desconectar",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold">Credential Manager</span>
        </Link>
        <nav className="flex items-center space-x-6 ml-6">
          <Link
            to="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location.pathname === "/" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Credenciais
          </Link>
          <Link
            to="/history"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location.pathname === "/history"
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            Histórico
          </Link>
          <Link
            to="/trash"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location.pathname === "/trash"
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            Lixeira
          </Link>
          <Link
            to="/network-map"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary flex items-center space-x-2",
              location.pathname === "/network-map"
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <Network className="h-4 w-4" />
            <span>Mapa de Rede</span>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(
              "text-sm font-medium transition-colors hover:text-primary flex items-center space-x-1",
              location.pathname.startsWith("/cadastros")
                ? "text-primary"
                : "text-muted-foreground"
            )}>
              <Building2 className="h-4 w-4 mr-1" />
              <span>Cadastros</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link
                  to="/cadastros/empresas"
                  className="flex items-center"
                >
                  Empresas
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            to="/settings"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary flex items-center space-x-2",
              location.pathname === "/settings"
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <Settings className="h-4 w-4" />
            <span>Configurações</span>
          </Link>
        </nav>
        <div className="ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-primary"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
}