---
applyTo: "apps/web/**"
---

# EXAME Design System — Instruções de Estilização

## Princípios de Design

1. Typography-first design
2. Whitespace generoso
3. Hierarquia visual forte
4. Mínimo ruído visual
5. Bordas suaves
6. Sombras de baixa intensidade
7. Estética enterprise
8. Layouts editoriais
9. Alta legibilidade
10. Linguagem visual business moderna

## Paleta de Cores

### Primária (Vermelho EXAME)
```
primary-50:  #FFF1F1
primary-500: #E10600  ← cor principal
primary-600: #B80000
primary-700: #8A0000
```

### Neutros
```
background:      #FFFFFF
surface:         #FAFAFA
foreground:      #111827
foregroundSoft:  #374151
muted:           #6B7280
border:          #E5E7EB
```

## Tipografia

- Fonte: **Inter**
- Hero: 64px / H1: 48px / H2: 36px / H3: 30px
- Body: 16px / BodySm: 14px / Caption: 12px
- Headlines: `font-black tracking-tight leading-none`
- Body: `leading-7`

## Spacing System (Grid 8pt)
```
4px / 8px / 12px / 16px / 24px / 32px / 48px / 64px / 80px
```

## Sombras (SEMPRE sutis)
```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
--shadow-md: 0 4px 12px rgba(0,0,0,0.06);
--shadow-lg: 0 10px 30px rgba(0,0,0,0.08);
```

## Componentes shadcn/ui

### Button Primário
```tsx
<Button className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-sm transition-all">
```

### Button Secundário
```tsx
<Button variant="outline" className="border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900">
```

### Card
```tsx
<Card className="bg-white border border-zinc-200 rounded-xl shadow-sm p-8">
```

### Input
```tsx
<Input className="border-zinc-200 focus:border-red-500 focus:ring-red-500/10 rounded-lg h-11">
```

### Badge
```tsx
<Badge className="bg-red-50 text-red-700 border-red-100">
```

## Regras de Animação

- Apenas transições de opacidade e cores suaves
- `transition-all duration-200`
- Hover: elevação sutil com sombra
- PROIBIDO: bounce, scaling exagerado, animações chamativas

## Ícones

- Usar exclusivamente **Lucide icons**
- Stroke fino
- Uso mínimo — ícones suportam conteúdo, não dominam

## NÃO FAZER

- Neumorphism ou glassmorphism
- Gradientes coloridos
- Blur excessivo
- UI cartoonizada
- Dashboards densos
- Sombras gigantes
- Muitas cores simultâneas

## Tailwind Theme Config
```ts
theme: {
  extend: {
    colors: {
      primary: {
        50: "#FFF1F1",
        500: "#E10600",
        600: "#B80000",
        700: "#8A0000",
      }
    },
    borderRadius: { lg: "12px", xl: "16px" },
    fontFamily: { sans: ["Inter", "sans-serif"] }
  }
}
```
