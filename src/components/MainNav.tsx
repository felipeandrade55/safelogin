import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export function MainNav() {
  const location = useLocation();

  return (
    <div className="mr-4 hidden md:flex">
      <Link to="/" className="mr-6 flex items-center space-x-2">
        <span className="hidden font-bold sm:inline-block">
          Credential Manager
        </span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
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
            "transition-colors hover:text-primary",
            location.pathname === "/settings"
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          <Settings className="h-4 w-4" />
        </Link>
      </nav>
    </div>
  );
}