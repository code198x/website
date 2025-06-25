# Proposed Enhanced Software Schema

```typescript
const software = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    alternative_names: z.array(z.string()).optional(), // Regional variations, working titles
    type: z.enum(['game', 'application', 'utility', 'operating_system', 'programming_language', 'demo', 'educational']),
    
    // Original version information
    original_platform: z.string(), // The platform it was first created for
    original_developer: z.array(z.object({
      name: z.string(),
      role: z.string().optional(), // "Programming", "Graphics", "Music", "Design"
    })),
    original_publisher: z.string().optional(),
    original_release_date: z.date(),
    development_time: z.string().optional(), // "6 months", "2 years"
    development_budget: z.string().optional(), // When known
    
    // Platform-specific releases
    platform_releases: z.array(z.object({
      system: z.string(), // e.g., "commodore-64", "zx-spectrum"
      developer: z.array(z.object({
        name: z.string(),
        role: z.string().optional(),
      })),
      publisher: z.string().optional(),
      distributor: z.string().optional(), // Often different from publisher
      release_date: z.date(),
      regions: z.array(z.string()).optional(), // ["UK", "US", "Europe", "Japan"]
      version: z.string().optional(), // "1.0", "Enhanced Edition", etc.
      
      // Technical details
      memory_requirements: z.string().optional(), // "48K", "128K", "512K"
      storage_format: z.array(z.string()).optional(), // ["Cassette", "Disk", "Cartridge"]
      copy_protection: z.string().optional(), // Type of copy protection used
      loading_time: z.string().optional(), // "5 minutes", "30 seconds"
      
      // Quality and differences
      technical_notes: z.string().optional(),
      significant_changes: z.array(z.string()).optional(),
      port_quality: z.enum(['excellent', 'good', 'average', 'poor', 'broken']).optional(),
      port_notes: z.string().optional(), // Why it's good/poor
      
      // Pricing
      original_price: z.object({
        amount: z.string(),
        currency: z.string(), // "GBP", "USD", "DEM"
      }).optional(),
    })),
    
    // Classification
    genre: z.string().optional(), // For games
    subgenre: z.array(z.string()).optional(), // ["Turn-based", "Real-time", "Puzzle"]
    category: z.string().optional(), // For applications
    target_audience: z.array(z.string()).optional(), // ["Children", "Adults", "Professionals", "Hobbyists"]
    
    // Content
    description: z.string(),
    significance: z.string(),
    gameplay_description: z.string().optional(), // For games
    features: z.array(z.string()).optional(), // Key features/selling points
    
    // Technical and cultural impact
    technical_innovations: z.array(z.string()).optional(),
    programming_techniques: z.array(z.string()).optional(), // "Sprite multiplexing", "Raster interrupts"
    hardware_pushed: z.array(z.string()).optional(), // What hardware limits it pushed
    cultural_impact: z.string().optional(),
    influence_on_industry: z.string().optional(),
    
    // Commercial performance
    sales_figures: z.object({
      total: z.string().optional(),
      by_platform: z.array(z.object({
        system: z.string(),
        sales: z.string(),
        timeframe: z.string().optional(), // "First year", "Lifetime"
      })).optional(),
      commercial_success: z.enum(['major_hit', 'moderate_success', 'commercial_failure', 'cult_classic']).optional(),
    }).optional(),
    
    // Reception and recognition
    awards: z.array(z.object({
      name: z.string(),
      year: z.number().optional(),
      category: z.string().optional(),
    })).optional(),
    
    contemporary_reviews: z.array(z.object({
      publication: z.string(),
      score: z.string().optional(), // "8/10", "90%", "5 stars"
      system: z.string().optional(),
      year: z.number().optional(),
      quote: z.string().optional(), // Notable review quotes
    })).optional(),
    
    modern_reception: z.object({
      retrospective_rating: z.string().optional(),
      historical_significance: z.string().optional(),
      modern_playability: z.enum(['excellent', 'good', 'dated', 'unplayable']).optional(),
    }).optional(),
    
    // Development context
    development_story: z.string().optional(), // Interesting development anecdotes
    development_challenges: z.array(z.string()).optional(),
    cancelled_features: z.array(z.string()).optional(),
    development_tools: z.array(z.string()).optional(), // What tools were used
    
    // Legacy and preservation
    source_code_availability: z.enum(['available', 'partially_available', 'lost', 'proprietary']).optional(),
    preservation_status: z.enum(['well_preserved', 'partially_preserved', 'rare', 'lost']).optional(),
    modern_availability: z.array(z.object({
      platform: z.string(), // "Steam", "GOG", "Emulation"
      notes: z.string().optional(),
    })).optional(),
    
    // Media and documentation
    screenshots: z.array(z.object({
      url: z.string(),
      system: z.string(),
      caption: z.string().optional(),
      type: z.enum(['gameplay', 'title_screen', 'loading_screen', 'manual_page']).optional(),
    })).optional(),
    
    videos: z.array(z.object({
      url: z.string(),
      title: z.string(),
      type: z.enum(['gameplay', 'documentary', 'interview', 'commercial']).optional(),
    })).optional(),
    
    manuals: z.array(z.object({
      url: z.string(),
      system: z.string(),
      language: z.string().optional(),
      type: z.enum(['user_manual', 'reference_card', 'hint_book']).optional(),
    })).optional(),
    
    // Relationships
    part_of_series: z.string().optional(), // Series name
    sequels: z.array(z.string()).optional(),
    prequels: z.array(z.string()).optional(),
    related_software: z.array(z.string()).optional(),
    inspired_by: z.array(z.string()).optional(),
    influenced: z.array(z.string()).optional(),
    
    // Educational relevance
    educational_value: z.object({
      programming_concepts: z.array(z.string()).optional(),
      historical_significance: z.string().optional(),
      technical_learning: z.array(z.string()).optional(),
    }).optional(),
    
    // External resources
    external_links: z.array(z.object({
      title: z.string(),
      url: z.string(),
      type: z.enum(['official', 'wiki', 'review', 'technical', 'preservation', 'community']).optional(),
    })).optional(),
    
    // Metadata
    order: z.number(),
  }),
});
```

## Benefits of Enhanced Schema

### 1. **Multi-Platform Support**
- Track different release dates per platform
- Record platform-specific developers and publishers
- Note technical differences between versions
- Rate port quality (excellent/good/poor/broken)

### 2. **Multiple Contributors**
- Arrays for developers and publishers
- Distinguish original creators from port developers
- Credit all contributors appropriately

### 3. **Version Tracking**
- Handle different versions and editions
- Track significant changes between releases
- Note enhanced or cut-down versions

### 4. **Enhanced Metadata**
- Platform-specific technical notes
- Sales figures by platform
- Screenshots from different systems
- Reviews for specific versions

### 5. **Better Relationships**
- Link to sequels and related software
- Connect ports and versions
- Show evolution of software across platforms

## Example: Elite Entry

```yaml
---
name: "Elite"
type: "game"
original_platform: "bbc-micro"
original_developer: ["David Braben", "Ian Bell"]
original_publisher: "Acornsoft"
original_release_date: 1984-09-20

platform_releases:
  - system: "bbc-micro"
    developer: ["David Braben", "Ian Bell"]
    publisher: "Acornsoft"
    release_date: 1984-09-20
    version: "Original"
    port_quality: "excellent"
    
  - system: "commodore-64"
    developer: ["David Braben", "Ian Bell"]
    publisher: "Firebird"
    release_date: 1985-01-01
    version: "C64 Port"
    technical_notes: "Adapted for C64's different graphics and sound capabilities"
    port_quality: "excellent"
    
  - system: "zx-spectrum"
    developer: ["David Braben", "Ian Bell"] 
    publisher: "Firebird"
    release_date: 1985-06-01
    version: "Spectrum Port"
    technical_notes: "Colour attribute limitations required graphics redesign"
    significant_changes: ["Simplified ship designs due to colour clash", "Different control scheme"]
    port_quality: "good"

genre: "Space Trading/Combat Simulation"
description: "Revolutionary 3D space trading game featuring unprecedented scope and freedom"
significance: "Demonstrated that home computers could host complex, open-ended gameplay experiences"

technical_innovations:
  - "Real-time 3D wireframe graphics on 8-bit hardware"
  - "Procedurally generated galaxy with 8 galaxies of 256 systems each"
  - "Complex economic simulation"
  - "Non-linear gameplay with multiple paths to success"

sales_figures:
  total: "Over 600,000 copies across all platforms"
  by_platform:
    - system: "bbc-micro"
      sales: "150,000"
    - system: "commodore-64" 
      sales: "200,000"
    - system: "zx-spectrum"
      sales: "180,000"
---
```

## Migration Strategy

1. **Gradual Implementation**: Start with new entries using enhanced schema
2. **Backwards Compatibility**: Ensure existing entries continue to work
3. **Progressive Enhancement**: Update existing entries when content is reviewed
4. **Validation Tools**: Create tools to validate the more complex schema

This enhanced schema would much better represent the reality of 1980s software development and publishing, where ports, multiple contributors, and platform-specific variations were the norm rather than the exception.