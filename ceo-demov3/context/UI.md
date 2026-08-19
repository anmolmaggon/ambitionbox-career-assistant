# UI

All tokens and visual rules are drafts until the owner explicitly locks them.

## Character

Calm, intelligent, trustworthy, mobile-native, and quietly futuristic. Futuristic means contextual and responsive, not gradients, glass, sparkles, or generic AI imagery.

## Foundation

- Typeface: Figtree with robust system fallbacks.
- Canvas: `#F7F8FC`
- Surface: `#FFFFFF`
- Primary ink: `#17192B`
- Muted ink: `#626985`
- AmbitionBox blue: `#3F5CFB`
- Success: `#168B63`
- Consideration: `#B96A12`
- Danger: `#C94B58`
- Border: cool grey-blue near `#E1E5F0`

Use a primitive → semantic → component token hierarchy. Raw values live only in the token layer as the system is migrated.

## Type and spacing

- Display: 30–34px, heavy, tight tracking
- Section title: 21–24px
- Action title: 16–18px
- Body: 13–14px with generous line height
- Metadata: 10–11px minimum when meaningful
- Spacing grid: 4px base using 8, 12, 16, 20, 24, and 32px intervals

## Shape and depth

- Major surfaces: 20px radius
- Inputs and action rows: 14px
- Every text-labelled CTA button—primary, secondary, tertiary, or contextual edit—uses a full pill radius. Icon-only utilities and full-row disclosures keep shapes appropriate to their role.
- Pills: compact statuses only
- Prefer borders and surface contrast to heavy shadow
- Reserve stronger depth for sheets, the dominant action, or an intentional emotional transition

## Component principles

- One structured surface may hold several related rows.
- Source headers that qualify a whole structured surface share its outer border and radius; use an internal divider instead of a card gap.
- When AmbitionBox presents data brought from a first-party sister product, use a compact **AmbitionBox × source** logo lockup. Do not add a second decorative icon when the outcome copy already carries the delight.
- Do not create a separate card for every fact.
- Use category-specific icons only when they improve recognition.
- Profile and settings rows may use restrained category colour inside icon tiles. Keep the colour local to the icon and do not turn it into status meaning or a page-wide rainbow treatment.
- The First Open signal spine may use three distinct pastel icon nodes inside the AmbitionBox blue world. Keep the colour inside the nodes; do not use device-dependent emoji as the visual system.
- Use blue as the dominant accent; green confirms success and amber marks something to consider.
- Keep secondary controls visibly interactive but quiet.
- Onboarding flow headers use a back action, branch-aware segmented progress with an elongated current marker, and an optional close action. The segment count comes from the selected journey rather than a fixed visual constant; the structure remains stable while its surface inherits white or the screen's blue hero.
- Completion ticks may use one short pop-and-draw transition when state changes; never loop a success animation.
- On Profile Review, keep working copy at readable mobile sizes: 14–15px body and row titles, 12px supporting metadata. Do not shrink core content to fit more rows above the fold.
- On Profile Review, long professional-summary copy belongs inside the same disclosure system as other imported sections. Keep its headline as the one-line collapsed preview and preserve readable paragraph rhythm when expanded.
- Reuse that readable row hierarchy for imported Preferences: 15px values, 12px labels and source metadata, 44px minimum edit targets, and one attached provenance header rather than a second card.
- Keep optional preference refinements inside the same continuous surface but visually subordinate to imported values. Empty rows use a clear Add affordance and **Not added** state; they do not look like validation errors.

## Imagery and reference use

- Lock structure and hierarchy before adding an illustration.
- Prefer native product artifacts, data, or one purposeful visual metaphor.
- Do not imitate a reference wholesale; extract the documented pattern in `references/CATALOG.md`.
- Avoid generic 3D search objects, floating cards, cosmetic blue-purple glows, AI-purple gradients, decorative sparkles, and visual effects whose only job is to look “AI.”

## Motion

- Use one orchestrated transition where the state consequence matters.
- Curation remains a parked white product-canvas experiment with an orbiting source network. It is not part of the current live sequence.
- Unified Email Assistance uses the standard light canvas, one white connected product-theatre surface, and restrained category colour inside reply, interview, and offer icon tiles. Reveal those three moments once from top to bottom. Anchor trust and full-pill provider actions near the bottom. Use the Gmail mark on **Connect Gmail**, keep Skip in the header, and render the complete state immediately under reduced motion.
- First Open draws the connected line and reveals its three benefits once from top to bottom. This motion communicates the product sequence; it does not loop.
- Keep routine screen motion short and restrained.
- Avoid scattered ambient animation.
- Provide an immediate reduced-motion state.

## Critique passes

1. Hierarchy, density, copy length, container count, and focal action
2. Alignment, wrapping, rhythm, icon consistency, contrast, and motion
