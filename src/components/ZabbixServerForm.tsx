import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  url: z.string().min(1, "A URL é obrigatória").url("URL inválida"),
  username: z.string().min(1, "O usuário é obrigatório"),
  password: z.string().min(1, "A senha é obrigatória"),
});

export function ZabbixServerForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      url: "",
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!supabase) {
      toast.error("Configuração do Supabase não encontrada");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('zabbix_servers')
        .insert([{
          name: values.name,
          url: values.url,
          username: values.username,
          password: values.password,
        }]);

      if (error) throw error;

      toast.success("Servidor Zabbix cadastrado com sucesso!");
      form.reset();
    } catch (error) {
      console.error('Error adding Zabbix server:', error);
      toast.error("Erro ao cadastrar servidor Zabbix");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Servidor</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Zabbix Produção" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL do Servidor</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: http://zabbix.exemplo.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
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
          name="password"
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

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Cadastrando..." : "Cadastrar Servidor"}
        </Button>
      </form>
    </Form>
  );
}