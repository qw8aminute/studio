import React, { useEffect, useMemo, useRef } from 'react'
import { Parallax, ParallaxLayer } from '@react-spring/parallax'
import * as d3 from 'd3'
import QSTULogo from '../../Header/QSTULogo/QSTULogo'
import './ExperimentTerminal.css'

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
      'calcQon transforms messy regional crises—water rights, housing allocation, energy grids—into structured optimization problems. It picks the right quantum or hybrid solver so teams can test scenarios before committing real dollars. Decision modeling that bridges human intuition with computational precision.',
    Visual: CalcQonVisual,
  },
  {
    id: 'drumcanon',
    name: 'Drum Canon',
    url: 'drumcanon.org',
    fullUrl: 'https://drumcanon.org',
    tagline: 'music therapy',
    description:
      "Drum Canon explores rhythm as medicine. Turn any tap, hum, or movement into music—instantly. We're researching how drumming patterns support cognitive health, emotional regulation, and human connection. Music without barriers, therapy without stigma.",
    Visual: DrumCanonVisual,
  },
]

/* ========== SNAP + PARALLAX ========== */

const SNAP_DEBOUNCE_MS = 140

// Minimal local type: enough for scrollTo + container.current
type ParallaxApi = {
  scrollTo: (page: number) => void
  container?: { current: HTMLElement | null }
}

export default function ExperimentTerminal() {
  const parallaxRef = useRef<ParallaxApi | null>(null)

  const scrollToPage = (pageIndex: number) => {
    parallaxRef.current?.scrollTo(pageIndex)
  }

  useEffect(() => {
    const el = parallaxRef.current?.container?.current
    if (!el) return

    let t: number | null = null
    const onScroll = () => {
      if (t) window.clearTimeout(t)
      t = window.setTimeout(() => {
        const pageH = el.clientHeight || 1
        const raw = el.scrollTop / pageH
        const nearest = Math.round(raw)
        scrollToPage(nearest)
      }, SNAP_DEBOUNCE_MS)
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (t) window.clearTimeout(t)
      el.removeEventListener('scroll', onScroll as any)
    }
  }, [])

  return (
    <div className="experiment-terminal">
      <Parallax ref={parallaxRef as any} pages={PROJECTS.length + 1}>
        <ParallaxLayer offset={0} speed={0} factor={PROJECTS.length + 1} className="experiment-stars" />

        {Array.from({ length: PROJECTS.length + 1 }, (_, i) => (
          <React.Fragment key={`bg-${i}`}>
            <ParallaxLayer offset={i} speed={0.06} className="page-shell page-shell--back" />
            <ParallaxLayer offset={i} speed={0.12} className="page-shell page-shell--mid" />
            <ParallaxLayer offset={i} speed={0.18} className="page-shell page-shell--front" />
          </React.Fragment>
        ))}

        {/* INTRO */}
        <ParallaxLayer offset={0} speed={0.18} className="experiment-page experiment-page-intro">
          <div className="page-inner">
            <div className="page-topbar">
              <span className="page-chip">THE EXPERIMENT</span>
            </div>

            <div className="intro-center">
              <div className="experiment-logo-wrap">
                <QSTULogo />
              </div>

              <h1 className="experiment-heading">Experiments</h1>
              <p className="experiment-lead">Side projects, explorations, and things I'm building in the open.</p>

              <div className="project-dots">
                {PROJECTS.map((p, i) => (
                  <button
                    key={p.id}
                    className="project-dot-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      scrollToPage(i + 1)
                    }}
                  >
                    {p.name}
                  </button>
                ))}
              </div>

              <div className="scroll-hint" onClick={() => scrollToPage(1)}>
                <div className="scroll-arrow">↓</div>
              </div>
            </div>
          </div>
        </ParallaxLayer>

        {/* PROJECT PAGES */}
        {PROJECTS.map((project, index) => {
          const ProjectVisual = project.Visual
          const page = index + 1

          return (
            <React.Fragment key={project.id}>
              <ParallaxLayer offset={page} speed={0.22} className="experiment-page">
                <div className="page-inner">
                  <div className="page-topbar">
                    <button className="page-chip page-chip--ghost" onClick={() => scrollToPage(0)}>
                      THE EXPERIMENT
                    </button>

                    <div className="page-nav">
                      {PROJECTS.map((p, i) => (
                        <button
                          key={p.id}
                          className={`nav-dot ${i === index ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            scrollToPage(i + 1)
                          }}
                          aria-label={`Go to ${p.name}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="project-grid">
                    <div className="project-left">
                      <div className="project-copy">
                        <span className="project-tagline">{project.tagline}</span>
                        <h2 className="project-name">{project.name}</h2>
                        <p className="project-description">{project.description}</p>

                        <a className="project-cta" href={project.fullUrl} target="_blank" rel="noopener noreferrer">
                          Explore full site →
                        </a>
                      </div>

                      <div className="project-snippet">
                        <ProjectVisual />
                      </div>
                    </div>

                    <div className="project-right">
                      <div className="project-iframe-container">
                        <div className="iframe-header">
                          <div className="iframe-dots">
                            <span className="iframe-dot red" />
                            <span className="iframe-dot yellow" />
                            <span className="iframe-dot green" />
                          </div>
                          <span className="iframe-url">{project.url}</span>
                        </div>

                        <iframe src={project.fullUrl} title={project.name} className="project-iframe" loading="lazy" />

                        <a
                          href={project.fullUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="iframe-overlay-link"
                        >
                          Visit {project.url} →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </ParallaxLayer>

              <ParallaxLayer offset={page} speed={-0.08} className="page-float-accent" />
            </React.Fragment>
          )
        })}
      </Parallax>
    </div>
  )
}
