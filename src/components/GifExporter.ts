/**
 * GIF Exporter - Native GIF generation from animation frames
 * Max 24 frames at 12fps = 2 second animations
 * Uses gif.js for encoding
 */

import GIF from 'gif.js'

export interface GifExportOptions {
  fps?: number           // Frames per second (default: 12)
  quality?: number       // 1-30, lower is better quality (default: 10)
  width?: number         // Output width (default: from frames)
  height?: number        // Output height (default: from frames)
  maxFrames?: number     // Maximum frames to export (default: 24)
  repeat?: number        // 0 = loop forever, -1 = no loop, n = loop n times (default: 0)
  transparent?: string   // Transparent color (hex string, optional)
  background?: string    // Background color (hex string, default: #ffffff)
  watermark?: boolean    // Add QSTU watermark (default: true)
}

export interface ExportProgress {
  phase: 'preparing' | 'encoding' | 'finishing'
  progress: number  // 0-100
  currentFrame?: number
  totalFrames?: number
}

type ProgressCallback = (progress: ExportProgress) => void

const DEFAULT_OPTIONS: Required<Omit<GifExportOptions, 'transparent'>> = {
  fps: 12,
  quality: 10,
  width: 0,  // Will be set from frame data
  height: 0,
  maxFrames: 24,
  repeat: 0,
  background: '#ffffff',
  watermark: true,
}

/**
 * Export animation frames to GIF
 * @param frames - Array of ImageData objects representing each frame
 * @param options - Export options
 * @param onProgress - Progress callback
 * @returns Promise resolving to Blob of the GIF
 */
export async function exportToGif(
  frames: (ImageData | null)[],
  options: GifExportOptions = {},
  onProgress?: ProgressCallback
): Promise<Blob> {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  // Filter out null frames and limit to maxFrames
  const validFrames = frames.filter((f): f is ImageData => f !== null)
  const framesToExport = validFrames.slice(0, opts.maxFrames)

  if (framesToExport.length === 0) {
    throw new Error('No valid frames to export')
  }

  // Get dimensions from first frame if not specified
  const firstFrame = framesToExport[0]
  const width = opts.width || firstFrame.width
  const height = opts.height || firstFrame.height

  onProgress?.({
    phase: 'preparing',
    progress: 0,
    currentFrame: 0,
    totalFrames: framesToExport.length,
  })

  // Create GIF encoder
  const gif = new GIF({
    workers: 2,
    quality: opts.quality,
    width,
    height,
    repeat: opts.repeat,
    background: opts.background,
    transparent: options.transparent || null,
    workerScript: '/gif.worker.js', // We'll need to copy this to public
  })

  // Create a canvas for rendering frames
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!

  // Frame delay in milliseconds
  const delay = Math.round(1000 / opts.fps)

  // Add each frame
  for (let i = 0; i < framesToExport.length; i++) {
    const frame = framesToExport[i]

    onProgress?.({
      phase: 'preparing',
      progress: Math.round((i / framesToExport.length) * 50),
      currentFrame: i + 1,
      totalFrames: framesToExport.length,
    })

    // Clear canvas with background
    ctx.fillStyle = opts.background
    ctx.fillRect(0, 0, width, height)

    // Scale frame if needed
    if (frame.width !== width || frame.height !== height) {
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = frame.width
      tempCanvas.height = frame.height
      tempCanvas.getContext('2d')!.putImageData(frame, 0, 0)
      ctx.drawImage(tempCanvas, 0, 0, width, height)
    } else {
      ctx.putImageData(frame, 0, 0)
    }

    // Add watermark on last frame if enabled
    if (opts.watermark && i === framesToExport.length - 1) {
      addWatermark(ctx, width, height)
    }

    // Add frame to GIF
    gif.addFrame(ctx, { delay, copy: true })
  }

  // Return promise that resolves when GIF is rendered
  return new Promise((resolve, reject) => {
    gif.on('progress', (p: number) => {
      onProgress?.({
        phase: 'encoding',
        progress: 50 + Math.round(p * 45),
        currentFrame: framesToExport.length,
        totalFrames: framesToExport.length,
      })
    })

    gif.on('finished', (blob: Blob) => {
      onProgress?.({
        phase: 'finishing',
        progress: 100,
        currentFrame: framesToExport.length,
        totalFrames: framesToExport.length,
      })
      resolve(blob)
    })

    // Handle errors via try/catch on render
    gif.on('abort', () => {
      reject(new Error('GIF encoding was aborted'))
    })

    gif.render()
  })
}

/**
 * Add QSTU watermark to canvas
 */
function addWatermark(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const size = Math.min(width, height) * 0.08
  const padding = size * 0.5
  const x = width - size - padding
  const y = height - size - padding

  // Semi-transparent background circle
  ctx.save()
  ctx.globalAlpha = 0.6
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(x + size / 2, y + size / 2, size / 2 + 4, 0, Math.PI * 2)
  ctx.fill()

  // Draw Q logo
  ctx.globalAlpha = 0.8
  ctx.fillStyle = '#6366f1'
  ctx.font = `bold ${size}px Arial, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('Q', x + size / 2, y + size / 2)
  ctx.restore()
}

/**
 * Download a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Export animation to GIF and download
 */
export async function exportAndDownloadGif(
  frames: (ImageData | null)[],
  options: GifExportOptions = {},
  onProgress?: ProgressCallback
): Promise<void> {
  const blob = await exportToGif(frames, options, onProgress)
  const timestamp = new Date().toISOString().slice(0, 10)
  downloadBlob(blob, `opus-prime-animation-${timestamp}.gif`)
}

/**
 * Alternative: Create GIF using canvas-based encoding (no web workers)
 * This is a simpler fallback if gif.js workers aren't available
 */
export async function exportToGifSimple(
  frames: (ImageData | null)[],
  options: GifExportOptions = {},
  onProgress?: ProgressCallback
): Promise<Blob> {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  const validFrames = frames.filter((f): f is ImageData => f !== null)
  const framesToExport = validFrames.slice(0, opts.maxFrames)

  if (framesToExport.length === 0) {
    throw new Error('No valid frames to export')
  }

  const firstFrame = framesToExport[0]
  const width = opts.width || firstFrame.width
  const height = opts.height || firstFrame.height

  // Use a simpler GIF encoder that doesn't need workers
  // This creates an animated GIF using the GIF89a format directly
  const encoder = new SimpleGifEncoder(width, height)
  encoder.setRepeat(opts.repeat)
  encoder.setDelay(Math.round(1000 / opts.fps))
  encoder.setQuality(opts.quality)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!

  encoder.start()

  for (let i = 0; i < framesToExport.length; i++) {
    const frame = framesToExport[i]

    onProgress?.({
      phase: 'encoding',
      progress: Math.round((i / framesToExport.length) * 100),
      currentFrame: i + 1,
      totalFrames: framesToExport.length,
    })

    ctx.fillStyle = opts.background
    ctx.fillRect(0, 0, width, height)

    if (frame.width !== width || frame.height !== height) {
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = frame.width
      tempCanvas.height = frame.height
      tempCanvas.getContext('2d')!.putImageData(frame, 0, 0)
      ctx.drawImage(tempCanvas, 0, 0, width, height)
    } else {
      ctx.putImageData(frame, 0, 0)
    }

    if (opts.watermark && i === framesToExport.length - 1) {
      addWatermark(ctx, width, height)
    }

    encoder.addFrame(ctx)
  }

  encoder.finish()

  onProgress?.({
    phase: 'finishing',
    progress: 100,
    currentFrame: framesToExport.length,
    totalFrames: framesToExport.length,
  })

  const output = encoder.getOutput()
  // Create a new ArrayBuffer copy to avoid SharedArrayBuffer type issues
  const buffer = new ArrayBuffer(output.byteLength)
  new Uint8Array(buffer).set(output)
  return new Blob([buffer], { type: 'image/gif' })
}

/**
 * Simple GIF encoder class (minimal implementation)
 * Based on GIF89a specification
 */
class SimpleGifEncoder {
  private width: number
  private height: number
  private repeat = 0
  private delay = 100
  private output: number[] = []
  private started = false

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
  }

  setRepeat(repeat: number) {
    this.repeat = repeat
  }

  setDelay(delay: number) {
    this.delay = delay
  }

  setQuality(_quality: number) {
    // Quality parameter is noted but not used in this simple encoder
    // The LZW compression is fixed
  }

  start() {
    this.output = []
    this.started = true
    // GIF Header
    this.writeString('GIF89a')
    // Logical Screen Descriptor
    this.writeShort(this.width)
    this.writeShort(this.height)
    this.output.push(0xf7) // Global Color Table Flag, Color Resolution, Sort Flag, Size
    this.output.push(0x00) // Background Color Index
    this.output.push(0x00) // Pixel Aspect Ratio
    // Global Color Table (256 colors)
    for (let i = 0; i < 256; i++) {
      this.output.push(i, i, i) // Grayscale palette as placeholder
    }
    // Netscape Extension for looping
    if (this.repeat >= 0) {
      this.output.push(0x21) // Extension Introducer
      this.output.push(0xff) // Application Extension Label
      this.output.push(0x0b) // Block Size
      this.writeString('NETSCAPE2.0')
      this.output.push(0x03) // Sub-block Size
      this.output.push(0x01) // Sub-block ID
      this.writeShort(this.repeat)
      this.output.push(0x00) // Block Terminator
    }
  }

  addFrame(ctx: CanvasRenderingContext2D) {
    if (!this.started) return

    const imageData = ctx.getImageData(0, 0, this.width, this.height)
    const pixels = imageData.data

    // Graphic Control Extension
    this.output.push(0x21) // Extension Introducer
    this.output.push(0xf9) // Graphic Control Label
    this.output.push(0x04) // Block Size
    this.output.push(0x00) // Packed Fields
    this.writeShort(Math.round(this.delay / 10)) // Delay Time (in 1/100 seconds)
    this.output.push(0x00) // Transparent Color Index
    this.output.push(0x00) // Block Terminator

    // Image Descriptor
    this.output.push(0x2c) // Image Separator
    this.writeShort(0) // Image Left Position
    this.writeShort(0) // Image Top Position
    this.writeShort(this.width)
    this.writeShort(this.height)
    this.output.push(0x00) // Packed Fields (no local color table)

    // Image Data (LZW compressed)
    const minCodeSize = 8
    this.output.push(minCodeSize)

    // Simple LZW encoding (simplified for grayscale)
    const indexed = this.quantizeFrame(pixels)
    const compressed = this.lzwEncode(indexed, minCodeSize)

    // Write sub-blocks
    let offset = 0
    while (offset < compressed.length) {
      const blockSize = Math.min(255, compressed.length - offset)
      this.output.push(blockSize)
      for (let i = 0; i < blockSize; i++) {
        this.output.push(compressed[offset++])
      }
    }
    this.output.push(0x00) // Block Terminator
  }

  private quantizeFrame(pixels: Uint8ClampedArray): number[] {
    const indexed: number[] = []
    for (let i = 0; i < pixels.length; i += 4) {
      // Convert to grayscale index (0-255)
      const gray = Math.round(0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2])
      indexed.push(gray)
    }
    return indexed
  }

  private lzwEncode(data: number[], minCodeSize: number): number[] {
    const clearCode = 1 << minCodeSize
    const eoiCode = clearCode + 1
    let codeSize = minCodeSize + 1
    let nextCode = eoiCode + 1
    const maxCode = 4096

    const dictionary = new Map<string, number>()
    for (let i = 0; i < clearCode; i++) {
      dictionary.set(String(i), i)
    }

    const output: number[] = []
    let bits = 0
    let bitCount = 0

    const writeCode = (code: number) => {
      bits |= code << bitCount
      bitCount += codeSize
      while (bitCount >= 8) {
        output.push(bits & 0xff)
        bits >>= 8
        bitCount -= 8
      }
    }

    writeCode(clearCode)

    let current = ''
    for (const pixel of data) {
      const next = current + ',' + pixel
      if (dictionary.has(next)) {
        current = next
      } else {
        writeCode(dictionary.get(current)!)
        if (nextCode < maxCode) {
          dictionary.set(next, nextCode++)
          if (nextCode > (1 << codeSize) && codeSize < 12) {
            codeSize++
          }
        } else {
          writeCode(clearCode)
          dictionary.clear()
          for (let i = 0; i < clearCode; i++) {
            dictionary.set(String(i), i)
          }
          nextCode = eoiCode + 1
          codeSize = minCodeSize + 1
        }
        current = String(pixel)
      }
    }

    if (current) {
      writeCode(dictionary.get(current)!)
    }
    writeCode(eoiCode)

    if (bitCount > 0) {
      output.push(bits & 0xff)
    }

    return output
  }

  finish() {
    if (!this.started) return
    this.output.push(0x3b) // GIF Trailer
    this.started = false
  }

  getOutput(): Uint8Array {
    return new Uint8Array(this.output)
  }

  private writeShort(value: number) {
    this.output.push(value & 0xff)
    this.output.push((value >> 8) & 0xff)
  }

  private writeString(str: string) {
    for (let i = 0; i < str.length; i++) {
      this.output.push(str.charCodeAt(i))
    }
  }
}
