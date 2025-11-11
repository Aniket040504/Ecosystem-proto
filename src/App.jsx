import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

// Animated counter component
const AnimatedCounter = ({ value, duration = 2 }) => {
  const [displayValue, setDisplayValue] = useState(0)
  const numValue = parseFloat(value.replace(/[^\d.]/g, ''))

  useEffect(() => {
    let startTime = null
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
      setDisplayValue(Math.floor(progress * numValue))
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplayValue(numValue)
      }
    }
    requestAnimationFrame(animate)
  }, [numValue, duration])

  if (value.includes('M')) return <span>{displayValue}M</span>
  if (value.includes('x')) return <span>{displayValue.toFixed(1)}x</span>
  if (value.includes('%')) return <span>{displayValue}%</span>
  return <span>{displayValue}</span>
}

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showGlobe, setShowGlobe] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  const navItems = [
    { label: 'Vision', href: '#vision' },
    { label: 'Objectives', href: '#objectives' },
    { label: 'Insights', href: '#insights' },
    { label: 'Future', href: '#future' },
  ]

  const objectives = [
    {
      title: 'Integrate multi-domain datasets',
      detail: 'Harmonize climate, health, and pollution feeds into a unified knowledge graph.',
      icon: '🧬',
    },
    {
      title: 'Enable correlation analysis',
      detail: 'Detect signal links between emissions, microplastics, and human health outcomes.',
      icon: '📈',
    },
    {
      title: 'Support policy planning',
      detail: 'Surface foresight dashboards tailored for resilient, people-first policies.',
      icon: '🏛️',
    },
    {
      title: 'Bridge science & health research',
      detail: 'Provide shared evidence hubs for scientists, clinicians, and civic leaders.',
      icon: '🔬',
    },
  ]

  const architectureLayers = [
    {
      id: '1️⃣',
      title: 'Data Collection',
      description:
        'IoT sensors, satellite feeds, and global health registries ingest raw climate and plastic metrics.',
    },
    {
      id: '2️⃣',
      title: 'Data Processing',
      description:
        'Streamed data is cleansed, harmonized, and enriched with contextual ontologies for cross-domain comparability.',
    },
    {
      id: '3️⃣',
      title: 'Analytics Engine',
      description:
        'AI and systems modeling uncover co-variances between pollutants, climate drivers, and health outcomes.',
    },
    {
      id: '4️⃣',
      title: 'Visualization Layer',
      description:
        'Adaptive dashboards highlight trends, hotspots, and projected trajectories with real-time updates.',
    },
    {
      id: '5️⃣',
      title: 'Output & Policy',
      description:
        'Insights translate into policy briefs, public advisories, and scenario planning for 2030 goals.',
    },
  ]

  const timeline = [
    {
      year: '2025',
      focus: 'Global onboarding of climate, plastic, and health partners',
      icon: '🌐',
    },
    {
      year: 'Predictive AI',
      focus: 'Deploy hybrid climate-health prediction engines',
      icon: '🤖',
    },
    {
      year: 'Real-time Integration',
      focus: 'Fuse live satellite, oceanic, and clinical dashboards',
      icon: '🛰️',
    },
    {
      year: '2030 Policy Goals',
      focus: 'Inform resilient policies and sustainable supply chains',
      icon: '📜',
    },
  ]

  const insightData = [
    { year: 1990, temperature: 0.3, plastic: 110 },
    { year: 1995, temperature: 0.35, plastic: 150 },
    { year: 2000, temperature: 0.41, plastic: 210 },
    { year: 2005, temperature: 0.47, plastic: 290 },
    { year: 2010, temperature: 0.56, plastic: 360 },
    { year: 2015, temperature: 0.63, plastic: 440 },
    { year: 2020, temperature: 0.74, plastic: 520 },
    { year: 2025, temperature: 0.82, plastic: 615 },
  ]

  const healthImpactData = [
    { layer: 'Coastal', exposure: 52, co2: 28 },
    { layer: 'Urban', exposure: 66, co2: 41 },
    { layer: 'Freshwater', exposure: 48, co2: 22 },
    { layer: 'Arctic', exposure: 38, co2: 18 },
  ]

  const insightStats = [
    {
      value: '8M',
      unit: 'tonnes',
      label: 'Plastic enters oceans annually',
      note: 'Real-time ingestion calibrates counter-measures.',
    },
    {
      value: '2.6x',
      unit: 'rise',
      label: 'Microplastic exposure since 2000',
      note: 'Linked to respiratory and endocrine stressors.',
    },
    {
      value: '74%',
      unit: 'alignment',
      label: 'CO2 spikes align with plastic output',
      note: 'Highlights the carbon-polymer production feedback loop.',
    },
  ]

  const tickerMessages = [
    'Global Microplastic Exposure Index up 2.6x since 2000',
    'Satellite Ocean Watch: New plastic gyre detected (South Pacific)',
    'Predictive AI flags high-risk respiratory clusters in coastal cities',
    'Policy pulse: 2030 plastics treaty draft enters consultation phase',
  ]

  const floatingIcons = [
    { icon: '🤖', className: 'top-40 left-[6%]' },
    { icon: '🛰️', className: 'top-24 right-[8%]' },
    { icon: '🌡️', className: 'bottom-36 left-[18%]' },
    { icon: '🩺', className: 'bottom-28 right-[14%]' },
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    const plastic = payload.find((item) => item.dataKey === 'plastic')
    const temperature = payload.find((item) => item.dataKey === 'temperature')

    return (
      <div className="p-3 text-xs border shadow-lg rounded-xl border-emerald-200 bg-white/95 text-slate-800 backdrop-blur">
        <p className="text-sm font-semibold text-emerald-700">{label}</p>
        <p>Plastic Production: {plastic?.value} Mt</p>
        <p>Global Temperature: {temperature?.value.toFixed(2)} degC anomaly</p>
        <p className="mt-2 text-emerald-600">
          Microplastic rise correlates with CO₂ levels
        </p>
      </div>
    )
  }

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    const exposure = payload.find((item) => item.dataKey === 'exposure')
    const co2 = payload.find((item) => item.dataKey === 'co2')

    return (
      <div className="p-3 text-xs border shadow-lg rounded-xl border-emerald-200 bg-white/92 text-slate-800 backdrop-blur">
        <p className="text-sm font-semibold">{label} systems</p>
        <p>Microplastic exposure: {exposure?.value} index</p>
        <p>CO2 burden: {co2?.value} Mt</p>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-slate-100 text-slate-900">
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        initial={{ backgroundPosition: '0% 50%' }}
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 35, ease: 'linear', repeat: Infinity }}
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(16,185,129,0.22), transparent 45%), radial-gradient(circle at 80% 30%, rgba(56,189,248,0.18), transparent 40%), radial-gradient(circle at 50% 80%, rgba(147,197,253,0.15), transparent 45%)',
          backgroundSize: '150% 150%',
        }}
      />
      <motion.div
        aria-hidden
        className="absolute rounded-full pointer-events-none -left-20 top-20 h-72 w-72 bg-gradient-to-r from-emerald-400/40 to-blue-500/20 blur-3xl"
        animate={{ y: [0, 25, -15, 0], rotate: [0, 6, -4, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute w-64 h-64 rounded-full pointer-events-none -right-12 bottom-16 bg-gradient-to-r from-cyan-400/30 to-purple-500/20 blur-3xl"
        animate={{ y: [0, -20, 10, 0], rotate: [0, -8, 6, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      {floatingIcons.map(({ icon, className }, index) => (
        <motion.span
          key={icon + index}
          aria-hidden
          className={`pointer-events-none absolute text-3xl sm:text-4xl ${className}`}
          animate={{
            y: [0, -12, 6, 0],
            rotate: [0, 4, -4, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{ duration: 10 + index * 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {icon}
        </motion.span>
      ))}
      {/* Additional floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          aria-hidden
          className="absolute w-2 h-2 rounded-full pointer-events-none bg-emerald-400/30"
          style={{
            left: `${15 + i * 12}%`,
            top: `${20 + (i % 3) * 30}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.sin(i) * 20, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        />
      ))}
      {/* Mouse parallax effect */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(16,185,129,0.1), transparent 40%)`,
        }}
      />

      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="sticky top-4 z-40 mx-auto mt-4 w-[calc(100%-2rem)] max-w-5xl rounded-full border border-emerald-200/60 bg-white/80 px-6 py-3 shadow-lg backdrop-blur sm:px-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-medium sm:text-base">
          <a href="#vision" className="flex items-center gap-2 font-semibold text-emerald-700">
            <img src="/src/assets/ChatGPT Image Nov 10, 2025, 11_56_38 PM.png" alt="Eco-Synergy Logo" className="object-cover w-8 h-8 rounded-full" />
            Eco-Synergy
          </a>
          <div className="flex justify-end flex-1 gap-4 sm:gap-6">
            {navItems.map((item, index) => (
              <motion.a
                key={item.href}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                whileHover={{
                  scale: 1.05,
                  y: -2,
                }}
                whileTap={{ scale: 0.95 }}
                className="relative px-3 py-1 overflow-hidden transition border border-transparent rounded-full text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <motion.span
                  className="absolute inset-0 rounded-full bg-emerald-100"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10">{item.label}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.nav>

      <div className="relative flex flex-col gap-20 px-6 pt-24 mx-auto max-w-7xl pb-28 sm:px-10 lg:px-12">
        <motion.header
          id="vision"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="grid gap-12 rounded-3xl border border-emerald-100/80 bg-white/70 p-10 shadow-xl backdrop-blur lg:grid-cols-[1.2fr,1fr] lg:items-center"
        >
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 px-4 py-1 text-sm font-medium tracking-wide border rounded-full border-emerald-100 bg-emerald-50 text-emerald-600">
             🌳 Eco-Synergy Insight Dashboard
            </p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8, ease: 'easeOut' }}
              className="text-3xl font-semibold text-slate-900 sm:text-4xl lg:text-5xl"
            >
              Integrating Climate, Plastic, and Health Data for Global
              Sustainability
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
              className="max-w-xl text-base text-slate-600 sm:text-lg"
            >
              Track the planetary pulse across oceans, air, and communities. The
              Eco-Synergy Dashboard unites multi-domain intelligence to surface
              the most actionable signal for people and planet.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8, ease: 'easeOut' }}
              className="px-5 py-4 text-sm border rounded-3xl border-emerald-200 bg-emerald-50 text-emerald-700 sm:text-base"
            >
              <span className="font-semibold text-emerald-800">Vision:</span>{' '}
              Bridging Climate, Plastic, and Health Data for Global Insight.
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1.1, ease: 'easeOut' }}
            className="relative h-64 overflow-hidden border shadow-2xl rounded-3xl border-emerald-100 bg-gradient-to-br from-slate-900/70 to-slate-900/40 backdrop-blur lg:h-80"
          >
            <motion.div
              className="absolute inset-0"
              initial={{ backgroundPosition: '0% 0%' }}
              animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              style={{
                backgroundImage:
                  'url(https://images.unsplash.com/photo-1465146633011-14f8e0781093?auto=format&fit=crop&w=1200&q=80)',
                backgroundSize: 'cover',
                filter: 'contrast(1.1) saturate(1.1)',
              }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/20 to-slate-950 opacity-80"
              initial={{ opacity: 0.7 }}
              animate={{ opacity: [0.6, 0.85, 0.6] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute flex items-center justify-center w-24 h-24 -translate-x-1/2 border rounded-full shadow-inner bottom-8 left-1/2 border-emerald-400/50 bg-emerald-500/20 shadow-emerald-500/40"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
            >
              <motion.div
                className="w-16 h-16 border rounded-full border-emerald-200/40 bg-gradient-to-br from-emerald-500/40 to-blue-400/30"
                animate={{
                  rotate: [0, -360],
                  scale: [1, 1.08, 1],
                }}
                transition={{
                  duration: 24,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>
          </motion.div>
        </motion.header>

        <section
          id="objectives"
          className="grid gap-6 p-8 border shadow-xl rounded-3xl border-emerald-100 bg-white/80 lg:grid-cols-4 lg:gap-8"
        >
          {objectives.map((objective, index) => (
            <motion.article
              key={objective.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.1, duration: 0.7, ease: 'easeOut' }}
              whileHover={{
                rotateX: 8,
                rotateY: -8,
                translateY: -12,
              }}
              className="relative p-6 overflow-hidden transition-transform border shadow-lg rounded-3xl border-emerald-100 bg-gradient-to-br from-white via-emerald-50/60 to-white"
            >
              <motion.div
                aria-hidden
                className="absolute inset-0 rounded-3xl"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.25 }}
                transition={{ duration: 0.4 }}
                style={{
                  background:
                    'linear-gradient(135deg, rgba(16,185,129,0.25), rgba(20,184,166,0.3))',
                }}
              />
              <motion.div
                className="absolute inset-0 opacity-0"
                whileHover={{ opacity: 1 }}
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                  backgroundSize: '200% 100%',
                }}
                animate={{
                  backgroundPosition: ['200% 0', '-200% 0'],
                }}
                transition={{
                  backgroundPosition: { duration: 2, repeat: Infinity, repeatDelay: 1 },
                  opacity: { duration: 0.4 },
                }}
              />
              <div className="relative z-10 flex flex-col h-full gap-4">
                <motion.span
                  className="text-2xl"
                  animate={{
                    y: [0, -8, 0],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    delay: index * 0.2,
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  {objective.icon}
                </motion.span>
                <motion.h3
                  className="text-lg font-semibold text-slate-900"
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {objective.title}
                </motion.h3>
                <p className="text-sm text-slate-600">
                  {objective.detail}
                </p>
              </div>
            </motion.article>
          ))}
        </section>

        <section
          id="architecture"
          className="p-10 border shadow-xl rounded-3xl border-emerald-100 bg-white/85 backdrop-blur"
        >
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-2xl font-semibold text-slate-900 sm:text-3xl"
          >
            5-Layer Architecture Flow
          </motion.h2>
          <p className="mt-3 text-sm text-slate-600">
            Data to Processing to Analytics to Visualization to Insights - each layer orchestrated to deliver timely, human-impacting intelligence.
          </p>
          <div className="grid gap-6 mt-8 lg:grid-cols-5">
            {architectureLayers.map((layer, index) => (
              <motion.div
                key={layer.id}
                className="relative flex flex-col gap-4 p-6 border shadow-lg rounded-3xl border-emerald-100 bg-gradient-to-br from-white via-emerald-50/60 to-white"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.15, duration: 0.7, ease: 'easeOut' }}
              >
                <motion.div
                  className="relative flex items-center justify-center w-12 h-12 text-xl border rounded-full border-emerald-300/70 bg-emerald-100 text-emerald-700"
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  whileHover={{ scale: 1.15, rotate: 360 }}
                >
                  <motion.div
                    className="absolute inset-0 border-2 rounded-full border-emerald-400"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                  />
                  {layer.id}
                </motion.div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {layer.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  {layer.description}
                </p>
                {index < architectureLayers.length - 1 && (
                  <motion.span
                    aria-hidden
                    className="absolute hidden w-10 h-10 -translate-y-1/2 border rounded-full -right-5 top-1/2 border-emerald-200 bg-emerald-50/80 lg:grid place-items-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1, rotate: [0, 6, -4, 0] }}
                    transition={{ delay: index * 0.2 + 0.4, duration: 1.2, repeat: Infinity, repeatType: 'mirror' }}
                  >
                    <svg
                      aria-hidden
                      className="w-5 h-5 text-emerald-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 12h14m0 0-5-5m5 5-5 5"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.span>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        <section
          id="insights"
          className="grid gap-10 rounded-3xl border border-emerald-100 bg-white/85 p-10 shadow-xl lg:grid-cols-[1.2fr,1fr] lg:items-start"
        >
          <motion.div
            className="p-8 border shadow-lg rounded-3xl border-emerald-100 bg-white/90"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
              Quantitative Insight Pulse
            </h2>
            <p className="mt-4 text-sm text-slate-600 sm:text-base">
              Plastic Production vs Global Temperature anomaly (1990 - 2025)
            </p>
            <motion.div
              className="w-full mt-8 h-72"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={insightData}>
                  <defs>
                    <linearGradient id="colorPlastic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient
                      id="colorTemperature"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.75} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 6"
                    stroke="rgba(148, 163, 184, 0.18)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="year"
                    tick={{ fill: 'rgb(148, 163, 184)', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    tick={{ fill: 'rgb(148, 163, 184)', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    label={{
                      value: 'Plastic (Mt)',
                      angle: -90,
                      position: 'insideLeft',
                      fill: 'rgba(226,232,240,0.8)',
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: 'rgb(148, 163, 184)', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    label={{
                      value: 'Temp Anomaly (degC)',
                      angle: 90,
                      position: 'insideRight',
                      fill: 'rgba(226,232,240,0.8)',
                      fontSize: 11,
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: 12,
                      color: '#0f172a',
                      marginBottom: 12,
                      paddingTop: 8,
                    }}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="plastic"
                    stroke="#34d399"
                    strokeWidth={3}
                    fill="url(#colorPlastic)"
                    name="Plastic Production (Mt)"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="temperature"
                    stroke="#38bdf8"
                    strokeWidth={3}
                    fill="url(#colorTemperature)"
                    name="Temperature Anomaly (°C)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
            
            {/* Toggleable Widget: Live Data Feed or Globe */}
            <motion.div
              className="p-5 mt-6 border shadow-md rounded-2xl border-emerald-200/60 bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/50 backdrop-blur"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
            >
              {/* Toggle Switch */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <motion.span
                    className="relative flex w-2 h-2"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping" />
                    <span className="relative w-2 h-2 rounded-full bg-emerald-500" />
                  </motion.span>
                  <span className="text-xs font-semibold tracking-wider uppercase text-emerald-700">
                    {showGlobe ? 'Global Heat Map' : 'Live Data Feed'}
                  </span>
                </div>
                
                {/* Toggle Button */}
                <button
                  onClick={() => setShowGlobe(!showGlobe)}
                  className="relative flex items-center w-32 overflow-hidden transition-colors border rounded-full h-7 bg-emerald-100 border-emerald-200 hover:bg-emerald-200"
                  aria-label="Toggle view"
                >
                  <motion.div
                    className="absolute inset-y-1 left-1 w-[calc(50%-0.5rem)] rounded-full bg-white shadow-sm"
                    animate={{
                      x: showGlobe ? 'calc(100% + 0.25rem)' : '0.25rem',
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                  <div className="relative flex items-center justify-around w-full text-xs font-medium">
                    <span className={`transition-colors ${showGlobe ? 'text-slate-500' : 'text-emerald-700'}`}>
                      📊
                    </span>
                    <span className={`transition-colors ${showGlobe ? 'text-emerald-700' : 'text-slate-500'}`}>
                      🌍
                    </span>
                  </div>
                </button>
              </div>

              {/* Conditional Content */}
              {showGlobe ? (
                /* Globe with Heat Map */
                <motion.div
                  key="globe"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full h-64 overflow-hidden rounded-xl"
                >
                  {/* Globe SVG */}
                  <svg
                    viewBox="0 0 400 400"
                    className="w-full h-full"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* Globe base circle */}
                    <circle
                      cx="200"
                      cy="200"
                      r="180"
                      fill="url(#globeGradient)"
                      stroke="#10b981"
                      strokeWidth="2"
                      opacity="0.3"
                    />
                    
                    {/* Gradient for globe */}
                    <defs>
                      <radialGradient id="globeGradient" cx="50%" cy="50%">
                        <stop offset="0%" stopColor="#1e40af" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.4" />
                      </radialGradient>
                      
                      {/* Heat zone gradients */}
                      <radialGradient id="heatZone1" cx="30%" cy="40%">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                      </radialGradient>
                      <radialGradient id="heatZone2" cx="70%" cy="50%">
                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                      </radialGradient>
                      <radialGradient id="heatZone3" cx="50%" cy="70%">
                        <stop offset="0%" stopColor="#eab308" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
                      </radialGradient>
                      <radialGradient id="heatZone4" cx="20%" cy="70%">
                        <stop offset="0%" stopColor="#dc2626" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Heat zones / Red zones */}
                    <motion.circle
                      cx="120"
                      cy="160"
                      r="45"
                      fill="url(#heatZone1)"
                      animate={{
                        r: [45, 50, 45],
                        opacity: [0.7, 0.9, 0.7],
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.circle
                      cx="280"
                      cy="200"
                      r="40"
                      fill="url(#heatZone2)"
                      animate={{
                        r: [40, 45, 40],
                        opacity: [0.6, 0.8, 0.6],
                      }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                    />
                    <motion.circle
                      cx="200"
                      cy="280"
                      r="35"
                      fill="url(#heatZone3)"
                      animate={{
                        r: [35, 40, 35],
                        opacity: [0.5, 0.7, 0.5],
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    />
                    <motion.circle
                      cx="80"
                      cy="280"
                      r="38"
                      fill="url(#heatZone4)"
                      animate={{
                        r: [38, 43, 38],
                        opacity: [0.8, 1, 0.8],
                      }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                    />

                    {/* Grid lines for globe effect */}
                    {[...Array(8)].map((_, i) => (
                      <motion.path
                        key={`lat-${i}`}
                        d={`M 20 ${40 + i * 40} Q 200 ${40 + i * 40} 380 ${40 + i * 40}`}
                        stroke="#10b981"
                        strokeWidth="0.5"
                        fill="none"
                        opacity="0.2"
                        animate={{
                          pathLength: [0, 1, 0],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                    {[...Array(6)].map((_, i) => (
                      <motion.path
                        key={`lon-${i}`}
                        d={`M ${60 + i * 60} 20 Q ${60 + i * 60} 200 ${60 + i * 60} 380`}
                        stroke="#10b981"
                        strokeWidth="0.5"
                        fill="none"
                        opacity="0.2"
                        animate={{
                          pathLength: [0, 1, 0],
                        }}
                        transition={{
                          duration: 5,
                          repeat: Infinity,
                          delay: i * 0.3,
                        }}
                      />
                    ))}

                    {/* Data points / Monitoring stations */}
                    {[
                      { x: 120, y: 320, label: 'High' },
                      { x: 280, y: 340, label: 'Medium' },
                      { x: 200, y: 370, label: 'Medium' },
                      { x: 80, y: 370, label: 'Critical' },
                    ].map((point, idx) => (
                      <g key={`point-${idx}`}>
                        <motion.circle
                          cx={point.x}
                          cy={point.y}
                          r="4"
                          fill="#ef4444"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.8, 1, 0.8],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: idx * 0.3,
                          }}
                        />
                        <motion.circle
                          cx={point.x}
                          cy={point.y}
                          r="8"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="1"
                          opacity="0.5"
                          animate={{
                            r: [8, 16, 8],
                            opacity: [0.5, 0, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: idx * 0.3,
                          }}
                        />
                      </g>
                    ))}
                  </svg>

                  {/* Legend */}
                  {/* Legend */}
<div className="absolute flex items-center justify-between px-3 py-2 text-xs translate-y-2 border rounded-lg bottom-1 left-4 right-4 bg-white/90 backdrop-blur border-emerald-200/50">
  <div className="flex items-center gap-4">
    <div className="flex items-center gap-1.5">
      <div className="w-3 h-3 bg-red-500 rounded-full" />
      <span className="text-slate-600">Critical</span>
    </div>
    <div className="flex items-center gap-1.5">
      <div className="w-3 h-3 bg-orange-500 rounded-full" />
      <span className="text-slate-600">High</span>
    </div>
    <div className="flex items-center gap-1.5">
      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
      <span className="text-slate-600">Medium</span>
    </div>
  </div>
  <span className="font-medium text-emerald-700">92 Countries Monitored</span>
</div>
</motion.div>

              ) : (
                /* Live Data Feed */
                <motion.div
                  key="data"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.span
                    className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium border border-emerald-200 float-right"
                    animate={{
                      boxShadow: [
                        '0 0 0 0 rgba(16, 185, 129, 0.4)',
                        '0 0 0 4px rgba(16, 185, 129, 0)',
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                  >
                    LIVE
                  </motion.span>
                  
                  <div className="mt-2 space-y-3">
                    <motion.div
                      className="flex items-start gap-3 text-sm"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1, duration: 0.5 }}
                    >
                      <span className="text-lg">🌊</span>
                      <div className="flex-1">
                        <p className="font-medium text-slate-700">
                          Plastic drift index
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Rising by <span className="font-semibold text-emerald-600">+0.8%</span> this hour
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      className="flex items-start gap-3 text-sm"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      <span className="text-lg">🌡️</span>
                      <div className="flex-1">
                        <p className="font-medium text-slate-700">
                          Ocean surface temperature
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Anomaly: <span className="font-semibold text-blue-600">+0.03°C</span>
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      className="flex items-start gap-3 text-sm"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <span className="text-lg">🧫</span>
                      <div className="flex-1">
                        <p className="font-medium text-slate-700">
                          Microplastic detections
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          <span className="font-semibold text-emerald-600">+12 samples/hr</span> across monitoring stations
                        </p>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Global Impact Indicator */}
                  <motion.div
                    className="pt-4 mt-4 border-t border-emerald-200/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🌍</span>
                        <span className="text-xs font-medium text-slate-600">
                          Global Signal Coverage
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-emerald-700">
                        92 Countries
                      </span>
                    </div>
                    <div className="mt-2 relative h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                        initial={{ width: 0 }}
                        animate={{ width: '92%' }}
                        transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
                      />
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
          <div className="flex flex-col gap-6">
            <motion.div
              className="p-6 border shadow-lg rounded-3xl border-emerald-100 bg-white/90"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.1, duration: 0.8, ease: 'easeOut' }}
            >
              <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <h3 className="mb-1 text-lg font-semibold text-slate-900">
                    Regional Exposure Signal
                  </h3>
                  <p className="text-sm text-slate-600">
                    Microplastic vs CO2 burden by system layer
                  </p>
                </div>
                <motion.span
                  className="relative rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 overflow-hidden shrink-0"
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(16, 185, 129, 0.4)',
                      '0 0 0 8px rgba(16, 185, 129, 0)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                >
                  <motion.span
                    className="absolute inset-0 bg-emerald-200/30"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                  <span className="relative z-10 flex items-center gap-1">
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      📊
                    </motion.span>{' '}
                    Realtime
                  </span>
                </motion.span>
              </div>
              <div className="w-full mt-4 h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={healthImpactData} barCategoryGap="18%">
                    <CartesianGrid
                      strokeDasharray="4 6"
                      stroke="rgba(148, 163, 184, 0.35)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="layer"
                      tick={{ fill: 'rgb(100,116,139)', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: 'rgb(100,116,139)', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomBarTooltip />} />
                    <Legend
                      verticalAlign="top"
                      align="left"
                      iconType="circle"
                      wrapperStyle={{ fontSize: 12, color: '#0f172a', marginBottom: 12 }}
                    />
                    <Bar dataKey="exposure" fill="#34d399" radius={[12, 12, 4, 4]} />
                    <Bar dataKey="co2" fill="#38bdf8" radius={[12, 12, 4, 4]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
            <motion.div
              className="p-6 border shadow-lg rounded-3xl border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/70"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-12 h-12 text-2xl bg-white border rounded-full border-emerald-200">
                  🔎
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Insight Highlights
                  </h3>
                  <p className="text-sm text-slate-600">
                    Correlations surfaced by the analytics engine
                  </p>
                </div>
              </div>
              <div className="grid gap-4 mt-5 sm:grid-cols-3">
                {insightStats.map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    className="p-4 border shadow-sm rounded-2xl border-emerald-100 bg-white/90"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ delay: idx * 0.1, duration: 0.6, ease: 'easeOut' }}
                    whileHover={{ y: -6, scale: 1.02 }}
                  >
                    <motion.span
                      aria-hidden
                      className="inline-flex items-center justify-center w-10 h-10 mb-3 border rounded-full border-emerald-200 bg-emerald-50"
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 2.8, repeat: Infinity, delay: idx * 0.2 }}
                    >
                      <span className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-sky-400" />
                    </motion.span>
                    <motion.p
                      className="text-2xl font-semibold text-emerald-600"
                      initial={{ scale: 0.95, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ delay: 0.15 + idx * 0.1, duration: 0.5 }}
                    >
                      <AnimatedCounter value={stat.value} duration={2 + idx * 0.3} />{' '}
                      <span className="text-xs font-medium align-top text-emerald-500">
                        {stat.unit}
                      </span>
                    </motion.p>
                    <p className="mt-2 text-sm font-medium text-slate-700">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">{stat.note}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative py-3 overflow-hidden border rounded-full shadow-lg border-emerald-100 bg-white/80"
        >
          <motion.div
            className="flex gap-8 px-8 text-sm font-medium whitespace-nowrap text-emerald-700"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
          >
            {[...tickerMessages, ...tickerMessages].map((message, index) => (
              <motion.span
                key={message + index}
                className="flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.span
                  className="w-2 h-2 rounded-full bg-emerald-500"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                />
                {message}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex justify-center"
        >
          <div className="flex flex-wrap items-center justify-between w-full gap-4 p-6 text-sm border shadow-lg rounded-3xl border-emerald-100 bg-gradient-to-br from-white via-emerald-50 to-white text-slate-600 sm:gap-6 sm:p-8">
            <motion.div
              className="flex items-center gap-3"
              animate={{ rotate: [0, 4, -4, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="flex items-center justify-center w-12 h-12 text-2xl bg-white border rounded-full border-emerald-200">
                🌍
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">Climate Drivers</p>
                <p className="text-xs text-slate-500">Ocean temps, CO2, extreme events</p>
              </div>
            </motion.div>
            <motion.span
              className="hidden sm:block"
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg
                aria-hidden
                className="h-6 w-14 text-emerald-400"
                viewBox="0 0 160 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 12h152m0 0-10-7m10 7-10 7"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 12 14 5m-10 7 10 7"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.span>
            <motion.div
              className="flex items-center gap-3"
              animate={{ rotate: [0, -4, 4, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            >
              <span className="flex items-center justify-center w-12 h-12 text-2xl bg-white border rounded-full border-emerald-200">
                ♻️
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">Plastic Systems</p>
                <p className="text-xs text-slate-500">Production, leakage, microfibers</p>
              </div>
            </motion.div>
            <motion.span
              className="hidden sm:block"
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
            >
              <svg
                aria-hidden
                className="h-6 w-14 text-emerald-400"
                viewBox="0 0 160 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 12h152m0 0-10-7m10 7-10 7"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 12 14 5m-10 7 10 7"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.span>
            <motion.div
              className="flex items-center gap-3"
              animate={{ rotate: [0, 4, -4, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            >
              <span className="flex items-center justify-center w-12 h-12 text-2xl bg-white border rounded-full border-emerald-200">
                🫀
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">Health Outcomes</p>
                <p className="text-xs text-slate-500">Respiratory stress, endocrine response</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <section
          id="future"
          className="p-10 border shadow-xl rounded-3xl border-emerald-100 bg-white/85 backdrop-blur"
        >
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-2xl font-semibold text-slate-900 sm:text-3xl"
          >
            Future Scope
          </motion.h2>
          <p className="mt-3 text-sm text-slate-600">
            Roadmap from present tracking to 2030 policy outcomes - powered by predictive AI, real-time sensing, and collaborative science.
          </p>
          <div className="grid gap-6 mt-10 md:grid-cols-4">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                className="relative flex flex-col gap-4 p-6 border shadow-lg rounded-3xl border-emerald-100 bg-gradient-to-br from-white via-emerald-50/60 to-white"
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.15 + 0.1, duration: 0.7 }}
                whileHover={{ y: -12, rotate: -1.5 }}
              >
                <motion.span
                  className="text-3xl"
                  animate={{ y: [0, -6, 0], rotate: [0, 4, -4, 0] }}
                  transition={{ duration: 4 + index, repeat: Infinity }}
                >
                  {item.icon}
                </motion.span>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {item.year}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {item.focus}
                  </p>
                </div>
                {index < timeline.length - 1 && (
                  <motion.div
                    className="absolute hidden w-16 h-16 -translate-y-1/2 border rounded-full -right-3 top-1/2 border-emerald-200 bg-emerald-50/80 md:grid place-items-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 0.9, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.25, duration: 0.6 }}
                  >
                    <motion.span
                      aria-hidden
                      className="w-8 h-8 border rounded-full border-emerald-300/60"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.6, 1, 0.6],
                      }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        <footer className="relative mt-20 overflow-visible border shadow-xl rounded-3xl border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/60 text-slate-700">
          {/* Floating icons in footer */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute top-8 left-[8%] text-3xl sm:text-4xl z-0 opacity-60"
            animate={{
              y: [0, -12, 6, 0],
              rotate: [0, 4, -4, 0],
              scale: [1, 1.1, 0.95, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          >
            🤖
          </motion.span>
          <motion.span
            aria-hidden
            className="pointer-events-none absolute top-12 right-[10%] text-3xl sm:text-4xl z-0 opacity-60"
            animate={{
              y: [0, -12, 6, 0],
              rotate: [0, -4, 4, 0],
              scale: [1, 1.1, 0.95, 1],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          >
            🛰️
          </motion.span>
          <motion.span
            aria-hidden
            className="pointer-events-none absolute bottom-16 left-[15%] text-3xl sm:text-4xl z-0 opacity-60"
            animate={{
              y: [0, -12, 6, 0],
              rotate: [0, 4, -4, 0],
              scale: [1, 1.1, 0.95, 1],
            }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          >
            🌡️
          </motion.span>
          <motion.span
            aria-hidden
            className="pointer-events-none absolute bottom-12 right-[12%] text-3xl sm:text-4xl z-0 opacity-60"
            animate={{
              y: [0, -12, 6, 0],
              rotate: [0, -4, 4, 0],
              scale: [1, 1.1, 0.95, 1],
            }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          >
            🩺
          </motion.span>
          <div className="relative">
            <svg
              className="absolute top-0 w-full h-20"
              viewBox="0 0 1440 120"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <motion.path
                fill="#10b981"
                fillOpacity="0.15"
                d="M0,80L30,85.3C60,91,120,101,180,98.7C240,96,300,80,360,74.7C420,69,480,75,540,80C600,85,660,91,720,93.3C780,96,840,96,900,93.3C960,91,1020,85,1080,82.7C1140,80,1200,80,1260,82.7C1320,85,1380,91,1410,93.3L1440,96L1440,120L0,120Z"
                initial={{ d: 'M0,80L30,85.3C60,91,120,101,180,98.7C240,96,300,80,360,74.7C420,69,480,75,540,80C600,85,660,91,720,93.3C780,96,840,96,900,93.3C960,91,1020,85,1080,82.7C1140,80,1200,80,1260,82.7C1320,85,1380,91,1410,93.3L1440,96L1440,120L0,120Z' }}
                animate={{
                  d: [
                    'M0,80L30,85.3C60,91,120,101,180,98.7C240,96,300,80,360,74.7C420,69,480,75,540,80C600,85,660,91,720,93.3C780,96,840,96,900,93.3C960,91,1020,85,1080,82.7C1140,80,1200,80,1260,82.7C1320,85,1380,91,1410,93.3L1440,96L1440,120L0,120Z',
                    'M0,75L30,78.3C60,82,120,88,180,90.7C240,93,300,93,360,88.7C420,85,480,75,540,73.3C600,72,660,80,720,82.7C780,85,840,83,900,85.3C960,88,1020,93,1080,90.7C1140,88,1200,80,1260,78.7C1320,77,1380,83,1410,85.3L1440,88L1440,120L0,120Z',
                    'M0,80L30,85.3C60,91,120,101,180,98.7C240,96,300,80,360,74.7C420,69,480,75,540,80C600,85,660,91,720,93.3C780,96,840,96,900,93.3C960,91,1020,85,1080,82.7C1140,80,1200,80,1260,82.7C1320,85,1380,91,1410,93.3L1440,96L1440,120L0,120Z',
                  ],
                }}
                transition={{ duration: 8, ease: 'easeInOut', repeat: Infinity }}
              />
            </svg>
          </div>

          <div className="relative z-10 grid max-w-6xl gap-8 px-6 pt-16 pb-10 mx-auto text-sm md:grid-cols-3 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-slate-900">
                <span className="text-xl">🌿</span> Eco-Synergy Insight
              </h3>
              <p className="leading-relaxed text-slate-600">
                Advancing global understanding at the intersection of climate, plastic, and health through data-driven intelligence.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.1, duration: 0.6, ease: 'easeOut' }}
            >
              <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-slate-900">
                <span className="text-xl">🔗</span> Quick Links
              </h3>
              <ul className="space-y-2.5 text-slate-600">
                <li>
                  <a
                    href="#vision"
                    className="flex items-center gap-2 transition-colors duration-200 hover:text-emerald-600"
                  >
                    <span className="text-xs">→</span> Vision
                  </a>
                </li>
                <li>
                  <a
                    href="#objectives"
                    className="flex items-center gap-2 transition-colors duration-200 hover:text-emerald-600"
                  >
                    <span className="text-xs">→</span> Objectives
                  </a>
                </li>
                <li>
                  <a
                    href="#insights"
                    className="flex items-center gap-2 transition-colors duration-200 hover:text-emerald-600"
                  >
                    <span className="text-xs">→</span> Insights
                  </a>
                </li>
                <li>
                  <a
                    href="#future"
                    className="flex items-center gap-2 transition-colors duration-200 hover:text-emerald-600"
                  >
                    <span className="text-xs">→</span> Future Scope
                  </a>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
            >
              <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-slate-900">
                <span className="text-xl">🤝</span> Partners
              </h3>
              <p className="mb-5 leading-relaxed text-slate-600">
                Supported by:{' '}
                <span className="font-medium text-emerald-700">UNEP</span> ·{' '}
                <span className="font-medium text-emerald-700">WHO</span> ·{' '}
                <span className="font-medium text-emerald-700">IPCC</span> ·{' '}
                <span className="font-medium text-emerald-700">AI4Planet</span>
              </p>
              <p className="mb-5 text-xs text-slate-500">
                Contact:{' '}
                <a
                  href="mailto:info@ecosyn.org"
                  className="underline transition-colors text-emerald-600 hover:text-emerald-700"
                >
                  
                </a>
              </p>
              <div className="flex gap-3">
                <motion.a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center transition-colors bg-white border rounded-full h-9 w-9 border-emerald-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="GitHub"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </motion.a>
                <motion.a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center transition-colors bg-white border rounded-full h-9 w-9 border-emerald-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </motion.a>
                <motion.a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center transition-colors bg-white border rounded-full h-9 w-9 border-emerald-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </motion.a>
              </div>
            </motion.div>
          </div>

          <div className="relative z-10 px-6 pt-6 pb-6 mt-6 text-xs text-center border-t text-slate-500 border-emerald-200/60">
            <p className="flex flex-wrap items-center justify-center gap-2">
              © 2025 Eco-Synergy Insight
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-block"
              >
              </motion.span>{' '}
            </p>
          </div>

          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed z-50 flex items-center justify-center w-12 h-12 transition-all border rounded-full shadow-lg bottom-8 right-8 border-emerald-200 bg-white/90 text-emerald-600 backdrop-blur hover:bg-emerald-50 hover:border-emerald-300"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Back to top"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </motion.button>
        </footer>
      </div>
    </div>
  )
}

export default App
