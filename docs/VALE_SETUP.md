# Vale Setup for Code198x

Vale is configured to help maintain consistent language, style, and technical accuracy across all educational content in the Code198x platform.

## Installation

### Option 1: Using Homebrew (macOS)
```bash
brew install vale
```

### Option 2: Using Package Managers
```bash
# Ubuntu/Debian
curl -sfL https://install.goreleaser.com/github.com/ValeLint/vale.sh | sh -s -- -b /usr/local/bin

# Windows (using Chocolatey)
choco install vale

# Using Go
go install github.com/errata-ai/vale/v2/cmd/vale@latest
```

### Option 3: Download Binary
Download the appropriate binary from [Vale releases](https://github.com/errata-ai/vale/releases) and add it to your PATH.

## Initial Setup

After installing Vale, sync the required style packages:

```bash
# Download the required style packages (Microsoft, write-good)
vale sync
```

This downloads the Microsoft Writing Style Guide and write-good rules that our configuration uses.

## Usage

### Basic Linting
```bash
# Lint all content with default settings
npm run lint:prose

# Check only warnings and errors
npm run prose:check

# See all suggestions
npm run prose:suggestions
```

### Advanced Usage
```bash
# Lint specific files
vale src/content/systems/commodore-64.md

# Lint with different output formats
vale --output=line src/content/lessons/
vale --output=JSON src/content/ > vale-results.json

# Lint with specific alert levels
vale --minAlertLevel=warning src/content/
vale --minAlertLevel=error src/content/
```

## What Vale Checks

### 1. Technical Accuracy
- Correct hardware specifications (64 KB not 64k)
- Proper memory addresses ($0400 not $400)
- Consistent assembly syntax (LDA # not LDA#)
- Accurate system names (VIC-II not VIC2)

### 2. Terminology Consistency
- System names (Commodore 64, C64, ZX Spectrum)
- Technical terms (6502, VIC-II, SID)
- Educational language (phase vs course, tier vs module)
- File formats (PRG, D64, SID)

### 3. Educational Tone
- Encouraging language over discouraging terms
- Inclusive and accessible explanations
- Consistent instructional voice
- Appropriate technical complexity

### 4. Writing Quality
- Spelling and grammar
- Readability and clarity
- Consistent formatting
- Proper punctuation and style

## Customizing for Your Content

### Adding New Technical Terms
Edit `.vale/styles/Code198x/accept.txt` to add project-specific vocabulary:

```
# Add new terms here
MyNewTerm
AnotherTechnicalTerm
```

### Adjusting Rules
Modify `.vale.ini` to change rule severity or disable specific checks:

```ini
# Change from error to suggestion
Microsoft.Contractions = suggestion

# Disable a rule entirely
Microsoft.We = NO
```

### Creating Custom Rules
Add new YAML files in `.vale/styles/Code198x/` for project-specific rules.

## Integration with CI/CD

### GitHub Actions Example
Create `.github/workflows/vale.yml`:

```yaml
name: Vale Linting
on: [push, pull_request]
jobs:
  vale:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: errata-ai/vale-action@reviewdog
      with:
        files: src/content
        vale_flags: "--minAlertLevel=warning"
```

### Pre-commit Hook
Add to `.git/hooks/pre-commit`:

```bash
#!/bin/sh
vale src/content/ --minAlertLevel=warning
```

## Common Issues and Solutions

### Issue: "Style not found"
**Solution**: Run `vale sync` to download required style packages.

### Issue: Too many suggestions
**Solution**: Adjust `MinAlertLevel` in `.vale.ini` or use `--minAlertLevel=warning`.

### Issue: False positives for technical terms
**Solution**: Add terms to `.vale/styles/Code198x/accept.txt`.

### Issue: Rule conflicts with educational style
**Solution**: Set problematic rules to `suggestion` level or disable with `NO`.

## Best Practices

1. **Run Vale regularly** during content creation
2. **Address warnings and errors** before publishing
3. **Review suggestions** for style improvements
4. **Update vocabulary** as new technical terms are introduced
5. **Customize rules** based on your content needs

## Configuration Overview

Our Vale setup includes:

- **Vale core rules**: Basic grammar and style
- **Microsoft Writing Guide**: Technical writing standards
- **write-good rules**: Readability improvements
- **Custom Code198x rules**: Retro computing terminology
- **Educational tone guidelines**: Consistent instructional voice

This ensures your educational content maintains high quality while staying true to the retro computing domain expertise. 