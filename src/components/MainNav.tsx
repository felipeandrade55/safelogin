import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Building2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MainNav() {
  const location = useLocation();

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
        </nav>
      </div>
    </div>
  );
}