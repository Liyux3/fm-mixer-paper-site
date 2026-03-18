# FM-Mixer Paper Site

Starter website for the broader `3-Axis MLP-Mixer Flow Matching Policy` paper companion.

The public framing is intentionally broader than the policy animation alone. The
site is meant to support a system-level paper spanning:

- an RRAM-oriented execution system
- model distillation from larger action models
- policy design plus simulation and physical evaluation

## Stack

- `Vite`
- `React`
- `Tailwind CSS`
- `Framer Motion`
- `lucide-react`

This stack was chosen because it is lightweight, fast for iteration, and well suited to animation-heavy research pages.

## Local development

```bash
cd /Users/liyux/Documents/Playground/fm-viz-preview
npm install
npm run dev
```

Local preview runs on the Vite URL, currently `http://127.0.0.1:4173/`.

## Build

```bash
npm run build
```

## Deployment

The site is configured for GitHub Pages through GitHub Actions.

- pushes to `main` trigger `.github/workflows/deploy.yml`
- the Vite `base` path is derived automatically from `GITHUB_REPOSITORY`
- production output is published from `dist/`

## Current content structure

- title and abstract framing
- scope section for the three system pillars
- embedded interactive method walkthrough
- placeholder sections for results, figures/media, and resources

The figures/media section currently assumes four selected journal figures on the
main site, while denser supplementary tables and videos may live on linked
companion pages later.

## Main files

- `src/App.jsx`: paper website shell
- `src/CombinedVizReadable.jsx`: architecture animation module
- `src/index.css`: Tailwind import and base reset
- `vite.config.js`: Vite config, Tailwind plugin, GitHub Pages base handling
- `.github/workflows/deploy.yml`: Pages deployment workflow
