import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { CredentialChange } from "@/types/history";

const changeTypeLabels = {
  create: "Criação",
  update: "Atualização",
  delete: "Exclusão",
};

const changeTypeColors = {
  create: "bg-green-500",
  update: "bg-blue-500",
  delete: "bg-red-500",
};

export const CredentialHistory = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Simula o carregamento do histórico (substitua por sua lógica real)
  const history: CredentialChange[] = JSON.parse(
    localStorage.getItem("credentialHistory") || "[]"
  ).slice(0, 50); // Limita aos últimos 50 registros

  const handleRevert = async (change: CredentialChange) => {
    try {
      // Aqui você implementaria a lógica real de reversão
      // Por exemplo, restaurando os valores antigos da credencial
      
      const credentials = JSON.parse(
        localStorage.getItem("mockCredentials") || "{}"
      );

      if (change.changeType === "delete") {
        // Restaura a credencial excluída
        if (!credentials[change.companyId]) {
          credentials[change.companyId] = [];
        }
        // Aqui você precisaria ter salvo o estado completo da credencial
        // no histórico para poder restaurá-la corretamente
      } else if (change.changeType === "update") {
        // Reverte as alterações
        const credential = credentials[change.companyId]?.find(
          (c: any) => c.id === change.credentialId
        );
        if (credential) {
          change.changedFields.forEach((field) => {
            credential[field.field] = field.oldValue;
          });
        }
      }

      localStorage.setItem("mockCredentials", JSON.stringify(credentials));

      toast({
        title: "Alteração revertida com sucesso",
        description: `As alterações na credencial "${change.credentialTitle}" foram revertidas.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao reverter alteração",
        description: "Não foi possível reverter as alterações. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(-1)}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Histórico de Alterações</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Últimas 50 Alterações</CardTitle>
          <CardDescription>
            Visualize e reverta alterações feitas nas credenciais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {history.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma alteração registrada ainda.
                </p>
              ) : (
                history.map((change) => (
                  <Card key={change.id} className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`${
                              changeTypeColors[change.changeType]
                            } text-white`}
                          >
                            {changeTypeLabels[change.changeType]}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {format(change.timestamp, "PPpp", { locale: ptBR })}
                          </span>
                        </div>
                        <h3 className="font-semibold">{change.credentialTitle}</h3>
                        <p className="text-sm text-muted-foreground">
                          Empresa: {change.companyName}
                        </p>
                        <div className="space-y-1">
                          {change.changedFields.map((field, index) => (
                            <p key={index} className="text-sm">
                              <span className="font-medium">
                                {field.field}:{" "}
                              </span>
                              <span className="text-red-500 line-through">
                                {field.oldValue}
                              </span>{" "}
                              →{" "}
                              <span className="text-green-500">
                                {field.newValue}
                              </span>
                            </p>
                          ))}
                        </div>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleRevert(change)}
                              className="h-8 w-8"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Reverter esta alteração</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};