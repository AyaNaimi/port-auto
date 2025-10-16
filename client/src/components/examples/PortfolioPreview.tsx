import { PortfolioPreview } from "../PortfolioPreview";
import type { PortfolioData } from "@shared/schema";

export default function PortfolioPreviewExample() {
  const mockData: PortfolioData = {
    fullName: "Sophie Martin",
    specialty: "Designer UX/UI",
    skills: "Figma, Adobe XD, Sketch, Design System, Prototypage, User Research",
    linkedin: "linkedin.com/in/sophie-martin",
    github: "github.com/sophiemartin",
    email: "sophie.martin@exemple.com",
    aiKeyword: "innovation",
    bio: "Sophie Martin est une Designer UX/UI passionnée avec une expertise en innovation. Dotée d'un excellent sens de l'innovation et d'une approche créative, elle apporte des solutions modernes et efficaces à chaque projet. Son parcours professionnel témoigne d'un engagement constant envers l'excellence et le développement continu de ses compétences.",
    projects: [
      {
        id: "1",
        title: "Application E-commerce",
        description: "Conception complète d'une application e-commerce moderne avec focus sur l'expérience utilisateur",
        languages: ["Figma", "React", "TypeScript"],
        link: "https://example.com/projet1"
      }
    ],
    tools: ["Figma", "Adobe XD", "Sketch", "InVision", "Miro"],
    template: "moderne",
    primaryColor: "#3b82f6",
    secondaryColor: "#64748b",
  };

  return (
    <div className="py-12 px-4">
      <PortfolioPreview data={mockData} />
    </div>
  );
}
