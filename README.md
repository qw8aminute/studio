QD Studio

QD Studio is the personal portfolio and creative studio of Quaite Dodson, showcasing work across product, design, data, and interactive development.

Built as a living system — part portfolio, part playground — it blends motion, narrative, and experimentation.

© 2025 QD Studio. All rights reserved.

Status

Phase 1: Foundation — Complete ✅

This release establishes the visual system, interaction model, and core architecture.

Tech Stack

React 18 + TypeScript

Vite

React Router

D3.js (force-directed graph)

React Spring / Framer Motion (animation)

Canvas & SVG rendering

CSS

Features

Animated duality background (canvas)

Fixed header with QSTU logo system

Force-directed typographic graph (hero motif)

Liquid tile grid with video / gradient fallbacks

Responsive layout (desktop + mobile)

Route scaffolding for future sections

Terminal-style modal system (About, Contact, Resume)


Project Structure
src/
├── components/
│   ├── Background/
│   │   └── DualityCanvas.tsx
│   ├── Header/
│   │   ├── Header.tsx
│   │   └── QSTULogo/
│   ├── Hero/
│   │   └── ForceGraph.tsx
│   ├── Tiles/
│   │   ├── TileGrid.tsx
│   │   └── CardStack.tsx
│   ├── Terminal/
│   │   ├── TerminalModal.tsx
│   │   └── Screens/
│   └── Footer/
│       └── Footer.tsx
├── pages/
│   ├── Home.tsx
│   └── sections/
├── types/
│   └── index.ts
└── App.tsx

Video Assets

Optional video loops can be added to:

public/videos/


Expected files:

mini-templates.mp4

tuneup.mp4

brand-engine.mp4

micro-teaching.mp4

abq-visuals.mp4

experiments.mp4

Recommended specs

1920×1080 (16:9)

MP4 (H.264)

10–15s seamless loops

< 5MB each

Tiles gracefully fall back to gradients if videos are absent.

Roadmap
Phase 2

Dedicated landing pages per tile

Section-specific motion + backgrounds

Narrative content expansion

Clear CTAs and pathways

Phase 3

Terminal-first navigation patterns

Artifact viewers (HTML, visuals, experiments)

Fullscreen overlay system

Keyboard-first interactions (ESC / CMD shortcuts)

Deployment

Designed for Cloudflare Pages.

npm run build
# deploy dist/

License

© 2025 QD Studio / Quaite Dodson
All rights reserved.
