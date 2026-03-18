import { motion } from 'framer-motion'
import CombinedVizReadable from './CombinedVizReadable.jsx'

const navItems = [
  { label: 'Abstract', href: '#overview' },
  { label: 'Scope', href: '#scope' },
  { label: 'Method', href: '#method' },
  { label: 'Results', href: '#results' },
  { label: 'Media', href: '#media' },
  { label: 'Resources', href: '#resources' },
]

const scopePillars = [
  {
    title: 'RRAM System',
    text: 'The project is framed around an acceleration system, not only a policy network. The eventual paper will cover an RRAM-oriented inference stack for running compact action policies.',
  },
  {
    title: 'Model Transfer',
    text: 'A second pillar is distillation from larger VLA-style action models into a smaller design that is realistic for the target system and deployment constraints.',
  },
  {
    title: 'Policy Evaluation',
    text: 'The third pillar is policy design and evaluation, including simulation comparisons, physical demos, and system-level tradeoffs. Public wording stays intentionally broad for now.',
  },
]

const resultPlaceholders = [
  {
    title: 'System-Level Comparison',
    text: 'Reserve this for the headline comparison that ties the policy to the broader system story, including efficiency, latency, or deployment-side gains where appropriate.',
  },
  {
    title: 'Model and Distillation Studies',
    text: 'Use this block for design ablations, teacher-student comparisons, and compact-policy variants without oversharing unfinished internals too early.',
  },
  {
    title: 'Simulation and Physical Trials',
    text: 'Place simulation comparisons, real-robot summaries, failure modes, and final task precision notes here.',
  },
]

const resourcePlaceholders = [
  'Paper PDF',
  'Code Repository',
  'Supplementary Tables',
  'Supplementary Videos',
  'Checkpoints',
  'BibTeX',
]

const figurePlaceholders = ['Figure 1', 'Figure 2', 'Figure 3', 'Figure 4']

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
      className="rounded-full border border-stone-300/80 bg-white/80 px-4 py-2 text-sm font-medium text-stone-700 shadow-sm backdrop-blur-sm transition hover:bg-white"
    >
      {children}
    </a>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#f5f1ea] text-stone-900">
      <header className="sticky top-0 z-40 px-3 pt-3 md:px-5">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between rounded-[22px] border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,0.68),rgba(255,255,255,0.34))] px-4 py-4 shadow-[0_12px_40px_rgba(84,63,37,0.10)] backdrop-blur-xl md:px-6">
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
        <section className="border-b border-stone-200 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),transparent_42%),linear-gradient(180deg,#fbf9f4_0%,#f5f1ea_100%)]">
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
                A system-oriented project around action-space flow matching for bimanual control, spanning acceleration hardware, model transfer, and policy design.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.45 }}
                className="mt-6 text-sm leading-7 text-stone-500"
              >
                Authors, institutional lines, and publication venue can slot here once finalized.
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
              className="rounded-[28px] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(255,255,255,0.62))] p-7 shadow-[0_18px_60px_rgba(70,52,30,0.08)] backdrop-blur-lg"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">Abstract</div>
              <p className="mt-4 text-base leading-8 text-stone-700">
                This website is structured as a paper companion rather than a product page. It is meant to hold the public-facing outline of a broader system paper while keeping sensitive implementation details, final figures, and supplementary artifacts flexible until the manuscript settles.
              </p>
              <div className="mt-6 grid gap-3">
                <div className="rounded-2xl bg-stone-50 px-4 py-3 text-sm leading-7 text-stone-600">
                  <span className="font-semibold text-stone-800">System scope.</span> The project spans hardware-aware deployment, compact model transfer, and policy behavior.
                </div>
                <div className="rounded-2xl bg-stone-50 px-4 py-3 text-sm leading-7 text-stone-600">
                  <span className="font-semibold text-stone-800">Method focus.</span> The current public animation emphasizes the policy backbone and its structured flow-matching design.
                </div>
                <div className="rounded-2xl bg-stone-50 px-4 py-3 text-sm leading-7 text-stone-600">
                  <span className="font-semibold text-stone-800">Status.</span> The site is live, quietly framed, and ready to absorb journal figures, tables, and linked supplementary media later.
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
              body="The site is now shaped like an academic project page: title, abstract, scope framing, method section, figure placeholders, and a final resources block. The visual language stays restrained so the technical material can stay in front."
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
                  The method animation is already embedded, and the surrounding sections are stable placeholders for writing, system framing, journal figures, tables, rollout clips, citations, and publication links.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="scope" className="border-b border-stone-200 bg-[#fbf9f4]">
          <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6">
            <SectionHeader
              eyebrow="Scope"
              title="The paper is framed as a system story"
              body="The public site should make the broader scope legible without prematurely exposing every implementation detail. These three blocks are intentionally high level and map to the current plan for the full paper."
            />
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {scopePillars.map((item) => (
                <div key={item.title} className="rounded-[24px] border border-stone-200 bg-white p-6 shadow-sm">
                  <div className="text-sm font-semibold text-stone-900">{item.title}</div>
                  <p className="mt-3 text-sm leading-7 text-stone-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="method" className="border-b border-stone-200 bg-[#fbf9f4]">
          <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6">
            <SectionHeader
              eyebrow="Method"
              title="Interactive architecture walkthrough"
              body="This module acts like an animated figure for the policy-design portion of the paper. It explains the raw action grid, projection into hidden features, observation and time conditioning, the three-axis mixer blocks, AdaLN-Zero modulation, and the final ODE rollout."
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
              eyebrow="Figures and Media"
              title="Selected journal figures and linked supplementary material"
              body="Assume a small set of curated figures will live here, while denser supplementary tables, videos, and extended rollouts can be linked out to companion pages or separate repositories when needed."
            />
            <div className="grid gap-4 md:grid-cols-2">
              {figurePlaceholders.map((item) => (
                <div key={item} className="rounded-[24px] border border-dashed border-stone-300 bg-white p-6">
                  <div className="text-sm font-semibold text-stone-900">{item}</div>
                  <div className="mt-4 h-44 rounded-2xl bg-stone-200" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="resources" className="bg-[#f5f1ea]">
          <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6">
            <SectionHeader
              eyebrow="Resources"
              title="Paper materials and citation links"
              body="Once the paper is public, this section can expose the manuscript, code, checkpoints, and outward links to supplementary tables or videos without overloading the main project page."
            />
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
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
