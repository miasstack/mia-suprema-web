---
name: Mia Suprema
description: Luxury Latin pop artist hub — dark cinematic surface, gold and rose accents, fan conversion focus
colors:
  void: "#060406"
  nocturne: "#0E090E"
  velvet: "#150F15"
  onyx: "#1C141C"
  gold: "#C9A855"
  gold-bright: "#E8D080"
  scarlet-rose: "#E91E8C"
  parchment: "#F5EDD8"
typography:
  display:
    fontFamily: "Cinzel Decorative, Georgia, serif"
    fontSize: "clamp(72px, 14vw, 200px)"
    fontWeight: 900
    lineHeight: 0.88
    letterSpacing: "normal"
  headline:
    fontFamily: "Cinzel Decorative, Georgia, serif"
    fontSize: "clamp(28px, 4.5vw, 60px)"
    fontWeight: 700
    lineHeight: 1.08
  title:
    fontFamily: "Cinzel Decorative, Georgia, serif"
    fontSize: "clamp(32px, 4vw, 54px)"
    fontWeight: 700
    lineHeight: 1.05
  body:
    fontFamily: "Josefin Sans, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "0.04em"
  label:
    fontFamily: "Josefin Sans, sans-serif"
    fontSize: "10px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.25em"
  caption:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(17px, 2.2vw, 26px)"
    fontWeight: 300
    lineHeight: 1.72
rounded:
  none: "0"
  subtle: "3px"
  pill: "50px"
  circle: "50%"
spacing:
  xs: "10px"
  sm: "16px"
  md: "28px"
  lg: "56px"
  xl: "120px"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.void}"
    rounded: "{rounded.none}"
    padding: "14px 40px"
  button-primary-hover:
    backgroundColor: "{colors.gold-bright}"
    textColor: "{colors.void}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.parchment}"
    rounded: "{rounded.none}"
    padding: "13px 40px"
  button-fan-cta:
    backgroundColor: "{colors.scarlet-rose}"
    textColor: "#ffffff"
    rounded: "{rounded.none}"
    padding: "18px 56px"
  nav-cta:
    backgroundColor: "transparent"
    textColor: "{colors.scarlet-rose}"
    rounded: "{rounded.none}"
    padding: "8px 20px"
  nav-cta-hover:
    backgroundColor: "{colors.scarlet-rose}"
    textColor: "#ffffff"
---

# Design System: Mia Suprema

## 1. Overview

**Creative North Star: "La Noche de Oro"**

This is a surface built for the 10-second glance from a phone screen at midnight. A fan taps from an Instagram story into a world that feels like arriving at a private event — dark and quiet, something gold catching the light, the energy of something expensive and slightly dangerous. The photography is the product; the type serves it.

The system uses four dark stops (#060406 through #1C141C) to create depth through tonal layering, not shadow. Gold carries authority; scarlet-rose carries urgency. Everything else is near-black. The design doesn't try to be Latin — it IS Latin in the way YSL is French: through precision, attitude, and the refusal to explain itself.

All copy is minimal. She doesn't explain herself. Labels are uppercase, tracked out, impossibly small. Headings are large to the point of risk. The space between them is the content.

**Key Characteristics:**
- Four-stop tonal dark system instead of flat black
- Gold accent used at ≤15% saturation on any surface; scarlet-rose used for primary CTAs and top-bar only
- Cinzel Decorative for every display and section headline; Josefin Sans for all body and label copy
- Sharp corners everywhere (radius: 0) except pill tags (50px) and circular avatars
- Film grain at 4% opacity: always present, never noticed
- Animated entrance on first load; scroll-triggered reveals; no looping decorative animation except grain and ticker
- No hover interactions on touch; full JS cursor on desktop with gold/pink states

## 2. Colors: The "La Noche de Oro" Palette

Four dark stops, one golden anchor, one hot signal color. The surface is a deep plum-black, not a cold graphite.

### Primary
- **Void** (#060406): Main body background. Near-black with a faint plum undertone — never cold, never neutral. Sections that need emphasis fall back here.
- **Gold** (#C9A855): The authority color. Logo, section labels, borders, interactive icons, primary button background. Warm antique gold, not chrome. Every visible stroke in the system is this color.
- **Gold Bright** (#E8D080): Hover state for Gold only. Lighter but still warm. Never used at rest.

### Secondary
- **Scarlet Rose** (#E91E8C): Urgency and conversion. The top bar, the "For the Real Fans" CTA, the nav ghost button border. Appears in ≤3 places per screen. Its rarity makes it mean something.

### Neutral
- **Nocturne** (#0E090E): Section background alternating with Void. The About and Connect sections sit here.
- **Velvet** (#150F15): Card and component background. Song cards, stream buttons, link cards.
- **Onyx** (#1C141C): Tertiary surface. Rarely used; reserved for deepest nesting.
- **Parchment** (#F5EDD8): All foreground text at full opacity. Warm white, never pure white.
- **Parchment 60** (rgba(245,237,216,0.6)): Body text, secondary labels, nav links at rest.
- **Parchment 30** (rgba(245,237,216,0.3)): Tertiary text, metadata, artist credits.

### Named Rules
**The One Signal Rule.** Scarlet Rose is used in ≤3 places per screen. A fourth use is prohibited. The moment it becomes ambient it stops meaning "act now."

**The Anti-Chrome Rule.** Gold means antique warmth. Never use #FFD700 or any chrome/coin gold. If a shade reads as shiny, it is wrong.

## 3. Typography

**Display Font:** Cinzel Decorative (with Georgia, serif fallback)
**Body Font:** Josefin Sans (sans-serif fallback)
**Accent Italic:** Cormorant Garamond, italic (with Georgia, serif fallback) — used for biographical prose and poetic subtitles only

**Character:** Cinzel Decorative is classical Roman letterforms at maximum weight — it reads as monument, not modernity. Josefin Sans is its inverse: geometric, light-tracked, and almost clinical. The pairing creates productive friction: grandeur up top, precision below. Cormorant bridges them in the moments that need warmth.

### Hierarchy
- **Display** (900 weight, clamp(72px–200px), line-height 0.88): Hero name only. Enormous. Leads with the artist's first name at a size that competes with the photography.
- **Headline** (700 weight, clamp(28px–60px), line-height 1.08): Section titles across the full site. "MÚSICA", "CONNECT", "FEED."
- **Title** (700 weight, clamp(32px–54px), line-height 1.05): Subsection heads. About section title. Fans section title.
- **Body** (400 weight, 14px, line-height 1.7, letter-spacing 0.04em): Standard prose. Max line length 65ch.
- **Label** (600 weight, 9.5–11px, letter-spacing 0.22–0.55em, uppercase): All navigation, button text, genre tags, section eyebrows, platform names. The backbone of the system.
- **Caption/Italic** (300 weight italic, clamp(17px–28px), line-height 1.72): Hero tagline, about body copy, fan section subheadline. This is where the warmth lives.

### Named Rules
**The Scale Cliff Rule.** The jump from label (10px) to body (14px) to caption (17–28px) to headline (28–60px) must remain abrupt. Intermediate sizes between these steps are prohibited — they collapse the hierarchy.

**The Uppercase Ceiling.** Uppercase with tracking is for labels only (≤11px). Never apply text-transform: uppercase above 14px. Cinzel Decorative at display sizes is already formal enough.

## 4. Elevation

Tonal layering, not shadows. Depth is created by stepping through the four dark stops: Void → Nocturne → Velvet → Onyx. A component sitting on Velvet (#150F15) over Nocturne (#0E090E) over Void (#060406) creates three implied floors without a single box-shadow.

Shadows appear only on hover states, as kinetic feedback — not as ambient structural depth.

### Shadow Vocabulary
- **Lift** (`0 20px 60px rgba(0,0,0,0.5)`): Song card hover. Confirms the Y-axis movement.
- **Gold Glow** (`0 12px 40px rgba(201,168,85,0.3)`): Primary button hover. Confirms the button's warmth.
- **Rose Glow** (`0 0 70px rgba(233,30,140,0.55)`): Fan CTA hover. Maximum urgency.
- **Rose Ambient** (`0 0 28px rgba(233,30,140,0.45), 0 0 60px rgba(233,30,140,0.18)`): Bio page fan button at rest. The one exception to the at-rest-no-shadow rule — the CTA is so important it glows permanently.

### Named Rules
**The At-Rest Rule.** Surfaces are flat at rest. Shadow is a response to state (hover, focus), not a structural indicator. The one exception is the fan CTA in bio.html, which earns a permanent ambient glow because it is the primary conversion element.

## 5. Components

### Buttons

The system has three button shapes: Primary (gold-filled), Ghost (cream-outlined), and Fan CTA (rose-filled). All have radius: 0. Sharp edges everywhere.

- **Primary** (`btn-primary`): Gold fill (#C9A855), Void text, 14px 40px padding. Hover: Gold Bright fill, translate-Y(-2px), Gold Glow shadow. Used for music CTAs.
- **Ghost** (`btn-ghost`): Transparent, rgba(245,237,216,0.3) border, Parchment 60 text. Hover: full Parchment border and text. Used as secondary action beside Primary.
- **Fan CTA** (`fans-cta`, `link-fan`): Scarlet Rose fill, white text, 18px 56px padding. Shimmer sweep on hover (left: -100% → 100% white gradient). Rose Glow hover shadow. This is the conversion button. Treat it as sacred.

### Genre Tags / Chips

Pill shape (50px radius), 1px Gold-at-35%-opacity border, Gold text, 9px uppercase Josefin label text. Hover: fill with Gold Dim (rgba gold at 12%). Used on hero and about sections; decorative, not interactive navigation.

### Song Cards

Dark surface (Velvet), 1px gold border at 8% opacity at rest, 30% on hover. Translate-Y(-5px) + Lift shadow on hover. Square album art occupies full card width (padding-bottom: 100% technique). Play button appears at scale(0.7)→scale(1) on hover. Info block: 20px 22px 26px padding. Song title in Josefin Sans 600 16px.

**The Whole-Card-is-a-Link Rule.** Song cards are `<a>` tags. Platform icons inside are `<span>`, never nested `<a>`. One clickable target per card.

### Link Cards

Dark surface (Velvet), 1px gold border at 9% opacity. Hover: border-color 40% gold + translate-X(3px) + Gold Dim fill slides in from left via `::before` pseudo. 44×44px icon circles. Gold arrow appears on hover (opacity 0→1, translate-X -8px→0).

### Navigation

Fixed at top: 38px top-bar offset. Transparent at rest; frosted glass (rgba black 88%, blur 20px) on scroll. Logo in Cinzel Decorative 21px gold. Nav links in Josefin Sans 10.5px label style, Parchment 60 at rest, Gold on hover. Nav CTA in Scarlet Rose ghost style; fills solid Scarlet Rose on hover. Custom gold/pink cursor replaces system cursor on desktop.

### Top Bar

Full-width Scarlet Rose strip, 38px height. Shimmer sweep animation on the link. This is the always-visible conversion entry point — above the fold, above the nav.

### Bio Song Cards

Horizontal layout: 50×50px album art thumbnail (object-fit: cover) + meta block + gold play chevron. Border 1px Gold at 18% opacity. Hover/active: Gold border brightens, background tints gold at 7%.

## 6. Do's and Don'ts

### Do:
- **Do** keep Scarlet Rose in ≤3 places per screen. Its job is urgency; overuse kills the signal.
- **Do** use the tonal layering system (Void → Nocturne → Velvet → Onyx) for depth. Four stops; use them in order.
- **Do** make every song card and link card a single `<a>` tag. One tap target per card, no nested interactive elements.
- **Do** respect `prefers-reduced-motion`: wrap all entrance animations in the media query. Grain and the ticker may persist; everything else must freeze.
- **Do** load retargeting pixels (Meta, TikTok) before any other script. Audience capture is Priority 1 per the product principles.
- **Do** keep label type at 9–11px uppercase with generous letter-spacing (0.22em–0.55em). That tracked-out precision IS the brand voice in text.
- **Do** use Parchment (#F5EDD8) for all foreground text — never pure white (#fff or #ffffff).
- **Do** keep touch targets at 44×44px minimum on all interactive elements. This is a mobile-first surface.

### Don't:
- **Don't** use neon-on-black, graffiti fonts, or SoundCloud-rapper aesthetics. She is luxury, not street. (PRODUCT.md anti-reference: "try-hard edgy.")
- **Don't** default to the generic music-artist major-label layout: polished photography, bland sans-serif, streaming buttons centered on white. (PRODUCT.md anti-reference: "safe corporate.")
- **Don't** make this look like Linktree. The bio page is a linktree in function; it must not be one in appearance.
- **Don't** use tropical signifiers (bright reds, oranges, flag imagery, folkloric patterns). She is high fashion, not regional. (PRODUCT.md anti-reference: "tropical stereotype.")
- **Don't** use gradient text (`background-clip: text` with a gradient background). The `-webkit-text-stroke` outline on "SUPREMA" is the intentional exception — it is structural, not decorative.
- **Don't** add a fourth dark stop below Onyx or above Void. The four-stop system is closed.
- **Don't** add looping decorative animations on elements other than grain, ticker, and scroll-indicator. One entrance sequence per page; persistent motion is noise.
- **Don't** use pure white (#fff) anywhere in the design. Parchment (#F5EDD8) is the ceiling. Pure white reads as clinical and breaks the warm black atmosphere.
- **Don't** add border-left as a colored accent stripe on cards, callouts, or list items. Full borders, background tints, or nothing.
