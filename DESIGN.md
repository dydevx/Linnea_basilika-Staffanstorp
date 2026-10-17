# Design — Linnea & Basilika

## Direction
Botanical lacquer bistro, deepened in the 2026-10-17 refinement. Dark jade surfaces, turmeric-gold highlights, porcelain menu cards, restrained serif headings and naturally lit food photography create a richer Asian dining identity. The existing cuisine, Swedish language and verified menu data remain authoritative.

## Tokens and implementation
`linnea-basilika/css/ornate.css` is the final theme layer after the base, responsive, bistro, luxury and motion sheets. Deep jade #10271f, secondary jade #153329, turmeric gold #e6a83f, porcelain #f3efe3 and ivory #f5f0e4 form the locked palette. Baskervville display and Inter body remain. Layered borders, subtle geometric fields and inset highlights add detail without competing with the food photography. Cards use soft 14-22px corners and interactive controls remain pill-shaped.

## Composition
A generous editorial hero leads to photographic menu shortcuts, then a practical searchable menu with desktop cart alongside. The menu uses a photographic family banner, tabs, filters, a category select and two-column dish cards so dense content remains easy to scan. On mobile the cards become a single column and a fixed cart bar keeps count and total visible. Forms, contact and booking share the light palette. Functional menu rows preserve exact dishes and prices.

## Motion
Motion follows the gesture of opening a printed bistro menu. A short split-panel introduction opens the page, then the hero copy and photograph settle into place in sequence. Key content reveals on scroll, mobile navigation opens with a stagger, and menu-family/filter changes use a brief continuity transition. Buttons respond with tactile press and click ripples. Adding a dish changes the button label, floats a small +1 marker, pulses cart indicators and announces a toast. A compositor-driven reading-progress rule and the HoangCaster signature animation add character without delaying tasks. Every spatial animation has a reduced-motion path.

## Images
Eleven generated illustrative assets live in `linnea-basilika/assets/images/ai/`. The menu maps these photographs to the relevant Thai, curry, noodle, sushi and bowl sections and loads them lazily. They are labelled as AI illustrations, not documentary restaurant photographs. Prompt provenance is in that directory's README.md. No scanned menu pages are displayed. The project favicon is a separate code-native SVG monogram in `linnea-basilika/assets/favicon.svg`.

## Accessibility and behavior
44px menu actions, visible focus, high-contrast body copy, reduced-motion support, visible content without reveal effects, meaningful alt text and search empty state. Menu shortcuts select the appropriate menu and filter. Keep cart persistence and the existing unconfigured-WhatsApp safeguards.
