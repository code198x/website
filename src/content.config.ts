import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

// CPU families a system can be keyed by — shared by the primary and secondary
// architecture fields on the systems collection.
const cpuArchitectures = z.enum([
  // 8-bit families
  '8080',      // Intel 8080/8085
  'f8',        // Fairchild F8
  '1802',      // RCA CDP1802
  'mcs48',     // Intel MCS-48 (8048/8049)
  'cp1610',    // General Instrument CP1610
  'tms9900',   // Texas Instruments TMS9900
  '6502',      // MOS 6502 and variants
  'huc6280',   // Hudson HuC6280 (PC Engine) — extended 65C02, own encoding extensions
  'z80',       // Zilog Z80
  'sm83',      // Sharp SM83/LR35902 (Game Boy) — Z80-flavoured, not Z80-compatible
  '6800',      // Motorola 6800/6801/6803
  '6809',      // Motorola 6809
  // 16-bit families
  '65c816',    // WDC 65C816 (16-bit 6502)
  'x86',       // Intel 8086/8088 and successors
  '68000',     // Motorola 68000
  // 32-bit families
  'arm',       // ARM (Acorn RISC Machine)
  'sh2',       // Hitachi SuperH SH-2
  'v810',      // NEC V810
  'mips',      // MIPS R3000/R4300
  // Later generations
  'sh4',       // Hitachi SuperH SH-4
  'tlcs900',   // Toshiba TLCS-900
]);

// Platform/system definitions - the source of truth for all platform data
const systems = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: 'src/content/systems' }),
  schema: z.object({
    // Identity
    name: z.string(),
    shortName: z.string(),
    year: z.number(),
    color: z.string(),
    tagline: z.string(),

    // Classification
    type: z.enum(['computer', 'console', 'handheld']),
    bits: z.enum(['8', '16', '32', '64', '128']),
    region: z.enum([
      // Core markets
      'US', 'UK', 'Japan', 'Europe', 'Netherlands',
      // Regional scenes — first-class per the cultural-scope axis (see umbrella CLAUDE.md).
      // Add new values as catalogued machines require them; not speculatively.
      'USSR', 'East Germany', 'West Germany', 'Czechoslovakia', 'Romania', 'Bulgaria',
      'Yugoslavia', 'Poland', 'Hungary', 'Spain', 'Italy', 'France', 'Belgium',
      'Brazil', 'Argentina', 'Australia', 'New Zealand', 'Canada',
      'South Korea', 'Hong Kong', 'Taiwan',
    ]),
    manufacturer: z.string(), // references manufacturers collection
    cpu: z.string(),
    // Primary programming identity — the CPU a learner writes for first.
    cpuArchitecture: cpuArchitectures,
    // Additional programmer-facing CPU families beyond the primary: sound CPUs
    // (Mega Drive Z80), CP/M sidecars (C128 Z80), base-console hosts (32X).
    // Not listed: same-family extras (FM-7's second 6809), peripheral
    // controllers (1541, keyboard MCUs), and custom coprocessors outside the
    // enum (SPC700, Tom/Jerry, SCU DSP) until a value is added deliberately.
    secondaryCpuArchitectures: z.array(cpuArchitectures).default([]),

    // Toolchain (optional for coming-soon platforms)
    assembler: z.string().optional(),
    dialect: z.string().optional(),
    assemblerLanguage: z.enum(['6502', 'z80', 'm68k', 'ca65']).optional(),
    emulator: z.string().optional(),
    buildOutput: z.string().optional(),
    toolchainExtras: z.array(z.string()).default([]),

    // Family support surfaces — curated per-machine flags, orthogonal to `tier`
    // (umbrella decision: 198x/decisions/support-surfaces.md). Only write the
    // key when true; absence is the queryable gap (`npm run surfaces:gaps`).
    // Bars: emu198x = an Emu198x core boots and validates this machine;
    // devReady = the end-to-end path (assemble → frame program → master media)
    // produces a runnable artefact, whatever toolchain implements it.
    emu198x: z.boolean().default(false),
    devReady: z.boolean().default(false),

    // Navigation
    navOrder: z.number(),
    // SINGLE SOURCE OF TRUTH for readiness. Everything derives from `tier`:
    // the fleet wall, the homepage band, active-vs-coming-soon, and landing-page
    // routing. Set it here and nowhere else. live = shipping; next = validated,
    // in build; planned = skeleton + subscribe; edge = strains the method
    // (vector/3D-first/add-ons); beyond = outside the curriculum's domain.
    // "active" (has a real landing page) means tier is live or next — see
    // isActivePlatform() in lib/platforms.ts.
    tier: z.enum(['live', 'next', 'planned', 'edge', 'beyond']),
  }),
});

// One later entity in a succession — used by `name_reused_by` and
// `continued_as`. Either `ref` (a Vault entry) or `name` (a successor with no
// entry) must be present; `from`/`to` bound the period it held the name.
const successionRef = z.object({
  ref: z.string().optional(),
  name: z.string().optional(),
  from: z.number().optional(),
  to: z.number().optional(),
  note: z.string().optional(),
}).refine(s => s.ref || s.name, {
  message: 'a succession entry needs either `ref` (a Vault entry) or `name`',
});

const vault = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: 'src/content/vault' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    summary: z.string(),

    // Provenance, surfaced to readers at the foot of every entry.
    // These were inert frontmatter until 2026-08-25 — absent from this schema,
    // read by nothing, and therefore stripped at parse time. An entry could
    // claim anything, or nothing, and no check would notice.
    // ai_generated: was the prose machine-written?
    // reviewed:     has a person checked the claims and signed them off?
    // They are independent: most entries are true/false, and an entry can be
    // machine-written and then checked (true/true) or hand-written (false/*).
    ai_generated: z.boolean(),
    reviewed: z.boolean(),

    category: z.enum([
      'people',
      'companies',
      'groups',        // Scene collectives, informal organisations (Fairlight, Future Crew)
      'games',
      'demos',         // Demo scene productions (Second Reality, State of the Art)
      'techniques',
      'hardware',
      'systems',
      'culture',
      'events',        // Demo parties, LAN events, conferences (Assembly, QuakeCon)
      'magazines',     // Gaming press (CRASH, ZZAP!64, Your Sinclair)
      'books',         // Books about gaming/programming
      'phenomena',     // Cultural phenomena (video game crash, bedroom coding)
      'tools',         // Development tools, trackers, archives (ProTracker, HVSC)
      'genres',        // Game genres (JRPG, roguelike, immersive sim)
      'emulators',     // Emulation software (VICE, MAME)
      'distribution',  // Software distribution methods (shareware, budget games, cover tapes)
      'communities'    // Subcultures and communities (demo scene, modding, speedrunning)
    ]),
    // Platforms can be any string - vault covers more systems than the curriculum
    platforms: z.array(z.string()).optional(),
    tags: z.array(z.string()).default([]),

    // Category-specific date fields (all optional, use null for unknown/ongoing)
    // People: birth and death years
    born: z.number().nullable().optional(),
    died: z.number().nullable().optional(),
    // Companies, groups, magazines: when it started
    founded: z.number().nullable().optional(),
    // Magazines: who published it, and when. A field rather than a line of prose,
    // because the publisher is what groups a masthead into a stable — Argus,
    // Newsfield, Future, EMAP, Ziff Davis — and a stable explains house style,
    // staff moving between titles, and why two magazines die in the same month.
    // Prose cannot be queried, and cannot be audited: 51 of 60 magazine entries
    // mentioned a publisher somewhere and 9 named none, with no way to tell which
    // without reading all sixty.
    //
    // An ARRAY, because for a long-running title the answer changes. Computer
    // Gaming World began at Golden Empire and ended at Ziff Davis; any single
    // string is wrong about one end of its life.
    //
    // `name` is the entity in the statement of publication — the thing the
    // magazine itself says publishes it. `group` is the parent or owner where the
    // magazine names one, which is a different fact and often the more revealing:
    // Compute!'s Gazette is published by COMPUTE! Publications, which is part of
    // ABC. (Note this is publisher-and-owner, not imprint: an imprint is a brand a
    // publisher issues *under*, which is a software-publishing distinction —
    // Rainbird under Telecomsoft — and does not apply cleanly to mastheads.)
    //
    // `from`/`to` are the years the arrangement is ATTESTED, not necessarily the
    // years it held. Where the corpus shows a publisher in 1981 and 1992 but does
    // not fix the handover, say so in `note` rather than inventing a date.
    publishers: z
      .array(
        z.object({
          name: z.string(),
          group: z.string().optional(),
          from: z.number().nullable().optional(),
          to: z.number().nullable().optional(),
          note: z.string().optional(),
        })
      )
      .optional(),
    // Evidence for individual facts, keyed by the frontmatter field it supports:
    //
    //   sources:
    //     founded:
    //       - ref: magazines/crash-magazine
    //         kind: magazine
    //         date: "1985-05"
    //         issue: 16
    //
    // `ref` points at the Vault entry for the publication, which makes the
    // evidence chain a relationship rather than a string — a fact links to the
    // magazine that carries it, and "which claims rest on one publication?"
    // becomes answerable. `title` covers sources with no entry of their own.
    //
    // A list, not a single value, because independent corroboration is the
    // thing worth counting: PRINCIPLES.md, "ten websites quoting one incorrect
    // source remain one incorrect source".
    //
    // `kind` follows the evidence hierarchy in PRINCIPLES.md, strongest first,
    // so relative confidence can be computed rather than argued.
    //
    // Absent means not established — never "verified". Populate as entries are
    // grounded; this is deliberately not a migration.
    sources: z.record(
      z.string(),
      z.array(z.object({
        ref: z.string().optional(),     // vault path, e.g. "magazines/crash-magazine"
        title: z.string().optional(),   // free text where no entry exists
        kind: z.enum([
          'hardware', 'software', 'source-code', 'manual', 'technical-doc',
          // A statutory register — Companies House and equivalents. Not a
          // `database`: this is the record made at the time of the event, by
          // the entity itself, rather than a later compilation about it. For an
          // incorporation or dissolution date it outranks a magazine reporting
          // the same thing, which is why it needs its own slot near the top.
          'public-record',
          'book', 'magazine', 'advertisement', 'interview', 'recollection',
          'modern-book', 'modern-article', 'database',
        ]).optional(),
        date: z.string().optional(),    // "1985-05" — a string, because partial
                                        // dates are not dates and YAML will
                                        // happily mangle them into one.
        issue: z.union([z.number(), z.string()]).optional(),
        page: z.string().optional(),
        note: z.string().optional(),
      }).refine(s => s.ref || s.title, {
        message: 'a source needs either `ref` (a Vault entry) or `title`',
      })),
    ).optional(),

    // What became of the name, and what became of the people. Two fields
    // because they are opposites, and one `successor` would collapse them:
    //
    //   name_reused_by  — the NAME went on without this entity. Ocean bought
    //                     the Imagine label in 1984 and published under it for
    //                     years; the Liverpool company was already gone.
    //   continued_as    — THIS ENTITY went on under another name. Zeppelin
    //                     became Eutechnyx and kept the same people.
    //
    // Conflating them is how "Commodore lasted until 2004" gets written.
    //
    // Dated, because names change hands repeatedly — Commodore's went to Escom,
    // then Tulip — and an undated list cannot say which era a reader is looking
    // at.
    //
    // `ref` points at a Vault entry; `name` covers successors that have none and
    // may never need one. Escom probably earns an entry. Eutechnyx may not.
    // Requiring an entry for every successor would either break the link check
    // or force stubs for companies outside this Vault's period.
    // Companies House registration, for entries that ARE a registered company.
    // Not for labels and imprints: Firebird and Rainbird were inside Telecomsoft
    // and giving them a number would attach a real identifier to the wrong
    // entity. The number is the point — names are reused constantly, and a
    // search for "Acorn Computers" returns four distinct companies.
    //
    // ⚠ A matching name and a matching year are not identification. Company
    // 01472275 is "CRL Group Ltd", incorporated 1980-01-11 — matching this
    // Vault's CRL on both, and it was CLWYD REFRIGERATION LIMITED until 2016:
    // a Conwy refrigeration business that took the name thirty-six years after
    // Clement Chambers founded the games publisher. Check
    // `previous_company_names` and the registered office against what the entry
    // says before believing any match. Both are one request away.
    //
    // ⚠ Coverage stops well short of the 1980s, and the boundary is measured
    // rather than assumed: across a 126-company sample of dissolved records the
    // earliest cessation date returned was 2010-04-27, with nothing before it.
    // A rolling retention window, not an indexing gap.
    //
    // So the era's casualties are simply absent. "Bug-Byte" returns exactly one
    // company in the whole register and "Quicksilva" one, both incorporated
    // after 1996; Ultimate, Denton Designs and Gargoyle Games return no
    // plausible pre-1996 candidate at all. The public web search hits the same
    // register, so searching by hand finds no more than this does.
    //
    // What survives is companies that lasted. For everything that died in the
    // eighties the period press remains the only witness — which is what the
    // reference library is for.
    company_number: z.string().optional(),

    name_reused_by: z.array(successionRef).optional(),
    continued_as: z.array(successionRef).optional(),

    // Games: release year
    released: z.number().nullable().optional(),
    // Techniques: when originated and deprecated (if applicable)
    originated: z.number().nullable().optional(),
    deprecated: z.number().nullable().optional(),
    // Culture, phenomena, events, communities: when it started
    emerged: z.number().nullable().optional(),
    // These dates bound THE ENTITY THIS ENTRY IS ABOUT, not the name it traded
    // under. Names outlive companies and get picked up by unrelated buyers:
    // Commodore was liquidated in 1994 and the name sold on afterwards;
    // `imagine-software` ended in 1984 and Ocean bought the label and kept
    // publishing under it. In both cases `ended` is the year the entity stopped,
    // and what happened to the name afterwards is a separate fact about a
    // separate entity. Setting `ended: 2004` for Commodore because something
    // called Commodore existed then would merge two companies into one.
    //
    // The reverse case — same people, new name, as Zeppelin became Eutechnyx —
    // is also an ending for this entity, with `ended_as: renamed`.
    //
    // The universal end date, whatever the category. Replaced `dissolved` in
    // 2026-08: of the 92 company entries carrying a dissolution year, 39% record
    // an acquisition, 9% an absorption or rename, and 18% nothing the body
    // supports. `dissolved` named one ending and was applied to four, and it
    // rendered as "Active: 1984–1988" — asserting a company stopped when it had
    // often been bought and carried on.
    ended: z.number().nullable().optional(),
    // How it ended, where the sources establish it. Optional on purpose: a date
    // without a mechanism is the common case and the honest one.
    ended_as: z.enum([
      'acquired',    // bought; the entity continued under new ownership
      'absorbed',    // folded into the parent, identity gone
      'renamed',     // continuous operation under a new name
      'dissolved',   // wound up deliberately
      'liquidated',  // wound up by insolvency — receivership, administration
      'ceased',      // stopped trading, mechanism unrecorded
    ]).optional(),
    // Hardware/Systems: introduction and discontinuation
    introduced: z.number().nullable().optional(),
    discontinued: z.number().nullable().optional(),
  }),
});

const patterns = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: 'src/content/patterns' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    platform: z.enum([
      'commodore-64',
      'sinclair-zx-spectrum',
      'commodore-amiga',
      'nintendo-nes',
      'cross-platform'
    ]),
    category: z.enum([
      'rendering',
      'input',
      'audio',
      'physics',
      'ai',
      'framework'
    ]),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    taught_in: z.string().optional(),
    tags: z.array(z.string()).default([]),
    evolution: z.object({
      previous: z.string().nullable(),
      next: z.string().nullable(),
    }).optional(),
    related: z.object({
      patterns: z.array(z.string()).default([]),
      vault: z.array(z.string()).default([]),
    }).optional(),
  }),
});

const timeline = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: 'src/content/timeline' }),
  schema: z.object({
    title: z.string(),
    year: z.number(),
    month: z.number().optional(),
    day: z.number().optional(),
    category: z.enum(['politics', 'culture', 'technology', 'economics', 'science']),
    summary: z.string(),
  }),
});

// Pattern library categories (rendering, input, audio, etc.)
const patternCategories = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: 'src/content/pattern-categories' }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    icon: z.string(), // Lucide icon name
    order: z.number(),
  }),
});

// Pattern library difficulty levels
const patternDifficulties = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: 'src/content/pattern-difficulties' }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    icon: z.string(), // Lucide icon name
    color: z.string(), // CSS color or variable
    order: z.number(),
  }),
});

// Manufacturers - companies that made the platforms
const manufacturers = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: 'src/content/manufacturers' }),
  schema: z.object({
    name: z.string(),
    shortName: z.string(),
    country: z.string(),
    city: z.string(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    founded: z.number(),
    defunct: z.number().optional(),
    color: z.string().optional(),
  }),
});

// CPU architectures - groupings for the systems page
const architectures = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: 'src/content/architectures' }),
  schema: z.object({
    name: z.string(),
    shortName: z.string(),
    description: z.string(),
    era: z.enum(['early', 'classic-8bit', '16bit', '32bit', 'later']),
    bits: z.enum(['8', '16', '32', '64', '128']),
    order: z.number(),
  }),
});

// Vault categories (systems, hardware, people, etc.)
const vaultCategories = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: 'src/content/vault-categories' }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    icon: z.string(), // Lucide icon name or emoji
    color: z.string(), // CSS color for category accent
    order: z.number(),
  }),
});

// A dependency edge. A bare string is a structural reference with no thread —
// used by the seam edges between sections and tracks. The object form carries
// the thread it belongs to and why it is needed, and is what a game-to-game
// edge uses. See docs/decisions/curriculum-routes.md
const routeRef = z.union([
  z.string(),
  z.object({
    module: z.string(),
    thread: z.string().optional(),
    why: z.string().optional(),
  }),
]);

// Curriculum catalogue: either a platform track (platform + track) or a
// cross-platform section (section). Never both — a section has no language
// track, and its content sits one level shallower on disk.
const modules = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: 'src/content/modules' }),
  schema: z.object({
    platform: z.string().optional(),
    track: z.enum(['assembly', 'basic', 'amos', 'blitz', 'machine']).optional(),
    section: z.enum(['foundations', 'craft']).optional(),
    modules: z.array(z.object({
      number: z.number(),
      slug: z.string(),
      name: z.string(),
      kind: z.enum(['game', 'teaching', 'interval']).default('game'),
      game: z.string().optional(),
      pass: z.number().optional(),
      tagline: z.string(),
      skills: z.array(z.string()),
      status: z.enum(['in-progress', 'coming-soon', 'complete']),
      thumbnail: z.string().optional(),
      phase: z.string().optional(),
      requires: z.array(routeRef).default([]),
      suggests: z.array(routeRef).default([]),
    })),
  }).refine(
    (d) => (d.section != null) !== (d.platform != null && d.track != null),
    { message: 'A catalogue needs either section, or both platform and track — never both and never neither.' },
  ),
});

// Unit details for each game - phases and individual unit information
const units = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: 'src/content/units' }),
  schema: z.object({
    platform: z.string(),
    track: z.enum(['assembly', 'basic', 'amos', 'blitz', 'machine']),
    moduleSlug: z.string(),
    phases: z.array(z.object({
      name: z.string(),
      description: z.string(),
      hours: z.string(), // e.g., "16-24"
      start: z.number(),
      end: z.number(),
    })),
    units: z.array(z.object({
      number: z.number(),
      title: z.string(),
      available: z.boolean().default(false),
      description: z.string().optional(),
      thumbnail: z.string().optional(),
    })),
  }),
});

// MDX page collections — migrated from src/pages/ file-based routing
// Computed fields (layout, prevLesson, nextLesson, totalUnits, system, gameName)
// are derived at render time from the entry's ID path in [...slug].astro

const unitPages = defineCollection({
  loader: glob({ pattern: '**/unit-*.mdx', base: 'src/content/curriculum' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date().optional(),
    game: z.number(),
    unit: z.number(),
    tags: z.array(z.string()).default([]),
    status: z.string().optional(),
    heroImage: z.string().optional(),
    learningTime: z.number().optional(),
  }),
});

const modulePages = defineCollection({
  loader: glob({ pattern: '**/index.mdx', base: 'src/content/curriculum' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    status: z.enum(['in-progress', 'coming-soon', 'complete']).optional(),
    game: z.number().optional(),
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
    units: z.array(z.object({
      number: z.number(),
      title: z.string(),
      available: z.boolean().default(false),
    })).default([]),
  }),
});

const gettingStartedPages = defineCollection({
  loader: glob({ pattern: '**/getting-started.mdx', base: 'src/content/curriculum' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    systemSlug: z.string().optional(),
    accentColor: z.string().optional(),
  }),
});

// From the Metal — short essays that reframe modern programming advice by
// dropping down to a vintage CPU where the cost is visible. One MDX per article;
// the per-article `accent` is a topic-coded hue (deliberately beyond the four
// brand colours). See docs/tracker/from-the-metal/build-plan.md.
const fromTheMetal = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: 'src/content/from-the-metal' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),       // meta description
    lede: z.string(),              // on-page opening paragraph
    kicker: z.string(),            // mono eyebrow, e.g. "PERFORMANCE · WHAT'S UNDERNEATH"
    pubDate: z.coerce.date(),
    cpu: z.string(),               // "6502" | "Z80" | "68000" | "6502 vs 68000"
    category: z.string(),          // PERFORMANCE, ARITHMETIC, …
    accent: z.string(),            // topic-coded hex
    order: z.number(),             // hub sort order
    audiences: z.array(z.string()).default([]),
    teaser: z.string(),            // hub card body
  }),
});

// Field Notes — first-person narrative dev-diary: the bugs, wrong turns, and
// lessons from building the curriculum + emulator. Site-canonical (the Substack
// mirrors and links back). Per-post accent is platform-tied.
const fieldNotes = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: 'src/content/field-notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),       // meta description
    dek: z.string(),               // italic standfirst under the title
    kicker: z.string(),            // mono eyebrow, e.g. "FIELD NOTES · AMIGA"
    pubDate: z.coerce.date(),
    accent: z.string(),            // per-post hex (platform-tied)
    order: z.number(),             // arc sort order
    teaser: z.string(),            // hub card body
    draft: z.boolean().default(false), // hidden everywhere until finished — never auto-publishes
  }),
});

// What's New — the project changelog. Each entry is a short page of its own: a
// screenshot, a paragraph or two, and a link to the thing that shipped. Kept
// deliberately light — the long story of building it belongs in Field Notes,
// which an update can link to. The `summary` feeds the homepage/hub cards and
// the RSS teaser; the MDX body is the post.
const updates = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: 'src/content/updates' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    summary: z.string(),               // card + RSS teaser (one or two sentences)
    accent: z.string().optional(),     // platform-tied hex; falls back to house
    href: z.string().optional(),       // the "see it" target — the game/thing
    linkText: z.string().default('See it'),
    heroImage: z.string().optional(),  // /images/… screenshot shown at the top
    heroAlt: z.string().optional(),
    // Structured tags for filtering when the changelog grows. No UI yet — this
    // is just the metadata, recorded per entry now so it never has to be
    // back-filled across dozens of old posts. `platform` holds the canonical
    // system slug(s) an update is about; a cross-cutting milestone leaves it
    // empty. `type` is the kind of update.
    platform: z.array(z.string()).default([]),
    type: z.enum(['game', 'fix', 'tooling', 'milestone']).optional(),
    draft: z.boolean().default(false), // never auto-publishes
  }),
});

export const collections = {
  systems,
  updates,
  manufacturers,
  architectures,
  vault,
  patterns,
  timeline,
  'from-the-metal': fromTheMetal,
  'field-notes': fieldNotes,
  modules,
  units,
  'pattern-categories': patternCategories,
  'pattern-difficulties': patternDifficulties,
  'vault-categories': vaultCategories,
  'unit-pages': unitPages,
  'module-pages': modulePages,
  'getting-started-pages': gettingStartedPages,
};
