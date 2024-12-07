import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { History, Trash2 } from "lucide-react";

export function MainNav() {
  return (
    <div className="flex items-center space-x-4 lg:space-x-6">
      <Link to="/" className="text-xl font-bold">
        Credential Manager
      </Link>
      <div className="ml-auto flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Histórico
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/trash" className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Lixeira
          </Link>
        </Button>
      </div>
    </div>
  );
}