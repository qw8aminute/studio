/**
 * SaveWithWatermark - Export drawings with QS favicon watermark
 *
 * Renders the canvas to an offscreen canvas, draws the logo in
 * the bottom-right corner, and exports as PNG
 */

// QS Favicon as inline SVG data (matches /public/favicon.svg)
const QS_FAVICON_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#050A14"/>
  <text
    x="32"
    y="40"
    text-anchor="middle"
    font-size="34"
    font-weight="900"
    fill="#FFFFFF"
    font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Inter', sans-serif">
    QS
  </text>
  <circle cx="46" cy="18" r="4" fill="#E63946"/>
</svg>
`

// Convert SVG string to Image
async function svgToImage(svgString: string, width: number, height: number): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const blob = new Blob([svgString], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load SVG'))
    }

    img.width = width
    img.height = height
    img.src = url
  })
}

export interface SaveOptions {
  canvas: HTMLCanvasElement
  filename?: string
  format?: 'png' | 'jpeg' | 'webp'
  quality?: number // 0-1 for jpeg/webp
  watermarkPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  watermarkSize?: number // Logo size in pixels
  watermarkOpacity?: number // 0-1
  watermarkPadding?: number // Padding from edge
  includeWatermark?: boolean
}

export async function saveWithWatermark(options: SaveOptions): Promise<Blob> {
  const {
    canvas,
    format = 'png',
    quality = 0.92,
    watermarkPosition = 'bottom-right',
    watermarkSize = 50,
    watermarkOpacity = 0.7,
    watermarkPadding = 15,
    includeWatermark = true,
  } = options

  // Create offscreen canvas
  const offscreen = document.createElement('canvas')
  offscreen.width = canvas.width
  offscreen.height = canvas.height
  const ctx = offscreen.getContext('2d')!

  // Draw original canvas content
  ctx.drawImage(canvas, 0, 0)

  // Add watermark if requested
  if (includeWatermark) {
    const logoImg = await svgToImage(QS_FAVICON_SVG, watermarkSize, watermarkSize)

    // Calculate position
    let x: number, y: number

    switch (watermarkPosition) {
      case 'bottom-right':
        x = canvas.width - watermarkSize - watermarkPadding
        y = canvas.height - watermarkSize - watermarkPadding
        break
      case 'bottom-left':
        x = watermarkPadding
        y = canvas.height - watermarkSize - watermarkPadding
        break
      case 'top-right':
        x = canvas.width - watermarkSize - watermarkPadding
        y = watermarkPadding
        break
      case 'top-left':
        x = watermarkPadding
        y = watermarkPadding
        break
    }

    // Draw with opacity
    ctx.globalAlpha = watermarkOpacity
    ctx.drawImage(logoImg, x, y, watermarkSize, watermarkSize)
    ctx.globalAlpha = 1
  }

  // Convert to blob
  return new Promise((resolve, reject) => {
    const mimeType =
      format === 'png'
        ? 'image/png'
        : format === 'jpeg'
        ? 'image/jpeg'
        : 'image/webp'

    offscreen.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to create image blob'))
        }
      },
      mimeType,
      quality
    )
  })
}

// Download the saved image
export async function downloadWithWatermark(options: SaveOptions): Promise<void> {
  const {
    filename = `crayon-${Date.now()}`,
    format = 'png',
  } = options

  const blob = await saveWithWatermark(options)
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.${format}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Save canvas without watermark (for animation frames, etc.)
export function saveCanvasAsBlob(
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpeg' | 'webp' = 'png',
  quality = 0.92
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const mimeType =
      format === 'png'
        ? 'image/png'
        : format === 'jpeg'
        ? 'image/jpeg'
        : 'image/webp'

    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to create image blob'))
        }
      },
      mimeType,
      quality
    )
  })
}

// Get canvas as data URL
export function getCanvasDataUrl(
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpeg' | 'webp' = 'png',
  quality = 0.92
): string {
  const mimeType =
    format === 'png'
      ? 'image/png'
      : format === 'jpeg'
      ? 'image/jpeg'
      : 'image/webp'

  return canvas.toDataURL(mimeType, quality)
}

// Render bubbles to canvas for export
export function renderBubblesToCanvas(
  canvas: HTMLCanvasElement,
  bubbles: Array<{
    type: string
    x: number
    y: number
    width: number
    height: number
    text: string
    rotation: number
  }>
): void {
  const ctx = canvas.getContext('2d')!

  for (const bubble of bubbles) {
    ctx.save()

    // Apply transform
    ctx.translate(bubble.x + bubble.width / 2, bubble.y + bubble.height / 2)
    ctx.rotate((bubble.rotation * Math.PI) / 180)
    ctx.translate(-bubble.width / 2, -bubble.height / 2)

    // Draw simple bubble shape (simplified for export)
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = '#333333'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.roundRect(0, 0, bubble.width, bubble.height * 0.85, 10)
    ctx.fill()
    ctx.stroke()

    // Draw tail
    ctx.beginPath()
    ctx.moveTo(bubble.width * 0.3, bubble.height * 0.85)
    ctx.lineTo(bubble.width * 0.2, bubble.height)
    ctx.lineTo(bubble.width * 0.4, bubble.height * 0.85)
    ctx.fill()
    ctx.stroke()

    // Draw text
    if (bubble.text) {
      ctx.fillStyle = '#000000'
      ctx.font = '16px system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // Word wrap
      const maxWidth = bubble.width - 20
      const words = bubble.text.split(' ')
      let line = ''
      let y = bubble.height * 0.4
      const lineHeight = 20

      for (const word of words) {
        const testLine = line + word + ' '
        const metrics = ctx.measureText(testLine)
        if (metrics.width > maxWidth && line !== '') {
          ctx.fillText(line.trim(), bubble.width / 2, y)
          line = word + ' '
          y += lineHeight
        } else {
          line = testLine
        }
      }
      ctx.fillText(line.trim(), bubble.width / 2, y)
    }

    ctx.restore()
  }
}
