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

export function ModerneTemplate({ data }: TemplateProps) {
  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const skillsList = data.skills
    .split(",")
    .map((skill) => skill.trim())
    .filter((skill) => skill.length > 0);

  return (
    <div className="space-y-8">
      {/* Header avec dégradé */}
      <div 
        className="relative p-12 rounded-2xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${data.primaryColor}20, ${data.secondaryColor}20)`
        }}
      >
        <div className="relative z-10 flex items-start justify-between gap-8">
          <div className="flex items-start gap-6 flex-1">
            <Avatar className="h-32 w-32 border-4" style={{ borderColor: data.primaryColor }}>
              {data.profileImage ? (
                <AvatarImage src={data.profileImage} alt={data.fullName} />
              ) : (
                <AvatarFallback className="text-3xl" style={{ backgroundColor: `${data.primaryColor}20`, color: data.primaryColor }}>
                  {getInitials(data.fullName)}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex-1">
              <h1 className="text-5xl font-bold font-heading mb-3" style={{ color: data.primaryColor }}>
                {data.fullName}
              </h1>
              <p className="text-2xl text-muted-foreground mb-6">
                {data.specialty}
              </p>

              <div className="flex flex-wrap gap-3">
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
              fgColor={data.primaryColor}
            />
            <p className="text-xs text-muted-foreground">Scannez-moi</p>
          </div>
        </div>
      </div>

      {/* Bio */}
      {data.bio && (
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: data.primaryColor }}>À propos</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            {data.bio}
          </p>
        </Card>
      )}

      {/* Compétences */}
      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-4" style={{ color: data.primaryColor }}>Compétences</h2>
        <div className="flex flex-wrap gap-3">
          {skillsList.map((skill, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="px-4 py-2 text-sm"
              style={{ 
                backgroundColor: `${data.primaryColor}15`,
                color: data.primaryColor
              }}
              data-testid={`badge-skill-${index}`}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Outils */}
      {data.tools && data.tools.length > 0 && (
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: data.primaryColor }}>Outils maîtrisés</h2>
          <div className="flex flex-wrap gap-3">
            {data.tools.map((tool, index) => (
              <Badge
                key={index}
                variant="outline"
                className="px-4 py-2"
                data-testid={`badge-tool-${index}`}
              >
                {tool}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Projets */}
      {data.projects && data.projects.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold" style={{ color: data.primaryColor }}>Projets</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {data.projects.map((project, index) => (
              <Card key={project.id} className="overflow-hidden hover-elevate transition-all" data-testid={`card-project-${index}`}>
                {project.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                    {project.link && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(project.link, "_blank")}
                        data-testid={`button-project-link-${index}`}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  {project.languages && project.languages.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.languages.map((lang, langIndex) => (
                        <Badge
                          key={langIndex}
                          variant="secondary"
                          className="text-xs"
                          style={{ 
                            backgroundColor: `${data.secondaryColor}20`,
                            color: data.secondaryColor
                          }}
                        >
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
