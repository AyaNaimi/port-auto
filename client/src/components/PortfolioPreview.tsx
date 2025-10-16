import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";
import type { PortfolioData } from "@shared/schema";
import { ModerneTemplate } from "./templates/ModerneTemplate";
import { MinimalisteTemplate } from "./templates/MinimalisteTemplate";
import { CreatifTemplate } from "./templates/CreatifTemplate";
import { ProfessionnelTemplate } from "./templates/ProfessionnelTemplate";

interface PortfolioPreviewProps {
  data: PortfolioData;
}

export function PortfolioPreview({ data }: PortfolioPreviewProps) {
  const portfolioRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!portfolioRef.current) return;

    const canvas = await html2canvas(portfolioRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${data.fullName.replace(/\s+/g, "_")}_portfolio.pdf`);
  };

  const getTemplate = () => {
    switch (data.template) {
      case "minimaliste":
        return <MinimalisteTemplate data={data} />;
      case "creatif":
        return <CreatifTemplate data={data} />;
      case "professionnel":
        return <ProfessionnelTemplate data={data} />;
      case "moderne":
      default:
        return <ModerneTemplate data={data} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex justify-end gap-3">
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <span className="font-medium">Template:</span>
          <span className="capitalize">{data.template}</span>
        </div>
        <Button
          onClick={downloadPDF}
          className="gap-2"
          data-testid="button-download-pdf"
        >
          <Download className="h-4 w-4" />
          Télécharger en PDF
        </Button>
      </div>

      <div
        ref={portfolioRef}
        className="bg-background p-12 rounded-2xl"
        data-testid="card-portfolio-preview"
      >
        {getTemplate()}
      </div>
    </div>
  );
}
