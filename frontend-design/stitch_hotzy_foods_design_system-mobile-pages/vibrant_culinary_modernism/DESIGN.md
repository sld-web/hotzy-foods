---
name: Vibrant Culinary Modernism
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1b1b1b'
  on-surface-variant: '#5b403f'
  inverse-surface: '#303030'
  inverse-on-surface: '#f1f1f1'
  outline: '#906f6e'
  outline-variant: '#e4bdbc'
  surface-tint: '#bd0a2e'
  primary: '#b20028'
  on-primary: '#ffffff'
  primary-container: '#d7263d'
  on-primary-container: '#fff2f1'
  inverse-primary: '#ffb3b2'
  secondary: '#745b00'
  on-secondary: '#ffffff'
  secondary-container: '#fecb00'
  on-secondary-container: '#6e5700'
  tertiary: '#006539'
  on-tertiary: '#ffffff'
  tertiary-container: '#008149'
  on-tertiary-container: '#d7ffdf'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad9'
  primary-fixed-dim: '#ffb3b2'
  on-primary-fixed: '#410008'
  on-primary-fixed-variant: '#92001f'
  secondary-fixed: '#ffe08b'
  secondary-fixed-dim: '#f1c100'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#584400'
  tertiary-fixed: '#86fab0'
  tertiary-fixed-dim: '#69dd96'
  on-tertiary-fixed: '#00210f'
  on-tertiary-fixed-variant: '#00522d'
  background: '#f9f9f9'
  on-background: '#1b1b1b'
  surface-variant: '#e2e2e2'
  chili-red: '#D7263D'
  golden-glaze: '#FFCC00'
  fresh-mint: '#3CB371'
  surface-white: '#FFFFFF'
  surface-gray: '#F8F8F8'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-lg:
    fontFamily: Work Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Work Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Work Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 4px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is engineered to evoke an immediate appetite and sense of culinary excitement. The brand personality is energetic, confident, and unapologetically bold, targeting a modern audience that values high-quality, flavorful food experiences. 

The aesthetic direction follows a **Modern Corporate** style infused with **High-Contrast/Bold** elements. It utilizes clean layouts with expansive white space to allow product imagery to take center stage, while employing punchy brand colors to drive action and hierarchy. The interface prioritizes "deliciousness" through crisp execution, fast-loading visual patterns, and a mobile-first philosophy that ensures a seamless experience from browsing to checkout.

## Colors

The color palette is built on high-chroma signals derived from fresh ingredients. 

- **Primary (Chili Red):** Used for critical calls-to-action, branding elements, and urgent highlights. It represents the "heat" and "passion" of the product line.
- **Secondary (Golden Glaze):** Utilized for promotional banners, ratings, and secondary buttons. It provides a warm contrast to the primary red.
- **Tertiary (Fresh Mint):** Reserved for dietary indicators, health-focused callouts, and success states, balancing the warm tones with a sense of freshness.
- **Neutral:** A deep black is used for maximum legibility in typography, paired with a soft gray and pure white for background layering to maintain a clean, professional feel.

## Typography

This design system replaces the whimsical source fonts with highly legible, modern alternatives that maintain a friendly yet professional character. 

**Plus Jakarta Sans** is the headline face, chosen for its approachable geometry and premium feel. It is used in heavy weights to create a strong visual anchor. **Work Sans** serves as the primary workhorse for body copy and labels, offering exceptional readability across all screen sizes and ensuring that nutritional info and product descriptions are easy to scan.

Typography scales dynamically; for mobile devices, display and large headline sizes are reduced to ensure optimal line lengths without sacrificing the bold brand impact.

## Layout & Spacing

The design system utilizes a **Fluid Grid** model based on an 8px spacing rhythm. 

- **Desktop:** A 12-column grid with a 1200px max-width container. Gutters are fixed at 24px to ensure breathing room between product cards.
- **Tablet:** An 8-column grid with 24px margins. Content cards typically reflow from 4 per row to 2 per row.
- **Mobile:** A 4-column grid with 16px margins. Layouts should prioritize vertical stacking.

Spacing is applied through a system of "Stacks" (vertical) and "Insets" (internal padding). Large 32px or 48px gaps are encouraged between major sections to prevent visual clutter and maintain the "Clean Modern" aesthetic.

## Elevation & Depth

This design system uses **Tonal Layers** and **Low-Contrast Outlines** to define hierarchy, avoiding heavy shadows to keep the UI light and fast-loading.

1.  **Level 0 (Base):** The primary background, typically #FFFFFF or #F8F8F8.
2.  **Level 1 (Surface):** Cards and navigation bars. These use a 1px solid border (#EEEEEE) or an extremely subtle 4% opacity black shadow to create separation.
3.  **Level 2 (Interaction):** Floating action buttons or active menus. These use a slightly more pronounced, tinted shadow (using the primary red at low opacity) to indicate "lift" and "touchability."

Depth is primarily communicated through color blocking rather than complex effects, ensuring high performance on mobile devices.

## Shapes

The shape language is **Rounded**, reflecting the organic nature of food. 

Standard components (buttons, input fields) use a 0.5rem (8px) radius. Larger containers, such as product cards and feature banners, utilize the `rounded-lg` (16px) or `rounded-xl` (24px) settings to soften the interface and make it feel more welcoming. 

Circular shapes are used exclusively for profile icons, quantity toggles, and status badges to provide a distinct visual contrast against the softer rectangular grids.

## Components

- **Buttons:** Primary buttons are solid Chili Red with white text, utilizing `label-md` for clear action. Secondary buttons use a Golden Glaze background or a red outline. All buttons feature a subtle scale-down effect on press for tactile feedback.
- **Product Cards:** These are the heart of the system. They feature a clean `Level 1` surface, high-resolution imagery with 0.5rem rounded corners, and a bold price tag using `headline-md`.
- **Chips:** Used for food categories (e.g., "Spicy," "Vegan"). These are pill-shaped with Fresh Mint or Chili Red backgrounds at 10% opacity, featuring high-contrast colored text.
- **Input Fields:** Minimalist design with a 1px border. The border transitions to Chili Red on focus. Labels use `label-sm` for a structured, organized look.
- **Lists:** Clean, border-bottom separated rows with ample vertical padding (16px). Used for order history and cart items.
- **Nutrition Badges:** Small, circular or rounded-rect icons that quickly communicate flavor profiles or dietary specs without cluttering the main UI.