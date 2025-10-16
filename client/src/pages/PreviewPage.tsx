import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { PortfolioPreview } from "@/components/PortfolioPreview";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PreviewPage() {
  const [, setLocation] = useLocation();
  const [portfolioData, setPortfolioData] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem("portfolioData");
    if (data) {
      setPortfolioData(JSON.parse(data));
    } else {
      setLocation("/create");
    }
  }, [setLocation]);

  if (!portfolioData) {
    return null;
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto mb-6">
        <Button
          variant="ghost"
          onClick={() => setLocation("/create")}
          className="gap-2"
          data-testid="button-back-to-form"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au formulaire
        </Button>
      </div>
      <PortfolioPreview data={portfolioData} />
    </div>
  );
}
