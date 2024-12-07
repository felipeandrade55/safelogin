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
import { PlusCircle, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

type EditCredentialFormProps = {
  initialData: z.infer<typeof formSchema>;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
};

export function EditCredentialForm({ initialData, onSubmit }: EditCredentialFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const addNewCredential = () => {
    const currentCredentials = form.getValues("credentials");
    form.setValue("credentials", [
      ...currentCredentials,
      { type: "URL", value: "", username: "", password: "" },
    ]);
  };

  const removeCredential = (index: number) => {
    const currentCredentials = form.getValues("credentials");
    if (currentCredentials.length > 1) {
      form.setValue(
        "credentials",
        currentCredentials.filter((_, i) => i !== index)
      );
    }
  };

  const accessTypes = [
    "URL",
    "IP",
    "IPv6",
    "API",
    "FTP",
    "SSH",
    "SFTP",
    "Telnet",
    "Outros",
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          {form.watch("credentials").map((_, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => removeCredential(index)}
                disabled={form.watch("credentials").length === 1}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>

              <FormField
                control={form.control}
                name={`credentials.${index}.type`}
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
                name={`credentials.${index}.value`}
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
        </div>

        <Button type="submit">Salvar Alterações</Button>
      </form>
    </Form>
  );
}