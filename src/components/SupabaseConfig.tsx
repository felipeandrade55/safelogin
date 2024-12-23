import { Button } from "@/components/ui/button";
import { isSupabaseConfigured } from "@/lib/supabase";

export const SupabaseConfig = () => {
  return (
    <Button variant="outline" disabled>
      Supabase Configurado
    </Button>
  );
};