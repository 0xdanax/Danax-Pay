# Danax Pay™ — Dark Cinematic Landing Page

A full dark cinematic landing page for Danax Pay, a private payment protocol built on the Miden ZK rollup.

## Tech Stack

- **React 18** + **Vite** + **TypeScript**
- **Tailwind CSS** — utility-first styling
- **Three.js** — raw WebGL particle field (800 desktop / 300 mobile)
- **vanilla-tilt** — 3D card tilt on hover
- **GSAP** — available for advanced animations

## Getting Started

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── App.tsx                   # Root composition
├── index.css                 # CSS variables, keyframes, utilities
├── components/
│   ├── Navbar.tsx            # Sticky nav with liquid-glass scroll effect
│   ├── Hero.tsx              # Full-screen video hero with parallax layers
│   ├── Features.tsx          # 6-card feature grid with tilt
│   ├── Stats.tsx             # Animated count-up statistics
│   ├── HowItWorks.tsx        # Step-by-step with slide-in animation
│   ├── Testimonials.tsx      # 3 testimonial cards with tilt + scramble
│   ├── Pricing.tsx           # 3-tier pricing with popular highlight
│   ├── FinalCTA.tsx          # Bottom CTA with glitch text
│   ├── Footer.tsx            # 4-column grid footer
│   ├── ParticleField.tsx     # Three.js raw particle canvas
│   ├── ScanLine.tsx          # Fixed scan-line + noise overlays
│   ├── GlitchText.tsx        # CSS glitch animation component
│   ├── ScrambleText.tsx      # Character scramble reveal
│   ├── SplitReveal.tsx       # Word-by-word float-up reveal
│   ├── TypewriterText.tsx    # Typewriter character-by-character
│   └── GradientFlowText.tsx  # Animated cyan gradient text
└── hooks/
    ├── useParallax.ts        # Scroll parallax (disabled on mobile)
    ├── useInView.ts          # IntersectionObserver trigger
    ├── useCountUp.ts         # Animated number counter
    └── useTilt.ts            # vanilla-tilt wrapper
```

## Design Decisions

- **No blobs or mesh gradients** — dark, cinematic atmosphere via video + vignette
- **Cyan accent (#00D2FF)** used only for CTAs, stats, borders, and gradient text
- **Liquid glass** morphism for cards and nav elements
- **All animations** respect `prefers-reduced-motion`
- **Mobile-first** — tilt and parallax disabled on < 768px, particles reduced to 300

## Performance

- Particles: Three.js geometry/material/renderer disposed on unmount
- vanilla-tilt: `.destroy()` called on unmount
- Images: `loading="lazy"` on all external images
- Parallax: passive scroll listener + `requestAnimationFrame` throttling
- React.memo on Navbar and Footer
