import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function CompanyRegistration() {
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      toast({
        title: "Error",
        description: "Company name is required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Starting company registration...');
      
      // Insert company
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert([{ 
          name: companyName.trim() 
        }])
        .select('id, name')
        .single();

      if (companyError) {
        console.error('Error creating company:', companyError);
        throw companyError;
      }

      console.log('Company created:', companyData);

      // Add current user as admin
      const { error: userError } = await supabase
        .from('company_users')
        .insert([{
          company_id: companyData.id,
          user_id: user.id,
          role: 'admin'
        }]);

      if (userError) {
        console.error('Error adding user to company:', userError);
        throw userError;
      }

      console.log('User added as admin');

      toast({
        title: "Success",
        description: "Company registered successfully!",
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Error",
        description: error.message || "Error registering company",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Register New Company</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registering..." : "Register Company"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}