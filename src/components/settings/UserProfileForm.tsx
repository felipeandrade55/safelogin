import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProfileFormValues {
  full_name: string;
  email: string;
  phone: string;
  bio: string;
}

export function UserProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>();

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          phone: data.phone,
          bio: data.bio,
        })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso!",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsLoading(true);
      const fileExt = file.name.split('.').pop();
      const filePath = `${(await supabase.auth.getUser()).data.user?.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      toast({
        title: "Avatar atualizado",
        description: "Sua foto de perfil foi atualizada com sucesso!",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Erro",
        description: "Não foi possível fazer upload da imagem.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={avatarUrl || undefined} />
          <AvatarFallback>
            {/* Use first letter of name or default icon */}
            ?
          </AvatarFallback>
        </Avatar>
        <div>
          <Button
            variant="outline"
            className="relative"
            disabled={isLoading}
          >
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={isLoading}
            />
            <Upload className="h-4 w-4 mr-2" />
            Alterar foto
          </Button>
        </div>
      </div>

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
            {...register("email")}
            disabled={true}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            {...register("phone")}
            disabled={isLoading}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="bio">Biografia</Label>
          <Textarea
            id="bio"
            {...register("bio")}
            disabled={isLoading}
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Salvar alterações
      </Button>
    </form>
  );
}