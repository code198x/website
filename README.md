# Code198x: Retro Computing Education Platform

An educational platform for learning assembly programming and retro computing through hands-on game development projects.

## Features

- **Multi-System Support**: Commodore 64, Amiga, Nintendo Entertainment System, ZX Spectrum
- **Phase-Based Learning**: Structured curriculum with progressive difficulty
- **Game-First Approach**: Learn assembly through creating complete games
- **Interactive Emulation**: Built-in emulators for authentic experience
- **Comprehensive Content**: Lessons, historical context, and technical specifications

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   ├── content/           # Educational content (lessons, systems, etc.)
│   ├── components/        # Astro/React components
│   └── pages/            # Route pages
├── .vale.ini             # Prose linting configuration
└── package.json
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run lint:prose`      | Check all content for style and consistency      |
| `npm run prose:check`     | Check content with warnings and errors only      |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |

## Content Quality Assurance

This project uses **Vale** to maintain consistent language, technical accuracy, and educational tone across all content. See [docs/VALE_SETUP.md](docs/VALE_SETUP.md) for detailed information.

### Quick Start with Vale

```bash
# Install Vale (macOS)
brew install vale

# Download required style packages
vale sync

# Check your content
npm run lint:prose
```

## Content Guidelines

- **Technical Accuracy**: Use correct specifications and terminology
- **Educational Tone**: Encouraging and accessible language
- **Consistency**: Standardized terms across all systems and lessons
- **Clarity**: Clear explanations suitable for beginners

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
