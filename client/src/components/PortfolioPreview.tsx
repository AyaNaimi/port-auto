import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Download, Linkedin, Github, Mail } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";

interface PortfolioData {
  fullName: string;
  specialty: string;
  skills: string;
  linkedin?: string;
  github?: string;
  email?: string;
  bio?: string;
}

interface PortfolioPreviewProps {
  data: PortfolioData;
}

export function PortfolioPreview({ data }: PortfolioPreviewProps) {
  const portfolioRef = useRef<HTMLDivElement>(null);

  const skillsList = data.skills
    .split(",")
    .map((skill) => skill.trim())
    .filter((skill) => skill.length > 0);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const downloadPDF = async () => {
    if (!portfolioRef.current) return;

    const canvas = await html2canvas(portfolioRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex justify-end">
        <Button
          onClick={downloadPDF}
          className="gap-2"
          data-testid="button-download-pdf"
        >
          <Download className="h-4 w-4" />
          Télécharger en PDF
        </Button>
      </div>

      <Card
        ref={portfolioRef}
        className="p-12 bg-background"
        data-testid="card-portfolio-preview"
      >
        <div className="space-y-8">
          <div className="flex items-start justify-between gap-8">
            <div className="flex items-start gap-6 flex-1">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {getInitials(data.fullName)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h1 className="text-4xl font-bold font-heading mb-2">
                  {data.fullName}
                </h1>
                <p className="text-xl text-muted-foreground mb-4">
                  {data.specialty}
                </p>

                <div className="flex flex-wrap gap-2">
                  {data.linkedin && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => window.open(`https://${data.linkedin}`, "_blank")}
                      data-testid="button-linkedin"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </Button>
                  )}
                  {data.github && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => window.open(`https://${data.github}`, "_blank")}
                      data-testid="button-github"
                    >
                      <Github className="h-4 w-4" />
                      GitHub
                    </Button>
                  )}
                  {data.email && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => window.location.href = `mailto:${data.email}`}
                      data-testid="button-email"
                    >
                      <Mail className="h-4 w-4" />
                      Email
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <QRCodeSVG
                value={`https://portfolio.example.com/${data.fullName.replace(/\s+/g, "-").toLowerCase()}`}
                size={100}
                level="M"
              />
              <p className="text-xs text-muted-foreground">Scannez-moi</p>
            </div>
          </div>

          {data.bio && (
            <div>
              <h2 className="text-xl font-semibold mb-3">À propos</h2>
              <p className="text-muted-foreground leading-relaxed">
                {data.bio}
              </p>
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold mb-3">Compétences</h2>
            <div className="flex flex-wrap gap-2">
              {skillsList.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-4 py-2"
                  data-testid={`badge-skill-${index}`}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
