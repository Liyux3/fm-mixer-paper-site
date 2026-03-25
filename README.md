# FM-Mixer Paper Site

Starter website for the `3-Axis MLP-Mixer Flow Matching Policy` project page.

The public framing is intentionally neutral. The site is meant to act as a
paper website template first, with room for project-specific wording once the
manuscript and public assets settle.

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
- generic framework section
- embedded interactive method explorer
- placeholder sections for results, figures/media, and resources

The figures/media section currently assumes four selected journal figures on the
main site, while denser supplementary tables and videos may live on linked
companion pages later.

The hero area also includes direct publication-link placeholders and top media
slots for teaser animations or videos.

The method module is now structured as:

- an overview map of the full pipeline
- a fixed-height detail area
- an integrated mixer explorer with overview and per-axis inspection in one place

A preserved copy of the older visualization remains in
`src/CombinedVizReadable_pre_mixer_refactor.jsx`.

## Main files

- `src/App.jsx`: paper website shell
- `src/CombinedVizReadable.jsx`: architecture animation module
- `src/index.css`: Tailwind import and base reset
- `vite.config.js`: Vite config, Tailwind plugin, GitHub Pages base handling
- `.github/workflows/deploy.yml`: Pages deployment workflow
