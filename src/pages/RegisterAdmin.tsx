import { CreateAdminForm } from "@/components/settings/CreateAdminForm";
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
            onClick={() => navigate("/settings")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Novo Administrador SafeLogin</h2>
            <p className="text-muted-foreground">
              Cadastre um novo administrador do sistema SafeLogin
            </p>
          </div>
        </div>
        <CreateAdminForm />
      </div>
    </div>
  );
}