# Code198x Website

Astro 5.15.x learning platform for retro game development education.

## 🚀 Project Structure

```text
website/
├── src/
│   ├── pages/                     # File-based routing
│   │   └── [platform]/            # e.g., commodore-64
│   │       └── game-NN-[title]/   # Game project
│   │           ├── index.mdx      # Course overview
│   │           └── unit-NN.mdx    # Individual lessons
│   ├── layouts/                   # Page templates
│   │   ├── Layout.astro           # Base layout
│   │   └── LessonLayout.astro     # Lesson page template
│   ├── components/                # Reusable components
│   └── styles/                    # Global styles
├── public/                        # Static assets
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

1. Check the authoritative curriculum specs in `/docs/curriculum/[platform]-curriculum.md`
2. Create `unit-NN.mdx` in the appropriate game directory
3. Follow the lesson structure template (Opening → Basic → Practical → WOW → Reference → Learnt)
4. Extract WOW moment code to `/code-samples/[platform]/game-NN-[title]/unit-NN/`

## 🌐 Live Site

[code198x.stevehill.xyz](https://code198x.stevehill.xyz)
