import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  role?: string;
  is_safelogin_admin: boolean;
  company_id?: string;
}

export function useUserManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      console.log("Fetching current user...");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log("No authenticated user found");
        throw new Error("Usuário não autenticado");
      }

      console.log("Auth user found:", user);

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, avatar_url, is_safelogin_admin, phone, bio")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching current user profile:", error);
        throw error;
      }
      
      console.log("Current user profile:", profile);
      return profile;
    },
  });

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      console.log("Fetching all users...");
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log("No authenticated user found when fetching users list");
          throw new Error("Usuário não autenticado");
        }

        console.log("Authenticated user ID:", user.id);

        const { data, error } = await supabase
          .from("profiles")
          .select("*");

        if (error) {
          console.error("Error fetching users:", error);
          toast({
            title: "Erro ao carregar usuários",
            description: error.message,
            variant: "destructive",
          });
          throw error;
        }

        if (!data) {
          console.log("No users data returned");
          return [];
        }

        console.log("Users fetched successfully:", data);
        return data as User[];
      } catch (error) {
        console.error("Unexpected error fetching users:", error);
        throw error;
      }
    },
    enabled: !!currentUser, // Only fetch users if we have a current user
  });

  const handleDeleteUser = async (userId: string) => {
    try {
      console.log("Attempting to delete user:", userId);
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (error) {
        console.error("Error deleting user:", error);
        throw error;
      }

      console.log("User deleted successfully");
      toast({
        title: "Usuário excluído",
        description: "O usuário foi removido com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (error) {
      console.error("Error in handleDeleteUser:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o usuário.",
        variant: "destructive",
      });
    }
  };

  return {
    currentUser,
    users,
    isLoading,
    handleDeleteUser,
  };
}