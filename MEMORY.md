# FM-Mixer Paper Site Memory

## Overview

This directory is the starter website for the `3-Axis MLP-Mixer Flow Matching Policy` project.

The immediate goal is to host an interactive, animation-friendly paper companion
site that can absorb more content over time without restructuring the stack.

## Architecture Snapshot

- stack: `Vite` + `React` + `Tailwind CSS` + `Framer Motion`
- main website shell lives in `src/App.jsx`
- architecture animation module lives in `src/CombinedVizReadable.jsx`
- deployment is handled by GitHub Pages via `.github/workflows/deploy.yml`
- Vite base path is computed from `GITHUB_REPOSITORY` for Pages builds

Current public URLs:

- GitHub Pages: `https://liyux3.github.io/fm-mixer-paper-site/`
- GitHub repository: `https://github.com/Liyux3/fm-mixer-paper-site`

## Progress Log

### 2026-03-19

Created a local preview app under `fm-viz-preview` and replaced the one-off
visualization with a cleaner research-site starter.

The earlier architecture animation was restyled toward a clearer light theme and
kept as an embedded method explainer instead of a standalone page.

The method walkthrough was corrected so the mixing-axis labels and highlight
geometry line up with the intended semantics:

- rows correspond to time
- columns correspond to joints
- time mixing highlights a joint column
- joint mixing highlights a timestep row

The site now includes:

- hero section
- overview section
- embedded interactive method section
- placeholder sections for results, media, and resources

GitHub Pages deployment was wired through GitHub Actions and published from a
new public repository at `Liyux3/fm-mixer-paper-site`.

Later the site shell was revised again to feel less like a startup landing page
and more like an academic paper companion:

- quieter stone-toned palette
- serif-forward headings
- abstract-style hero content
- placeholder sections written more like paper sections than marketing cards

The step-6 mixer diagram was also corrected further so the time-mix highlight
snaps to the intended joint column more precisely.
