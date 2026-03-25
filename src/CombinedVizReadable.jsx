import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  ArrowDown,
  Box,
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock,
  Cpu,
  Layers,
  Waves,
} from 'lucide-react'

const COLORS = {
  input: '#3b82f6',
  projection: '#6366f1',
  observation: '#a855f7',
  time: '#f59e0b',
  mixer: '#10b981',
  output: '#ec4899',
  ode: '#06b6d4',
  text: '#1f2937',
  muted: '#64748b',
  border: '#cbd5e1',
  panel: '#ffffff',
  canvas: '#f8fafc',
}

const OVERVIEW_NODES = [
  {
    id: 'input',
    title: 'Noisy Action Grid',
    short: '(16, 21, 1)',
    accent: COLORS.input,
    Icon: Activity,
    description: 'The action horizon enters as a structured time-by-joint grid.',
  },
  {
    id: 'projection',
    title: 'Token Projection',
    short: '1 → 256',
    accent: COLORS.projection,
    Icon: Box,
    description: 'Each scalar slot becomes a 256-dimensional token.',
  },
  {
    id: 'mixer',
    title: 'Multi-Axis Mixer Stack',
    short: '6 blocks',
    accent: COLORS.mixer,
    Icon: Layers,
    description: 'Time, joint, and feature mixing happen inside each block.',
  },
  {
    id: 'output',
    title: 'Velocity Projection',
    short: '(16, 21)',
    accent: COLORS.output,
    Icon: ArrowDown,
    description: 'Hidden tokens collapse back to a velocity field.',
  },
  {
    id: 'ode',
    title: 'ODE Rollout',
    short: 'Euler steps',
    accent: COLORS.ode,
    Icon: Waves,
    description: 'The velocity field iteratively sculpts noise into a trajectory.',
  },
]

const SIDE_NODES = [
  {
    id: 'observation',
    title: 'Observation Bias',
    short: '(1, 1, 256)',
    accent: COLORS.observation,
    Icon: Camera,
    description: 'A shared observation vector is broadcast into every time-joint slot.',
  },
  {
    id: 'time',
    title: 'Time Controller',
    short: 'cond (256)',
    accent: COLORS.time,
    Icon: Clock,
    description: 'The ODE time stays separate and modulates each mixer block.',
  },
]

const MIXER_VIEWS = [
  {
    id: 'overview',
    label: 'Overview',
    color: COLORS.mixer,
    fixedAxis: 'All three axes stay visible together.',
    dims: 'Block = Time Mix → Joint Mix → Feature Mix',
    summary: 'Use this view to keep the whole mixer block in mind before drilling into any one axis.',
  },
  {
    id: 'time',
    label: 'Time Mix',
    color: '#10b981',
    fixedAxis: 'Hold joint fixed, mix across timesteps.',
    dims: 'Linear(16 → 64) → GELU → Linear(64 → 16)',
    summary: 'This is where one joint can look backward and forward across the horizon.',
  },
  {
    id: 'joint',
    label: 'Joint Mix',
    color: '#3b82f6',
    fixedAxis: 'Hold timestep fixed, mix across joints.',
    dims: 'Linear(21 → 84) → GELU → Linear(84 → 21)',
    summary: 'This is where coordination happens across the robot body at one moment in time.',
  },
  {
    id: 'feature',
    label: 'Feature Mix',
    color: '#a855f7',
    fixedAxis: 'Hold one time-joint slot fixed, mix hidden channels.',
    dims: 'Linear(256 → 1024) → GELU → Linear(1024 → 256)',
    summary: 'This is where action content, observation context, and prior mixing results are recombined.',
  },
  {
    id: 'adaln',
    label: 'AdaLN-Zero',
    color: '#ef4444',
    fixedAxis: 'Conditioner controls every axis update.',
    dims: 'γ, β, α per axis',
    summary: 'The time controller modulates each residual update without breaking the main signal path.',
  },
]

const JOINT_NAMES = ['L.Shoulder', 'L.Elbow', 'L.Wrist', 'R.Shoulder', 'R.Elbow', 'R.Wrist', 'Gripper']
const JOINT_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#6366f1', '#a855f7']

const SAMPLE_ROWS = 8
const SAMPLE_COLS = 11
const CELL = 26
const GAP = 4
const ACTIVE_ROW = 3
const ACTIVE_COL = 5

function LinkPill({ active, color, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm transition"
      style={{
        borderColor: active ? `${color}55` : '#d6d3d1',
        background: active ? `${color}18` : '#ffffff',
        color: active ? color : COLORS.muted,
      }}
    >
      {children}
    </button>
  )
}

function PipelineArrow() {
  return (
    <div className="hidden items-center justify-center px-1 lg:flex">
      <div className="h-[2px] w-8 rounded-full bg-slate-300" />
      <div className="h-0 w-0 border-b-[5px] border-l-[8px] border-t-[5px] border-b-transparent border-l-slate-300 border-t-transparent" />
    </div>
  )
}

function NodeCard({ node, active, onClick, children }) {
  const Icon = node.Icon
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick()
        }
      }}
      className="rounded-[24px] border p-4 text-left shadow-sm transition"
      style={{
        borderColor: active ? `${node.accent}55` : '#d6d3d1',
        background: active ? `${node.accent}12` : '#ffffff',
        boxShadow: active ? `0 14px 28px ${node.accent}14` : '0 6px 14px rgba(15,23,42,0.06)',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="rounded-2xl p-2"
            style={{
              background: `${node.accent}18`,
              color: node.accent,
            }}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">{node.title}</div>
            <div className="text-xs text-slate-500">{node.short}</div>
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs leading-6 text-slate-600">{node.description}</p>
      {children ? <div className="mt-3">{children}</div> : null}
    </div>
  )
}

function SampleTensor({ mode, tick }) {
  const renderCell = (r, c) => {
    const pulseRow = tick % SAMPLE_ROWS
    const pulseCol = tick % SAMPLE_COLS
    const isColumn = c === ACTIVE_COL
    const isRow = r === ACTIVE_ROW
    const isCore = r === ACTIVE_ROW && c === ACTIVE_COL

    let background = '#ffffff'
    let borderColor = '#cbd5e1'
    let transform = 'scale(1)'

    if (mode === 'overview') {
      if (isColumn) {
        background = '#d1fae5'
        borderColor = '#10b981'
      }
      if (isRow) {
        background = '#dbeafe'
        borderColor = '#3b82f6'
      }
      if (isCore) {
        background = '#f3e8ff'
        borderColor = '#a855f7'
        transform = 'scale(1.05)'
      }
    } else if (mode === 'time') {
      if (isColumn) {
        background = r === pulseRow ? '#10b981' : '#d1fae5'
        borderColor = '#10b981'
        transform = r === pulseRow ? 'scale(1.06)' : 'scale(1)'
      }
    } else if (mode === 'joint') {
      if (isRow) {
        background = c === pulseCol ? '#3b82f6' : '#dbeafe'
        borderColor = '#3b82f6'
        transform = c === pulseCol ? 'scale(1.06)' : 'scale(1)'
      }
    } else if (mode === 'feature') {
      if (isCore) {
        background = '#a855f7'
        borderColor = '#7e22ce'
        transform = 'scale(1.08)'
      } else if (Math.abs(r - ACTIVE_ROW) + Math.abs(c - ACTIVE_COL) <= 2) {
        background = '#f3e8ff'
        borderColor = '#c084fc'
      }
    } else if (mode === 'adaln') {
      if (isColumn) {
        background = '#fee2e2'
        borderColor = '#ef4444'
      }
      if (isRow) {
        background = '#dbeafe'
        borderColor = '#3b82f6'
      }
      if (isCore) {
        background = '#dcfce7'
        borderColor = '#22c55e'
        transform = 'scale(1.08)'
      }
    }

    return (
      <div
        key={`${r}-${c}`}
        className="rounded-md border transition-all duration-150"
        style={{
          width: CELL,
          height: CELL,
          background,
          borderColor,
          transform,
        }}
      />
    )
  }

  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 shadow-inner">
      <div className="mb-2 ml-9 text-xs text-slate-500">joints →</div>
      <div className="flex">
        <div className="mr-2 flex flex-col justify-center text-[10px] text-slate-500" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
          time →
        </div>
        <div className="relative grid grid-cols-11 gap-1">
          {Array.from({ length: SAMPLE_ROWS }).map((_, r) =>
            Array.from({ length: SAMPLE_COLS }).map((_, c) => renderCell(r, c)),
          )}
          {mode === 'time' ? (
            <div
              className="pointer-events-none absolute top-0 bottom-0 rounded-md border-2 border-emerald-500"
              style={{ left: ACTIVE_COL * (CELL + GAP) - 1, width: CELL + 2 }}
            />
          ) : null}
          {mode === 'joint' ? (
            <div
              className="pointer-events-none absolute left-0 right-0 rounded-md border-2 border-blue-500"
              style={{ top: ACTIVE_ROW * (CELL + GAP) - 1, height: CELL + 2 }}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}

function ChannelBars({ color, mode, tick }) {
  return (
    <div className="flex h-40 items-end gap-1 rounded-[20px] border border-slate-200 bg-white px-3 pb-3 pt-4">
      {Array.from({ length: 12 }).map((_, i) => {
        const base = 24 + ((i * 13) % 48)
        const pulse =
          mode === 'feature'
            ? 20 * Math.sin((tick + i) * 0.25) ** 2
            : mode === 'time'
              ? 12 * Math.sin((tick + i) * 0.22) ** 2
              : mode === 'joint'
                ? 14 * Math.sin((tick + i) * 0.28) ** 2
                : 10 * Math.sin((tick + i) * 0.21) ** 2
        return (
          <motion.div
            key={i}
            animate={{ height: base + pulse }}
            transition={{ duration: 0.18 }}
            className="w-4 rounded-t-md"
            style={{ background: `${color}cc` }}
          />
        )
      })}
    </div>
  )
}

export default function CombinedVizReadable() {
  const [selectedNode, setSelectedNode] = useState('mixer')
  const [selectedMixerView, setSelectedMixerView] = useState('overview')
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setTick((prev) => prev + 1), 220)
    return () => clearInterval(interval)
  }, [])

  const trajectories = useMemo(() => {
    return JOINT_NAMES.map((_, j) =>
      Array.from({ length: 16 }).map((__, i) => Math.sin(i * 0.42 + j * 0.9) * (0.25 + j * 0.05)),
    )
  }, [])

  const mixerMeta = MIXER_VIEWS.find((item) => item.id === selectedMixerView) ?? MIXER_VIEWS[0]

  const renderNodeDetail = () => {
    if (selectedNode === 'input') {
      return (
        <div className="grid h-full gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <SampleTensor mode="overview" tick={tick} />
          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-white p-5">
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Input tensor</div>
            <h3 className="text-xl font-semibold text-slate-900">The whole process starts from a structured action grid</h3>
            <p className="text-sm leading-7 text-slate-600">
              The key point is that the model never needs to forget what time and joint mean. Even the noisiest input still enters as a time-by-joint layout rather than a flat vector.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-600">
                <span className="font-semibold text-slate-800">Rows.</span> Future control steps.
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-600">
                <span className="font-semibold text-slate-800">Columns.</span> Joints or action channels.
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (selectedNode === 'projection') {
      return (
        <div className="grid h-full gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex items-center justify-center gap-6 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <div className="space-y-2 text-center">
              <div className="text-sm font-semibold text-blue-700">Grid slot</div>
              <div className="mx-auto h-16 w-16 rounded-2xl border-2 border-blue-200 bg-blue-100" />
              <div className="text-xs text-slate-500">1 scalar</div>
            </div>
            <div className="h-[2px] w-10 rounded-full bg-indigo-300" />
            <div className="space-y-2 text-center">
              <div className="text-sm font-semibold text-indigo-700">Token</div>
              <div className="relative h-24 w-20">
                {[0, 1, 2, 3, 4].map((layer) => (
                  <div
                    key={layer}
                    className="absolute h-20 w-14 rounded-xl border-2 border-indigo-500 bg-indigo-200"
                    style={{ transform: `translate(${layer * 5}px, ${-layer * 5}px)`, opacity: 1 - layer * 0.12 }}
                  />
                ))}
              </div>
              <div className="text-xs text-slate-500">256 features</div>
            </div>
          </div>
          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-white p-5">
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Projection</div>
            <h3 className="text-xl font-semibold text-slate-900">Each cell gets depth without losing position</h3>
            <p className="text-sm leading-7 text-slate-600">
              This is not a reshape trick. The network is learning a richer internal representation for every time-joint slot, while preserving the grid structure that later mixers use.
            </p>
            <div className="rounded-2xl bg-slate-50 px-4 py-3 font-mono text-sm text-slate-700">Linear(1 → 256)</div>
          </div>
        </div>
      )
    }

    if (selectedNode === 'observation') {
      return (
        <div className="grid h-full gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex items-center justify-center gap-6 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <div className="rounded-2xl bg-purple-100 p-4 text-purple-700">
              <Camera className="h-8 w-8" />
            </div>
            <div className="h-[2px] w-10 rounded-full bg-purple-300" />
            <div className="rounded-2xl border border-purple-200 bg-white px-4 py-3 text-sm font-semibold text-purple-700">ResNet18 → 256</div>
            <div className="h-[2px] w-10 rounded-full bg-purple-300" />
            <div className="flex h-28 w-10 items-center justify-center rounded-xl bg-purple-500 shadow-lg">
              <span className="rotate-[-90deg] whitespace-nowrap text-xs font-bold text-white">bias</span>
            </div>
          </div>
          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-white p-5">
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Observation branch</div>
            <h3 className="text-xl font-semibold text-slate-900">Visual context is injected globally first</h3>
            <p className="text-sm leading-7 text-slate-600">
              The same observation vector is added to every time-joint token. This keeps the conditioner cheap, and later mixers decide how that shared context should become time-specific or joint-specific.
            </p>
          </div>
        </div>
      )
    }

    if (selectedNode === 'time') {
      return (
        <div className="grid h-full gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex items-center justify-center gap-6 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-orange-400 bg-white text-xl font-bold text-orange-600 shadow-sm">
              t
            </div>
            <div className="h-[2px] w-10 rounded-full bg-orange-300" />
            <div className="space-y-2">
              <div className="rounded-2xl border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-700">Sinusoidal Embedding</div>
              <div className="rounded-2xl border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-700">MLP → cond (256)</div>
            </div>
          </div>
          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-white p-5">
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Time branch</div>
            <h3 className="text-xl font-semibold text-slate-900">The denoising time stays outside the tensor</h3>
            <p className="text-sm leading-7 text-slate-600">
              This branch is better thought of as a controller than as another token source. It shapes how strongly each axis update should act, rather than being pasted directly into the grid.
            </p>
          </div>
        </div>
      )
    }

    if (selectedNode === 'output') {
      return (
        <div className="grid h-full gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex items-center justify-center gap-6 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <div className="relative h-28 w-20">
              {[0, 1, 2, 3].map((layer) => (
                <div
                  key={layer}
                  className="absolute h-24 w-16 rounded-xl border-2 border-emerald-500 bg-emerald-200"
                  style={{ transform: `translate(${layer * 5}px, ${-layer * 5}px)`, opacity: 1 - layer * 0.12 }}
                />
              ))}
            </div>
            <div className="h-[2px] w-10 rounded-full bg-pink-300" />
            <div className="space-y-2 text-center">
              <div className="text-sm font-semibold text-pink-700">Velocity field</div>
              <div className="grid grid-cols-6 gap-1 rounded-2xl border-2 border-pink-200 bg-pink-50 p-2">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="h-5 w-6 rounded-md bg-pink-400" style={{ opacity: 0.3 + Math.abs(Math.sin(i)) * 0.55 }} />
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-white p-5">
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Output head</div>
            <h3 className="text-xl font-semibold text-slate-900">The shape comes back to the original grid</h3>
            <p className="text-sm leading-7 text-slate-600">
              After all the internal mixing, the output head returns one scalar per time-joint slot. The topology of the grid is unchanged, only its meaning has shifted from noisy action values to predicted velocity.
            </p>
            <div className="rounded-2xl bg-slate-50 px-4 py-3 font-mono text-sm text-slate-700">Linear(256 → 1)</div>
          </div>
        </div>
      )
    }

    if (selectedNode === 'ode') {
      return (
        <div className="grid h-full gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <svg viewBox="0 0 380 220" className="block w-full">
              {Array.from({ length: 5 }).map((_, i) => (
                <line key={i} x1={24} x2={360} y1={28 + i * 36} y2={28 + i * 36} stroke="#cbd5e1" strokeWidth={0.7} strokeDasharray="3,6" />
              ))}
              {trajectories.map((curve, j) => {
                const points = curve
                  .map((value, i) => `${24 + (i / 15) * 336},${110 - value * 72}`)
                  .join(' ')
                return <polyline key={j} points={points} fill="none" stroke={JOINT_COLORS[j]} strokeWidth={2.3} opacity={0.88} strokeLinejoin="round" strokeLinecap="round" />
              })}
            </svg>
          </div>
          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-white p-5">
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">ODE rollout</div>
            <h3 className="text-xl font-semibold text-slate-900">The network is queried repeatedly, not just once</h3>
            <p className="text-sm leading-7 text-slate-600">
              The velocity network is part of a dynamical process. The predicted field bends the whole trajectory step by step, which is why smoothness and coordination matter far beyond a single forward pass.
            </p>
            <div className="rounded-2xl bg-slate-50 px-4 py-3 font-mono text-sm text-slate-700">x = x + v(x, t, obs) * dt</div>
          </div>
        </div>
      )
    }

    return (
      <div className="grid h-full gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4 rounded-[24px] border border-slate-200 bg-white p-5">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Inside one representative mixer block</div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {MIXER_VIEWS.map((view) => (
              <button
                key={view.id}
                onClick={() => setSelectedMixerView(view.id)}
                className="rounded-[20px] border p-4 text-left transition"
                style={{
                  borderColor: selectedMixerView === view.id ? `${view.color}55` : '#d6d3d1',
                  background: selectedMixerView === view.id ? `${view.color}12` : '#ffffff',
                }}
              >
                <div className="text-sm font-semibold" style={{ color: selectedMixerView === view.id ? view.color : COLORS.text }}>
                  {view.label}
                </div>
                <div className="mt-2 text-xs leading-6 text-slate-500">{view.fixedAxis}</div>
              </button>
            ))}
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-900">Whole block flow</div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {['Input tensor', 'AdaLN', 'Time Mix', 'Joint Mix', 'Feature Mix', 'Residual output'].map((label, idx) => (
                <div key={label} className="flex items-center gap-3">
                  <div
                    className="rounded-2xl px-3 py-2 text-sm font-medium"
                    style={{
                      background:
                        idx === 1
                          ? '#fee2e2'
                          : idx === 2
                            ? '#d1fae5'
                            : idx === 3
                              ? '#dbeafe'
                              : idx === 4
                                ? '#f3e8ff'
                                : '#ffffff',
                      border: `1px solid ${idx === 1 ? '#ef444455' : '#cbd5e1'}`,
                    }}
                  >
                    {label}
                  </div>
                  {idx < 5 ? <div className="h-[2px] w-6 rounded-full bg-slate-300" /> : null}
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm leading-7 text-slate-600">
              This top lane stays fixed while you inspect details on the right. That keeps the local operation anchored to the larger block structure.
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-600">
              <span className="font-semibold text-slate-800">Why this view exists.</span> You should be able to inspect one axis without losing sight of the block that contains it.
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-600">
              <span className="font-semibold text-slate-800">Mental model.</span> The mixer block is not a set of isolated slides, it is one tensor repeatedly transformed along different structural directions.
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-[24px] border border-slate-200 bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Tensor lens</div>
              <h3 className="mt-1 text-xl font-semibold text-slate-900">{mixerMeta.label}</h3>
            </div>
            <div
              className="rounded-full border px-3 py-1.5 text-xs font-semibold"
              style={{ borderColor: `${mixerMeta.color}55`, background: `${mixerMeta.color}12`, color: mixerMeta.color }}
            >
              {mixerMeta.dims}
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[auto_1fr] xl:items-start">
            <SampleTensor mode={selectedMixerView} tick={tick} />
            <div className="space-y-4">
              <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-600">
                <span className="font-semibold text-slate-800">What stays fixed.</span> {mixerMeta.fixedAxis}
              </div>
              <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-600">
                {mixerMeta.summary}
              </div>
              {selectedMixerView === 'adaln' ? (
                <div className="rounded-[20px] border border-slate-200 bg-white p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      ['γ', '#ef4444'],
                      ['β', '#3b82f6'],
                      ['α', '#22c55e'],
                    ].map(([label, color]) => (
                      <div
                        key={label}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-bold shadow-sm"
                        style={{ borderColor: `${color}44`, color, background: `${color}12` }}
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 font-mono text-xs text-slate-700">
                    x = x + α * Mixer(LayerNorm(x) * (1 + γ) + β)
                  </div>
                </div>
              ) : selectedMixerView === 'overview' ? (
                <div className="grid gap-3 sm:grid-cols-3">
                  {MIXER_VIEWS.slice(1, 4).map((view) => (
                    <div key={view.id} className="rounded-[20px] border border-slate-200 bg-white px-4 py-3">
                      <div className="text-sm font-semibold" style={{ color: view.color }}>
                        {view.label}
                      </div>
                      <div className="mt-2 text-xs leading-6 text-slate-500">{view.fixedAxis}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <ChannelBars color={mixerMeta.color} mode={selectedMixerView} tick={tick} />
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.12)] md:h-[1180px]">
        <div className="flex h-2 w-full bg-slate-100">
          {[...OVERVIEW_NODES, ...SIDE_NODES].slice(0, 7).map((node, idx) => (
            <div
              key={`${node.id}-${idx}`}
              className="h-full flex-1"
              style={{ background: idx < 5 ? node.accent : '#e2e8f0', borderRight: idx < 6 ? '1px solid rgba(255,255,255,0.55)' : 'none' }}
            />
          ))}
        </div>

        <div className="flex flex-col border-b border-slate-200 bg-slate-50/70 px-6 py-5 md:h-[330px] md:flex-none md:px-8">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Interactive architecture map</div>
          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1.3fr_auto_1fr_auto_1fr]">
            <NodeCard node={OVERVIEW_NODES[0]} active={selectedNode === 'input'} onClick={() => setSelectedNode('input')} />
            <PipelineArrow />
            <NodeCard node={OVERVIEW_NODES[1]} active={selectedNode === 'projection'} onClick={() => setSelectedNode('projection')} />
            <PipelineArrow />
            <div className="relative">
              <NodeCard node={OVERVIEW_NODES[2]} active={selectedNode === 'mixer'} onClick={() => setSelectedNode('mixer')}>
                <div className="flex gap-2">
                  {MIXER_VIEWS.slice(1, 4).map((view) => (
                    <LinkPill
                      key={view.id}
                      active={selectedNode === 'mixer' && selectedMixerView === view.id}
                      color={view.color}
                      onClick={(event) => {
                        event.stopPropagation()
                        setSelectedNode('mixer')
                        setSelectedMixerView(view.id)
                      }}
                    >
                      {view.label}
                    </LinkPill>
                  ))}
                </div>
              </NodeCard>

              <div className="pointer-events-none absolute -left-8 -top-24 hidden h-24 w-48 lg:block">
                <div className="absolute bottom-3 left-[72%] h-10 w-[2px] bg-purple-200" />
              </div>
              <div className="pointer-events-none absolute -left-8 top-full hidden h-24 w-48 lg:block">
                <div className="absolute left-[72%] top-0 h-10 w-[2px] bg-orange-200" />
              </div>
            </div>
            <PipelineArrow />
            <NodeCard node={OVERVIEW_NODES[3]} active={selectedNode === 'output'} onClick={() => setSelectedNode('output')} />
            <PipelineArrow />
            <NodeCard node={OVERVIEW_NODES[4]} active={selectedNode === 'ode'} onClick={() => setSelectedNode('ode')} />
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
            {SIDE_NODES.map((node) => (
              <NodeCard key={node.id} node={node} active={selectedNode === node.id} onClick={() => setSelectedNode(node.id)} />
            ))}
          </div>
        </div>

        <div className="grid min-h-[880px] flex-1 gap-0 md:min-h-0 md:grid-cols-[0.33fr_1fr]">
          <div className="border-b border-slate-200 bg-slate-50 p-8 md:overflow-y-auto md:border-b-0 md:border-r">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Current focus</div>
            <h2 className="mt-3 text-2xl font-bold leading-tight text-slate-800">
              {selectedNode === 'mixer'
                ? `Mixer Stack${selectedMixerView !== 'overview' ? `, ${mixerMeta.label}` : ''}`
                : [...OVERVIEW_NODES, ...SIDE_NODES].find((node) => node.id === selectedNode)?.title}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              {selectedNode === 'mixer'
                ? 'The overview stays above while the lower panel acts like a lens into one part of the mixer stack.'
                : [...OVERVIEW_NODES, ...SIDE_NODES].find((node) => node.id === selectedNode)?.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {[...OVERVIEW_NODES, ...SIDE_NODES].map((node) => (
                <LinkPill key={node.id} active={selectedNode === node.id} color={node.accent} onClick={() => setSelectedNode(node.id)}>
                  {node.title}
                </LinkPill>
              ))}
            </div>

            {selectedNode === 'mixer' ? (
              <div className="mt-8 space-y-3">
                {MIXER_VIEWS.map((view) => (
                  <button
                    key={view.id}
                    onClick={() => setSelectedMixerView(view.id)}
                    className="w-full rounded-[20px] border p-4 text-left transition"
                    style={{
                      borderColor: selectedMixerView === view.id ? `${view.color}55` : '#d6d3d1',
                      background: selectedMixerView === view.id ? `${view.color}12` : '#ffffff',
                    }}
                  >
                    <div className="text-sm font-semibold" style={{ color: selectedMixerView === view.id ? view.color : COLORS.text }}>
                      {view.label}
                    </div>
                    <div className="mt-2 text-xs leading-6 text-slate-500">{view.fixedAxis}</div>
                  </button>
                ))}
              </div>
            ) : null}

            <div className="mt-8 flex gap-3">
              <button
                onClick={() =>
                  setSelectedNode((prev) => {
                    const ids = [...OVERVIEW_NODES, ...SIDE_NODES].map((node) => node.id)
                    const index = ids.indexOf(prev)
                    return ids[Math.max(0, index - 1)]
                  })
                }
                className="flex flex-1 items-center justify-center gap-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
              <button
                onClick={() =>
                  setSelectedNode((prev) => {
                    const ids = [...OVERVIEW_NODES, ...SIDE_NODES].map((node) => node.id)
                    const index = ids.indexOf(prev)
                    return ids[Math.min(ids.length - 1, index + 1)]
                  })
                }
                className="flex flex-1 items-center justify-center gap-1 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-slate-700"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="bg-white p-6 md:overflow-y-auto md:p-8">
            <div className="relative h-full min-h-[640px] overflow-hidden rounded-[26px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#fafaf9)] p-5 shadow-inner md:min-h-0">
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedNode}-${selectedMixerView}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="relative h-full overflow-y-auto"
                >
                  {renderNodeDetail()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
