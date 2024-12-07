import { AddCredentialDialog } from "@/components/AddCredentialDialog";
import { CredentialCard } from "@/components/CredentialCard";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const mockCredentials = [
  {
    id: "cred_01HNYG8J5N1X2P3Q4R5T6Y7Z8",
    title: "Gmail Trabalho",
    credentials: [
      {
        type: "URL",
        value: "https://gmail.com",
        username: "usuario@empresa.com",
        password: "senha123",
      },
      {
        type: "URL",
        value: "https://mail.google.com",
        username: "usuario@empresa.com",
        password: "senha123",
      },
    ],
  },
  {
    id: "cred_01HNYGB2M3N4P5Q6R7S8T9U0V",
    title: "Sistema Interno",
    credentials: [
      {
        type: "URL",
        value: "https://sistema.empresa.com",
        username: "admin",
        password: "admin123",
      },
      {
        type: "SSH",
        value: "192.168.1.100",
        username: "root",
        password: "root123",
      },
      {
        type: "API",
        value: "https://api.sistema.empresa.com",
        username: "apikey",
        password: "chave-secreta-123",
      },
    ],
  },
];

const formSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  credentials: z.array(
    z.object({
      type: z.string(),
      value: z.string(),
      username: z.string().optional(),
      password: z.string().optional(),
    })
  ),
});

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCard, setEditingCard] = useState<{
    id: string;
    title: string;
    credentials: Array<{
      type: string;
      value: string;
      username?: string;
      password?: string;
    }>;
  } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      credentials: [],
    },
  });

  const filteredCredentials = mockCredentials.filter((credential) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      credential.title.toLowerCase().includes(searchLower) ||
      credential.credentials.some(
        (cred) =>
          cred.type.toLowerCase().includes(searchLower) ||
          cred.value.toLowerCase().includes(searchLower) ||
          (cred.username && cred.username.toLowerCase().includes(searchLower))
      )
    );
  });

  const handleEdit = (credential: typeof mockCredentials[0]) => {
    setEditingCard(credential);
    form.reset({
      title: credential.title,
      credentials: credential.credentials,
    });
  };

  const onSubmitEdit = (values: z.infer<typeof formSchema>) => {
    // Aqui você implementará a lógica de atualização após integração com Supabase
    console.log("Editando credencial:", editingCard?.id, values);
    setEditingCard(null);
  };

  return (
    <div className="min-h-screen bg-secondary p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">Minhas Credenciais</h1>
          <AddCredentialDialog />
        </div>

        <div className="flex items-center space-x-4">
          <Input
            type="search"
            placeholder="Pesquisar credenciais..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {filteredCredentials.map((credential) => (
            <CredentialCard
              key={credential.id}
              title={credential.title}
              credentials={credential.credentials}
              onEdit={() => handleEdit(credential)}
            />
          ))}
        </div>
      </div>

      <Dialog open={!!editingCard} onOpenChange={() => setEditingCard(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Credencial</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("credentials").map((_, index) => (
                <div key={index} className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`credentials.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Acesso</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`credentials.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`credentials.${index}.username`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Usuário</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`credentials.${index}.password`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}

              <Button type="submit">Salvar Alterações</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
