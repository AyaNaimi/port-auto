import { Sparkles, Layout, Download } from "lucide-react";
import { Card } from "@/components/ui/card";

export function Features() {
  const features = [
    {
      icon: Sparkles,
      title: "Bio générée par IA",
      description:
        "Notre IA crée une biographie professionnelle personnalisée basée sur vos informations et mots-clés.",
    },
    {
      icon: Layout,
      title: "Design professionnel",
      description:
        "Un portfolio moderne et responsive qui impressionne recruteurs et clients potentiels.",
    },
    {
      icon: Download,
      title: "Téléchargement PDF",
      description:
        "Exportez votre portfolio en PDF pour le partager facilement par email ou sur les réseaux.",
    },
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-heading mb-4">
            Pourquoi choisir Smart Portfolio ?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Créez un portfolio professionnel qui vous démarque de la concurrence
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-8 hover-elevate transition-all duration-300"
              data-testid={`card-feature-${index}`}
            >
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
