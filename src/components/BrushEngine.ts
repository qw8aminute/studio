/**
 * BrushEngine - Procedural brush rendering with multiple styles
 *
 * Brush styles:
 * - Smooth: Clean anti-aliased strokes with pressure sensitivity
 * - Rough: Jagged edges with random displacement
 * - Chalky: Grainy texture overlay with opacity variance
 * - Neon: Glowing strokes with color bleeding
 * - Marker: Flat semi-transparent strokes that layer
 * - Spray: Particle-based spray paint effect
 */

import type { BrushStyle, Point } from '../store/useStore'

export interface BrushSettings {
  style: BrushStyle
  size: number
  color: string
  opacity: number
}

// Procedural noise for texture generation
function noise2D(x: number, y: number, seed = 0): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453
  return n - Math.floor(n)
}

// Generate chalk/grain texture pattern
function generateGrainPattern(ctx: CanvasRenderingContext2D, width: number, height: number): ImageData {
  const imageData = ctx.createImageData(width, height)
  const data = imageData.data

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      const n = noise2D(x * 0.5, y * 0.5)
      const grain = n > 0.5 ? 255 : 0
      data[i] = grain
      data[i + 1] = grain
      data[i + 2] = grain
      data[i + 3] = n > 0.5 ? Math.floor(n * 100) : 0
    }
  }

  return imageData
}

// Parse hex color to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 }
}

// Catmull-Rom spline interpolation for smooth curves
function catmullRom(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const t2 = t * t
  const t3 = t2 * t

  return {
    x:
      0.5 *
      (2 * p1.x +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    y:
      0.5 *
      (2 * p1.y +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
    pressure: p1.pressure + (p2.pressure - p1.pressure) * t,
  }
}

// Get interpolated points along a path
function getInterpolatedPoints(points: Point[], segmentsPerPoint = 8): Point[] {
  if (points.length < 2) return points
  if (points.length < 4) {
    // Linear interpolation for short paths
    const result: Point[] = []
    for (let i = 0; i < points.length - 1; i++) {
      for (let t = 0; t < segmentsPerPoint; t++) {
        const ratio = t / segmentsPerPoint
        result.push({
          x: points[i].x + (points[i + 1].x - points[i].x) * ratio,
          y: points[i].y + (points[i + 1].y - points[i].y) * ratio,
          pressure: points[i].pressure + (points[i + 1].pressure - points[i].pressure) * ratio,
        })
      }
    }
    result.push(points[points.length - 1])
    return result
  }

  const result: Point[] = []

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)]
    const p1 = points[i]
    const p2 = points[Math.min(points.length - 1, i + 1)]
    const p3 = points[Math.min(points.length - 1, i + 2)]

    for (let t = 0; t < segmentsPerPoint; t++) {
      result.push(catmullRom(p0, p1, p2, p3, t / segmentsPerPoint))
    }
  }

  result.push(points[points.length - 1])
  return result
}

// BRUSH RENDERERS

function drawSmoothStroke(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  settings: BrushSettings
) {
  if (points.length < 2) return

  const interpolated = getInterpolatedPoints(points, 12)
  const { r, g, b } = hexToRgb(settings.color)

  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  for (let i = 1; i < interpolated.length; i++) {
    const prev = interpolated[i - 1]
    const curr = interpolated[i]
    const pressure = (prev.pressure + curr.pressure) / 2
    const width = settings.size * pressure

    ctx.beginPath()
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${settings.opacity * pressure})`
    ctx.lineWidth = width
    ctx.moveTo(prev.x, prev.y)
    ctx.lineTo(curr.x, curr.y)
    ctx.stroke()
  }
}

function drawRoughStroke(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  settings: BrushSettings
) {
  if (points.length < 2) return

  const interpolated = getInterpolatedPoints(points, 6)
  const { r, g, b } = hexToRgb(settings.color)

  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  for (let i = 1; i < interpolated.length; i++) {
    const prev = interpolated[i - 1]
    const curr = interpolated[i]
    const pressure = (prev.pressure + curr.pressure) / 2

    // Add jitter
    const jitterX = (Math.random() - 0.5) * settings.size * 0.3
    const jitterY = (Math.random() - 0.5) * settings.size * 0.3
    const width = settings.size * pressure * (0.7 + Math.random() * 0.6)

    ctx.beginPath()
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${settings.opacity * pressure * (0.6 + Math.random() * 0.4)})`
    ctx.lineWidth = width
    ctx.moveTo(prev.x + jitterX, prev.y + jitterY)
    ctx.lineTo(curr.x + jitterX, curr.y + jitterY)
    ctx.stroke()
  }
}

function drawChalkyStroke(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  settings: BrushSettings
) {
  if (points.length < 2) return

  const interpolated = getInterpolatedPoints(points, 4)
  const { r, g, b } = hexToRgb(settings.color)

  for (let i = 1; i < interpolated.length; i++) {
    const prev = interpolated[i - 1]
    const curr = interpolated[i]
    const pressure = (prev.pressure + curr.pressure) / 2
    const radius = (settings.size / 2) * pressure

    // Draw multiple particles for chalk effect
    const particleCount = Math.ceil(radius * 3)

    for (let p = 0; p < particleCount; p++) {
      const t = Math.random()
      const x = prev.x + (curr.x - prev.x) * t
      const y = prev.y + (curr.y - prev.y) * t

      // Scatter particles in a circular area
      const angle = Math.random() * Math.PI * 2
      const dist = Math.random() * radius
      const px = x + Math.cos(angle) * dist
      const py = y + Math.sin(angle) * dist

      // Grain effect
      const grain = noise2D(px * 0.2, py * 0.2)
      if (grain < 0.4) continue

      const particleSize = 1 + Math.random() * 2
      const alpha = settings.opacity * grain * pressure * 0.7

      ctx.beginPath()
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
      ctx.arc(px, py, particleSize, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

function drawNeonStroke(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  settings: BrushSettings
) {
  if (points.length < 2) return

  const interpolated = getInterpolatedPoints(points, 12)
  const { r, g, b } = hexToRgb(settings.color)

  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  // Draw glow layers (outer to inner)
  const glowLayers = [
    { width: settings.size * 4, alpha: 0.02 },
    { width: settings.size * 3, alpha: 0.05 },
    { width: settings.size * 2, alpha: 0.1 },
    { width: settings.size * 1.5, alpha: 0.3 },
    { width: settings.size, alpha: 0.8 },
    { width: settings.size * 0.5, alpha: 1 },
  ]

  ctx.save()
  ctx.globalCompositeOperation = 'lighter'

  for (const layer of glowLayers) {
    ctx.beginPath()
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${layer.alpha * settings.opacity})`
    ctx.lineWidth = layer.width

    ctx.moveTo(interpolated[0].x, interpolated[0].y)
    for (let i = 1; i < interpolated.length; i++) {
      ctx.lineTo(interpolated[i].x, interpolated[i].y)
    }
    ctx.stroke()
  }

  // Core white highlight
  ctx.beginPath()
  ctx.strokeStyle = `rgba(255, 255, 255, ${settings.opacity * 0.8})`
  ctx.lineWidth = settings.size * 0.2
  ctx.moveTo(interpolated[0].x, interpolated[0].y)
  for (let i = 1; i < interpolated.length; i++) {
    ctx.lineTo(interpolated[i].x, interpolated[i].y)
  }
  ctx.stroke()

  ctx.restore()
}

function drawMarkerStroke(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  settings: BrushSettings
) {
  if (points.length < 2) return

  const interpolated = getInterpolatedPoints(points, 8)
  const { r, g, b } = hexToRgb(settings.color)

  ctx.save()
  ctx.globalCompositeOperation = 'multiply'
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  // Draw slightly transparent strokes that darken when overlapping
  ctx.beginPath()
  ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${settings.opacity * 0.4})`
  ctx.lineWidth = settings.size

  ctx.moveTo(interpolated[0].x, interpolated[0].y)
  for (let i = 1; i < interpolated.length; i++) {
    ctx.lineTo(interpolated[i].x, interpolated[i].y)
  }
  ctx.stroke()

  ctx.restore()
}

function drawSprayStroke(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  settings: BrushSettings
) {
  if (points.length < 1) return

  const { r, g, b } = hexToRgb(settings.color)
  const radius = settings.size * 2

  for (const point of points) {
    const density = Math.ceil(radius * point.pressure * 3)

    for (let i = 0; i < density; i++) {
      // Use gaussian-ish distribution for natural spray
      const angle = Math.random() * Math.PI * 2
      const dist = Math.random() * Math.random() * radius * point.pressure
      const x = point.x + Math.cos(angle) * dist
      const y = point.y + Math.sin(angle) * dist

      const particleSize = 0.5 + Math.random() * 1.5
      const alpha = settings.opacity * (1 - dist / radius) * 0.8

      ctx.beginPath()
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
      ctx.arc(x, y, particleSize, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

/**
 * Eraser brush - uses destination-out to remove pixels
 * With opacity < 1, creates a soft "buff" effect that fades rather than fully erases
 * This allows for subtle corrections and blending of colors underneath
 */
function drawEraserStroke(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  settings: BrushSettings
) {
  if (points.length < 2) return

  const interpolated = getInterpolatedPoints(points, 12)

  ctx.save()
  ctx.globalCompositeOperation = 'destination-out'
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  for (let i = 1; i < interpolated.length; i++) {
    const prev = interpolated[i - 1]
    const curr = interpolated[i]
    const pressure = (prev.pressure + curr.pressure) / 2
    const width = settings.size * pressure

    ctx.beginPath()
    // Use white with opacity - destination-out uses alpha to determine how much to erase
    ctx.strokeStyle = `rgba(255, 255, 255, ${settings.opacity * pressure})`
    ctx.lineWidth = width
    ctx.moveTo(prev.x, prev.y)
    ctx.lineTo(curr.x, curr.y)
    ctx.stroke()
  }

  ctx.restore()
}

// Main brush render function
export function renderBrushStroke(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  settings: BrushSettings
) {
  if (points.length === 0) return

  ctx.save()

  switch (settings.style) {
    case 'smooth':
      drawSmoothStroke(ctx, points, settings)
      break
    case 'rough':
      drawRoughStroke(ctx, points, settings)
      break
    case 'chalky':
      drawChalkyStroke(ctx, points, settings)
      break
    case 'neon':
      drawNeonStroke(ctx, points, settings)
      break
    case 'marker':
      drawMarkerStroke(ctx, points, settings)
      break
    case 'spray':
      drawSprayStroke(ctx, points, settings)
      break
    case 'eraser':
      drawEraserStroke(ctx, points, settings)
      break
  }

  ctx.restore()
}

// Continuous drawing for live preview
export function renderBrushPoint(
  ctx: CanvasRenderingContext2D,
  point: Point,
  prevPoint: Point | null,
  settings: BrushSettings
) {
  if (!prevPoint) {
    renderBrushStroke(ctx, [point], settings)
    return
  }

  // For smooth real-time rendering, draw between prev and current
  renderBrushStroke(ctx, [prevPoint, point], settings)
}

// Get brush cursor preview
export function getBrushCursor(settings: BrushSettings): string {
  const size = Math.max(4, settings.size)
  const canvas = document.createElement('canvas')
  canvas.width = size + 4
  canvas.height = size + 4
  const ctx = canvas.getContext('2d')!

  // Eraser has a distinct cursor with dashed outline
  if (settings.style === 'eraser') {
    ctx.strokeStyle = '#666'
    ctx.lineWidth = 1.5
    ctx.setLineDash([3, 2])
    ctx.beginPath()
    ctx.arc(canvas.width / 2, canvas.height / 2, size / 2, 0, Math.PI * 2)
    ctx.stroke()

    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 1
    ctx.setLineDash([])
    ctx.beginPath()
    ctx.arc(canvas.width / 2, canvas.height / 2, size / 2 - 1, 0, Math.PI * 2)
    ctx.stroke()
  } else {
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(canvas.width / 2, canvas.height / 2, size / 2, 0, Math.PI * 2)
    ctx.stroke()

    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(canvas.width / 2, canvas.height / 2, size / 2 - 1, 0, Math.PI * 2)
    ctx.stroke()
  }

  return `url(${canvas.toDataURL()}) ${canvas.width / 2} ${canvas.height / 2}, crosshair`
}

// Export texture generation for external use
export { generateGrainPattern, hexToRgb }
