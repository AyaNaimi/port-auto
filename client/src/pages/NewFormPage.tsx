import { useLocation } from "wouter";
import { PortfolioForm } from "@/components/PortfolioForm";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { PortfolioData } from "@shared/schema";

export default function NewFormPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (data: PortfolioData) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create a portfolio',
        variant: 'destructive',
      });
      setLocation('/login');
      return;
    }

    try {
      const slug = `${data.fullName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

      const { error } = await supabase
        .from('user_portfolios')
        .insert({
          user_id: user.id,
          module_id: null,
          full_name: data.fullName,
          specialty: data.specialty,
          skills: data.skills,
          bio: data.bio,
          profile_image: data.profileImage,
          linkedin: data.linkedin,
          github: data.github,
          email: data.email,
          projects: data.projects,
          tools: data.tools,
          template_settings: {
            template: data.template,
            primaryColor: data.primaryColor,
            secondaryColor: data.secondaryColor,
          },
          slug,
          is_published: false,
        });

      if (error) throw error;

      localStorage.setItem("portfolioData", JSON.stringify(data));
      toast({
        title: 'Success',
        description: 'Portfolio created successfully',
      });
      setLocation("/preview");
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create portfolio',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <PortfolioForm onSubmit={handleSubmit} />
    </div>
  );
}
