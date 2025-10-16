# Smart Portfolio

## Overview
Smart Portfolio est un générateur automatique de portfolios professionnels pour étudiants et freelances. L'application permet de créer rapidement un portfolio moderne et personnalisable avec une bio générée par IA.

## Fonctionnalités principales

### 1. Génération de portfolio intelligent
- **Formulaire intuitif** : Interface à onglets pour une saisie organisée des informations
- **Bio générée par IA** : Utilise l'API Hugging Face pour créer une biographie professionnelle personnalisée
- **Upload d'images** : Support pour photo de profil et images de projets (base64)
- **Stockage local** : Données sauvegardées dans localStorage pour persistance

### 2. Sections du portfolio
- **Profil** : Photo, nom, spécialité, compétences, liens professionnels (LinkedIn, GitHub, Email)
- **Projets** : Ajout de projets avec titre, description, image, lien et technologies utilisées
- **Outils maîtrisés** : Liste personnalisable d'outils et technologies
- **QR Code** : Code QR généré automatiquement pour partage facile

### 3. Personnalisation du design
- **4 templates** :
  - Moderne : Design avec dégradés et cartes
  - Minimaliste : Approche épurée et centrée
  - Créatif : Style visuel avec formes et couleurs vives
  - Professionnel : Format CV classique et structuré
- **Couleurs personnalisables** : Sélection de couleurs primaire et secondaire
- **Export PDF** : Téléchargement du portfolio en PDF haute qualité

## Architecture technique

### Frontend (React + TypeScript)
- **Routing** : Wouter pour la navigation entre pages
- **Formulaires** : React Hook Form avec validation Zod
- **UI** : Composants Shadcn UI avec Tailwind CSS
- **Thème** : Support dark/light mode avec ThemeProvider

### Pages
- `/` - Page d'accueil avec hero et features
- `/create` - Formulaire de création de portfolio
- `/preview` - Prévisualisation et téléchargement PDF

### Composants principaux
- `PortfolioForm` : Formulaire multi-onglets avec validation
- `ImageUpload` : Upload d'images avec drag-and-drop
- `PortfolioPreview` : Rendu du portfolio avec sélection de template
- Templates : Moderne, Minimaliste, Créatif, Professionnel
- `Header` : Navigation avec logo et toggle de thème
- `Footer` : Pied de page informatif
- `Hero` : Section hero de la page d'accueil
- `Features` : Présentation des fonctionnalités

### Schéma de données
```typescript
PortfolioData {
  fullName: string
  specialty: string
  skills: string
  profileImage?: string
  linkedin?: string
  github?: string
  email?: string
  aiKeyword: string
  bio?: string
  projects: Project[]
  tools: string[]
  template: "moderne" | "minimaliste" | "creatif" | "professionnel"
  primaryColor: string
  secondaryColor: string
}

Project {
  id: string
  title: string
  description: string
  image?: string
  link?: string
  languages: string[]
}
```

## Design System
- **Palette** : Bleu/Gris avec personnalisation
- **Typographie** : Inter (corps), Poppins (titres)
- **Interactions** : Système hover-elevate et active-elevate-2
- **Responsive** : Mobile-first avec breakpoints adaptés

## Technologies utilisées
- React 18
- TypeScript
- Tailwind CSS
- Wouter (routing)
- React Hook Form + Zod
- Shadcn UI
- jsPDF + html2canvas
- qrcode.react
- Hugging Face API (simulée)

## Prochaines étapes possibles
1. Intégration réelle de l'API Hugging Face
2. Authentification utilisateur
3. Sauvegarde cloud des portfolios
4. Partage via URL unique
5. Analyse de visites
6. Plus de templates
7. Export vers d'autres formats (DOCX, HTML)
