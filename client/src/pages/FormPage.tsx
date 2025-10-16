import { useLocation } from "wouter";
import { PortfolioForm } from "@/components/PortfolioForm";
import type { PortfolioData } from "@shared/schema";

export default function FormPage() {
  const [, setLocation] = useLocation();

  const handleSubmit = (data: PortfolioData) => {
    localStorage.setItem("portfolioData", JSON.stringify(data));
    setLocation("/preview");
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <PortfolioForm onSubmit={handleSubmit} />
    </div>
  );
}
