import { PortfolioPreview } from "../PortfolioPreview";

export default function PortfolioPreviewExample() {
  const mockData = {
    fullName: "Sophie Martin",
    specialty: "Designer UX/UI",
    skills: "Figma, Adobe XD, Sketch, Design System, Prototypage, User Research",
    linkedin: "linkedin.com/in/sophie-martin",
    github: "github.com/sophiemartin",
    email: "sophie.martin@exemple.com",
    bio: "Sophie Martin est une Designer UX/UI passionnée avec une expertise en innovation. Dotée d'un excellent sens de l'innovation et d'une approche créative, elle apporte des solutions modernes et efficaces à chaque projet. Son parcours professionnel témoigne d'un engagement constant envers l'excellence et le développement continu de ses compétences.",
  };

  return (
    <div className="py-12 px-4">
      <PortfolioPreview data={mockData} />
    </div>
  );
}
