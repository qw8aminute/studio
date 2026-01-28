import React, { useEffect, useMemo, useRef } from 'react'
import { Parallax, ParallaxLayer } from '@react-spring/parallax'
import type { IParallax } from '@react-spring/parallax'
import * as d3 from 'd3'
import QSTULogo from '../../Header/QSTULogo/QSTULogo'
import './OmegaloopsTerminal.css'

/* ========== MINI VISUALS ========== */

function ThirdAIVisual() {
  const paths = useMemo(() => {
    const result: string[] = []
    const cx = 150
    const cy = 100
    for (let i = 0; i < 8; i++) {
      const a = 2 + (i % 4)
      const b = 3 + ((i + 1) % 5)
      const ampX = 60 + i * 3
      const ampY = 40 + i * 2.5
      const rot = (i * Math.PI) / 28
      let d = 'M '
      for (let t = 0; t <= 360; t += 2) {
        const rad = (Math.PI * 2 * t) / 360
        const x0 = ampX * Math.sin(a * rad)
        const y0 = ampY * Math.sin(b * rad + Math.PI / 3)
        const x = x0 * Math.cos(rot) - y0 * Math.sin(rot) + cx
        const y = x0 * Math.sin(rot) + y0 * Math.cos(rot) + cy
        d += t === 0 ? `${x.toFixed(1)} ${y.toFixed(1)}` : ` L ${x.toFixed(1)} ${y.toFixed(1)}`
      }
      result.push(d)
    }
    return result
  }, [])

  return (
    <div className="project-visual thirdai-visual">
      <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid meet">
        <path
          d="M 20 100 Q 150 20 280 100 Q 150 180 20 100 Z"
          fill="none"
          stroke="rgba(242, 239, 232, 0.9)"
          strokeWidth="1.5"
          opacity="0.55"
        />
        {paths.map((d, idx) => (
          <path
            key={idx}
            d={d}
            fill="none"
            stroke="rgba(255, 255, 255, 0.8)"
            strokeWidth="1"
            className="spiro-path"
            style={{ animationDelay: `${idx * 0.22}s` }}
          />
        ))}
      </svg>
      <div className="do-not-press">DO NOT PRESS</div>
    </div>
  )
}

function CalcQonVisual() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const width = 360
    const height = 220
    const radius = 2.4

    const data: [number, number][] = []
    const theta = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < 620; i++) {
      const r = 3.2 * Math.sqrt(i)
      const a = theta * i
      data.push([width / 2 + r * Math.cos(a), height / 2 + r * Math.sin(a)])
    }

    d3.select(containerRef.current).selectAll('*').remove()

    let currentTransform: [number, number, number] = [width / 2, height / 2, height]
    const svg = d3
      .select(containerRef.current)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('width', '100%')
      .style('height', '100%')

    const g = svg.append('g')

    g.selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', ([x]) => x)
      .attr('cy', ([, y]) => y)
      .attr('r', radius)
      .attr('fill', (_, i) => d3.interpolateWarm(i / data.length))
      .attr('opacity', 0.92)

    function transform([x, y, r]: [number, number, number]) {
      return `translate(${width / 2}, ${height / 2}) scale(${height / r}) translate(${-x}, ${-y})`
    }

    let stop = false
    function transition() {
      if (stop) return
      const d = data[Math.floor(Math.random() * data.length)]
      const target: [number, number, number] = [d[0], d[1], radius * 2 + 1]
      const i = d3.interpolateZoom(currentTransform, target)

      g.transition()
        .delay(220)
        .duration(i.duration)
        .ease(d3.easeCubicInOut)
        .attrTween('transform', () => (t) => {
          currentTransform = i(t) as [number, number, number]
          return transform(currentTransform)
        })
        .on('end', transition)
    }

    transition()

    return () => {
      stop = true
      g.interrupt()
    }
  }, [])

  return <div ref={containerRef} className="project-visual calcqon-visual" />
}

function DrumCanonVisual() {
  const bars = Array.from({ length: 14 }, (_, i) => i)
  const colors = ['#86efac', '#67e8f9', '#c084fc', '#fb7185']

  return (
    <div className="project-visual drumcanon-visual">
      <div className="waveform-container">
        {bars.map((i) => (
          <div
            key={i}
            className="wave-bar"
            style={{
              animationDelay: `${i * 0.075}s`,
              background: `linear-gradient(180deg, ${colors[i % colors.length]} 0%, rgba(0,0,0,0) 100%)`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

/* ========== DATA ========== */

type Project = {
  id: string
  name: string
  url: string
  fullUrl: string
  tagline: string
  description: string
  Visual: React.FC
}

const PROJECTS: Project[] = [
  {
    id: 'thirdai',
    name: 'thirdAI',
    url: 'thethirdai.org',
    fullUrl: 'https://thethirdai.org',
    tagline: 'cooperative association',
    description:
      'thirdAI is a cooperative building privacy-first behavioral awareness tools. We help people see their own patterns—spending, screen time, sleep, stress—without selling their data to advertisers. Member-owned, ad-free, built for humans who want to understand themselves better.',
    Visual: ThirdAIVisual,
  },
  {
    id: 'calcqon',
    name: 'calcQon',
    url: 'calcqon.com',
    fullUrl: 'https://calcqon.com',
    tagline: 'quantum problem calculator',
    description:
      'calcQon transforms messy regional crises—water rights, housing allocation, energy grids—into structured optimization problems. It picks the right quantum or hybrid solver so teams can test scenarios before committing real dollars.',
    Visual: CalcQonVisual,
  },
  {
    id: 'drumcanon',
    name: 'Drum Canon',
    url: 'drumcanon.org',
    fullUrl: 'https://drumcanon.org',
    tagline: 'music therapy',
    description:
      "Drum Canon explores rhythm as medicine. Turn any tap, hum, or movement into music—instantly. We're researching how drumming patterns support cognitive health, emotional regulation, and human connection.",
    Visual: DrumCanonVisual,
  },
]

/* ========== MAIN COMPONENT ========== */

export default function ExperimentTerminal() {
  const parallaxRef = useRef<IParallax | null>(null)
  const totalPages = PROJECTS.length + 1

  const scrollToPage = (pageIndex: number) => {
    parallaxRef.current?.scrollTo(pageIndex)
  }

  // Snap to nearest page after user stops scrolling
  useEffect(() => {
    const el = parallaxRef.current?.container?.current
    if (!el) return

    let timeoutId: number | null = null

    const onScroll = () => {
      if (timeoutId) window.clearTimeout(timeoutId)

      timeoutId = window.setTimeout(() => {
        const pageH = el.clientHeight || 1
        const raw = el.scrollTop / pageH
        const nearest = Math.round(raw)

        // Only snap if they're meaningfully between pages
        if (Math.abs(raw - nearest) > 0.02) {
          scrollToPage(nearest)
        }
      }, 120)
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId)
      el.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div className="experiment-terminal">
      <Parallax ref={parallaxRef} pages={totalPages} className="experiment-parallax">
        {/* Background layers */}
        <ParallaxLayer offset={0} speed={0} factor={totalPages} className="layer-stars" />
        <ParallaxLayer
          offset={0.3}
          speed={0.06}
          factor={totalPages}
          className="layer-nebula layer-nebula--purple"
        />

        {/* ══════════════════ INTRO PAGE ══════════════════ */}
        <ParallaxLayer offset={0} speed={0.12} className="page-layer">
          <div className="page-content page-content--intro">
            <div className="intro-badge">OMEGALOOPS</div>

            <div className="intro-logo">
              <QSTULogo />
            </div>

            <h1 className="intro-title">Experiments</h1>
            <p className="intro-subtitle">
              Side projects, explorations, and things I'm building in the open.
            </p>

            <nav className="intro-nav">
              {PROJECTS.map((p, i) => (
                <button
                  key={p.id}
                  className="intro-nav-btn"
                  onClick={() => scrollToPage(i + 1)}
                >
                  {p.name}
                </button>
              ))}
            </nav>

            <button
              className="scroll-cue"
              onClick={() => scrollToPage(1)}
              aria-label="Scroll to first project"
            >
              <span className="scroll-cue-arrow">↓</span>
            </button>
          </div>
        </ParallaxLayer>

        {/* ══════════════════ PROJECT PAGES ══════════════════ */}
        {PROJECTS.map((project, index) => {
          const pageOffset = index + 1
          const Visual = project.Visual

          return (
            <React.Fragment key={project.id}>
              {/* Content layer */}
              <ParallaxLayer offset={pageOffset} speed={0.12} className="page-layer">
                <div className="page-content page-content--project">
                  <header className="project-header">
                    <button className="header-back" onClick={() => scrollToPage(0)}>
                      ← Experiments
                    </button>

                    <nav className="header-dots">
                      {PROJECTS.map((_, i) => (
                        <button
                          key={i}
                          className={`dot ${i === index ? 'dot--active' : ''}`}
                          onClick={() => scrollToPage(i + 1)}
                          aria-label={`Go to project ${i + 1}`}
                        />
                      ))}
                    </nav>
                  </header>

                  <div className="project-grid">
                    <div className="project-main">
                      <div className="project-copy">
                        <span className="project-tagline">{project.tagline}</span>
                        <h2 className="project-name">{project.name}</h2>
                        <p className="project-desc">{project.description}</p>

                        <a
                          href={project.fullUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-cta"
                        >
                          Explore {project.name} →
                        </a>
                      </div>

                      <div className="project-visual-wrap">
                        <Visual />
                      </div>
                    </div>

                    <div className="project-preview">
                      <div className="preview-window">
                        <div className="preview-titlebar">
                          <div className="preview-dots">
                            <span className="preview-dot preview-dot--red" />
                            <span className="preview-dot preview-dot--yellow" />
                            <span className="preview-dot preview-dot--green" />
                          </div>
                          <span className="preview-url">{project.url}</span>
                        </div>

                        <iframe
                          src={project.fullUrl}
                          title={project.name}
                          className="preview-iframe"
                          loading="lazy"
                        />

                        <a
                          href={project.fullUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="preview-overlay"
                        >
                          Visit {project.url} →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </ParallaxLayer>

              {/* Accent layer */}
              <ParallaxLayer offset={pageOffset} speed={-0.04} className="layer-accent">
                <div
                  className="accent-orb accent-orb--1"
                  style={{ ['--hue' as any]: index * 40 } as React.CSSProperties}
                />
                <div
                  className="accent-orb accent-orb--2"
                  style={{ ['--hue' as any]: index * 40 + 180 } as React.CSSProperties}
                />
              </ParallaxLayer>
            </React.Fragment>
          )
        })}
      </Parallax>
    </div>
  )
}
