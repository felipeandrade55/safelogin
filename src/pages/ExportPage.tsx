import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, Mail, FileJson, FileSpreadsheet, Archive } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getMockCredentials, getMockCompanies } from "@/utils/mockData";

export const ExportPage = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(
    "Olá,\n\nSegue anexo as credenciais solicitadas.\n\nAtenciosamente."
  );

  const credentials = getMockCredentials()[companyId || ""];
  const company = getMockCompanies().find(c => c.id === companyId);

  const handleDownloadAll = () => {
    // TODO: Implementar lógica de compactação
    const jsonString = JSON.stringify(credentials, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${company?.name || "credenciais"}_export.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      description: "Arquivo exportado com sucesso!",
    });
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar lógica de envio de email
    toast({
      description: "Email enviado com sucesso!",
    });
  };

  return (
    <div className="min-h-screen bg-secondary p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">
            Exportar Credenciais - {company?.name}
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Download</h2>
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={handleDownloadAll}
              >
                <Archive className="h-4 w-4" />
                Baixar Tudo (ZIP)
              </Button>
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => {
                  const jsonString = JSON.stringify(credentials, null, 2);
                  const blob = new Blob([jsonString], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${company?.name || "credenciais"}.json`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
              >
                <FileJson className="h-4 w-4" />
                Exportar como JSON
              </Button>
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => {
                  // TODO: Implementar exportação CSV
                  toast({
                    description: "Exportação CSV em desenvolvimento",
                  });
                }}
              >
                <FileSpreadsheet className="h-4 w-4" />
                Exportar como CSV
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Enviar por E-mail</h2>
            <form onSubmit={handleSendEmail} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  E-mail do Destinatário
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemplo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Mensagem
                </label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                />
              </div>
              <Button type="submit" className="w-full gap-2">
                <Mail className="h-4 w-4" />
                Enviar
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};