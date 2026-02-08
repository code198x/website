# Code198x Website

Astro 5.x learning platform for retro game development education.

## Project Structure

```text
website/
├── src/
│   ├── content/                      # Astro content collections
│   │   ├── games/                    # Game catalogue (by platform/track)
│   │   │   ├── commodore-64/
│   │   │   │   ├── assembly.yaml     # 16 assembly games
│   │   │   │   └── basic.yaml        # 8 BASIC gateway games
│   │   │   ├── sinclair-zx-spectrum/
│   │   │   ├── commodore-amiga/
│   │   │   └── nintendo-entertainment-system/
│   │   ├── units/                    # Unit details (phases, availability)
│   │   │   ├── commodore-64/
│   │   │   │   ├── assembly/
│   │   │   │   │   ├── game-01-starfield.yaml
│   │   │   │   │   └── ...
│   │   │   │   └── basic/
│   │   │   └── ...
│   │   ├── platforms/                # Platform definitions
│   │   ├── vault/                    # Historical articles
│   │   ├── patterns/                 # Pattern library
│   │   └── config.ts                 # Collection schemas
│   ├── pages/                        # File-based routing
│   │   └── [platform]/
│   │       └── [track]/              # assembly, basic, or amos
│   │           └── game-NN-[slug]/
│   │               ├── index.mdx     # Game overview
│   │               └── unit-NN.mdx   # Individual lessons
│   ├── layouts/                      # Page templates
│   ├── components/                   # Reusable components
│   ├── lib/                          # Helper functions
│   │   ├── games.ts                  # Game collection queries
│   │   ├── units.ts                  # Unit collection queries
│   │   └── platforms.ts              # Platform collection queries
│   └── styles/                       # Global styles
├── public/                           # Static assets
│   ├── favicon.svg                   # SVG favicon (modern browsers)
│   ├── favicon.ico                   # ICO favicon (legacy)
│   └── apple-touch-icon.png          # iOS home screen icon
├── scripts/
│   └── generate-units.mjs            # Generate units YAML from MDX
└── package.json
```

## Content Collections

### Games Collection (`src/content/games/`)

Defines game catalogue by platform and track. Does **not** store unit counts — those are computed from the units collection.

```yaml
# commodore-64/assembly.yaml
platform: commodore-64
track: assembly
games:
  - number: 1
    slug: game-01-starfield
    name: Starfield
    tagline: Single-screen space shooter with hardware sprites
    skills: [VIC-II sprites, Joystick input, SID sound, Raster interrupts]
    status: in-progress
```

### Units Collection (`src/content/units/`)

Stores phases and unit details for each game. This is the single source of truth for unit counts and availability.

```yaml
# commodore-64/assembly/game-01-starfield.yaml
platform: commodore-64
track: assembly
gameSlug: game-01-starfield
phases:
  - name: Foundation
    description: Build a complete playable game
    hours: "16-24"
    start: 1
    end: 16
units:
  - number: 1
    title: "Unit 1"
    available: true
  - number: 2
    title: "Unit 2"
    available: true
```

### Helper Functions (`src/lib/`)

```typescript
// Get games with computed unit counts
import { getGamesWithCounts } from '../lib/games';
const games = await getGamesWithCounts('commodore-64', 'assembly');
// Each game has: units (total), unitsAvailable (computed)

// Get unit details
import { getUnitsEntry, getPhases, getUnits } from '../lib/units';
const entry = await getUnitsEntry('commodore-64', 'assembly', 'game-01-starfield');
```

## Commands

All commands are run from the website directory:

| Command           | Action                                      |
| :---------------- | :------------------------------------------ |
| `npm install`     | Installs dependencies                       |
| `npm run dev`     | Starts dev server at `localhost:4321`       |
| `npm run build`   | Build production site to `./dist/`          |
| `npm run preview` | Preview build locally before deploying      |

## Adding Content

### Adding a New Game

1. Add game entry to `src/content/games/[platform]/[track].yaml`
2. Create units file at `src/content/units/[platform]/[track]/game-NN-[slug].yaml`
3. Create game directory at `src/pages/[platform]/[track]/game-NN-[slug]/`
4. Add `index.mdx` for game overview

### Adding Units to an Existing Game

1. Create `unit-NN.mdx` in the game's page directory
2. Update `src/content/units/.../[game].yaml` to set `available: true`
3. Extract code samples to `/code-samples/[platform]/game-NN-[slug]/unit-NN/`

### Generating Units Files

For bulk operations, use the generator script:

```bash
node scripts/generate-units.mjs
```

This extracts unit data from existing MDX frontmatter or creates placeholder files for coming-soon games.

## Live Site

[code198x.stevehill.xyz](https://code198x.stevehill.xyz)
