import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export type BrushStyle = 'smooth' | 'rough' | 'chalky' | 'neon' | 'marker' | 'spray' | 'eraser'
export type AppMode = 'draw' | 'animate'

export interface Frame {
  id: string
  imageData: ImageData | null
  duration: number // ms
}

export interface SpeechBubble {
  id: string
  type: 'happy' | 'angry' | 'whisper' | 'shout' | 'think' | 'normal'
  x: number
  y: number
  width: number
  height: number
  text: string
  rotation: number
}

export interface Point {
  x: number
  y: number
  pressure: number
}

export type ThemeMode = 'system' | 'light' | 'dark'

interface CrayonState {
  // Theme / Dark mode
  themeMode: ThemeMode
  setThemeMode: (mode: ThemeMode) => void
  isDarkMode: boolean
  setIsDarkMode: (dark: boolean) => void

  // Watermark preference
  includeWatermark: boolean
  setIncludeWatermark: (include: boolean) => void

  // App mode
  mode: AppMode
  setMode: (mode: AppMode) => void

  // Brush settings
  brushStyle: BrushStyle
  setBrushStyle: (style: BrushStyle) => void
  brushSize: number
  setBrushSize: (size: number) => void
  brushColor: string
  setBrushColor: (color: string) => void
  brushOpacity: number
  setBrushOpacity: (opacity: number) => void

  // Canvas state
  isDrawing: boolean
  setIsDrawing: (drawing: boolean) => void
  currentPath: Point[]
  addToPath: (point: Point) => void
  clearPath: () => void

  // History for undo/redo
  history: ImageData[]
  historyIndex: number
  pushHistory: (imageData: ImageData) => void
  undo: () => ImageData | null
  redo: () => ImageData | null
  canUndo: () => boolean
  canRedo: () => boolean

  // Animation frames
  frames: Frame[]
  currentFrameIndex: number
  setCurrentFrameIndex: (index: number) => void
  addFrame: (frame: Frame) => void
  updateFrame: (index: number, frame: Partial<Frame>) => void
  deleteFrame: (index: number) => void
  duplicateFrame: (index: number) => void
  onionSkinEnabled: boolean
  setOnionSkinEnabled: (enabled: boolean) => void
  onionSkinOpacity: number
  setOnionSkinOpacity: (opacity: number) => void
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  fps: number
  setFps: (fps: number) => void

  // Speech bubbles
  bubbles: SpeechBubble[]
  selectedBubbleId: string | null
  bubbleToolActive: boolean
  addBubble: (bubble: SpeechBubble) => void
  updateBubble: (id: string, updates: Partial<SpeechBubble>) => void
  deleteBubble: (id: string) => void
  selectBubble: (id: string | null) => void
  setBubbleToolActive: (active: boolean) => void

  // Audio recording
  isRecording: boolean
  setIsRecording: (recording: boolean) => void
  audioBlob: Blob | null
  setAudioBlob: (blob: Blob | null) => void

  // Easter egg
  wigglerActive: boolean
  setWigglerActive: (active: boolean) => void
  konamiProgress: number
  incrementKonami: () => void
  resetKonami: () => void

  // UI state
  showToolbar: boolean
  setShowToolbar: (show: boolean) => void
  showColorPicker: boolean
  setShowColorPicker: (show: boolean) => void
}

// Helper to get initial theme from localStorage or system
const getInitialTheme = (): { themeMode: ThemeMode; isDarkMode: boolean } => {
  if (typeof window === 'undefined') return { themeMode: 'system', isDarkMode: false }

  const stored = localStorage.getItem('crayon-theme-mode') as ThemeMode | null
  const themeMode = stored || 'system'

  let isDarkMode = false
  if (themeMode === 'system') {
    isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
  } else {
    isDarkMode = themeMode === 'dark'
  }

  return { themeMode, isDarkMode }
}

// Helper to get initial watermark preference
const getInitialWatermark = (): boolean => {
  if (typeof window === 'undefined') return true
  const stored = localStorage.getItem('crayon-include-watermark')
  return stored === null ? true : stored === 'true'
}

const initialTheme = getInitialTheme()

export const useStore = create<CrayonState>()(
  subscribeWithSelector((set, get) => ({
    // Theme / Dark mode
    themeMode: initialTheme.themeMode,
    setThemeMode: (themeMode) => {
      localStorage.setItem('crayon-theme-mode', themeMode)
      let isDarkMode = false
      if (themeMode === 'system') {
        isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
      } else {
        isDarkMode = themeMode === 'dark'
      }

      // Update brush color when switching themes
      const { brushColor, isDarkMode: wasDark } = get()
      let newBrushColor = brushColor

      // When switching TO dark mode, change default dark color to bright white
      if (isDarkMode && !wasDark && (brushColor === '#2d2d2d' || brushColor === '#1f2937')) {
        newBrushColor = '#f0f0ff' // Neon white for dark mode
      }
      // When switching FROM dark mode, change white colors to default dark
      else if (!isDarkMode && wasDark && (brushColor === '#ffffff' || brushColor === '#f0f0ff' || brushColor === '#f9fafb')) {
        newBrushColor = '#2d2d2d' // Default dark for light mode
      }

      set({ themeMode, isDarkMode, brushColor: newBrushColor })
    },
    isDarkMode: initialTheme.isDarkMode,
    setIsDarkMode: (isDarkMode) => {
      // Also update brush color when system theme changes
      const { brushColor, isDarkMode: wasDark } = get()
      let newBrushColor = brushColor

      if (isDarkMode && !wasDark && (brushColor === '#2d2d2d' || brushColor === '#1f2937')) {
        newBrushColor = '#f0f0ff'
      } else if (!isDarkMode && wasDark && (brushColor === '#ffffff' || brushColor === '#f0f0ff' || brushColor === '#f9fafb')) {
        newBrushColor = '#2d2d2d'
      }

      set({ isDarkMode, brushColor: newBrushColor })
    },

    // Watermark preference
    includeWatermark: getInitialWatermark(),
    setIncludeWatermark: (includeWatermark) => {
      localStorage.setItem('crayon-include-watermark', String(includeWatermark))
      set({ includeWatermark })
    },

    // App mode
    mode: 'draw',
    setMode: (mode) => set({ mode }),

    // Brush settings
    brushStyle: 'smooth',
    setBrushStyle: (brushStyle) => set({ brushStyle }),
    brushSize: 12,
    setBrushSize: (brushSize) => set({ brushSize }),
    brushColor: initialTheme.isDarkMode ? '#f0f0ff' : '#2d2d2d',
    setBrushColor: (brushColor) => set({ brushColor }),
    brushOpacity: 1,
    setBrushOpacity: (brushOpacity) => set({ brushOpacity }),

    // Canvas state
    isDrawing: false,
    setIsDrawing: (isDrawing) => set({ isDrawing }),
    currentPath: [],
    addToPath: (point) => set((state) => ({ currentPath: [...state.currentPath, point] })),
    clearPath: () => set({ currentPath: [] }),

    // History
    history: [],
    historyIndex: -1,
    pushHistory: (imageData) => {
      const { history, historyIndex } = get()
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(imageData)
      // Limit history to 50 entries
      if (newHistory.length > 50) newHistory.shift()
      set({ history: newHistory, historyIndex: newHistory.length - 1 })
    },
    undo: () => {
      const { history, historyIndex } = get()
      if (historyIndex > 0) {
        set({ historyIndex: historyIndex - 1 })
        return history[historyIndex - 1]
      }
      return null
    },
    redo: () => {
      const { history, historyIndex } = get()
      if (historyIndex < history.length - 1) {
        set({ historyIndex: historyIndex + 1 })
        return history[historyIndex + 1]
      }
      return null
    },
    canUndo: () => get().historyIndex > 0,
    canRedo: () => get().historyIndex < get().history.length - 1,

    // Animation
    frames: [{ id: 'frame-0', imageData: null, duration: 100 }],
    currentFrameIndex: 0,
    setCurrentFrameIndex: (index) => set({ currentFrameIndex: index }),
    addFrame: (frame) => set((state) => ({ frames: [...state.frames, frame] })),
    updateFrame: (index, frame) =>
      set((state) => ({
        frames: state.frames.map((f, i) => (i === index ? { ...f, ...frame } : f)),
      })),
    deleteFrame: (index) =>
      set((state) => {
        if (state.frames.length <= 1) return state
        const newFrames = state.frames.filter((_, i) => i !== index)
        const newIndex = Math.min(state.currentFrameIndex, newFrames.length - 1)
        return { frames: newFrames, currentFrameIndex: newIndex }
      }),
    duplicateFrame: (index) =>
      set((state) => {
        const frame = state.frames[index]
        const newFrame = { ...frame, id: `frame-${Date.now()}` }
        const newFrames = [...state.frames]
        newFrames.splice(index + 1, 0, newFrame)
        return { frames: newFrames, currentFrameIndex: index + 1 }
      }),
    onionSkinEnabled: true,
    setOnionSkinEnabled: (enabled) => set({ onionSkinEnabled: enabled }),
    onionSkinOpacity: 0.3,
    setOnionSkinOpacity: (opacity) => set({ onionSkinOpacity: opacity }),
    isPlaying: false,
    setIsPlaying: (playing) => set({ isPlaying: playing }),
    fps: 12,
    setFps: (fps) => set({ fps }),

    // Speech bubbles
    bubbles: [],
    selectedBubbleId: null,
    bubbleToolActive: false,
    addBubble: (bubble) => set((state) => ({ bubbles: [...state.bubbles, bubble] })),
    updateBubble: (id, updates) =>
      set((state) => ({
        bubbles: state.bubbles.map((b) => (b.id === id ? { ...b, ...updates } : b)),
      })),
    deleteBubble: (id) =>
      set((state) => ({
        bubbles: state.bubbles.filter((b) => b.id !== id),
        selectedBubbleId: state.selectedBubbleId === id ? null : state.selectedBubbleId,
      })),
    selectBubble: (id) => set({ selectedBubbleId: id }),
    setBubbleToolActive: (active) => set({ bubbleToolActive: active }),

    // Audio
    isRecording: false,
    setIsRecording: (recording) => set({ isRecording: recording }),
    audioBlob: null,
    setAudioBlob: (blob) => set({ audioBlob: blob }),

    // Easter egg
    wigglerActive: false,
    setWigglerActive: (active) => set({ wigglerActive: active }),
    konamiProgress: 0,
    incrementKonami: () => {
      const progress = get().konamiProgress + 1
      if (progress >= 10) {
        set({ wigglerActive: true, konamiProgress: 0 })
      } else {
        set({ konamiProgress: progress })
      }
    },
    resetKonami: () => set({ konamiProgress: 0 }),

    // UI
    showToolbar: true,
    setShowToolbar: (show) => set({ showToolbar: show }),
    showColorPicker: false,
    setShowColorPicker: (show) => set({ showColorPicker: show }),
  }))
)
