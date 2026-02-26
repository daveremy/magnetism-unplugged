# Magnetism Unplugged — AI Assistant Guide

## Project Overview

Interactive magnetism course for learners with zero physics/math background. Intuition-first, visualization-heavy, scientifically accurate.

## Audience

- No physics or math background assumed
- Building intuition through analogies and interactive visuals
- Every concept starts with a real-world hook before theory

## Tone & Voice

- Conversational, curious, never condescending
- "Let's figure this out together" — not lecturing
- Use analogies deliberately and **always note where they break down**
- Math only when it genuinely helps (and always optional in "Going Deeper" sections)

## Content Rules

- Every module starts with a real-world hook question
- Learning objectives: 3-5 specific things per module
- Include safety notes for "Try It" hands-on activities
- Address 1-3 common misconceptions per module explicitly
- Never sacrifice correctness for accessibility — find better analogies instead
- Flag any physics uncertainties for expert review with `<!-- REVIEW: description -->`

## Code Conventions

- TypeScript strict mode
- Tailwind CSS for all styling (no CSS modules, no styled-components)
- Components: PascalCase (`ModuleCard.tsx`)
- MDX content files: kebab-case (`01-the-invisible-push-and-pull.mdx`)
- Physics/math logic lives in `src/lib/physics/` — decoupled from React, unit tested
- Use Framer Motion for drag/layout animations, Canvas API for field visualizations
- react-three-fiber only when a module concretely needs 3D (Module 4+ at earliest)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with nav
│   ├── page.tsx            # Landing page
│   └── modules/[slug]/     # Dynamic MDX module pages
├── components/
│   ├── ui/                 # Shared UI (nav, quiz, callouts)
│   └── visualizations/     # Interactive physics simulations
│       └── shared/         # Reusable visual primitives
├── content/modules/        # MDX files (one per module)
├── lib/
│   ├── modules.ts          # Module metadata from frontmatter
│   ├── mdx.ts              # MDX compilation utilities
│   └── physics/            # Decoupled physics logic
├── types/                  # TypeScript type definitions
└── mdx-components.tsx      # MDX → React component mapping
```

## MDX Frontmatter Schema

```yaml
---
title: "Module Title"
slug: "module-slug"
module: 1
description: "Short description"
prerequisites: []
status: "draft" | "review" | "published"
---
```

## Available MDX Components

- `<Callout type="info|warning|tip">` — Informational boxes
- `<CommonMisconception myth="..." reality="...">` — Misconception callouts
- `<TryIt>` — Hands-on experiment prompts
- `<QuizQuestion>` — Interactive quiz questions

## Physics Accuracy

All content must be scientifically accurate even though simplified. When in doubt:
1. Check multiple authoritative sources
2. Flag uncertainty with `<!-- REVIEW: ... -->` comments
3. Prefer "we don't fully know" over incorrect simplification

## Licensing

- Code: MIT
- Educational content (MDX text, diagrams): CC BY-SA 4.0

## Testing

- Physics logic: unit tests with Vitest in `__tests__/lib/physics/`
- E2E: Playwright in `__tests__/e2e/`
- All visualizations must have accessible fallback text descriptions

## Workflow

Explore → Plan → Write tests → Implement → Update docs → Commit
