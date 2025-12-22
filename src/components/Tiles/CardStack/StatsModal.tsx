import { useState, useEffect, useMemo } from 'react'
import './StatsModal.css'

interface ThrowRecord {
  id: string
  cardName: string
  distance: number
  timestamp: number
  angle: number
}

interface Round {
  id: string
  totalDistance: number
  longestThrow: number
  shortestThrow: number
  timestamp: number
  throws: number
}

interface StatsModalProps {
  isOpen: boolean
  onClose: () => void
  currentSessionThrows: Array<{ cardId: string; distance: number; angle: number }>
  cardNames: Map<string, string>
}

const THROWS_PER_SET = 6
const SETS_PER_ROUND = 3
const THROWS_PER_ROUND = THROWS_PER_SET * SETS_PER_ROUND // 18

export default function StatsModal({ 
  isOpen, 
  onClose, 
  currentSessionThrows,
  cardNames 
}: StatsModalProps) {
  const [allThrows, setAllThrows] = useState<ThrowRecord[]>([])
  const [allRounds, setAllRounds] = useState<Round[]>([])
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied' | 'sharing'>('idle')

  // Load and process data
  useEffect(() => {
    if (!isOpen) return

    // Load historical data
    const storedThrows = localStorage.getItem('card-throw-history')
    const storedRounds = localStorage.getItem('card-rounds-history')
    const historical: ThrowRecord[] = storedThrows ? JSON.parse(storedThrows) : []
    const historicalRounds: Round[] = storedRounds ? JSON.parse(storedRounds) : []
    
    // Convert current session to records
    const sessionRecords: ThrowRecord[] = currentSessionThrows.map(t => ({
      id: `${Date.now()}-${Math.random()}`,
      cardName: cardNames.get(t.cardId) || 'Unknown Card',
      distance: t.distance,
      timestamp: Date.now(),
      angle: t.angle,
    }))

    // Merge and save throws
    const combined = [...historical, ...sessionRecords]
    setAllThrows(combined)
    localStorage.setItem('card-throw-history', JSON.stringify(combined))

    // Process rounds
    const allRoundsData = [...historicalRounds]
    
    // Check if we need to create a new round from session
    if (sessionRecords.length >= THROWS_PER_ROUND) {
      const roundThrows = sessionRecords.slice(-THROWS_PER_ROUND)
      const totalDistance = roundThrows.reduce((sum, t) => sum + t.distance, 0)
      const distances = roundThrows.map(t => t.distance)
      
      const newRound: Round = {
        id: `round-${Date.now()}`,
        totalDistance,
        longestThrow: Math.max(...distances),
        shortestThrow: Math.min(...distances),
        timestamp: Date.now(),
        throws: THROWS_PER_ROUND,
      }
      
      allRoundsData.push(newRound)
    }

    setAllRounds(allRoundsData)
    localStorage.setItem('card-rounds-history', JSON.stringify(allRoundsData))
  }, [isOpen, currentSessionThrows, cardNames])

  // Calculate stats
  const stats = useMemo(() => {
    const totalThrows = allThrows.length
    const totalDistance = allThrows.reduce((sum, t) => sum + t.distance, 0)
    const averageDistance = totalThrows > 0 ? Math.floor(totalDistance / totalThrows) : 0

    // Current round progress
    const currentRoundThrows = currentSessionThrows.length % THROWS_PER_ROUND || 0
    const currentRoundDistance = currentSessionThrows
      .slice(-currentRoundThrows || -THROWS_PER_ROUND)
      .reduce((sum, t) => sum + t.distance, 0)
    
    const currentLongest = currentRoundThrows > 0 
      ? Math.max(...currentSessionThrows.slice(-currentRoundThrows).map(t => t.distance))
      : 0
    
    const currentShortest = currentRoundThrows > 0
      ? Math.min(...currentSessionThrows.slice(-currentRoundThrows).map(t => t.distance))
      : 0

    // All-time bests
    const allTimeBestDistance = allRounds.length > 0
      ? Math.max(...allRounds.map(r => r.totalDistance))
      : 0
    
    const allTimeLongest = allThrows.length > 0
      ? Math.max(...allThrows.map(t => t.distance))
      : 0
    
    const allTimeShortest = allThrows.length > 0
      ? Math.min(...allThrows.map(t => t.distance))
      : Infinity

    return {
      totalThrows,
      totalDistance,
      averageDistance,
      currentRoundThrows,
      currentRoundDistance,
      currentLongest,
      currentShortest,
      allTimeBestDistance,
      allTimeLongest,
      allTimeShortest: allTimeShortest === Infinity ? 0 : allTimeShortest,
    }
  }, [allThrows, allRounds, currentSessionThrows])

  const topRounds = useMemo(() => {
    return [...allRounds]
      .sort((a, b) => b.totalDistance - a.totalDistance)
      .slice(0, 3)
  }, [allRounds])

  const handleShare = async () => {
    const bestRoundDistance = allRounds.length > 0
      ? Math.max(...allRounds.map(r => r.totalDistance))
      : 0

    const shareText = `I've thrown ${stats.totalThrows} cards ${stats.totalDistance.toLocaleString()} light-years into the void.

Best Round: ${bestRoundDistance.toLocaleString()} ly
Longest Throw: ${stats.allTimeLongest.toLocaleString()} ly
Shortest Throw: ${stats.allTimeShortest.toLocaleString()} ly

Can you beat my distance? qdfafo.com (mobile only)`

    if (navigator.share) {
      try {
        setShareStatus('sharing')
        await navigator.share({ text: shareText })
        setShareStatus('idle')
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          copyToClipboard(shareText)
        }
        setShareStatus('idle')
      }
    } else {
      copyToClipboard(shareText)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setShareStatus('copied')
      setTimeout(() => setShareStatus('idle'), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const clearHistory = () => {
    if (confirm('Clear all throw history and rounds? This cannot be undone.')) {
      localStorage.removeItem('card-throw-history')
      localStorage.removeItem('card-rounds-history')
      setAllThrows([])
      setAllRounds([])
    }
  }

  if (!isOpen) return null

  return (
    <div className="stats-modal-overlay" onClick={onClose}>
      <div className="stats-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="stats-modal-header">
          <h2 className="stats-modal-title">Stats</h2>
          <button className="stats-modal-close" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Overall Summary */}
        <div className="stats-summary">
          <div className="stat-cell">
            <div className="stat-value">{stats.totalThrows}</div>
            <div className="stat-label">Total Throws</div>
          </div>
          <div className="stat-cell">
            <div className="stat-value">{stats.totalDistance.toLocaleString()}</div>
            <div className="stat-label">Total Light-Years</div>
          </div>
          <div className="stat-cell">
            <div className="stat-value">{stats.averageDistance.toLocaleString()}</div>
            <div className="stat-label">Avg Distance</div>
          </div>
        </div>

        {/* Current Round Progress */}
        {stats.currentRoundThrows > 0 && (
          <div className="stats-section current-round">
            <h3 className="stats-section-title">
              Current Round ({stats.currentRoundThrows}/{THROWS_PER_ROUND})
            </h3>
            
            <div className="round-stats">
              <div className="round-stat-row">
                <span className="round-stat-label">Total Distance</span>
                <div className="round-stat-values">
                  <span className="round-stat-current">{stats.currentRoundDistance.toLocaleString()}</span>
                  {stats.allTimeBestDistance > 0 && (
                    <span className="round-stat-best">Best: {stats.allTimeBestDistance.toLocaleString()}</span>
                  )}
                </div>
              </div>

              <div className="round-stat-row">
                <span className="round-stat-label">Longest Throw</span>
                <div className="round-stat-values">
                  <span className="round-stat-current">{stats.currentLongest.toLocaleString()}</span>
                  {stats.allTimeLongest > 0 && (
                    <span className="round-stat-best">Best: {stats.allTimeLongest.toLocaleString()}</span>
                  )}
                </div>
              </div>

              <div className="round-stat-row">
                <span className="round-stat-label">Shortest Throw</span>
                <div className="round-stat-values">
                  <span className="round-stat-current">{stats.currentShortest.toLocaleString()}</span>
                  {stats.allTimeShortest > 0 && (
                    <span className="round-stat-best">Low: {stats.allTimeShortest.toLocaleString()}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top 3 Rounds */}
        {topRounds.length > 0 && (
          <div className="stats-section">
            <h3 className="stats-section-title">Top 3 Rounds All Time</h3>
            
            <div className="podium">
              {topRounds.map((round, idx) => (
                <div key={round.id} className={`podium-place place-${idx + 1}`}>
                  {/* Custom Podium SVG */}
                  <div className="podium-icon">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      {idx === 0 && (
                        <>
                          <rect x="6" y="12" width="20" height="16" fill="rgba(6, 182, 212, 0.2)" stroke="rgba(6, 182, 212, 0.6)" strokeWidth="2" rx="2"/>
                          <circle cx="16" cy="8" r="5" fill="rgba(6, 182, 212, 0.3)" stroke="rgba(6, 182, 212, 0.8)" strokeWidth="2"/>
                        </>
                      )}
                      {idx === 1 && (
                        <>
                          <rect x="7" y="16" width="18" height="12" fill="rgba(6, 182, 212, 0.15)" stroke="rgba(6, 182, 212, 0.5)" strokeWidth="2" rx="2"/>
                          <circle cx="16" cy="11" r="4" fill="rgba(6, 182, 212, 0.2)" stroke="rgba(6, 182, 212, 0.6)" strokeWidth="2"/>
                        </>
                      )}
                      {idx === 2 && (
                        <>
                          <rect x="8" y="20" width="16" height="8" fill="rgba(6, 182, 212, 0.1)" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="2" rx="2"/>
                          <circle cx="16" cy="15" r="3" fill="rgba(6, 182, 212, 0.15)" stroke="rgba(6, 182, 212, 0.5)" strokeWidth="2"/>
                        </>
                      )}
                    </svg>
                  </div>
                  
                  <div className="podium-rank">#{idx + 1}</div>
                  <div className="podium-distance">{round.totalDistance.toLocaleString()} ly</div>
                  <div className="podium-meta">
                    <span>Longest: {round.longestThrow.toLocaleString()}</span>
                    <span>Shortest: {round.shortestThrow.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {allThrows.length === 0 && (
          <div className="empty-state">
            Throw {THROWS_PER_ROUND} cards to complete a round
          </div>
        )}

        {/* Actions */}
        <div className="stats-actions">
          <button 
            className="share-button"
            onClick={handleShare}
            disabled={allThrows.length === 0}
          >
            {/* Share SVG */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
            </svg>
            {shareStatus === 'copied' ? 'Copied!' : shareStatus === 'sharing' ? 'Sharing...' : 'Share Stats'}
          </button>

          <button className="clear-button" onClick={clearHistory} disabled={allThrows.length === 0}>
            Clear History
          </button>
        </div>
      </div>
    </div>
  )
}