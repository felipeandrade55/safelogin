import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CreateAdminFormValues {
  email: string;
  full_name: string;
  password: string;
}

interface CreateAdminParams {
  email: string;
  full_name: string;
  password: string;
}

interface CreateAdminResult {
  id: string;
}

export function CreateAdminForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateAdminFormValues>();

  const onSubmit = async (data: CreateAdminFormValues) => {
    try {
      setIsLoading(true);
      
      const { data: result, error } = await supabase.rpc<CreateAdminResult, CreateAdminParams>(
        'create_safelogin_admin',
        {
          email: data.email,
          full_name: data.full_name,
          password: data.password
        }
      );

      if (error) throw error;

      toast({
        title: "Administrador criado",
        description: "O novo administrador foi criado com sucesso!",
      });
      
      reset();
    } catch (error: any) {
      console.error('Error creating admin:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar o administrador.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="full_name">Nome completo</Label>
          <Input
            id="full_name"
            {...register("full_name", { required: true })}
            disabled={isLoading}
          />
          {errors.full_name && (
            <p className="text-sm text-red-500">Nome é obrigatório</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            {...register("email", { 
              required: true,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "E-mail inválido"
              }
            })}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-red-500">
              {errors.email.message || "E-mail é obrigatório"}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            {...register("password", { 
              required: true,
              minLength: {
                value: 6,
                message: "A senha deve ter no mínimo 6 caracteres"
              }
            })}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-sm text-red-500">
              {errors.password.message || "Senha é obrigatória"}
            </p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Criar administrador
      </Button>
    </form>
  );
}