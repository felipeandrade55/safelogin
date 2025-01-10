import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function RegisterAdmin() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-10">
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Registro de Administrador</h2>
            <p className="text-muted-foreground">
              Esta funcionalidade foi removida do sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}