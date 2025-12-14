# QD Studio

Portfolio website for Quaite Studio - showcasing creative work across design, product, and development.

## Phase 1: Foundation ✅

**Tech Stack:**
- React 18 + TypeScript
- Vite
- D3.js (force graph)
- Framer Motion (animations)
- React Router (navigation)

**Features:**
- ✅ Animated background (duality pattern)
- ✅ Fixed header with QSTU logo
- ✅ D3 force graph hero section
- ✅ 6 liquid tiles with video backgrounds
- ✅ Responsive grid layout
- ✅ Smooth scrolling and transitions
- ✅ React Router navigation (stubbed Phase 2 pages)

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Background/
│   │   ├── DualityCanvas.tsx    # Animated particle background
│   ├── Header/
│   │   ├── Header.tsx           # Fixed header
│   │   ├── QSTULogo.tsx         # Brand logo
│   │   └── Menu.tsx             # Navigation menu
│   ├── Hero/
│   │   ├── Hero.tsx             # Hero section wrapper
│   │   └── ForceGraph.tsx       # D3 force-directed graph
│   ├── Tiles/
│   │   ├── TileGrid.tsx         # Tile container
│   │   └── LiquidTile.tsx       # Individual tile component
│   └── Footer/
│       └── Footer.tsx           # Site footer
├── pages/
│   ├── Home.tsx                 # Main landing page
│   └── sections/                # Landing pages (Phase 2)
├── types/
│   └── index.ts                 # TypeScript types & data
└── App.tsx                      # Router configuration
```

## Video Assets

Place video files in `public/videos/`:
- mini-templates.mp4
- tuneup.mp4
- brand-engine.mp4
- micro-teaching.mp4
- abq-visuals.mp4
- experiments.mp4

**Specs:** 1920x1080 (16:9), MP4 (H.264), 10-15s loops, <5MB each

Tiles will show gradient fallbacks until videos are added.

## Phase 2 Roadmap

- [ ] Individual landing pages for each tile
- [ ] Custom backgrounds per section
- [ ] Section-specific components
- [ ] Pricing sections
- [ ] CTA components

## Phase 3 Roadmap

- [ ] Terminal window component
- [ ] HTML artifact viewer
- [ ] Fullscreen overlay system
- [ ] ESC to close functionality

## Deployment

Deploy to Cloudflare Pages:

```bash
npm run build
# Upload 'dist' folder to Cloudflare Pages
```

## License

© 2024 QD Studio. All rights reserved.
