import { useEffect, useRef } from 'react'
import './ForceGraph.css'

export type ForceGraphProps = {
  onNodeSelect?: (id: string) => void
}

interface LetterNode {
  id: string
  char: string
  x: number
  y: number
  targetX: number
  targetY: number
  vx: number
  vy: number
  startTime: number
  visible: boolean
  color: string
  trail: { x: number; y: number }[]
}

export default function ForceGraph({ onNodeSelect }: ForceGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const getSize = () => {
      const rect = canvas.getBoundingClientRect()
      return { width: rect.width, height: rect.height }
    }

    resize()
    window.addEventListener('resize', resize)

    let { width, height } = getSize()

    const text = "QUAITE'STUDIO"
    const nodes: LetterNode[] = []
    const links: { source: string; target: string; startTime: number }[] = []

    const getFontSize = () => {
      if (width < 200) return 14
      if (width < 300) return 18
      if (width < 400) return 22
      return 26
    }

    const getLetterSpacing = () => {
      if (width < 200) return 12
      if (width < 300) return 16
      if (width < 400) return 22
      return 28
    }

    const initNodes = () => {
      nodes.length = 0
      links.length = 0

      ;({ width, height } = getSize())
      const fontSize = getFontSize()
      const letterSpacing = getLetterSpacing()
      const totalWidth = (text.length - 1) * letterSpacing

      const padding = fontSize
      const availableWidth = width - padding * 2
      const scale = Math.min(1, availableWidth / totalWidth)
      const adjustedSpacing = letterSpacing * scale
      const adjustedTotalWidth = (text.length - 1) * adjustedSpacing

      text.split('').forEach((char, i) => {
        const startTime = i * 80
        const targetX =
          padding + (width - padding * 2 - adjustedTotalWidth) / 2 + i * adjustedSpacing

        const t = i / text.length
        const tealColor = `hsl(${180 + t * 10}, ${45 + t * 15}%, ${50 + t * 15}%)`

        nodes.push({
          id: `char-${i}`,
          char,
          x: width / 2 + (Math.random() - 0.5) * Math.min(200, width * 0.5),
          y: height / 2 + (Math.random() - 0.5) * Math.min(40, height * 0.3),
          targetX,
          targetY: height / 2,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 0.5,
          startTime,
          visible: false,
          color: tealColor,
          trail: [],
        })

        if (i > 0) {
          links.push({
            source: `char-${i - 1}`,
            target: `char-${i}`,
            startTime,
          })
        }
      })
    }

    initNodes()

    let time = 0
    const animationDuration = 2500

    const animate = () => {
      time += 16
      ;({ width, height } = getSize())

      const fontSize = getFontSize()
      const padding = fontSize * 0.5

      ctx.clearRect(0, 0, width, height)

      nodes.forEach((node) => {
        if (time >= node.startTime) node.visible = true
      })

      const visibleNodes = nodes.filter((n) => n.visible)

      visibleNodes.forEach((node) => {
        const dx = node.targetX - node.x
        const dy = node.targetY - node.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist > 0.3) {
          const force = Math.min(dist * 0.1, 3)
          node.vx += (dx / dist) * force
          node.vy += (dy / dist) * force
        }

        visibleNodes.forEach((other) => {
          if (other.id === node.id) return
          const ddx = node.x - other.x
          const ddy = node.y - other.y
          const dd = Math.sqrt(ddx * ddx + ddy * ddy)
          if (dd < 40 && dd > 0) {
            const repel = (40 - dd) * 0.15
            node.vx += (ddx / dd) * repel
            node.vy += (ddy / dd) * repel
          }
        })

        node.vx *= 0.85
        node.vy *= 0.85
        node.x += node.vx
        node.y += node.vy

        node.x = Math.max(padding, Math.min(width - padding, node.x))
        node.y = Math.max(padding, Math.min(height - padding, node.y))

        node.trail.push({ x: node.x, y: node.y })
        if (node.trail.length > 6) node.trail.shift()
      })

      links.forEach((link) => {
        const source = nodes.find((n) => n.id === link.source)
        const target = nodes.find((n) => n.id === link.target)

        if (source?.visible && target?.visible && time >= link.startTime) {
          const opacity = Math.min(1, (time - link.startTime) / 300)
          const gradient = ctx.createLinearGradient(source.x, source.y, target.x, target.y)
          gradient.addColorStop(0, source.color)
          gradient.addColorStop(1, target.color)

          ctx.beginPath()
          ctx.moveTo(source.x, source.y)
          ctx.lineTo(target.x, target.y)
          ctx.strokeStyle = gradient
          ctx.globalAlpha = opacity * 0.5
          ctx.lineWidth = 1.5
          ctx.stroke()
          ctx.globalAlpha = 1
        }
      })

      visibleNodes.forEach((node) => {
        const opacity = Math.min(1, (time - node.startTime) / 300)
        const settled = Math.abs(node.vx) < 0.05 && Math.abs(node.vy) < 0.05

        node.trail.forEach((pos, idx) => {
          const t = idx / node.trail.length
          ctx.shadowBlur = 8 * (1 - t)
          ctx.shadowColor = node.color
          ctx.globalAlpha = opacity * 0.15 * t
          ctx.font = `bold ${fontSize}px system-ui`
          ctx.fillStyle = node.color
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(node.char, pos.x, pos.y)
        })

        ctx.shadowBlur = settled ? 12 : 8
        ctx.shadowColor = node.color
        ctx.globalAlpha = opacity
        ctx.fillStyle = node.color
        ctx.font = `bold ${fontSize}px system-ui`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(node.char, node.x, node.y)

        ctx.shadowBlur = 0
        ctx.globalAlpha = 1
      })

      if (time < animationDuration) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animate()

    const handleResize = () => {
      resize()
      const newSize = getSize()
      if (Math.abs(newSize.width - width) > 50) {
        time = 0
        initNodes()
      }
    }

    window.addEventListener('resize', handleResize)

    // (Optional) later: pointer handler that calls onNodeSelect?.('ABOUT') etc.

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('resize', handleResize)
    }
  }, [onNodeSelect])

  return <canvas ref={canvasRef} className="force-graph" />
}
