import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle, Trash2, UserPlus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const userCredentialSchema = z.object({
  username: z.string().optional(),
  password: z.string().optional(),
});

const formSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  cardType: z.string().min(1, "O tipo é obrigatório"),
  credentials: z.array(
    z.object({
      type: z.string(),
      value: z.string(),
      userCredentials: z.array(userCredentialSchema),
    })
  ),
});

type EditCredentialFormProps = {
  initialData: z.infer<typeof formSchema>;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
};

export function EditCredentialForm({ initialData, onSubmit }: EditCredentialFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialData,
      cardType: initialData.cardType || 'Outros',
      credentials: initialData.credentials.map(cred => ({
        ...cred,
        userCredentials: cred.userCredentials || [{
          username: "",
          password: ""
        }],
      })),
    },
  });

  const cardTypes = [
    "Equipamento",
    "Servidor",
    "Roteador",
    "Switch",
    "Rádio",
    "OLT",
    "Site",
    "Outros",
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <FormField
            control={form.control}
            name="cardType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {cardTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Credenciais de Acesso</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addNewCredential}
              className="gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Adicionar Acesso
            </Button>
          </div>

          {form.watch("credentials").map((_, credentialIndex) => (
            <div key={credentialIndex} className="space-y-4 p-4 border rounded-lg relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => removeCredential(credentialIndex)}
                disabled={form.watch("credentials").length === 1}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>

              <FormField
                control={form.control}
                name={`credentials.${credentialIndex}.type`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Acesso</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {accessTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`credentials.${credentialIndex}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={
                        field.value === "URL" ? "https://..." :
                        field.value === "IP" ? "192.168.1.1" :
                        field.value === "IPv6" ? "2001:0db8:85a3:0000:0000:8a2e:0370:7334" :
                        "Endereço de acesso"
                      } />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel>Usuários e Senhas</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addUserCredential(credentialIndex)}
                    className="gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    Adicionar Usuário
                  </Button>
                </div>

                {form.watch(`credentials.${credentialIndex}.userCredentials`)?.map((_, userCredIndex) => (
                  <div key={userCredIndex} className="space-y-4 p-4 border rounded-lg relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2"
                      onClick={() => removeUserCredential(credentialIndex, userCredIndex)}
                      disabled={form.watch(`credentials.${credentialIndex}.userCredentials`).length === 1}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>

                    <FormField
                      control={form.control}
                      name={`credentials.${credentialIndex}.userCredentials.${userCredIndex}.username`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Usuário {userCredIndex + 1}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`credentials.${credentialIndex}.userCredentials.${userCredIndex}.password`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha {userCredIndex + 1}</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Button type="submit">Salvar Alterações</Button>
      </form>
    </Form>
  );
}
