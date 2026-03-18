import { motion } from 'framer-motion'
import CombinedVizReadable from './CombinedVizReadable.jsx'

const navItems = [
  { label: 'Overview', href: '#overview' },
  { label: 'Method', href: '#method' },
  { label: 'Results', href: '#results' },
  { label: 'Media', href: '#media' },
  { label: 'Resources', href: '#resources' },
]

const cards = [
  {
    title: 'Problem',
    text: 'Learn a coherent 16-step bimanual action plan in plain action space, instead of autoregressively emitting one action at a time.',
  },
  {
    title: 'Core move',
    text: 'Treat the trajectory as a structured tensor and mix separately along time, joints, and hidden features.',
  },
  {
    title: 'Status',
    text: 'This is a starter paper site. The animation module is already live and the content sections are ready for figures, tables, videos, and writing.',
  },
]

const resultPlaceholders = [
  'Main benchmark table placeholder',
  'Ablation study placeholder',
  'Real-robot qualitative rollout placeholder',
]

const resourcePlaceholders = [
  'Paper PDF, once ready',
  'ArXiv / project update link',
  'Code repository and checkpoints',
  'BibTeX and citation block',
]

function SectionHeader({ eyebrow, title, body }) {
  return (
    <div className="max-w-2xl">
      <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">{eyebrow}</div>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-8 text-slate-600 md:text-lg">{body}</p>
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/88 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <a href="#" className="text-sm font-bold uppercase tracking-[0.18em] text-slate-700">
            FM-Mixer Project Site
          </a>
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-sm font-medium text-slate-500 transition hover:text-slate-900">
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-100">
          <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 shadow-sm"
              >
                Research website scaffold
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.45 }}
                className="mt-6 max-w-4xl text-4xl font-bold tracking-tight text-slate-900 md:text-6xl"
              >
                3-Axis MLP-Mixer Flow Matching Policy
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16, duration: 0.45 }}
                className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 md:text-xl"
              >
                A motion-heavy project website shell for explaining action-space flow matching with explicit time, joint, and feature mixing for bimanual control.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24, duration: 0.45 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <a
                  href="#method"
                  className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-slate-700"
                >
                  See method animation
                </a>
                <a
                  href="#results"
                  className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  Fill results later
                </a>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.45 }}
              className="grid gap-4"
            >
              {cards.map((card) => (
                <div key={card.title} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="text-sm font-bold text-slate-900">{card.title}</div>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{card.text}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="overview" className="border-b border-slate-200 bg-slate-100">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 md:px-6 lg:grid-cols-[0.9fr_1.1fr]">
            <SectionHeader
              eyebrow="Overview"
              title="A better home for future paper figures and interactive explanations"
              body="I kept the stack centered on React, Tailwind, and Framer Motion. It is a strong fit for a research site that needs interactive diagrams, incremental reveals, embedded videos, and fast static deployment without dragging in a heavier CMS or app framework too early."
            />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-bold text-slate-900">Chosen stack</div>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Vite + React + Tailwind + Framer Motion. Fast local iteration, easy static export, and plenty of control for custom research visuals.
                </p>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-bold text-slate-900">Design direction</div>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Clean paper companion, light theme, large type, animation where it teaches, and obvious placeholders where content will be added later.
                </p>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm md:col-span-2">
                <div className="text-sm font-bold text-slate-900">What is already plugged in</div>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  The architecture walkthrough is already embedded as the method explainer. You can now add authored sections for abstract, setup, benchmark tables, video grids, and citation resources without rewriting the site skeleton.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="method" className="border-b border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6">
            <SectionHeader
              eyebrow="Method"
              title="Interactive architecture walkthrough"
              body="This module is ready to live inside the future website. It already explains the raw action grid, the projection to a hidden tensor, observation and time conditioning, the three-axis mixer blocks, AdaLN-Zero, output projection, and ODE rollout."
            />
            <div className="mt-10">
              <CombinedVizReadable />
            </div>
          </div>
        </section>

        <section id="results" className="border-b border-slate-200 bg-slate-100">
          <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6">
            <SectionHeader
              eyebrow="Results"
              title="Prepared placeholders for experiments and comparisons"
              body="These cards are where your main quantitative story can land next. They are just shells for now, which keeps the structure stable while the paper content matures."
            />
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {resultPlaceholders.map((item) => (
                <div key={item} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="text-sm font-bold text-slate-900">{item}</div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Drop in table screenshots, animated charts, rollout summaries, or comparison snippets here.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="media" className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 md:px-6 lg:grid-cols-[0.95fr_1.05fr]">
            <SectionHeader
              eyebrow="Media"
              title="Reserved space for videos, gifs, and qualitative rollouts"
              body="Since the eventual paper site will likely lean hard on movement and timing, I left a media section with large slots for real robot clips, simulation comparisons, or short scene-by-scene visual stories."
            />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6">
                <div className="text-sm font-bold text-slate-900">Hero video slot</div>
                <div className="mt-4 h-48 rounded-2xl bg-slate-200" />
              </div>
              <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6">
                <div className="text-sm font-bold text-slate-900">Qualitative comparison slot</div>
                <div className="mt-4 h-48 rounded-2xl bg-slate-200" />
              </div>
            </div>
          </div>
        </section>

        <section id="resources" className="bg-slate-100">
          <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6">
            <SectionHeader
              eyebrow="Resources"
              title="Everything else can slot in here later"
              body="This final section is ready for the practical links people expect from a project page once the paper, code, and checkpoints are public."
            />
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {resourcePlaceholders.map((item) => (
                <div key={item} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="text-sm font-bold text-slate-900">{item}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
