# Code198x Website

Astro 5.14.1 learning platform for retro game development education.

## 🚀 Project Structure

```text
website/
├── src/
│   ├── pages/                  # File-based routing
│   │   └── commodore-64/basic/ # C64 BASIC course
│   │       ├── CURRICULUM.md   # Authoritative lesson specs
│   │       ├── index.astro     # Course overview
│   │       └── week-N/         # Weekly lesson groups
│   ├── layouts/                # Page templates
│   │   ├── Layout.astro        # Base layout
│   │   └── LessonLayout.astro  # Lesson page template
│   ├── components/             # Reusable components
│   └── styles/                 # Global styles
├── public/                     # Static assets
└── package.json
```

## 🧞 Commands

All commands are run from the website directory:

| Command           | Action                                      |
| :---------------- | :------------------------------------------ |
| `npm install`     | Installs dependencies                       |
| `npm run dev`     | Starts dev server at `localhost:4321`       |
| `npm run build`   | Build production site to `./dist/`          |
| `npm run preview` | Preview build locally before deploying      |

## 📝 Adding Lessons

1. Check `CURRICULUM.md` in the course directory for lesson specifications
2. Create `lesson-NN.mdx` with proper frontmatter (see LessonLayout.astro)
3. Follow the lesson structure template (Opening → Basic → Practical → WOW → Reference → Learnt)
4. Extract WOW moment code to `/code-samples/[system]/[course]/week-N/lesson-NN/`

## 🌐 Live Site

[code198x.stevehill.xyz](https://code198x.stevehill.xyz)
