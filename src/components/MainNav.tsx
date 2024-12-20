import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";

export function MainNav() {
  const location = useLocation();

  return (
    <div className="flex items-center justify-between w-full mb-4 md:mb-0 md:w-auto md:mr-4">
      <Link to="/" className="flex items-center space-x-2">
        <span className="font-bold">
          Credential Manager
        </span>
      </Link>
      <nav className="flex items-center space-x-4 md:space-x-6 text-sm font-medium">
        <Link
          to="/"
          className={cn(
            "transition-colors hover:text-primary",
            location.pathname === "/" ? "text-primary" : "text-muted-foreground"
          )}
        >
          Credenciais
        </Link>
        <Link
          to="/history"
          className={cn(
            "transition-colors hover:text-primary",
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
            "transition-colors hover:text-primary",
            location.pathname === "/trash"
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          Lixeira
        </Link>
        <Link
          to="/settings"
          className={cn(
            "transition-colors hover:text-primary flex items-center gap-2",
            location.pathname === "/settings"
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          <Settings className="h-4 w-4" />
          <span className="inline-block">Usuários</span>
        </Link>
      </nav>
    </div>
  );
}