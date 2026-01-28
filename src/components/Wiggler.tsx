import { useState, useEffect, useRef, useCallback } from 'react'
import '../styles/wiggler.css'

/**
 * WIGGLER - Staggering Beauty inspired physics-based worm
 *
 * Features:
 * - Particle chain that follows the cursor with spring physics
 * - Shake detection triggers visual chaos (flashing colors, screen shake)
 * - Audio feedback on shake events
 * - Psychedelic background effects
 */

// Physics constants
const NUM_SEGMENTS = 50
const SEGMENT_LENGTH = 12
const SPRING_CONSTANT = 0.45
const DAMPING = 0.75
const SHAKE_THRESHOLD = 35
const SHAKE_INTENSITY_MAX = 100

// Audio frequencies for chaos sounds
const CHAOS_FREQUENCIES = [220, 277, 330, 392, 440, 523, 659, 784]

class WormSegment {
  x: number
  y: number
  vx: number
  vy: number
  targetX: number
  targetY: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.vx = 0
    this.vy = 0
    this.targetX = x
    this.targetY = y
  }

  update(targetX: number, targetY: number, isHead = false) {
    this.targetX = targetX
    this.targetY = targetY

    if (isHead) {
      const dx = targetX - this.x
      const dy = targetY - this.y
      this.vx = dx * 0.3
      this.vy = dy * 0.3
    } else {
      const dx = this.targetX - this.x
      const dy = this.targetY - this.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance > SEGMENT_LENGTH) {
        const force = (distance - SEGMENT_LENGTH) * SPRING_CONSTANT
        const ax = (dx / distance) * force
        const ay = (dy / distance) * force
        this.vx += ax
        this.vy += ay
      }

      this.vx *= DAMPING
      this.vy *= DAMPING
    }

    this.x += this.vx
    this.y += this.vy
  }

  getSpeed() {
    return Math.sqrt(this.vx * this.vx + this.vy * this.vy)
  }
}

interface WigglerProps {
  onExit: () => void
}

export default function Wiggler({ onExit }: WigglerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const oscillatorsRef = useRef<OscillatorNode[]>([])

  const [isShaking, setIsShaking] = useState(false)
  const [shakeIntensity, setShakeIntensity] = useState(0)
  const [bgColor, setBgColor] = useState({ h: 150, s: 70, l: 85 })
  const [showWarning, setShowWarning] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(false)

  const stateRef = useRef({
    segments: [] as WormSegment[],
    mouseX: 0,
    mouseY: 0,
    animationId: null as number | null,
    shakeHistory: [] as number[],
    isInitialized: false,
    chaosMode: false,
    screenShakeX: 0,
    screenShakeY: 0,
  })

  // Initialize audio
  const initAudio = useCallback(() => {
    if (audioContextRef.current) return
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      gainNodeRef.current = audioContextRef.current.createGain()
      gainNodeRef.current.connect(audioContextRef.current.destination)
      gainNodeRef.current.gain.value = 0
      setAudioEnabled(true)
    } catch (e) {
      console.warn('Audio not available:', e)
    }
  }, [])

  // Play chaos sounds
  const playChaosSound = useCallback(
    (intensity: number) => {
      if (!audioContextRef.current || !audioEnabled) return

      const ctx = audioContextRef.current
      const gain = gainNodeRef.current!

      oscillatorsRef.current.forEach((osc) => {
        try {
          osc.stop()
        } catch {}
      })
      oscillatorsRef.current = []

      const numOscs = Math.min(Math.floor(intensity / 20) + 1, 5)

      for (let i = 0; i < numOscs; i++) {
        const osc = ctx.createOscillator()
        const oscGain = ctx.createGain()

        osc.type = (['sine', 'square', 'sawtooth', 'triangle'] as const)[Math.floor(Math.random() * 4)]
        osc.frequency.value = CHAOS_FREQUENCIES[Math.floor(Math.random() * CHAOS_FREQUENCIES.length)]
        osc.frequency.value *= 0.8 + Math.random() * 0.4

        oscGain.gain.value = (intensity / SHAKE_INTENSITY_MAX) * 0.15
        osc.connect(oscGain)
        oscGain.connect(gain)
        osc.start()
        oscillatorsRef.current.push(osc)
      }

      gain.gain.setValueAtTime((intensity / SHAKE_INTENSITY_MAX) * 0.3, ctx.currentTime)
    },
    [audioEnabled]
  )

  // Stop chaos sounds
  const stopChaosSound = useCallback(() => {
    if (!gainNodeRef.current || !audioContextRef.current) return
    gainNodeRef.current.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 0.3)
    setTimeout(() => {
      oscillatorsRef.current.forEach((osc) => {
        try {
          osc.stop()
        } catch {}
      })
      oscillatorsRef.current = []
    }, 300)
  }, [])

  // Initialize worm
  const initWorm = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const segments: WormSegment[] = []

    for (let i = 0; i < NUM_SEGMENTS; i++) {
      segments.push(new WormSegment(centerX, centerY + i * SEGMENT_LENGTH))
    }

    stateRef.current.segments = segments
    stateRef.current.mouseX = centerX
    stateRef.current.mouseY = centerY
    stateRef.current.isInitialized = true
  }, [])

  // Pointer handlers
  const handlePointerMove = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    stateRef.current.mouseX = clientX - rect.left
    stateRef.current.mouseY = clientY - rect.top
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => handlePointerMove(e.clientX, e.clientY),
    [handlePointerMove]
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      handlePointerMove(touch.clientX, touch.clientY)
    },
    [handlePointerMove]
  )

  const handleStart = useCallback(() => {
    setShowWarning(false)
    initAudio()
  }, [initAudio])

  // Calculate shake intensity
  const calculateShakeIntensity = useCallback(() => {
    const state = stateRef.current
    if (state.segments.length === 0) return 0

    let totalSpeed = 0
    const checkSegments = Math.min(10, state.segments.length)

    for (let i = 0; i < checkSegments; i++) {
      totalSpeed += state.segments[i].getSpeed()
    }

    const avgSpeed = totalSpeed / checkSegments
    state.shakeHistory.push(avgSpeed)
    if (state.shakeHistory.length > 10) state.shakeHistory.shift()

    const avgShake = state.shakeHistory.reduce((a, b) => a + b, 0) / state.shakeHistory.length
    return Math.min(avgShake * 3, SHAKE_INTENSITY_MAX)
  }, [])

  // Draw worm
  const drawWorm = useCallback(
    (ctx: CanvasRenderingContext2D, segments: WormSegment[], intensity: number) => {
      if (segments.length < 2) return
      const isIntense = intensity > SHAKE_THRESHOLD

      // Draw body
      for (let i = segments.length - 1; i >= 1; i--) {
        const seg = segments[i]
        const prevSeg = segments[i - 1]
        const t = 1 - i / segments.length
        const baseWidth = 8 + t * 25
        const width = baseWidth + (isIntense ? Math.sin(Date.now() / 50 + i) * 5 : 0)

        if (isIntense) {
          const hue = (Date.now() / 10 + i * 20) % 360
          ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`
        } else {
          ctx.strokeStyle = '#1a1a1a'
        }

        ctx.lineWidth = width
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(seg.x, seg.y)
        ctx.lineTo(prevSeg.x, prevSeg.y)
        ctx.stroke()
      }

      // Draw head
      const head = segments[0]
      const headSize = 35 + (isIntense ? Math.sin(Date.now() / 30) * 10 : 0)

      if (isIntense) {
        const glowSize = headSize + 20 + Math.sin(Date.now() / 50) * 10
        const gradient = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, glowSize)
        gradient.addColorStop(0, `hsla(${(Date.now() / 10) % 360}, 100%, 70%, 0.8)`)
        gradient.addColorStop(0.5, `hsla(${(Date.now() / 10 + 60) % 360}, 100%, 50%, 0.4)`)
        gradient.addColorStop(1, 'transparent')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(head.x, head.y, glowSize, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.fillStyle = isIntense ? `hsl(${(Date.now() / 10) % 360}, 100%, 50%)` : '#1a1a1a'
      ctx.beginPath()
      ctx.arc(head.x, head.y, headSize, 0, Math.PI * 2)
      ctx.fill()

      // Eyes
      const eyeOffset = 12
      const eyeSize = 10 + (isIntense ? Math.sin(Date.now() / 40) * 3 : 0)
      const dx = stateRef.current.mouseX - head.x
      const dy = stateRef.current.mouseY - head.y
      const angle = Math.atan2(dy, dx)

      const leftEyeX = head.x + Math.cos(angle - 0.4) * eyeOffset
      const leftEyeY = head.y + Math.sin(angle - 0.4) * eyeOffset
      const rightEyeX = head.x + Math.cos(angle + 0.4) * eyeOffset
      const rightEyeY = head.y + Math.sin(angle + 0.4) * eyeOffset

      ctx.fillStyle = isIntense ? `hsl(${(Date.now() / 5) % 360}, 100%, 90%)` : '#fff'
      ctx.beginPath()
      ctx.arc(leftEyeX, leftEyeY, eyeSize, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(rightEyeX, rightEyeY, eyeSize, 0, Math.PI * 2)
      ctx.fill()

      const pupilOffset = isIntense ? 4 : 2
      ctx.fillStyle = isIntense ? '#ff0000' : '#000'
      ctx.beginPath()
      ctx.arc(leftEyeX + Math.cos(angle) * pupilOffset, leftEyeY + Math.sin(angle) * pupilOffset, eyeSize * 0.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(rightEyeX + Math.cos(angle) * pupilOffset, rightEyeY + Math.sin(angle) * pupilOffset, eyeSize * 0.5, 0, Math.PI * 2)
      ctx.fill()

      if (isIntense) {
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 3
        ctx.beginPath()
        const mouthY = head.y + headSize * 0.4
        ctx.moveTo(head.x - 15, mouthY)
        for (let i = 0; i < 6; i++) {
          const mx = head.x - 15 + i * 6
          const my = mouthY + (i % 2 === 0 ? -5 : 5) * Math.sin(Date.now() / 30)
          ctx.lineTo(mx, my)
        }
        ctx.stroke()
      }
    },
    []
  )

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')!
    const state = stateRef.current

    const animate = () => {
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        if (!state.isInitialized) initWorm()
      }

      if (state.segments.length > 0) {
        state.segments[0].update(state.mouseX, state.mouseY, true)
        for (let i = 1; i < state.segments.length; i++) {
          const prev = state.segments[i - 1]
          state.segments[i].update(prev.x, prev.y)
        }
      }

      const intensity = calculateShakeIntensity()
      setShakeIntensity(intensity)

      const nowShaking = intensity > SHAKE_THRESHOLD
      if (nowShaking !== isShaking) {
        setIsShaking(nowShaking)
        if (nowShaking) {
          state.chaosMode = true
          playChaosSound(intensity)
        } else {
          state.chaosMode = false
          stopChaosSound()
        }
      } else if (nowShaking && audioEnabled) {
        playChaosSound(intensity)
      }

      if (state.chaosMode) {
        state.screenShakeX = (Math.random() - 0.5) * intensity * 0.5
        state.screenShakeY = (Math.random() - 0.5) * intensity * 0.5
      } else {
        state.screenShakeX *= 0.9
        state.screenShakeY *= 0.9
      }

      if (state.chaosMode) {
        setBgColor((prev) => ({ h: (prev.h + 10) % 360, s: 100, l: 50 + Math.sin(Date.now() / 100) * 20 }))
      } else {
        setBgColor((prev) => ({ h: (prev.h + 0.1) % 360, s: Math.max(60, prev.s - 1), l: Math.min(85, prev.l + 0.5) }))
      }

      ctx.save()
      ctx.translate(state.screenShakeX, state.screenShakeY)

      if (state.chaosMode) {
        const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width)
        gradient.addColorStop(0, `hsl(${(Date.now() / 20) % 360}, 100%, 60%)`)
        gradient.addColorStop(0.5, `hsl(${(Date.now() / 20 + 120) % 360}, 100%, 40%)`)
        gradient.addColorStop(1, `hsl(${(Date.now() / 20 + 240) % 360}, 100%, 20%)`)
        ctx.fillStyle = gradient
      } else {
        ctx.fillStyle = `hsl(${bgColor.h}, ${bgColor.s}%, ${bgColor.l}%)`
      }
      ctx.fillRect(-50, -50, canvas.width + 100, canvas.height + 100)

      if (state.chaosMode && Math.random() > 0.7) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      drawWorm(ctx, state.segments, intensity)
      ctx.restore()

      state.animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (state.animationId) cancelAnimationFrame(state.animationId)
      stopChaosSound()
    }
  }, [initWorm, calculateShakeIntensity, drawWorm, isShaking, bgColor, playChaosSound, stopChaosSound, audioEnabled])

  // Event listeners
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('touchmove', handleTouchMove)
    }
  }, [handleMouseMove, handleTouchMove])

  useEffect(() => {
    initWorm()
  }, [initWorm])

  return (
    <div className={`wiggler-container ${isShaking ? 'chaos' : ''}`}>
      <canvas ref={canvasRef} className="wiggler-canvas" />

      <div className="intensity-meter">
        <div
          className="intensity-fill"
          style={{
            height: `${shakeIntensity}%`,
            backgroundColor: shakeIntensity > SHAKE_THRESHOLD ? `hsl(${(Date.now() / 10) % 360}, 100%, 50%)` : '#0ff',
          }}
        />
        <div className="intensity-threshold" style={{ bottom: `${SHAKE_THRESHOLD}%` }} />
      </div>

      {isShaking && (
        <div className="shake-text">
          {['SHAKE', 'HARDER', 'CHAOS', 'YES', 'MORE', 'WILD'][Math.floor(Date.now() / 200) % 6]}
        </div>
      )}

      <button className="exit-button" onClick={onExit}>
        EXIT WIGGLER
      </button>

      {showWarning && (
        <div className="warning-overlay">
          <div className="warning-content">
            <div className="warning-stripes">
              <div className="stripe-line"></div>
              <div className="stripe-line"></div>
              <div className="stripe-line"></div>
            </div>
            <div className="warning-text-box">
              <div className="warning-english">FLASHING IMAGES, LOUD NOISES</div>
              <div className="warning-kanji">包含闪烁图像、大声噪音</div>
            </div>
            <div className="warning-stripes">
              <div className="stripe-line"></div>
              <div className="stripe-line"></div>
              <div className="stripe-line"></div>
            </div>
            <button className="accept-button" onClick={handleStart}>
              I UNDERSTAND
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
