# Image Components for Code198x

This document explains how to use the image components designed for the retro computing aesthetic of Code198x.

## Components Overview

### 1. ScreenshotBox
For displaying program output, code examples, and technical screenshots with CRT-style effects.

```astro
import ScreenshotBox from '../../../../../components/ScreenshotBox.astro';

<ScreenshotBox
  src="/images/c64-hello-world.png"
  alt="Hello World program running on Commodore 64"
  caption="Your first BASIC program in action"
  system="commodore-64"
  type="program-output"
/>
```

**Props:**
- `src` (required): Image source path
- `alt` (required): Alt text for accessibility
- `caption` (optional): Caption text below image
- `system` (optional): "commodore-64" | "sinclair-zx-spectrum" | "nintendo-entertainment-system" | "amiga"
- `type` (optional): "program-output" | "code-editor" | "hardware" | "magazine"

### 2. ImageComparison
For showing before/after comparisons of code examples or program output.

```astro
import ImageComparison from '../../../../../components/ImageComparison.astro';

<ImageComparison
  beforeSrc="/images/before-optimization.png"
  afterSrc="/images/after-optimization.png"
  beforeAlt="Program before optimization"
  afterAlt="Program after optimization"
  beforeLabel="Original Code"
  afterLabel="Optimized Code"
  caption="See how the optimization improves performance"
  system="commodore-64"
/>
```

**Props:**
- `beforeSrc` (required): Before image source
- `afterSrc` (required): After image source
- `beforeAlt` (required): Before image alt text
- `afterAlt` (required): After image alt text
- `beforeLabel` (optional): Label for before image (default: "Before")
- `afterLabel` (optional): Label for after image (default: "After")
- `caption` (optional): Caption for the entire comparison
- `system` (optional): System for color theming

### 3. VintagePhoto
For historical photos, hardware images, and vintage computing content.

```astro
import VintagePhoto from '../../../../../components/VintagePhoto.astro';

<VintagePhoto
  src="/images/commodore-64-setup.jpg"
  alt="Commodore 64 computer setup from 1982"
  caption="A typical home computer setup in the early 1980s"
  year="1982"
  photographer="Computer History Museum"
  style="polaroid"
  system="commodore-64"
/>
```

**Props:**
- `src` (required): Image source path
- `alt` (required): Alt text
- `caption` (optional): Photo caption
- `year` (optional): Year the photo was taken
- `photographer` (optional): Photo credit
- `style` (optional): "polaroid" | "magazine" | "technical" | "casual"
- `system` (optional): System for color theming

## Image Organization

### Recommended Directory Structure
```
/public/images/
├── c64/
│   ├── screenshots/
│   │   ├── hello-world.png
│   │   ├── basic-editor.png
│   │   └── program-output/
│   ├── hardware/
│   │   ├── commodore-64-front.jpg
│   │   ├── datasette.jpg
│   │   └── disk-drive.jpg
│   └── vintage/
│       ├── magazine-covers/
│       ├── advertisements/
│       └── historical/
├── zx-spectrum/
├── nes/
└── amiga/
```

## Best Practices

### Image Optimization
- Use WebP format when possible for better compression
- Optimize images for web (typically 800-1200px wide max)
- Include 2x versions for high-DPI displays
- Use lazy loading (automatically included in components)

### Accessibility
- Always provide meaningful alt text
- Include captions for context when helpful
- Ensure good contrast for any text overlays

### Retro Aesthetics
- Screenshot images should use authentic system colors
- Avoid modern UI elements in vintage contexts
- Consider the era-appropriate quality (some pixelation is good!)
- Use appropriate system theming via the `system` prop

### Content Guidelines
- **Screenshots**: Capture actual program output from emulators when possible
- **Hardware**: Show computers in context with period-appropriate setups
- **Historical**: Use images that enhance the educational narrative
- **Comparisons**: Make sure before/after differences are clearly visible

## Usage Examples in Lessons

### Basic Program Screenshot
```astro
<ScreenshotBox
  src="/images/c64/screenshots/print-statement.png"
  alt="PRINT statement output on Commodore 64"
  caption="The classic 'Hello, World!' message appears on screen"
  system="commodore-64"
  type="program-output"
/>
```

### Hardware Reference
```astro
<VintagePhoto
  src="/images/c64/hardware/commodore-64-keyboard.jpg"
  alt="Commodore 64 keyboard layout"
  caption="The distinctive brown and cream keyboard that defined a generation"
  year="1982"
  style="technical"
  system="commodore-64"
/>
```

### Code Comparison
```astro
<ImageComparison
  beforeSrc="/images/c64/screenshots/slow-version.png"
  afterSrc="/images/c64/screenshots/fast-version.png"
  beforeAlt="Slow scrolling text"
  afterAlt="Fast scrolling text with optimization"
  beforeLabel="Unoptimized"
  afterLabel="Optimized"
  caption="See the dramatic difference optimization makes"
  system="commodore-64"
/>
```

## System Color Themes

Each system has its own color theme that affects borders and accents:

- **Commodore 64**: Purple/Blue (#6c5ce7)
- **ZX Spectrum**: Red/Orange (#e17055)
- **NES**: Pink/Magenta (#e84393)
- **Amiga**: Orange/Yellow (#fdcb6e)

Choose the appropriate system to match your lesson content!