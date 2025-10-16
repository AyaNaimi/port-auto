import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Linkedin, Github, Mail, ExternalLink } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import type { PortfolioData } from "@shared/schema";

interface TemplateProps {
  data: PortfolioData;
}

export function ProfessionnelTemplate({ data }: TemplateProps) {
  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const skillsList = data.skills
    .split(",")
    .map((skill) => skill.trim())
    .filter((skill) => skill.length > 0);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header style CV */}
      <div className="border-b pb-8 mb-8">
        <div className="flex items-start gap-8">
          <Avatar className="h-28 w-28">
            {data.profileImage ? (
              <AvatarImage src={data.profileImage} alt={data.fullName} />
            ) : (
              <AvatarFallback className="text-2xl">
                {getInitials(data.fullName)}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="flex-1">
            <h1 className="text-4xl font-bold font-heading mb-2">
              {data.fullName}
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              {data.specialty}
            </p>

            <div className="flex flex-wrap gap-4 text-sm">
              {data.email && (
                <a 
                  href={`mailto:${data.email}`} 
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <Mail className="h-4 w-4" />
                  {data.email}
                </a>
              )}
              {data.linkedin && (
                <a 
                  href={`https://${data.linkedin}`} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              )}
              {data.github && (
                <a 
                  href={`https://${data.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              )}
            </div>
          </div>

          <QRCodeSVG
            value={`https://portfolio.example.com/${data.fullName.replace(/\s+/g, "-").toLowerCase()}`}
            size={100}
            level="M"
          />
        </div>
      </div>

      {/* Résumé professionnel */}
      {data.bio && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 pb-2 border-b" style={{ borderColor: data.primaryColor }}>
            RÉSUMÉ PROFESSIONNEL
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {data.bio}
          </p>
        </div>
      )}

      {/* Compétences clés */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-3 pb-2 border-b" style={{ borderColor: data.primaryColor }}>
          COMPÉTENCES CLÉS
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {skillsList.map((skill, index) => (
            <div
              key={index}
              className="flex items-center gap-2"
            >
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: data.primaryColor }}
              />
              <span className="text-sm">{skill}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Outils et technologies */}
      {data.tools && data.tools.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 pb-2 border-b" style={{ borderColor: data.primaryColor }}>
            OUTILS & TECHNOLOGIES
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {data.tools.map((tool, index) => (
              <div
                key={index}
                className="text-sm text-center py-2 px-3 border rounded"
              >
                {tool}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projets */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 pb-2 border-b" style={{ borderColor: data.primaryColor }}>
            PROJETS RÉALISÉS
          </h2>
          <div className="space-y-6">
            {data.projects.map((project, index) => (
              <div key={project.id} className="border-l-4 pl-6" style={{ borderColor: data.primaryColor }}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  {project.link && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(project.link, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover rounded mb-3"
                  />
                )}
                
                <p className="text-sm text-muted-foreground mb-3">
                  {project.description}
                </p>
                
                {project.languages && project.languages.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs font-medium text-muted-foreground">Technologies:</span>
                    {project.languages.map((lang, langIndex) => (
                      <Badge
                        key={langIndex}
                        variant="secondary"
                        className="text-xs"
                      >
                        {lang}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
