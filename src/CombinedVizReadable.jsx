import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  ArrowDown,
  ArrowRight,
  Box,
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock,
  Cpu,
  FastForward,
  Layers,
  Plus,
  Waves,
} from 'lucide-react'

const STEPS = [
  {
    id: 'raw',
    title: '1. The Raw Action Grid',
    accent: '#3b82f6',
    Icon: Activity,
    desc: "We start with a noisy action trajectory. It is a 2D grid: 16 timesteps by 21 joints. At this stage every point is just one scalar action value.",
  },
  {
    id: 'projection',
    title: '2. Expanding to 3D',
    accent: '#6366f1',
    Icon: Box,
    desc: "Each scalar at position (time, joint) is projected into a 256-dimensional feature vector. The flat action grid becomes a richer hidden tensor with room to encode structure.",
  },
  {
    id: 'obs',
    title: '3. Injecting Observation',
    accent: '#a855f7',
    Icon: Camera,
    desc: "A ResNet turns camera image and robot state into a flat observation vector. That vector is projected to 256 dims and added to every time-joint slot as a shared bias.",
  },
  {
    id: 'time',
    title: '4. The Time Controller',
    accent: '#f59e0b',
    Icon: Clock,
    desc: "The ODE time t tells the policy how noisy the current actions still are. It becomes a 256-dimensional conditioning vector that stays separate from the tensor and later modulates each block.",
  },
  {
    id: 'entry',
    title: '5. Entering the Network',
    accent: '#14b8a6',
    Icon: FastForward,
    desc: "Now two streams move together through the model. The main tensor carries the action content, while the time condition vector runs in parallel and controls each mixer block.",
  },
  {
    id: 'mixing',
    title: '6. The 3-Axis Mixers',
    accent: '#10b981',
    Icon: Layers,
    desc: "Inside each block, three separate MLPs mix different physical axes. Time mixing smooths trajectories, joint mixing coordinates the robot body, and feature mixing recombines hidden context inside each slot.",
  },
  {
    id: 'adaln',
    title: '7. AdaLN-Zero Modulation',
    accent: '#ef4444',
    Icon: Cpu,
    desc: "The time vector generates scale, shift, and gate values for each axis. The gate starts at zero, so each block begins as identity and learns to turn on its residual updates gradually.",
  },
  {
    id: 'output',
    title: '8. Output Projection',
    accent: '#ec4899',
    Icon: ArrowDown,
    desc: "After the mixer stack, every 256-dimensional token is projected back down to one scalar. The output shape returns to 16 by 21 and is interpreted as the velocity field v(x, t).",
  },
  {
    id: 'flow',
    title: '9. Flow Matching Inference',
    accent: '#06b6d4',
    Icon: Waves,
    desc: "Starting from noise, we integrate the ODE over several Euler steps. Each step queries the mixer network, nudging the action grid toward a coherent trajectory that can be executed on the robot.",
  },
]

const JOINT_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#6366f1', '#a855f7']
const JOINT_NAMES = ['L.Shoulder', 'L.Elbow', 'L.Wrist', 'R.Shoulder', 'R.Elbow', 'R.Wrist', 'Gripper']
const MIX_CELL_SIZE = 32
const MIX_GAP = 4
const MIX_ACTIVE_COLUMN = 5
const MIX_ACTIVE_ROW = 3

function Arrow({ vertical = false, color = '#94a3b8', size = 36 }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center"
      style={{ flexDirection: vertical ? 'column' : 'row', width: vertical ? 10 : size, height: vertical ? size : 10 }}
    >
      <div
        style={{
          width: vertical ? 2 : size - 10,
          height: vertical ? size - 10 : 2,
          background: color,
          borderRadius: 999,
        }}
      />
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: vertical ? '4px solid transparent' : `7px solid ${color}`,
          borderRight: vertical ? '4px solid transparent' : 'none',
          borderTop: vertical ? `7px solid ${color}` : '4px solid transparent',
          borderBottom: vertical ? 'none' : '4px solid transparent',
        }}
      />
    </div>
  )
}

function Pill({ color, children }) {
  return (
    <div
      className="rounded-xl border px-3 py-1.5 text-xs font-semibold shadow-sm"
      style={{ borderColor: `${color}55`, background: `${color}12`, color }}
    >
      {children}
    </div>
  )
}

export default function CombinedVizReadable() {
  const [step, setStep] = useState(0)
  const [mixAxis, setMixAxis] = useState(0)
  const [flowT, setFlowT] = useState(0)
  const [autoFlow, setAutoFlow] = useState(false)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (step !== 5) return undefined
    const interval = setInterval(() => setMixAxis((prev) => (prev + 1) % 3), 2500)
    return () => clearInterval(interval)
  }, [step])

  useEffect(() => {
    const interval = setInterval(() => setTick((prev) => prev + 1), 220)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!autoFlow) return undefined
    if (flowT >= 6) {
      setAutoFlow(false)
      return undefined
    }
    const timer = setTimeout(() => setFlowT((prev) => prev + 1), 800)
    return () => clearTimeout(timer)
  }, [flowT, autoFlow])

  const curves = useMemo(() => {
    const noise = []
    const target = []
    for (let j = 0; j < 7; j += 1) {
      const n = []
      const t = []
      for (let i = 0; i < 16; i += 1) {
        n.push(Math.sin(j * 17.3 + i * 11.7) * 0.5 + Math.cos(j * 7.1 + i * 3.3) * 0.4)
        t.push(Math.sin(i * 0.38 + j * 1.2) * (0.2 + j * 0.08) + (j > 3 ? 0.12 : -0.08))
      }
      noise.push(n)
      target.push(t)
    }
    return { noise, target }
  }, [])

  const stepMeta = STEPS[step]
  const Icon = stepMeta.Icon
  const miniRows = 8
  const miniCols = 10
  const mixRows = 8
  const mixCols = 11

  const mixCellStyle = (r, c) => {
    const pulse =
      mixAxis === 0
        ? c === MIX_ACTIVE_COLUMN && tick % mixRows === r
        : mixAxis === 1
          ? r === MIX_ACTIVE_ROW && tick % mixCols === c
          : r === MIX_ACTIVE_ROW && c === MIX_ACTIVE_COLUMN
    const selected =
      mixAxis === 0
        ? c === MIX_ACTIVE_COLUMN
        : mixAxis === 1
          ? r === MIX_ACTIVE_ROW
          : r === MIX_ACTIVE_ROW && c === MIX_ACTIVE_COLUMN

    if (pulse) {
      return { background: ['#10b981', '#3b82f6', '#a855f7'][mixAxis], borderColor: 'transparent', transform: 'scale(1.06)' }
    }
    if (selected) {
      return { background: ['#d1fae5', '#dbeafe', '#f3e8ff'][mixAxis], borderColor: ['#10b981', '#3b82f6', '#a855f7'][mixAxis] }
    }
    return { background: '#ffffff', borderColor: '#cbd5e1' }
  }

  const renderRaw = () => (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6">
      <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Noisy action trajectory</div>
      <div className="flex items-start gap-2">
        <div className="pt-8 pr-2">
          {Array.from({ length: miniRows }).map((_, i) => (
            <div key={i} className="h-6 text-right font-mono text-[10px] leading-6 text-slate-500">
              t{i}
            </div>
          ))}
        </div>
        <div>
          <div className="mb-1 flex pl-1">
            {Array.from({ length: miniCols }).map((_, j) => (
              <div
                key={j}
                className="w-7 text-center font-mono text-[9px] font-bold"
                style={{ color: JOINT_COLORS[j < 3 ? 0 : j < 6 ? 3 : 6] }}
              >
                {j < 3 ? 'L' : j < 6 ? 'R' : 'G'}
                {(j % 3) + 1}
              </div>
            ))}
          </div>
          <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-2 shadow-lg">
            <div className="grid grid-cols-10 gap-1">
              {Array.from({ length: miniRows * miniCols }).map((_, i) => {
                const v = Math.sin(i * 0.81) * 0.5 + 0.5
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.015 }}
                    className="h-6 w-7 rounded-md bg-blue-500"
                    style={{ opacity: 0.18 + v * 0.52 }}
                  />
                )
              })}
            </div>
          </div>
          <div className="mt-2 text-center text-xs font-semibold text-blue-700">Joints (J = 21)</div>
        </div>
      </div>
      <div className="text-xs font-semibold text-slate-600" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', position: 'absolute', left: 22 }}>
        Time (T = 16)
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Pill color="#3b82f6">Shape: (Batch, 16, 21, 1)</Pill>
        <Pill color="#64748b">One cell = one scalar action value</Pill>
      </div>
    </div>
  )

  const renderProjection = () => (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8">
      <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Per-cell linear projection</div>
      <div className="flex flex-wrap items-center justify-center gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="text-sm font-semibold text-blue-700">Flat grid</div>
          <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-2 shadow-sm">
            <div className="grid grid-cols-6 gap-1">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="h-4 w-5 rounded-sm bg-blue-500/45" />
              ))}
            </div>
          </div>
          <div className="text-xs text-slate-500">T × J × 1</div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="text-sm font-bold text-indigo-600">Linear(1 → 256)</div>
          <Arrow color="#6366f1" size={56} />
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="text-sm font-semibold text-indigo-700">3D tensor</div>
          <div className="relative h-40 w-32">
            {[0, 1, 2, 3, 4, 5].map((layer) => (
              <motion.div
                key={layer}
                initial={{ x: 0, y: 0, opacity: 0 }}
                animate={{ x: layer * 8, y: -layer * 8, opacity: 1 - layer * 0.1 }}
                transition={{ delay: layer * 0.12 }}
                className="absolute h-32 w-24 rounded-xl border-2 border-indigo-500 bg-indigo-200 shadow-sm"
                style={{ zIndex: 10 - layer }}
              />
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="absolute -right-9 -top-7 text-right text-sm font-bold leading-tight text-indigo-700"
            >
              Features
              <br />
              (F = 256)
            </motion.div>
          </div>
          <div className="text-xs text-slate-500">T × J × F</div>
        </div>
      </div>
      <div className="max-w-xl rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-center text-sm text-slate-600">
        The time-joint layout is preserved. Only the depth of each cell expands so the network has space to store richer structure.
      </div>
    </div>
  )

  const renderObs = () => (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8">
      <div className="rounded-2xl border border-purple-200 bg-purple-50 px-5 py-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Camera className="h-8 w-8 text-purple-600" />
          <Arrow color="#c084fc" size={28} />
          <Pill color="#7c3aed">ResNet18</Pill>
          <Arrow color="#c084fc" size={28} />
          <Pill color="#a855f7">Project → 256</Pill>
          <Arrow color="#c084fc" size={28} />
          <Pill color="#9333ea">Broadcast bias</Pill>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <div className="text-sm font-semibold text-purple-700">Shared bias</div>
          <div className="relative flex h-28 w-10 items-center justify-center rounded-xl bg-purple-500 shadow-lg">
            <span className="rotate-[-90deg] whitespace-nowrap text-xs font-bold text-white">256 dims</span>
            <motion.div
              animate={{ x: [0, 48, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -right-10 text-purple-400"
            >
              <Plus />
            </motion.div>
          </div>
        </div>

        <div className="relative h-40 w-32">
          {[0, 1, 2, 3].map((layer) => (
            <div
              key={layer}
              className="absolute h-32 w-24 overflow-hidden rounded-xl border-2 border-indigo-500 bg-indigo-200 shadow-sm"
              style={{ zIndex: 10 - layer, transform: `translate(${layer * 8}px, ${-layer * 8}px)` }}
            >
              <motion.div
                animate={{ backgroundColor: ['rgba(168,85,247,0)', 'rgba(168,85,247,0.35)', 'rgba(168,85,247,0)'] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="h-full w-full"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-xl rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-center text-sm text-slate-600">
        The same observation vector is added to every time-joint slot. Nothing is joint-specific here yet, that structure gets learned later by the mixers.
      </div>
    </div>
  )

  const renderTime = () => (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8">
      <div className="rounded-2xl border border-orange-200 bg-orange-50 px-6 py-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-orange-400 bg-white text-xl font-bold text-orange-600 shadow-sm">
            t
          </div>
          <Arrow color="#fbbf24" size={32} />
          <div className="flex flex-col items-center gap-2">
            <Pill color="#f59e0b">Sinusoidal Embedding</Pill>
            <Pill color="#f59e0b">MLP (256 → 256)</Pill>
          </div>
          <Arrow color="#fbbf24" size={32} />
          <div className="flex h-24 w-12 items-center justify-center rounded-xl bg-orange-500 shadow-lg">
            <span className="rotate-[-90deg] whitespace-nowrap text-xs font-bold text-white">cond (256)</span>
          </div>
        </div>
      </div>

      <div className="max-w-xl rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-center text-sm text-slate-600">
        The time controller stays separate from the tensor. Think of it as a remote control that tells the network how aggressive the denoising should be at the current ODE step.
      </div>
    </div>
  )

  const renderEntry = () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-wrap items-center justify-center gap-10">
        <div className="flex flex-col gap-12">
          <div className="flex items-center gap-4">
            <div className="flex h-24 w-20 items-center justify-center rounded-2xl border-2 border-indigo-300 bg-indigo-500 shadow-lg">
              <Box className="text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-indigo-800">Main tensor</div>
              <div className="text-xs text-slate-500">(16, 21, 256)</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-10 w-20 items-center justify-center rounded-xl border-2 border-orange-300 bg-orange-500 shadow-lg">
              <Clock className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-orange-800">Time cond</div>
              <div className="text-xs text-slate-500">(256)</div>
            </div>
          </div>
        </div>

        <div className="relative h-44 w-28">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 180">
            <path d="M 0,30 C 50,30 50,90 100,90" fill="none" stroke="#6366f1" strokeWidth="4" strokeDasharray="8,4">
              <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="1s" repeatCount="indefinite" />
            </path>
            <path d="M 0,150 C 50,150 50,112 100,112" fill="none" stroke="#f97316" strokeWidth="4" strokeDasharray="8,4">
              <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="1s" repeatCount="indefinite" />
            </path>
          </svg>
        </div>

        <div className="relative h-52 w-40">
          {[5, 4, 3, 2, 1, 0].map((i) => (
            <div
              key={i}
              className="absolute flex h-32 w-24 items-center justify-center rounded-2xl border-2 border-emerald-500 bg-emerald-100 shadow-md"
              style={{ top: i * 10, left: i * 10, zIndex: 10 - i }}
            >
              {i === 0 ? (
                <span className="text-center text-xs font-bold text-emerald-800">
                  Mixer Block
                  <br />
                  1 of 6
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderMixing = () => {
    const axisMeta = [
      {
        name: 'Time Mix',
        color: '#10b981',
        dims: 'Linear(16 → 64) → GELU → Linear(64 → 16)',
        purpose: 'Same joint, all future timesteps',
      },
      {
        name: 'Joint Mix',
        color: '#3b82f6',
        dims: 'Linear(21 → 84) → GELU → Linear(84 → 21)',
        purpose: 'Same timestep, all joints',
      },
      {
        name: 'Feature Mix',
        color: '#a855f7',
        dims: 'Linear(256 → 1024) → GELU → Linear(1024 → 256)',
        purpose: 'Same cell, all hidden features',
      },
    ]

    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-6">
        <div className="flex flex-wrap justify-center gap-3">
          {axisMeta.map((axis, i) => (
            <button
              key={axis.name}
              onClick={() => setMixAxis(i)}
              className="rounded-full px-4 py-1.5 text-xs font-bold transition-colors"
              style={{
                background: mixAxis === i ? axis.color : '#f1f5f9',
                color: mixAxis === i ? '#ffffff' : '#64748b',
              }}
            >
              {i + 1}. {axis.name}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-4 shadow-inner">
            <div className="mb-2 ml-9 text-xs text-slate-500">joints →</div>
            <div className="flex">
              <div className="mr-2 flex flex-col justify-center text-[10px] text-slate-500" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                time →
              </div>
              <div className="relative grid grid-cols-11 gap-1">
                {Array.from({ length: mixRows * mixCols }).map((_, i) => {
                  const row = Math.floor(i / mixCols)
                  const col = i % mixCols
                  return (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-md border transition-all duration-150"
                      style={mixCellStyle(row, col)}
                    />
                  )
                })}
                {mixAxis === 0 ? (
                  <div
                    className="pointer-events-none absolute top-0 bottom-0 rounded-md border-2 border-emerald-500"
                    style={{
                      left: MIX_ACTIVE_COLUMN * (MIX_CELL_SIZE + MIX_GAP) - 1,
                      width: MIX_CELL_SIZE + 2,
                    }}
                  />
                ) : null}
                {mixAxis === 1 ? (
                  <div
                    className="pointer-events-none absolute left-0 right-0 rounded-md border-2 border-blue-500"
                    style={{
                      top: MIX_ACTIVE_ROW * (MIX_CELL_SIZE + MIX_GAP) - 1,
                      height: MIX_CELL_SIZE + 2,
                    }}
                  />
                ) : null}
              </div>
            </div>
          </div>

          <Arrow color="#94a3b8" size={34} />

          <div className="flex h-36 w-72 items-center rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={mixAxis}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-3"
              >
                <div className="text-sm font-bold" style={{ color: axisMeta[mixAxis].color }}>
                  {axisMeta[mixAxis].name} MLP
                </div>
                <div className="text-sm text-slate-700">{axisMeta[mixAxis].dims}</div>
                <div className="text-xs uppercase tracking-[0.14em] text-slate-400">What is being mixed</div>
                <div className="text-sm text-slate-600">{axisMeta[mixAxis].purpose}</div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    )
  }

  const renderAdaLN = () => (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Pill color="#f59e0b">Time cond (256)</Pill>
        <Arrow color="#94a3b8" size={28} />
        <Pill color="#111827">Linear(256 → 3)</Pill>
        <Arrow color="#94a3b8" size={28} />
        <div className="flex gap-2">
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
      </div>

      <div className="w-full max-w-3xl rounded-2xl border-2 border-slate-200 bg-slate-50 p-6">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Pill color="#6366f1">x</Pill>
          <Arrow color="#94a3b8" size={24} />
          <Pill color="#475569">LayerNorm</Pill>
          <Arrow color="#94a3b8" size={24} />
          <div className="rounded-xl border border-red-200 bg-white px-3 py-2 font-mono text-xs text-slate-700 shadow-sm">
            Norm(x) * (1 + <span className="font-bold text-red-600">γ</span>) + <span className="font-bold text-blue-600">β</span>
          </div>
          <Arrow color="#94a3b8" size={24} />
          <Pill color="#10b981">Mixing MLP</Pill>
          <Arrow color="#94a3b8" size={24} />
          <div className="rounded-xl border border-green-200 bg-white px-3 py-2 font-mono text-xs text-slate-700 shadow-sm">
            x + <span className="font-bold text-green-600">α</span> * mixed
          </div>
        </div>
      </div>

      <div className="max-w-2xl rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-center text-sm text-slate-600">
        This modulation happens for each axis inside each block. The key stabilizer is the gate α, which starts at zero so every block initially behaves like identity.
      </div>
    </div>
  )

  const renderOutput = () => (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8">
      <div className="flex flex-wrap items-center justify-center gap-8">
        <div className="relative h-32 w-24">
          {[0, 1, 2, 3].map((layer) => (
            <div
              key={layer}
              className="absolute h-28 w-20 rounded-xl border-2 border-emerald-500 bg-emerald-200 shadow-sm"
              style={{ zIndex: 10 - layer, transform: `translate(${layer * 6}px, ${-layer * 6}px)` }}
            />
          ))}
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="text-sm font-bold text-pink-600">Linear(256 → 1)</div>
          <Arrow color="#f472b6" size={56} />
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="rounded-2xl border-2 border-pink-300 bg-pink-50 p-2 shadow-lg">
            <div className="grid grid-cols-6 gap-1">
              {Array.from({ length: 24 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.35 + Math.abs(Math.sin(i)) * 0.55 }}
                  transition={{ delay: i * 0.03 }}
                  className="h-6 w-7 rounded-md bg-pink-400"
                />
              ))}
            </div>
          </div>
          <div className="text-sm font-bold text-pink-700">Velocity v (16 × 21)</div>
        </div>
      </div>
    </div>
  )

  const renderFlow = () => {
    const frac = flowT / 6

    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-6">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => {
              setFlowT(0)
              setAutoFlow(true)
            }}
            className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-bold text-white shadow-md transition hover:bg-cyan-600"
          >
            {autoFlow ? '● Playing' : '▶ Play'}
          </button>
          <input
            type="range"
            min={0}
            max={6}
            step={1}
            value={flowT}
            onChange={(e) => {
              setFlowT(Number(e.target.value))
              setAutoFlow(false)
            }}
            className="w-44 accent-cyan-500"
          />
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-cyan-700 shadow-sm">
            step {flowT}/6, t = {frac.toFixed(2)}
          </div>
        </div>

        <div className="w-full max-w-3xl rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm">
          <svg viewBox="0 0 380 170" className="block w-full">
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={i} x1={30} x2={370} y1={15 + i * 35} y2={15 + i * 35} stroke="#cbd5e1" strokeWidth={0.7} strokeDasharray="3,6" />
            ))}
            {curves.noise.map((curve, j) => {
              const points = curve
                .map((n, i) => {
                  const v = (1 - frac) * n + frac * curves.target[j][i]
                  return `${30 + (i / 15) * 340},${85 - v * 70}`
                })
                .join(' ')
              return <polyline key={j} points={points} fill="none" stroke={JOINT_COLORS[j]} strokeWidth={2.4} opacity={0.9} strokeLinejoin="round" strokeLinecap="round" />
            })}
            <rect x={32} y={5} width={126} height={24} rx={6} fill="#ffffff" fillOpacity={0.94} />
            <text x={40} y={20} fill={flowT === 0 ? '#ef4444' : flowT === 6 ? '#10b981' : '#06b6d4'} fontSize={11} fontWeight="bold" fontFamily="system-ui">
              {flowT === 0 ? 'Pure noise' : flowT === 6 ? 'Clean trajectory' : `Euler step ${flowT}/6`}
            </text>
            <text x={200} y={165} textAnchor="middle" fill="#64748b" fontSize={10} fontFamily="system-ui">
              horizon timestep (T = 16)
            </text>
          </svg>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {JOINT_NAMES.map((name, i) => (
            <span key={name} className="flex items-center gap-1 text-xs text-slate-500">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: JOINT_COLORS[i] }} />
              {name}
            </span>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-center text-sm text-slate-600">
          <code className="font-mono text-slate-800">x = x + MixerNet(x, t, obs) * (1/6)</code>
          <br />
          The network is queried repeatedly until the action grid has been sculpted from noise into a usable trajectory.
        </div>
      </div>
    )
  }

  const renderVisual = () => {
    switch (step) {
      case 0:
        return renderRaw()
      case 1:
        return renderProjection()
      case 2:
        return renderObs()
      case 3:
        return renderTime()
      case 4:
        return renderEntry()
      case 5:
        return renderMixing()
      case 6:
        return renderAdaLN()
      case 7:
        return renderOutput()
      case 8:
        return renderFlow()
      default:
        return null
    }
  }

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.12)]">
        <div className="flex h-2 w-full bg-slate-100">
          {STEPS.map((item, idx) => (
            <div
              key={item.id}
              className="h-full flex-1 transition-colors duration-300"
              style={{
                background: idx <= step ? item.accent : 'transparent',
                borderRight: idx < STEPS.length - 1 ? '1px solid rgba(255,255,255,0.55)' : 'none',
              }}
            />
          ))}
        </div>

        <div className="flex flex-1 flex-col md:flex-row">
          <div className="w-full border-b border-slate-200 bg-slate-50 p-8 md:w-[34%] md:border-b-0 md:border-r">
            <div className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <Icon className="h-6 w-6" style={{ color: stepMeta.accent }} />
            </div>

            <div className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Architecture walkthrough</div>
            <h2 className="mt-3 text-2xl font-bold leading-tight text-slate-800">{stepMeta.title}</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">{stepMeta.desc}</p>

            <div className="mt-8 flex flex-wrap gap-2">
              {STEPS.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setStep(idx)}
                  className="h-8 w-8 rounded-xl text-xs font-bold shadow-sm transition"
                  style={{
                    background: idx === step ? item.accent : '#ffffff',
                    color: idx === step ? '#ffffff' : '#64748b',
                    border: idx === step ? '1px solid transparent' : '1px solid #cbd5e1',
                  }}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                className="flex flex-1 items-center justify-center gap-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
              <button
                onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}
                disabled={step === STEPS.length - 1}
                className="flex flex-1 items-center justify-center gap-1 rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-md transition disabled:cursor-not-allowed disabled:opacity-40"
                style={{ background: stepMeta.accent }}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="relative flex min-h-[520px] flex-1 items-center justify-center overflow-hidden bg-white p-6 md:p-8">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3 }}
                className="relative flex h-full w-full items-center justify-center"
              >
                {renderVisual()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
