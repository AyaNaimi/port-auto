import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Portfolio schema
export const projectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  image: z.string().optional(),
  link: z.string().optional(),
  languages: z.array(z.string()).default([]),
});

// Helper to strip protocol from URLs
const stripProtocol = (url: string) => {
  return url.replace(/^https?:\/\//, "");
};

export const portfolioSchema = z.object({
  fullName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  specialty: z.string().min(2, "La spécialité est requise"),
  skills: z.string().min(10, "Décrivez vos compétences (min. 10 caractères)"),
  profileImage: z.string().optional(),
  linkedin: z.string().optional().transform(val => val ? stripProtocol(val) : val),
  github: z.string().optional().transform(val => val ? stripProtocol(val) : val),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  aiKeyword: z.string().min(2, "Le mot-clé est requis"),
  bio: z.string().optional(),
  projects: z.array(projectSchema).default([]),
  tools: z.array(z.string()).default([]),
  template: z.enum(["moderne", "minimaliste", "creatif", "professionnel"]).default("moderne"),
  primaryColor: z.string().default("#3b82f6"),
  secondaryColor: z.string().default("#64748b"),
});

export type Project = z.infer<typeof projectSchema>;
export type PortfolioData = z.infer<typeof portfolioSchema>;
