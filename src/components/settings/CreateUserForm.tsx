import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { Database } from "@/integrations/supabase/types";

type UserRole = Database["public"]["Enums"]["user_role"];

interface CreateUserFormValues {
  email: string;
  full_name: string;
  password: string;
  role: UserRole;
  is_safelogin_admin: boolean;
}

export function CreateUserForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateUserFormValues>();

  const onSubmit = async (data: CreateUserFormValues) => {
    try {
      setIsLoading(true);

      // Create the auth user
      const signUpResponse = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
          },
        },
      });

      if (signUpResponse.error) {
        console.error('Error in signUp:', signUpResponse.error);
        throw signUpResponse.error;
      }

      const newUser = signUpResponse.data.user;
      if (!newUser) {
        throw new Error("Falha ao criar usuário");
      }

      // Update the profile to set is_safelogin_admin
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          is_safelogin_admin: true 
        })
        .eq('id', newUser.id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        throw profileError;
      }

      toast({
        title: "Usuário criado",
        description: "O novo usuário foi criado com sucesso!",
      });
      
      queryClient.invalidateQueries({ queryKey: ["users"] });
      reset();
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar o usuário.",
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
        Criar usuário
      </Button>
    </form>
  );
}