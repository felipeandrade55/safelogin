import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useUserCompany } from "@/hooks/useUserCompany";
import { zabbixServerSchema, type ZabbixServerFormData } from "@/schemas/zabbixServer";
import { useQueryClient } from "@tanstack/react-query";
import { ZabbixAPI } from "@/services/zabbixApi";

export function ZabbixServerForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: companyId } = useUserCompany();
  const queryClient = useQueryClient();

  const form = useForm<ZabbixServerFormData>({
    resolver: zodResolver(zabbixServerSchema),
    defaultValues: {
      name: "",
      url: "",
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: ZabbixServerFormData) => {
    console.log("Iniciando submissão do formulário", { values });

    if (!companyId) {
      console.error("Company ID não encontrado");
      toast.error("Empresa não encontrada");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Testando conexão com o Zabbix...");
      
      // Verifica se a URL termina com /api_jsonrpc.php
      const apiUrl = values.url.endsWith('/api_jsonrpc.php') 
        ? values.url 
        : `${values.url}/api_jsonrpc.php`;

      const api = new ZabbixAPI(apiUrl);
      await api.login(values.username, values.password);
      console.log("Conexão com Zabbix bem sucedida");

      console.log("Salvando servidor no Supabase...", {
        name: values.name,
        url: values.url,
        company_id: companyId,
      });

      const { data, error } = await supabase
        .from('zabbix_servers')
        .insert([{
          name: values.name,
          url: values.url,
          username: values.username,
          password: values.password,
          company_id: companyId,
        }])
        .select();

      if (error) {
        console.error('Erro ao salvar no Supabase:', error);
        throw error;
      }

      console.log("Servidor salvo com sucesso", data);

      // Atualiza a lista de servidores e dispositivos
      await queryClient.invalidateQueries({ queryKey: ['zabbix-servers'] });
      await queryClient.invalidateQueries({ queryKey: ['monitored-devices'] });

      toast.success("Servidor Zabbix cadastrado com sucesso!");
      form.reset();
    } catch (error: any) {
      console.error('Error adding Zabbix server:', error);
      toast.error(error.message || "Erro ao cadastrar servidor Zabbix. Verifique as credenciais e a URL.");
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