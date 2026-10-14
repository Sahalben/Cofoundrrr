# COFOUNDRRR — ARCHITECTURE & PROJECT CONTEXT

## Brand & Creative Foundation
- **Product**: Cofoundrrr
- **Tagline**: You never build alone.
- **Mission**: Help people discover their professional identities, find compatible collaborators, form teams, build projects, and develop promising startups through a collaborative ecosystem.
- **Design Palette**:
  - Forest: `#0B3F30` (Primary brand dark)
  - Mist: `#F0F7F4` (Primary background light)
  - Mint: `#DDEEE6` (Primary accent & surface light)
  - Ink: `#143A2E` (Deep contrast text & dark surface)
  - *Muted Gold (`#C9A86A`)*: Explicitly removed per user directive. Do not reintroduce without explicit confirmation.

---

## Technical Stack
- **Framework**: React 19 + TypeScript (Strict mode enabled)
- **Bundler & Tooling**: Vite 7
- **CSS Engine**: Tailwind CSS v4 via `@tailwindcss/vite`
- **Testing**: Vitest (`npx vitest run`)
- **Routing**: Zero-dependency lightweight hash router (`src/lib/router.tsx`) supporting `#top` anchors on the landing page and `#/problems/*` application routes.

---

## Directory Structure
```
cofoundrrr/
├── docs/
│   └── problem-box-schema.sql         # Production PostgreSQL 15+ schema specification
├── src/
│   ├── components/
│   │   ├── layout/                    # Nav (theme-sensing transparent), Footer
│   │   ├── mockups/                   # Illustrative profile cards
│   │   └── ui/                        # Reusable primitives (Container, Eyebrow, Button, Tag, Avatar, Reveal)
│   ├── data/
│   │   └── sample.ts                  # Landing page illustrative sample data
│   ├── features/
│   │   └── problem-box/               # Problem Box first-class module
│   │       ├── components/            # Header, Badges, Breakdown, Actions, Modals
│   │       ├── data/                  # Repository interface, localStorage driver, seed data
│   │       ├── domain/                # Pure business logic (validation rules, ranking, similarity, sanitization)
│   │       │   └── __tests__/         # Vitest unit test suites
│   │       ├── views/                 # Directory, Detail, Submit, Moderation views
│   │       └── ProblemBoxApp.tsx      # Problem Box root module entry
│   ├── hooks/                         # useReveal intersection observer hook
│   ├── lib/
│   │   ├── router.tsx                 # Hash router supporting path routes and in-page anchors
│   │   └── demoSession.ts             # Demo identity switcher (Member A, B, Moderator)
│   ├── sections/                      # Landing page sections (Hero, Problem, Pathways, etc.)
│   ├── styles/
│   │   └── index.css                  # Tailwind v4 @theme design tokens
│   ├── App.tsx                        # Root router selector (Landing vs Problem Box)
│   └── main.tsx                       # React application bootstrap
├── context.md                         # This architecture guide & source of truth
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Module: Problem Box
Problem Box is a searchable, community-maintained wiki of real-world problem statements submitted by individuals, companies, and organizations.

### Key Data Integrity Guarantees
1. **Separation of Validation Kinds**: Responses are tracked as **Direct Personal Experience**, **Observed in Others**, or **General Interest**. General interest is never presented as experience.
2. **No Deceptive Demand Aggregation**: Validation counts are never summed into an aggregate &ldquo;vote count&rdquo; or equated with commercial market size or willingness to pay.
3. **Single Validation per Member**: Each authenticated identity holds at most one response per problem. Submitting a new response edits and updates the existing entry.
4. **Transparent Verification**: Submitter kinds clearly distinguish **Verified Organizations**, **Unverified Submitters**, and **Public Problem Banks** (SIH, KSUM).
5. **Algorithmic Lexicographic Ranking**: &ldquo;Most Validated&rdquo; sorts by direct experience first, then observed, then interest, ensuring high-conviction first-hand experience always outranks speculative interest.
6. **Input Sanitization**: Untrusted user content is normalized, stripped of dangerous characters, and URLs are strictly restricted to `http://` and `https://`.

### Seed Dataset
The repository comes pre-seeded with authentic, documented challenges sourced from public problem statement archives:
- Smart India Hackathon (Ministry of Education's Innovation Cell / AICTE)
- Kerala Startup Mission (KSUM) Government Department Challenges (Animal Husbandry, IT Mission, Disaster Management)
- Sponsoring ministries and challenge IDs are preserved with original citations.

---

## Future Backend Integration Points
When provisioning cloud infrastructure:
1. Replace `LocalStorageProblemBoxRepository` (`src/features/problem-box/data/repository.ts`) with an API client (Supabase, PostgreSQL + PostgREST, or custom API).
2. Execute `docs/problem-box-schema.sql` on PostgreSQL.
3. Replace `src/lib/demoSession.ts` with real session state (e.g. Supabase Auth / NextAuth / Clerk).
