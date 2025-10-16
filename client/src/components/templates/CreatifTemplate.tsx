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

export function CreatifTemplate({ data }: TemplateProps) {
  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const skillsList = data.skills
    .split(",")
    .map((skill) => skill.trim())
    .filter((skill) => skill.length > 0);

  return (
    <div className="space-y-8">
      {/* Header créatif avec formes */}
      <div className="relative">
        <div 
          className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: data.primaryColor }}
        />
        <div 
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: data.secondaryColor }}
        />
        
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center py-12">
          <div className="space-y-6">
            <Avatar className="h-40 w-40 border-8 shadow-2xl" style={{ borderColor: `${data.primaryColor}40` }}>
              {data.profileImage ? (
                <AvatarImage src={data.profileImage} alt={data.fullName} />
              ) : (
                <AvatarFallback className="text-4xl" style={{ backgroundColor: `${data.primaryColor}20`, color: data.primaryColor }}>
                  {getInitials(data.fullName)}
                </AvatarFallback>
              )}
            </Avatar>

            <div>
              <h1 className="text-6xl font-bold font-heading mb-4 bg-gradient-to-r bg-clip-text text-transparent"
                style={{ 
                  backgroundImage: `linear-gradient(to right, ${data.primaryColor}, ${data.secondaryColor})`
                }}>
                {data.fullName}
              </h1>
              <p className="text-2xl font-medium" style={{ color: data.secondaryColor }}>
                {data.specialty}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {data.linkedin && (
                <Button
                  size="sm"
                  className="gap-2"
                  style={{ backgroundColor: data.primaryColor }}
                  onClick={() => window.open(`https://${data.linkedin}`, "_blank")}
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </Button>
              )}
              {data.github && (
                <Button
                  size="sm"
                  className="gap-2"
                  style={{ backgroundColor: data.primaryColor }}
                  onClick={() => window.open(`https://${data.github}`, "_blank")}
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </Button>
              )}
              {data.email && (
                <Button
                  size="sm"
                  className="gap-2"
                  style={{ backgroundColor: data.primaryColor }}
                  onClick={() => window.location.href = `mailto:${data.email}`}
                >
                  <Mail className="h-4 w-4" />
                  Email
                </Button>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <QRCodeSVG
              value={`https://portfolio.example.com/${data.fullName.replace(/\s+/g, "-").toLowerCase()}`}
              size={150}
              level="H"
              fgColor={data.primaryColor}
            />
          </div>
        </div>
      </div>

      {/* Bio avec design créatif */}
      {data.bio && (
        <Card className="p-8 relative overflow-hidden">
          <div 
            className="absolute top-0 right-0 w-32 h-32 opacity-10"
            style={{ 
              background: `radial-gradient(circle, ${data.primaryColor}, transparent)`
            }}
          />
          <h2 className="text-3xl font-bold mb-4" style={{ color: data.primaryColor }}>
            Mon histoire
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {data.bio}
          </p>
        </Card>
      )}

      {/* Grille de compétences */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold" style={{ color: data.primaryColor }}>
          Mes super-pouvoirs
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {skillsList.map((skill, index) => (
            <Card
              key={index}
              className="p-4 text-center hover-elevate transition-all"
              style={{ 
                borderTop: `3px solid ${data.primaryColor}`
              }}
            >
              <p className="font-semibold">{skill}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Outils avec badges colorés */}
      {data.tools && data.tools.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-3xl font-bold" style={{ color: data.primaryColor }}>
            Ma boîte à outils
          </h2>
          <div className="flex flex-wrap gap-3">
            {data.tools.map((tool, index) => (
              <Badge
                key={index}
                className="px-4 py-2 text-sm"
                style={{ 
                  backgroundColor: index % 2 === 0 ? data.primaryColor : data.secondaryColor,
                  color: "white"
                }}
              >
                {tool}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Projets en mosaïque */}
      {data.projects && data.projects.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold" style={{ color: data.primaryColor }}>
            Mes créations
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {data.projects.map((project, index) => (
              <Card 
                key={project.id} 
                className="group overflow-hidden hover-elevate transition-all"
                style={{ 
                  borderLeft: `4px solid ${index % 2 === 0 ? data.primaryColor : data.secondaryColor}`
                }}
              >
                {project.image && (
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-2xl font-bold">{project.title}</h3>
                    {project.link && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(project.link, "_blank")}
                      >
                        <ExternalLink className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  {project.languages && project.languages.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.languages.map((lang, langIndex) => (
                        <Badge
                          key={langIndex}
                          variant="outline"
                          className="text-xs"
                          style={{ borderColor: data.secondaryColor, color: data.secondaryColor }}
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
