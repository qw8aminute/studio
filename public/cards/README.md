# Tarot Card Assets

## Directory Structure

```
public/
├── cards/           # Full-size tarot cards (300x500px minimum)
│   ├── mini-templates.png
│   ├── tuneup.png
│   ├── brand-engine.png
│   ├── micro-teaching.png
│   ├── abq-visuals.png
│   └── experiments.png
└── icons/           # Dock icons (128x128px minimum)
    ├── mini-templates.png
    ├── tuneup.png
    ├── brand-engine.png
    ├── micro-teaching.png
    ├── abq-visuals.png
    └── experiments.png
```

## Card Specifications

### Tarot Cards (Full Size)
- **Format:** PNG with transparency
- **Dimensions:** 300x500px minimum (3:5 aspect ratio)
- **Resolution:** 72-150 DPI
- **File size:** <500KB each
- **Style:** Your custom tarot card designs

These appear in the swipeable deck above the dock.

### Dock Icons
- **Format:** PNG with transparency or rounded corners
- **Dimensions:** 128x128px minimum (1:1 square)
- **Resolution:** 72-150 DPI  
- **File size:** <100KB each
- **Style:** Simplified icon versions

These appear in the iOS-style dock at the bottom.

## Temporary Placeholders

Until you add your actual tarot card images, the deck will show:
1. Fallback gradient backgrounds based on service theme colors
2. Service titles overlaid on cards
3. Basic styling to maintain layout

The dock icons will show placeholder colored squares if images are missing.

## Design Tips

### For Tarot Cards:
- Use your actual PNG tarot card designs
- Cards should have rich, detailed artwork
- Consider a consistent art style across all 6 cards
- Add border/frame if needed in the design itself
- Dark backgrounds work best with the overlay text

### For Dock Icons:
- Simplified, recognizable symbols for each service
- High contrast for visibility at small size
- Rounded corners match iOS aesthetic
- Can be abstractions of the full tarot card designs

## Quick Setup

1. Export your 6 tarot cards as PNGs
2. Name them according to the list above
3. Place in `public/cards/`
4. Create simplified 128x128px icons
5. Place in `public/icons/`
6. Restart dev server to see changes

Cards will automatically load and be swipeable!
