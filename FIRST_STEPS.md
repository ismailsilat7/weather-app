# First Steps After Using This Template

Follow these steps to get started with your new project.

---

## 1️⃣ Rename Project in `package.json`

Open `package.json` and update the following fields:

```json
{
  "name": "your-project-name",
  "description": "Describe what your project does",
  "version": "1.0.0",
  "author": "Your Name (optional)",
  "keywords": ["custom", "tags", "for", "your", "project"]
}
```

## 2️⃣ Install Dependencies
```bash
npm install
```

## 3️⃣ Start the Dev Server
```bash
npm run dev
```

## 4️⃣ Customize Your App
- Edit the following files:
    - src/index.js – main JS entry point
    - src/style.css – global styles
    - src/template.html – your base HTML
    - src/assets/ – add your images and fonts

## 5️⃣ Build for Production
```bash
npm run build
```

### Commit /dist (Optional)
```bash
git add ./dist
git commit -m"Deployment"
```

## 6️⃣ Deploy to GitHub Pages
```bash
npm run deploy
```


