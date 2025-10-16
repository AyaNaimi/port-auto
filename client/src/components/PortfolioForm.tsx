import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Sparkles, Loader2 } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  specialty: z.string().min(2, "La spécialité est requise"),
  skills: z.string().min(10, "Décrivez vos compétences (min. 10 caractères)"),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  aiKeyword: z.string().min(2, "Le mot-clé est requis"),
  bio: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface PortfolioFormProps {
  onSubmit: (data: FormData) => void;
}

export function PortfolioForm({ onSubmit }: PortfolioFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      specialty: "",
      skills: "",
      linkedin: "",
      github: "",
      email: "",
      aiKeyword: "",
      bio: "",
    },
  });

  const generateBio = async () => {
    const { fullName, specialty, aiKeyword } = form.getValues();
    
    if (!fullName || !specialty || !aiKeyword) {
      form.setError("aiKeyword", {
        message: "Veuillez remplir le nom, la spécialité et le mot-clé d'abord"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call - in real app, this would call Hugging Face
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const generatedBio = `${fullName} est un(e) ${specialty} passionné(e) avec une expertise en ${aiKeyword}. Doté(e) d'un excellent sens de l'innovation et d'une approche créative, il/elle apporte des solutions modernes et efficaces à chaque projet. Son parcours professionnel témoigne d'un engagement constant envers l'excellence et le développement continu de ses compétences.`;
    
    form.setValue("bio", generatedBio);
    setIsGenerating(false);
  };

  return (
    <Card className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold font-heading mb-2">
          Créez votre portfolio
        </h2>
        <p className="text-muted-foreground">
          Remplissez le formulaire ci-dessous pour générer votre portfolio
          professionnel
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Informations personnelles</h3>
            
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Jean Dupont"
                      {...field}
                      data-testid="input-fullname"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spécialité / Métier</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Développeur Full Stack"
                      {...field}
                      data-testid="input-specialty"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description de vos compétences</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="React, Node.js, TypeScript, PostgreSQL..."
                      className="min-h-[100px]"
                      {...field}
                      data-testid="input-skills"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Liens professionnels</h3>
            
            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="linkedin.com/in/..."
                        {...field}
                        data-testid="input-linkedin"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="github"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="github.com/..."
                        {...field}
                        data-testid="input-github"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@exemple.com"
                        {...field}
                        data-testid="input-email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Génération de bio par IA</h3>
            
            <FormField
              control={form.control}
              name="aiKeyword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot-clé IA</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="innovation, créativité, expertise technique..."
                      {...field}
                      data-testid="input-ai-keyword"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="button"
              variant="outline"
              onClick={generateBio}
              disabled={isGenerating}
              className="w-full gap-2"
              data-testid="button-generate-bio"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Générer ma bio avec IA
                </>
              )}
            </Button>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biographie générée</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Votre biographie apparaîtra ici après génération..."
                      className="min-h-[120px]"
                      {...field}
                      data-testid="input-bio"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            data-testid="button-create-portfolio-submit"
          >
            Créer mon portfolio
          </Button>
        </form>
      </Form>
    </Card>
  );
}
