import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { portfolioSchema, type PortfolioData, type Project } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Sparkles, Loader2, Plus, Trash2, Palette } from "lucide-react";
import { ImageUpload } from "./ImageUpload";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PortfolioFormProps {
  onSubmit: (data: PortfolioData) => void;
}

export function PortfolioForm({ onSubmit }: PortfolioFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [toolInput, setToolInput] = useState("");
  const [modules, setModules] = useState<any[]>([]);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [userAccess, setUserAccess] = useState<Set<string>>(new Set());
  const { user, appUser } = useAuth();

  useEffect(() => {
    fetchModules();
    if (user) {
      fetchUserAccess();
    }
  }, [user]);

  const fetchModules = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_modules')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setModules(data || []);
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  const fetchUserAccess = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_module_access')
        .select('module_id')
        .eq('user_id', user.id);

      if (error) throw error;
      const accessSet = new Set(data?.map(a => a.module_id) || []);
      setUserAccess(accessSet);
    } catch (error) {
      console.error('Error fetching user access:', error);
    }
  };

  const form = useForm<PortfolioData>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      fullName: appUser?.full_name || "",
      specialty: "",
      skills: "",
      profileImage: "",
      linkedin: "",
      github: "",
      email: appUser?.email || "",
      aiKeyword: "",
      bio: "",
      projects: [],
      tools: [],
      template: "moderne",
      primaryColor: "#3b82f6",
      secondaryColor: "#64748b",
    },
  });

  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control: form.control,
    name: "projects",
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

  const addTool = () => {
    if (toolInput.trim()) {
      const currentTools = form.getValues("tools");
      form.setValue("tools", [...currentTools, toolInput.trim()]);
      setToolInput("");
    }
  };

  const removeTool = (index: number) => {
    const currentTools = form.getValues("tools");
    form.setValue("tools", currentTools.filter((_, i) => i !== index));
  };

  const addProject = () => {
    appendProject({
      id: Math.random().toString(36).substr(2, 9),
      title: "",
      description: "",
      image: "",
      link: "",
      languages: [],
    });
  };

  const hasAccess = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return false;
    return module.is_free || userAccess.has(moduleId);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Choisir un template</h3>
          <p className="text-muted-foreground text-sm">
            Sélectionnez le template pour votre portfolio
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => {
            const canAccess = hasAccess(module.id);
            return (
              <Card
                key={module.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedModule === module.id ? 'ring-2 ring-primary' : ''
                } ${!canAccess ? 'opacity-60' : ''}`}
                onClick={() => canAccess && setSelectedModule(module.id)}
              >
                <CardContent className="p-4">
                  {module.preview_image && (
                    <img
                      src={module.preview_image}
                      alt={module.name}
                      className="w-full h-32 object-cover rounded-md mb-3"
                    />
                  )}
                  <h4 className="font-semibold mb-1">{module.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {module.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant={module.is_free ? 'default' : 'secondary'}>
                      {module.is_free ? 'Gratuit' : `$${module.price}`}
                    </Badge>
                    {!canAccess && !module.is_free && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/payment/${module.id}`;
                        }}
                      >
                        Acheter
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Card>

      {selectedModule && (
        <Card className="p-8 max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold font-heading mb-2">
              Créez votre portfolio
            </h2>
            <p className="text-muted-foreground">
              Remplissez le formulaire ci-dessous pour générer votre portfolio professionnel
            </p>
          </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal" data-testid="tab-personal">Profil</TabsTrigger>
              <TabsTrigger value="projects" data-testid="tab-projects">Projets</TabsTrigger>
              <TabsTrigger value="tools" data-testid="tab-tools">Outils</TabsTrigger>
              <TabsTrigger value="design" data-testid="tab-design">Design</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6 mt-6">
              <FormField
                control={form.control}
                name="profileImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo de profil</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        variant="avatar"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
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
              </div>

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
                      <FormDescription className="text-xs">
                        Sans https://
                      </FormDescription>
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
                      <FormDescription className="text-xs">
                        Sans https://
                      </FormDescription>
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

              <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Génération de bio par IA
                </h3>
                
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
            </TabsContent>

            <TabsContent value="projects" className="space-y-6 mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Vos projets</h3>
                  <p className="text-sm text-muted-foreground">
                    Ajoutez vos projets professionnels ou personnels
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={addProject}
                  variant="outline"
                  className="gap-2"
                  data-testid="button-add-project"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter un projet
                </Button>
              </div>

              {projectFields.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  Aucun projet ajouté. Cliquez sur "Ajouter un projet" pour commencer.
                </div>
              )}

              {projectFields.map((field, index) => (
                <Card key={field.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Projet {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProject(index)}
                      data-testid={`button-remove-project-${index}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name={`projects.${index}.image`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image du projet</FormLabel>
                          <FormControl>
                            <ImageUpload
                              value={field.value}
                              onChange={field.onChange}
                              variant="project"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name={`projects.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Titre du projet</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Mon Application Web"
                                {...field}
                                data-testid={`input-project-title-${index}`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`projects.${index}.link`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lien du projet</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://..."
                                {...field}
                                data-testid={`input-project-link-${index}`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`projects.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Décrivez votre projet..."
                              {...field}
                              data-testid={`input-project-description-${index}`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`projects.${index}.languages`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Technologies utilisées</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="React, Node.js, PostgreSQL (séparés par des virgules)"
                              value={field.value?.join(", ") || ""}
                              onChange={(e) => {
                                const languages = e.target.value
                                  .split(",")
                                  .map(l => l.trim())
                                  .filter(l => l);
                                field.onChange(languages);
                              }}
                              data-testid={`input-project-languages-${index}`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="tools" className="space-y-6 mt-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Outils maîtrisés</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Listez les outils, logiciels ou technologies que vous maîtrisez
                </p>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Ex: VS Code, Figma, Docker..."
                  value={toolInput}
                  onChange={(e) => setToolInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTool();
                    }
                  }}
                  data-testid="input-add-tool"
                />
                <Button
                  type="button"
                  onClick={addTool}
                  variant="outline"
                  data-testid="button-add-tool"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {form.watch("tools").map((tool, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-3 py-1 gap-2"
                    data-testid={`badge-tool-${index}`}
                  >
                    {tool}
                    <button
                      type="button"
                      onClick={() => removeTool(index)}
                      className="hover-elevate rounded-full"
                      data-testid={`button-remove-tool-${index}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              {form.watch("tools").length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  Aucun outil ajouté. Ajoutez vos outils maîtrisés ci-dessus.
                </div>
              )}
            </TabsContent>

            <TabsContent value="design" className="space-y-6 mt-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Personnalisation du design
                </h3>
                <p className="text-sm text-muted-foreground">
                  Choisissez le template et les couleurs de votre portfolio
                </p>
              </div>

              <FormField
                control={form.control}
                name="template"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template de design</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-template">
                          <SelectValue placeholder="Sélectionnez un template" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="moderne">Moderne</SelectItem>
                        <SelectItem value="minimaliste">Minimaliste</SelectItem>
                        <SelectItem value="creatif">Créatif</SelectItem>
                        <SelectItem value="professionnel">Professionnel</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Le template détermine la disposition et le style général de votre portfolio
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="primaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Couleur primaire</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            type="color"
                            {...field}
                            className="h-10 w-20"
                            data-testid="input-primary-color"
                          />
                        </FormControl>
                        <Input
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="#3b82f6"
                          data-testid="input-primary-color-text"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="secondaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Couleur secondaire</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            type="color"
                            {...field}
                            className="h-10 w-20"
                            data-testid="input-secondary-color"
                          />
                        </FormControl>
                        <Input
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="#64748b"
                          data-testid="input-secondary-color-text"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
          </Tabs>

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
      )}
    </div>
  );
}
