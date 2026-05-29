# EXAME Design System Skill
## AI Skill for Styling shadcn/ui Components

Version: 1.0.0

---

# OBJECTIVE

This skill transforms generic React + shadcn/ui components into an interface inspired by the visual language of EXAME.com.

The goal is NOT to clone the website pixel-perfect.

The goal is to reproduce:

- editorial premium aesthetics
- typography hierarchy
- whitespace rhythm
- enterprise visual quality
- business-news visual identity
- clean corporate interfaces
- high readability
- modern SaaS/editorial feeling

---

# DESIGN PRINCIPLES

The generated UI MUST follow these principles:

1. Typography-first design
2. Large whitespace usage
3. Strong content hierarchy
4. Minimal visual noise
5. Soft borders
6. Low shadow intensity
7. Enterprise-grade aesthetics
8. Editorial layout patterns
9. High readability
10. Modern business visual language

---

# VISUAL PERSONALITY

The design language should feel like a mix between:

- EXAME
- Bloomberg
- Linear
- Stripe
- Notion
- Vercel
- The Economist
- modern fintech dashboards

---

# COLOR TOKENS

## Primary Brand

```json
{
  "primary": {
    "50": "#FFF1F1",
    "100": "#FFD6D6",
    "200": "#FFB0B0",
    "300": "#FF8585",
    "400": "#FF5C5C",
    "500": "#E10600",
    "600": "#B80000",
    "700": "#8A0000",
    "800": "#5C0000",
    "900": "#300000"
  }
}
```

---

# NEUTRAL COLORS

```json
{
  "background": "#FFFFFF",
  "surface": "#FAFAFA",
  "surfaceElevated": "#FFFFFF",

  "foreground": "#111827",
  "foregroundSoft": "#374151",

  "muted": "#6B7280",
  "mutedLight": "#9CA3AF",

  "border": "#E5E7EB",
  "borderSoft": "#F1F5F9"
}
```

---

# TYPOGRAPHY

## Font Family

Preferred fonts:

```css
font-family:
Inter,
"Helvetica Neue",
sans-serif;
```

---

# TYPOGRAPHY SCALE

```json
{
  "hero": "64px",
  "h1": "48px",
  "h2": "36px",
  "h3": "30px",
  "h4": "24px",
  "h5": "20px",
  "h6": "18px",

  "bodyLg": "18px",
  "body": "16px",
  "bodySm": "14px",
  "caption": "12px"
}
```

---

# FONT WEIGHTS

```json
{
  "light": 300,
  "regular": 400,
  "medium": 500,
  "semibold": 600,
  "bold": 700,
  "black": 800
}
```

---

# LINE HEIGHT RULES

## Headlines

```css
line-height: 1.05;
letter-spacing: -0.03em;
```

## Body

```css
line-height: 1.7;
```

---

# SPACING SYSTEM

Use an 8pt grid system.

```json
{
  "1": "4px",
  "2": "8px",
  "3": "12px",
  "4": "16px",
  "5": "20px",
  "6": "24px",
  "8": "32px",
  "10": "40px",
  "12": "48px",
  "16": "64px",
  "20": "80px"
}
```

---

# BORDER RADIUS

```json
{
  "sm": "4px",
  "md": "8px",
  "lg": "12px",
  "xl": "16px"
}
```

---

# SHADOWS

Shadows MUST remain subtle.

```css
--shadow-sm:
0 1px 2px rgba(0,0,0,0.04);

--shadow-md:
0 4px 12px rgba(0,0,0,0.06);

--shadow-lg:
0 10px 30px rgba(0,0,0,0.08);
```

---

# LAYOUT RULES

## Container Sizes

```json
{
  "sm": "640px",
  "md": "768px",
  "lg": "1024px",
  "xl": "1280px",
  "2xl": "1440px"
}
```

---

# GRID SYSTEM

Use 12-column responsive grids.

```css
grid-template-columns:
repeat(12, minmax(0, 1fr));
```

---

# COMPONENT RULES

# BUTTONS

## Primary Button

Characteristics:

- solid red background
- white text
- semibold typography
- soft radius
- minimal shadow

Example:

```tsx
<Button className="
bg-red-600
hover:bg-red-700
text-white
font-semibold
rounded-lg
shadow-sm
transition-all
">
```

---

## Secondary Button

Characteristics:

- white background
- subtle border
- neutral text
- hover surface background

Example:

```tsx
<Button variant="outline" className="
border-zinc-200
bg-white
hover:bg-zinc-50
text-zinc-900
">
```

---

# CARDS

Cards MUST feel spacious and editorial.

Rules:

- large internal padding
- subtle borders
- soft corners
- low shadow intensity
- clean background

Example:

```tsx
<Card className="
bg-white
border
border-zinc-200
rounded-xl
shadow-sm
p-8
">
```

---

# INPUTS

Inputs MUST look enterprise-grade.

Rules:

- subtle borders
- soft focus rings
- clean typography
- medium height

Example:

```tsx
<Input className="
border-zinc-200
focus:border-red-500
focus:ring-red-500/10
rounded-lg
h-11
">
```

---

# TABLES

Tables should resemble financial/editorial dashboards.

Rules:

- subtle row separators
- compact typography
- muted headers
- hover feedback

---

# TYPOGRAPHY RULES

# Headlines

Headlines MUST:

- use bold weights
- maintain tight tracking
- prioritize hierarchy
- dominate the visual composition

Example:

```tsx
<h1 className="
text-5xl
font-black
tracking-tight
leading-none
text-zinc-900
">
```

---

# BODY TEXT

Body text MUST prioritize readability.

Example:

```tsx
<p className="
text-zinc-600
leading-7
text-base
">
```

---

# WHITE SPACE RULES

The system MUST prefer:

- large section spacing
- generous padding
- breathing room
- uncluttered layouts

Avoid:

- dense interfaces
- excessive borders
- too many colors
- visual overload

---

# MOTION RULES

Animations MUST be subtle.

Preferred:

- opacity transitions
- soft hover elevation
- smooth color changes

Avoid:

- bouncing animations
- exaggerated scaling
- flashy transitions

---

# ICONOGRAPHY

Use:

- Lucide icons
- thin stroke icons
- minimal icon usage

Icons MUST support content, not dominate it.

---

# SHADCN/UI MAPPING

# Card

```tsx
<Card className="
rounded-xl
border-zinc-200
shadow-sm
bg-white
">
```

---

# Dialog

```tsx
<DialogContent className="
rounded-2xl
border-zinc-200
shadow-lg
">
```

---

# Badge

```tsx
<Badge className="
bg-red-50
text-red-700
border-red-100
">
```

---

# Tailwind Theme Example

```ts
export const theme = {
  extend: {
    colors: {
      primary: {
        50: "#FFF1F1",
        100: "#FFD6D6",
        200: "#FFB0B0",
        300: "#FF8585",
        400: "#FF5C5C",
        500: "#E10600",
        600: "#B80000",
        700: "#8A0000",
        800: "#5C0000",
        900: "#300000"
      }
    },

    borderRadius: {
      lg: "12px",
      xl: "16px"
    },

    fontFamily: {
      sans: ["Inter", "sans-serif"]
    }
  }
}
```

---

# AI BEHAVIOR RULES

When generating components:

1. Always prioritize readability
2. Prefer whitespace over decoration
3. Use typography as primary hierarchy tool
4. Keep shadows subtle
5. Avoid saturated interfaces
6. Use red only as accent color
7. Prefer neutral backgrounds
8. Create premium editorial feeling
9. Generate enterprise-quality layouts
10. Preserve visual simplicity

---

# DO NOT

Avoid:

- neumorphism
- glassmorphism
- colorful gradients
- excessive blur
- cartoonish UI
- overly playful visuals
- dense dashboards
- giant shadows
- excessive animations

---

# IDEAL USE CASES

This design system works best for:

- news platforms
- business dashboards
- fintech systems
- SaaS applications
- analytics platforms
- editorial products
- AI products
- enterprise interfaces
- admin systems

---

# EXAMPLE PROMPTS

## Example 1

Input:

```txt
Create a pricing section using EXAME design language
```

Expected behavior:

- large whitespace
- bold headlines
- subtle cards
- restrained red accents
- premium typography

---

## Example 2

Input:

```txt
Create a fintech dashboard using this design system
```

Expected behavior:

- editorial typography
- spacious cards
- enterprise tables
- restrained color palette
- clean analytics visuals

---

# FINAL OBJECTIVE

The generated interfaces should feel:

- premium
- intelligent
- trustworthy
- editorial
- corporate
- modern
- clean
- scalable
- highly readable

The UI should resemble a modern business media platform combined with enterprise SaaS quality.

