# Smart Portfolio - Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern portfolio platforms (Behance, Dribbble) and professional tools (Notion, Linear) to create a credible, contemporary portfolio generator that balances professionalism with approachability.

## Core Design Principles
1. **Professional Credibility**: Design must instill trust - this tool creates professional portfolios
2. **Clarity Over Complexity**: Guide users through portfolio creation with clear visual hierarchy
3. **Modern Sophistication**: Clean, contemporary aesthetic that reflects current design trends
4. **Responsive Fluidity**: Seamless experience across all devices

---

## Color Palette

### Light Mode
- **Primary Brand**: 217 91% 60% (confident blue)
- **Primary Dark**: 217 91% 45% (for hover states)
- **Secondary**: 220 13% 46% (sophisticated gray-blue)
- **Background**: 0 0% 100% (pure white)
- **Surface**: 220 13% 97% (soft gray for cards)
- **Border**: 220 13% 91% (subtle dividers)
- **Text Primary**: 220 13% 18% (near-black)
- **Text Secondary**: 220 9% 46% (muted text)

### Dark Mode
- **Primary Brand**: 217 91% 65% (slightly brighter blue)
- **Primary Dark**: 217 91% 50%
- **Secondary**: 220 13% 60%
- **Background**: 222 47% 11% (deep navy-gray)
- **Surface**: 217 33% 17% (elevated surfaces)
- **Border**: 217 33% 23%
- **Text Primary**: 0 0% 98%
- **Text Secondary**: 220 9% 72%

### Accent Colors (Use Sparingly)
- **Success**: 142 71% 45% (for AI generation success)
- **Warning**: 38 92% 50% (for validation)

---

## Typography

### Font Families
- **Primary**: "Inter", system-ui, sans-serif (clean, modern, professional)
- **Accent**: "Poppins", sans-serif (for hero headlines and key CTAs)

### Type Scale
- **Hero Headline**: 3.5rem / 4rem / bold (Poppins)
- **Page Title**: 2.25rem / 2.5rem / semibold (Poppins)
- **Section Heading**: 1.5rem / 1.75rem / semibold (Inter)
- **Subsection**: 1.125rem / 1.25rem / medium (Inter)
- **Body Large**: 1.125rem / 1.75rem / normal (Inter)
- **Body**: 1rem / 1.5rem / normal (Inter)
- **Small**: 0.875rem / 1.25rem / normal (Inter)
- **Tiny**: 0.75rem / 1rem / medium (Inter, uppercase for labels)

---

## Layout System

### Spacing Primitives
Tailwind units of **2, 3, 4, 6, 8, 12, 16, 24** for consistent rhythm
- Form fields: gap-6
- Card padding: p-8
- Section spacing: py-16 to py-24
- Button padding: px-6 py-3

### Containers
- Max width: max-w-6xl for main content
- Form container: max-w-2xl (centered, focused)
- Portfolio preview: max-w-4xl

### Grid System
- Form layout: Single column with focused flow
- Skills badges: flex-wrap with gap-3
- Portfolio cards: Grid when displaying multiple (future feature)

---

## Component Library

### Navigation
- **Header**: Fixed top, backdrop-blur, subtle shadow on scroll
- Logo: "Smart Portfolio" with gradient text effect (blue to secondary)
- Minimal navigation: Home, Create Portfolio (when applicable)
- Mobile: Hamburger menu with slide-in drawer

### Buttons
- **Primary CTA**: Rounded-lg (8px), px-6 py-3, bold text, shadow-md, primary brand color
- **Secondary**: Rounded-lg, border-2, transparent background, primary brand border
- **Outline on Image**: Backdrop-blur-md, border-2 white, white text
- **Icon Buttons**: Rounded-full, 40x40px minimum touch target
- Hover: Slight scale (1.02) + shadow elevation

### Form Elements
- **Input Fields**: Rounded-lg, border-2, px-4 py-3, focus ring-2 ring-primary
- **Textarea**: Min height 120px, auto-resize
- **Labels**: Text-sm, font-medium, mb-2, text-secondary
- **AI Generation Button**: Distinctive styling with gradient or icon to highlight AI feature
- Validation: Red border + small error text below field

### Cards
- **Form Card**: Rounded-2xl, p-8, shadow-lg, surface background
- **Portfolio Preview Card**: Rounded-2xl, p-12, shadow-2xl, border subtle
- **Skill Badges**: Rounded-full, px-4 py-2, text-sm, secondary background, primary text
- Hover: Subtle shadow elevation + border color shift

### Feedback Elements
- **Loading State**: Spinner with blue accent, centered with message
- **Success Toast**: Slide-in from top-right, green accent, auto-dismiss
- **AI Generation Indicator**: Pulsing animation while generating

---

## Page-Specific Layouts

### Homepage (Landing)
**Hero Section** (90vh):
- Centered layout with max-w-4xl
- Large headline (Poppins): "Create Your Professional Portfolio in Minutes"
- Subheading: "AI-powered bio generation for students and freelancers"
- Primary CTA: Large "Create My Portfolio" button
- Visual: Subtle gradient background (blue to white) or abstract geometric pattern

**Features Section** (py-24):
- 3-column grid (stacks on mobile)
- Icon + Title + Description for each feature
- Features: "AI-Powered Bio", "Professional Design", "PDF Download"

### Form Page
- Centered card (max-w-2xl) with generous padding
- Progress indicator at top (Step 1 of 2)
- Clear section breaks: Personal Info, Links, AI Bio Generation
- "Generate Bio with AI" button prominently placed with icon
- Generated bio displays in highlighted textarea with edit capability
- Bottom CTA: "Create My Portfolio" (full-width on mobile)

### Portfolio Preview Page
- Clean, resume-like layout with premium feel
- Header section: Name (large, Poppins) + Specialty (secondary color)
- Bio section: Generous whitespace, readable line-length (max-w-prose)
- Skills displayed as pill badges with subtle shadows
- Contact links as icon + text combinations
- QR code in bottom corner or sidebar
- Floating action: "Download PDF" button (sticky on mobile)

---

## Animations
- Page transitions: Fade-in (300ms)
- Button hover: Scale + shadow (150ms ease)
- Form field focus: Ring expansion (200ms)
- AI generation: Typewriter effect for bio text
- Card entrance: Slide-up with fade (400ms stagger for multiple)

---

## Images

### Homepage Hero
- **Large Hero Image**: Modern workspace with laptop showing portfolio, bright and aspirational
- Placement: Right side or full-width background with overlay
- Style: Professional photography with slight blur or gradient overlay for text readability

### Form Page
- No hero image - focus on form clarity
- Optional: Small decorative illustrations near AI generation section

### Portfolio Preview
- **Profile Photo Placeholder**: Circular, 120px diameter, gradient background if no photo
- **Background Pattern**: Subtle geometric shapes or dots in brand colors, low opacity

---

## Accessibility & Interaction

### Dark Mode
- Toggle in header, persistent via localStorage
- All colors maintain 4.5:1 contrast ratio minimum
- Images: Slight opacity reduction in dark mode

### Responsive Breakpoints
- Mobile: < 640px (single column, stacked layout)
- Tablet: 640px - 1024px (adjusted spacing)
- Desktop: > 1024px (full multi-column layouts)

### Focus States
- All interactive elements: Visible focus ring (ring-2 ring-primary)
- Skip navigation for accessibility

This design creates a credible, modern portfolio generator that feels professional while remaining approachable and easy to use.