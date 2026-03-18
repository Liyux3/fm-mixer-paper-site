import { motion } from 'framer-motion'
import CombinedVizReadable from './CombinedVizReadable.jsx'

const navItems = [
  { label: 'Abstract', href: '#overview' },
  { label: 'Method', href: '#method' },
  { label: 'Results', href: '#results' },
  { label: 'Media', href: '#media' },
  { label: 'Resources', href: '#resources' },
]

const resultPlaceholders = [
  {
    title: 'Main Table',
    text: 'Reserve this for benchmark success rates, confidence intervals, and the main comparison against prior policies.',
  },
  {
    title: 'Ablations',
    text: 'Use this block for axis-mixing ablations, conditioner variants, and action-space versus latent-space comparisons.',
  },
  {
    title: 'Robot Trials',
    text: 'Place real-robot rollout summaries, failure modes, and insertion precision notes here.',
  },
]

const resourcePlaceholders = [
  'Paper PDF',
  'Code Repository',
  'Checkpoints',
  'BibTeX',
]

function SectionHeader({ eyebrow, title, body }) {
  return (
    <div className="max-w-3xl">
      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">{eyebrow}</div>
      <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-stone-900 md:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-8 text-stone-600 md:text-lg">{body}</p>
    </div>
  )
}

function LinkChip({ children, href = '#' }) {
  return (
    <a
      href={href}
      className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm transition hover:bg-stone-50"
    >
      {children}
    </a>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#f5f1ea] text-stone-900">
      <header className="sticky top-0 z-40 border-b border-stone-200/90 bg-[#fbf9f4]/92 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <a href="#" className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
            FM-Mixer
          </a>
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-sm font-medium text-stone-500 transition hover:text-stone-900">
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <section className="border-b border-stone-200 bg-[linear-gradient(180deg,#fbf9f4_0%,#f5f1ea_100%)]">
          <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500"
              >
                Project Website
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.45 }}
                className="mt-5 max-w-4xl font-serif text-4xl font-semibold leading-tight tracking-tight text-stone-900 md:text-6xl"
              >
                3-Axis MLP-Mixer Flow Matching Policy
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16, duration: 0.45 }}
                className="mt-5 max-w-3xl text-lg leading-8 text-stone-600 md:text-xl"
              >
                An action-space flow matching policy for bimanual control, with explicit mixing along time, joints, and hidden features.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.45 }}
                className="mt-6 text-sm leading-7 text-stone-500"
              >
                Authors and institutional lines can slot here once finalized.
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.45 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <LinkChip href="#method">Method Animation</LinkChip>
                <LinkChip href="#results">Results</LinkChip>
                <LinkChip href="#resources">Resources</LinkChip>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.45 }}
              className="rounded-[28px] border border-stone-200 bg-white p-7 shadow-[0_18px_60px_rgba(70,52,30,0.08)]"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">Abstract</div>
              <p className="mt-4 text-base leading-8 text-stone-700">
                This website is structured as a paper companion rather than a product landing page. The animation module is already embedded as an explanatory method figure, while the surrounding sections are prepared for quantitative tables, qualitative rollouts, paper links, and citation material.
              </p>
              <div className="mt-6 grid gap-3">
                <div className="rounded-2xl bg-stone-50 px-4 py-3 text-sm leading-7 text-stone-600">
                  <span className="font-semibold text-stone-800">Problem.</span> Generate coherent 16-step bimanual action chunks directly in plain action space.
                </div>
                <div className="rounded-2xl bg-stone-50 px-4 py-3 text-sm leading-7 text-stone-600">
                  <span className="font-semibold text-stone-800">Method.</span> Replace flat action processing with separate time, joint, and feature mixing.
                </div>
                <div className="rounded-2xl bg-stone-50 px-4 py-3 text-sm leading-7 text-stone-600">
                  <span className="font-semibold text-stone-800">Status.</span> The site is live, deploys persistently through GitHub Pages, and is ready for paper content.
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="overview" className="border-b border-stone-200 bg-[#f5f1ea]">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 md:px-6 lg:grid-cols-[0.9fr_1.1fr]">
            <SectionHeader
              eyebrow="Overview"
              title="A calmer, paper-oriented shell for future figures and explanations"
              body="The site is now shaped like an academic project page: title, abstract, method section, results placeholders, media slots, and a final resources block. The visual language is intentionally quieter so the technical content and animated diagrams can stay in front."
            />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border border-stone-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-stone-900">Stack</div>
                <p className="mt-2 text-sm leading-7 text-stone-600">
                  Vite, React, Tailwind, and Framer Motion. Lightweight, static-friendly, and comfortable for interactive method figures.
                </p>
              </div>
              <div className="rounded-[24px] border border-stone-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-stone-900">Tone</div>
                <p className="mt-2 text-sm leading-7 text-stone-600">
                  Serif headlines, muted stone palette, restrained buttons, and less of the startup-call-to-action flavor.
                </p>
              </div>
              <div className="rounded-[24px] border border-stone-200 bg-white p-5 shadow-sm md:col-span-2">
                <div className="text-sm font-semibold text-stone-900">Current structure</div>
                <p className="mt-2 text-sm leading-7 text-stone-600">
                  The method animation is already embedded, and the surrounding sections are stable placeholders for writing, tables, rollout clips, citations, and publication links.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="method" className="border-b border-stone-200 bg-[#fbf9f4]">
          <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6">
            <SectionHeader
              eyebrow="Method"
              title="Interactive architecture walkthrough"
              body="This module acts like an animated figure for the method section. It explains the raw action grid, projection into hidden features, observation and time conditioning, the three-axis mixer blocks, AdaLN-Zero modulation, and the final ODE rollout."
            />
            <div className="mt-10">
              <CombinedVizReadable />
            </div>
          </div>
        </section>

        <section id="results" className="border-b border-stone-200 bg-[#f5f1ea]">
          <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6">
            <SectionHeader
              eyebrow="Results"
              title="Placeholders for quantitative comparisons and ablations"
              body="The structure below is meant for paper material rather than marketing cards. Tables, compact discussion text, and annotated figures can be dropped in without fighting the layout."
            />
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {resultPlaceholders.map((item) => (
                <div key={item.title} className="rounded-[24px] border border-stone-200 bg-white p-6 shadow-sm">
                  <div className="text-sm font-semibold text-stone-900">{item.title}</div>
                  <p className="mt-3 text-sm leading-7 text-stone-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="media" className="border-b border-stone-200 bg-[#fbf9f4]">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 md:px-6 lg:grid-cols-[0.95fr_1.05fr]">
            <SectionHeader
              eyebrow="Media"
              title="Reserved space for qualitative rollouts and videos"
              body="This section is intentionally simple. It can hold real-robot videos, simulation comparisons, failure-case galleries, or embedded animated figures without reworking the overall site."
            />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border border-dashed border-stone-300 bg-white p-6">
                <div className="text-sm font-semibold text-stone-900">Primary rollout video</div>
                <div className="mt-4 h-52 rounded-2xl bg-stone-200" />
              </div>
              <div className="rounded-[24px] border border-dashed border-stone-300 bg-white p-6">
                <div className="text-sm font-semibold text-stone-900">Comparison or failure gallery</div>
                <div className="mt-4 h-52 rounded-2xl bg-stone-200" />
              </div>
            </div>
          </div>
        </section>

        <section id="resources" className="bg-[#f5f1ea]">
          <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6">
            <SectionHeader
              eyebrow="Resources"
              title="Paper materials and citation links"
              body="Once the paper is public, this section can expose the PDF, code, checkpoints, and citation material in a compact and academic-looking way."
            />
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {resourcePlaceholders.map((item) => (
                <div key={item} className="rounded-[24px] border border-stone-200 bg-white p-5 shadow-sm">
                  <div className="text-sm font-semibold text-stone-900">{item}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
