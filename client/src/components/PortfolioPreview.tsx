import { Button } from "@/components/ui/button";
import { Download, Code } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";
import type { PortfolioData } from "@shared/schema";
import JSZip from "jszip";
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

  const downloadSourceCode = async () => {
    const zip = new JSZip();

    const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.fullName} - Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
  </style>
</head>
<body>
  ${portfolioRef.current?.innerHTML || ''}
</body>
</html>`;

    const readmeContent = `# ${data.fullName} - Portfolio

## Description
This is the portfolio website for ${data.fullName}, ${data.specialty}.

## Technologies
- HTML5
- CSS3 (Tailwind CSS)
- JavaScript

## Setup
1. Open index.html in your web browser
2. Or deploy to any static hosting service

## Contact
- Email: ${data.email || 'N/A'}
- LinkedIn: ${data.linkedin ? 'https://' + data.linkedin : 'N/A'}
- GitHub: ${data.github ? 'https://' + data.github : 'N/A'}
`;

    zip.file('index.html', htmlContent);
    zip.file('README.md', readmeContent);

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.fullName.replace(/\s+/g, '_')}_portfolio_source.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
      <div className="mb-6 flex justify-between items-center">
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <span className="font-medium">Template:</span>
          <span className="capitalize">{data.template}</span>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={downloadSourceCode}
            variant="outline"
            className="gap-2"
            data-testid="button-download-source"
          >
            <Code className="h-4 w-4" />
            Télécharger le code source
          </Button>
          <Button
            onClick={downloadPDF}
            className="gap-2"
            data-testid="button-download-pdf"
          >
            <Download className="h-4 w-4" />
            Télécharger en PDF
          </Button>
        </div>
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
