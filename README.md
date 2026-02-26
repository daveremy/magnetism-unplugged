# Magnetism Unplugged

An open-source, interactive course on magnetism for learners with no physics or math background.

## What is this?

Magnetism Unplugged is a free, browser-based course that builds intuition about magnetism through plain-language explanations and interactive visualizations. No equations required — just curiosity.

## Course Modules

1. **The Invisible Push and Pull** — What magnets are, how poles work
2. **Fields: The Invisible Landscape** — What a "field" means, field lines
3. **Why Iron but Not Aluminum?** — Magnetic domains, why some materials are magnetic
4. **Earth as a Giant Magnet** — Compasses, magnetic north, navigation
5. **Electricity & Magnetism: Secret Siblings** — Moving charges create fields
6. **Electromagnets and Why They Matter** — Coils, solenoids, controlling magnetism
7. **Induction: Magnetism Creates Electricity** — Faraday's law, generators
8. **Magnetism in Your Daily Life** — Motors, speakers, MRI, maglev
9. **The Bigger Picture** — EM waves and how magnetism and electricity unify
10. **Frontiers** — Quantum spin, superconductors, or fusion (pick your adventure)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
git clone https://github.com/dremy/magnetism-unplugged.git
cd magnetism-unplugged
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start the course.

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run test` | Run unit tests |
| `npm run lint` | Run linter |

## Contributing

Contributions are welcome! Here's how you can help:

- **Content**: Improve explanations, fix errors, add analogies
- **Visualizations**: Build or improve interactive simulations
- **Accessibility**: Improve a11y for visualizations and navigation
- **Translations**: Help make the course available in other languages

Please open an issue before starting work on a new module or visualization.

### Content Guidelines

- **Audience**: No physics or math background assumed
- **Tone**: Conversational, curious, never condescending
- **Accuracy**: All content must be scientifically accurate, even when simplified
- **Analogies**: Use them deliberately and note where they break down

## Tech Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- MDX for interactive lesson content
- Tailwind CSS for styling
- Framer Motion for 2D interactions
- Canvas API for field visualizations
- Vitest for unit testing

## License

- **Code**: [MIT License](LICENSE)
- **Educational Content** (MDX text, diagrams): [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
