import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Linkedin, Github, Mail, ExternalLink } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import type { PortfolioData } from "@shared/schema";

interface TemplateProps {
  data: PortfolioData;
}

export function MinimalisteTemplate({ data }: TemplateProps) {
  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const skillsList = data.skills
    .split(",")
    .map((skill) => skill.trim())
    .filter((skill) => skill.length > 0);

  return (
    <div className="max-w-3xl mx-auto space-y-12 px-4">
      {/* Header minimaliste */}
      <div className="text-center space-y-6 py-12 border-b">
        <Avatar className="h-24 w-24 mx-auto">
          {data.profileImage ? (
            <AvatarImage src={data.profileImage} alt={data.fullName} />
          ) : (
            <AvatarFallback className="text-2xl">
              {getInitials(data.fullName)}
            </AvatarFallback>
          )}
        </Avatar>

        <div>
          <h1 className="text-4xl font-bold font-heading mb-2">
            {data.fullName}
          </h1>
          <p className="text-xl text-muted-foreground">
            {data.specialty}
          </p>
        </div>

        <div className="flex justify-center gap-4">
          {data.linkedin && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(`https://${data.linkedin}`, "_blank")}
            >
              <Linkedin className="h-5 w-5" />
            </Button>
          )}
          {data.github && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(`https://${data.github}`, "_blank")}
            >
              <Github className="h-5 w-5" />
            </Button>
          )}
          {data.email && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.location.href = `mailto:${data.email}`}
            >
              <Mail className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Bio */}
      {data.bio && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            À propos
          </h2>
          <p className="text-lg leading-relaxed">
            {data.bio}
          </p>
        </div>
      )}

      {/* Compétences */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Compétences
        </h2>
        <div className="flex flex-wrap gap-2">
          {skillsList.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm border rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Outils */}
      {data.tools && data.tools.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Outils
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {data.tools.map((tool, index) => (
              <div
                key={index}
                className="text-sm py-2 px-4 bg-muted rounded-md text-center"
              >
                {tool}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projets */}
      {data.projects && data.projects.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Projets
          </h2>
          <div className="space-y-8">
            {data.projects.map((project, index) => (
              <div key={project.id} className="space-y-4 pb-8 border-b last:border-0">
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold">{project.title}</h3>
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
                <p className="text-muted-foreground">{project.description}</p>
                {project.languages && project.languages.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.languages.map((lang, langIndex) => (
                      <span
                        key={langIndex}
                        className="text-xs px-2 py-1 bg-muted rounded"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QR Code */}
      <div className="flex justify-center pt-8">
        <div className="text-center">
          <QRCodeSVG
            value={`https://portfolio.example.com/${data.fullName.replace(/\s+/g, "-").toLowerCase()}`}
            size={100}
            level="M"
          />
          <p className="text-xs text-muted-foreground mt-2">Scannez pour partager</p>
        </div>
      </div>
    </div>
  );
}
