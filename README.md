# webpack-template
This repository serves as a template for any of my upcoming webpack projects

## Features
- Webpack 5 with production & development modes
- CSS support via `style-loader` and `css-loader`
- Image & font asset handling
- Live reload with `webpack-dev-server`
- HTML templating with `html-webpack-plugin`
- Easy deploy to GitHub Pages (`/dist`)
- Modular config files using `webpack-merge`

## Installation
```bash
git clone https://github.com/ismailsilat7/webpack-template.git my-project
cd my-project
rm -rf .git
npm install
```

## Scripts
| Command          | Description                            |
| ---------------- | -------------------------------------- |
| `npm run dev`    | Run development server with hot reload |
| `npm run build`  | Build production-ready bundle          |
| `npm run deploy` | Deploy `/dist` to GitHub Pages branch  |


## Project Structure
webpack-template/
├── dist/              # Production output (generated)
├── src/
│   ├── assets/
│   │   └── images/
│   ├── index.js       # Entry point
│   ├── style.css      # Global styles
│   └── template.html  # HTML template
├── webpack.common.js
├── webpack.dev.js
├── webpack.prod.js
├── package.json
└── README.md

> New to this template? See [FIRST_STEPS.md](./FIRST_STEPS.md)