---
name: Nam & Lan Wedding Elegance
colors:
  surface: '#faf9f6'
  surface-dim: '#dbdad7'
  surface-bright: '#faf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f1'
  surface-container: '#efeeeb'
  surface-container-high: '#e9e8e5'
  surface-container-highest: '#e3e2e0'
  on-surface: '#1a1c1a'
  on-surface-variant: '#4e453b'
  inverse-surface: '#2f312f'
  inverse-on-surface: '#f2f1ee'
  outline: '#807569'
  outline-variant: '#d1c4b6'
  surface-tint: '#76592d'
  primary: '#6f5327'
  on-primary: '#ffffff'
  primary-container: '#8a6b3d'
  on-primary-container: '#fff4e9'
  inverse-primary: '#e7c08b'
  secondary: '#516442'
  on-secondary: '#ffffff'
  secondary-container: '#d3eabf'
  on-secondary-container: '#566a48'
  tertiary: '#705323'
  on-tertiary: '#ffffff'
  tertiary-container: '#8b6b38'
  on-tertiary-container: '#fff4e9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffddb1'
  primary-fixed-dim: '#e7c08b'
  on-primary-fixed: '#291800'
  on-primary-fixed-variant: '#5c4218'
  secondary-fixed: '#d3eabf'
  secondary-fixed-dim: '#b7cda4'
  on-secondary-fixed: '#0f2005'
  on-secondary-fixed-variant: '#394c2c'
  tertiary-fixed: '#ffdeae'
  tertiary-fixed-dim: '#e8c086'
  on-tertiary-fixed: '#281800'
  on-tertiary-fixed-variant: '#5d4213'
  background: '#faf9f6'
  on-background: '#1a1c1a'
  surface-variant: '#e3e2e0'
  ivory: '#FAF9F6'
  charcoal: '#3A3A38'
  charcoal-muted: '#6B6A66'
  gold: '#B08D57'
  gold-deep: '#8A6B3D'
  sage: '#9CAF88'
  sage-deep: '#5F7350'
typography:
  display-script:
    fontFamily: Great Vibes
    fontSize: 96px
    fontWeight: '400'
    lineHeight: 100px
    letterSpacing: '0'
  display-script-mobile:
    fontFamily: Great Vibes
    fontSize: 60px
    fontWeight: '400'
    lineHeight: 68px
    letterSpacing: '0'
  display-lg:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: '500'
    lineHeight: 64px
    letterSpacing: -0.01em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '500'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '500'
    lineHeight: 44px
    letterSpacing: '0'
  headline-md-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
    letterSpacing: '0'
  title-sm:
    fontFamily: Playfair Display
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: '0'
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 30px
    letterSpacing: '0'
  body-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: '0'
  label-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.18em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
  space-2xl: 4rem
  space-3xl: 6rem
  space-4xl: 8rem
---

## Brand & Style

This design system is crafted for high-end, romantic, and artisanal digital wedding invitations and guest portals. The aesthetic blends classical editorial luxury with delicate organic notes, evoking serenity, eternal commitment, and thoughtful hospitality.

### Visual Style Movement
The design movement balances **Minimalist Editorial** with **Boutique Tactile Romance**:
- **Bespoke Breathing Room**: Expansive, uncluttered negative space prioritizes emotional connection and keeps reading effortless.
- **Organic Subtlety**: Warm ivory paper-like surfaces complemented by muted botanicals (sage) and precious metallic accents (warm antique gold).
- **Refined Flat Structure**: Elimination of heavy drop shadows or skeuomorphic embellishments in favor of crisp 1px hairline borders, airy typography, and deliberate typographic rhythm.
- **Understated Motion**: Slow, cinematic easing without spring or bounce effects, preserving the dignity of an authentic printed luxury invitation.

## Colors

The palette reproduces the physical tactile experience of heavyweight hot-pressed cotton paper, archival charcoal calligraphy ink, botanical greenery, and gold leaf foiling.

### Semantic Roles & Contrast Ratios
- **Base Surface (`--color-ivory`, #FAF9F6)**: Serves as the primary canvas for all page layouts, ensuring an intimate, antique-white warmth over sterile digital white.
- **Primary Ink (`--color-charcoal`, #3A3A38)**: Exclusively designated for standard text and titles, guaranteeing an accessible 10.8:1 contrast ratio against the ivory base.
- **Subdued Ink (`--color-charcoal-muted`, #6B6A66)**: Used for metadata, subtitles, timestamps, and placeholder copy (5.1:1 contrast ratio).
- **Action Gold (`--color-gold-deep`, #8A6B3D)**: High-contrast metallic tone used for primary buttons, active text links, and key focus outlines (WCAG AA 4.7:1 compliance on ivory).
- **Ornamental Gold (`--color-gold`, #B08D57)**: Strictly reserved for 1px hairline dividers, decorative monograms, card borders, and large accent motifs. Never use for standard reading copy.
- **Botanical Sage (`--color-sage`, #9CAF88)**: Used for delicate tint containers, badge backgrounds, and non-text visual accents.
- **Sage Deep (`--color-sage-deep`, #5F7350)**: Secondary action tone for nature-inspired interactive components and secondary CTA treatments (4.9:1 contrast ratio).

## Typography

Typography pairs classical ceremonial script with structured, high-legibility modern sans-serif type configured for Vietnamese diacritics.

### Pairing Hierarchy & Strict Application
- **Calligraphic Feature (`Great Vibes`)**: Dedicated exclusively to the couple's personal names, celebratory salutations, and decorative romantic highlights. Never use for sentences or multi-word descriptive text.
- **Ceremonial Editorial (`Playfair Display`)**: Applied to all section titles, formal headings, event timeline markers, and card titles. Preserves classic publication elegance.
- **Narrative & System (`Be Vietnam Pro`)**: Engineered natively for complex Vietnamese tonal marks to avoid glyph clipping, awkward diacritic stacking, or visual crowding. Used across all narrative stories, schedule descriptions, form inputs, and micro-labels.
- **Small Caps & Letter Spacing**: All uppercase tags or category labels rendered in `label-sm` must apply wide letter-spacing (`0.18em`) to preserve legibility and editorial prestige.

## Layout & Spacing

The layout is built upon an editorial column concept with strict width containment to emulate an unfolding paper keepsake.

### Grid & Width Constraints
- **Max Content Width**: The primary reading flow and card components are locked to a centered column of **720px** maximum width. This maintains optimal typographical line length (50–70 characters) and creates balanced side margins on desktop screens.
- **Mobile Safe Margin**: 24px (`1.5rem` / `margin`) horizontal inset on screens `< 640px`.
- **Section Pacing**: Rhythmic separation between narrative chapters (e.g., Hero, Love Story, Event Details, RSVP) requires a minimum vertical gap of `space-3xl` (96px) on desktop, scaling down to `space-2xl` (64px) on mobile viewports.
- **Micro Spacing**: 
  - Sub-elements within an event card maintain `space-sm` (8px) to `space-md` (16px) separation.
  - Section title groupings maintain `space-lg` (24px) distance from their respective narrative bodies.

## Elevation & Depth

Visual hierarchy is maintained via organic flat layering, paper borders, and extremely diffused ambient lighting rather than structural elevation tiers.

### Depth Hierarchy
- **Base Level (Canvas)**: Solid `--color-ivory` background.
- **Card & Frame Outlines**: Visual depth is achieved through 1px solid hairline borders using `--color-gold` (`#B08D57`) rather than elevation drop shadows.
- **Interactive Floating RSVP**: The only component permitted a cast shadow is the primary RSVP surface or modal envelope:
  `box-shadow: 0 8px 32px rgba(58, 58, 56, 0.08);`
  This subtle diffused charcoal shadow creates gentle separation without digital artificiality.
- **Overlay & Backdrop**: Modal sheets and sticky audio controllers sit above the page canvas, using a soft backdrop blur (`backdrop-filter: blur(8px)`) over a semi-transparent ivory overlay (`rgba(250, 249, 246, 0.9)`).

## Shapes

The shape system adopts a tailored, crisp, and understated silhouette reminiscent of hand-trimmed deckle paper and fine stationery.

### Corner Radius System
- **Interactive Controls (Buttons & Inputs)**: Standardized to a subtle `4px` radius (`roundedness: 1`). Pill shapes or fully round buttons are strictly forbidden.
- **Containers & Event Cards**: Standardized to a minimal `2px` radius, producing virtually crisp corners with softened apexes.
- **Floating Controls (Audio Toggle)**: Fixed `4px` corner radius to retain geometric consistency with buttons.
- **Border Stylings**: All outlines use a precise `1px` stroke weight, elevating the delicacy of cards and dividers.

## Components

### Buttons & CTAs
- **Primary Button ("Gửi lời chúc", "Xác nhận tham dự")**:
  - Background: `--color-gold-deep` (`#8A6B3D`).
  - Text: `--color-ivory` (`#FAF9F6`), `label-sm`, uppercase, font weight 600.
  - Padding: 14px 28px.
  - Border Radius: 4px.
  - Border: None.
  - Hover: Background transitions smoothly over 300ms to `#735730`.
- **Secondary / Outlined Button ("Xem bản đồ", "Lịch trình")**:
  - Background: Transparent.
  - Text: `--color-gold-deep` (`#8A6B3D`).
  - Border: 1px solid `--color-gold` (`#B08D57`).
  - Icon: Thin line Lucide icon (e.g., `MapPin`, 16px).
  - Hover: Background transitions to `rgba(176, 141, 87, 0.08)`.

### Form Fields & Inputs
- **Text Inputs & Textareas**:
  - Minimal underline styling: `border: none; border-bottom: 1px solid var(--color-gold);`
  - Background: Transparent.
  - Padding: 12px 0; font-family: `Be Vietnam Pro`; font-size: 16px; color: `--color-charcoal`.
  - Placeholder: `--color-charcoal-muted`, italicized or low-contrast.
  - Focus State: `border-bottom: 2px solid var(--color-gold-deep); outline: none;` transition: 200ms ease.

### Cards & Panels
- **Ceremony & Banquet Cards**:
  - Width: 100% within the 720px container.
  - Background: `--color-ivory`.
  - Border: 1px solid `--color-gold` (`#B08D57`).
  - Internal Padding: 32px on desktop, 20px on mobile.
  - Shadow: None (flat paper profile).

### Floating Music Player Component
- **Position**: Fixed at bottom-right corner, 24px inset from viewport edges.
- **Appearance**: Square form factor (40px x 40px), 4px border radius, background `--color-ivory`, border 1px solid `--color-gold`.
- **Icon**: Subtle rotating or pulsating music note/disc icon in `--color-charcoal` (18px stroke).
- **Z-Index**: 50.

### Motion & Interactions
- **Scroll Reveal**: Elements enter via Framer Motion with an upward travel of 16px and opacity transition (`0` to `1`), duration `600ms`, easing `easeOut`. Child elements sequence with an `80ms` stagger delay.
- **Accessibility**: Wrap all motion inside `prefers-reduced-motion` checks to render elements statically at full opacity for sensitive users.