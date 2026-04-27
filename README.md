# Aman Agarwal — Portfolio

Personal portfolio of **Aman Agarwal**, Principal Software Engineer and Co-founder, built with Next.js 15.

**Live:** [amanagarwal.dev](https://amanagarwal.dev) · **Schedule a call:** [cal.com/aman.openlit/30min](https://cal.com/aman.openlit/30min)

---

## About

I'm a Principal Software Engineer and co-founder building at the intersection of AI, security, and open-source.

- **[Transilience AI](https://github.com/transilienceai)** — Full-stack engineer building an AI-powered security platform. Autonomous agents for pentesting, CSPM, compliance, and policy automation. Engineered a dynamic TSX component generation system that produces interactive, context-aware UIs at runtime.
- **[OpenLIT](https://github.com/openlit/openlit)** *(Co-founder)* — Open-source AI Engineering platform with 2.4k+ GitHub stars. OpenTelemetry-native LLM observability supporting 50+ LLM providers, GPU monitoring, Guardrails, and Evaluations.

Before AI, I spent years at [Appsmith](https://github.com/appsmithorg/appsmith) (GraphQL integrations, module-sharing architecture) and [Gradeup/Byju's](https://byjus.com) (led 7+ engineers across 4 products, built a live virtual whiteboard with WebRTC, drove Lighthouse scores to 90+).

---

## Stack

| Layer | Technologies |
|---|---|
| Framework | Next.js 15 (App Router, static export) |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion |
| 3D | Three.js (particle network constellation) |
| Fonts | Bricolage Grotesque · DM Sans (Google Fonts) |
| Language | TypeScript |

---

## Features

- **Particle network 3D** — 140-node constellation that responds to mouse movement
- **mix-blend-mode cursor** — white orb with difference blending; inverts on hover
- **Scroll-triggered animations** — staggered Framer Motion `whileInView` per section
- **Aurora background** — CSS-animated radial gradient blobs
- **Scrolling marquee** — three-row tech stack with alternating directions
- **SEO-ready** — JSON-LD Person schema, OG/Twitter meta, canonical URL, semantic HTML
- **Performance** — static generation, `next/font`, no layout-triggering animations

---

## Getting Started

```bash
# Install
npm install

# Dev server
npm run dev        # http://localhost:3000

# Production build (generates out/)
npm run build
```

## Deploy to Cloudflare Pages

```bash
# 1. Authenticate (one-time)
npx wrangler login

# 2. Build + deploy in one command
npm run deploy
```

Or via CI with a token:

```bash
CLOUDFLARE_API_TOKEN=<token> npm run deploy
```

The `[assets]` block in `wrangler.toml` points Wrangler at the `out/` directory.
Get a token at [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens) → **Edit Cloudflare Workers** template.

**Cloudflare Pages CI (GitHub integration):**
- Build command: `npm run build`
- Build output directory: `out`
- Deploy command: `npx wrangler deploy`
- Environment variable: `CLOUDFLARE_API_TOKEN`

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx       # Fonts, SEO metadata, JSON-LD
│   ├── page.tsx         # Section assembly
│   └── globals.css      # Design tokens, animations, cursor
└── components/
    ├── Cursor.tsx        # mix-blend-mode orb cursor
    ├── Nav.tsx           # Frosted glass nav, scroll-aware
    ├── Hero.tsx          # Full-viewport hero, particle scene
    ├── Scene3D.tsx       # Three.js particle network
    ├── About.tsx         # Animated stat counters, highlights
    ├── Stack.tsx         # Scrolling marquee + project cards
    ├── Experience.tsx    # Vertical timeline
    ├── Blogs.tsx         # LinkedIn + OpenLIT + Medium posts
    ├── Testimonials.tsx  # Peer recommendations
    └── Contact.tsx       # cal.com + email CTAs
```

---

## Connect

| | |
|---|---|
| GitHub | [AmanAgarwal041](https://github.com/AmanAgarwal041) |
| LinkedIn | [amanagarwal041](https://www.linkedin.com/in/amanagarwal041/) |
| Twitter | [@_typeofnull](https://x.com/_typeofnull) |
| npm | [~typeofnull](https://www.npmjs.com/~typeofnull) |
| Email | [agarwal.aman041@gmail.com](mailto:agarwal.aman041@gmail.com) |
