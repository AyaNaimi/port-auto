import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@assets/generated_images/Professional_workspace_hero_image_2392fe83.png";

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Professional workspace"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-24 md:px-6">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold tracking-tight font-heading text-foreground md:text-7xl mb-6">
            Créez votre portfolio professionnel en{" "}
            <span className="bg-gradient-to-r from-[hsl(var(--gradient-from))] to-[hsl(var(--gradient-to))] bg-clip-text text-transparent">
              quelques minutes
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
            Générateur automatique de portfolios avec bio générée par IA pour
            étudiants et freelances. Simple, rapide et professionnel.
          </p>
          <Button
            size="lg"
            onClick={onGetStarted}
            className="gap-2 text-base"
            data-testid="button-create-portfolio"
          >
            Créer mon portfolio
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
