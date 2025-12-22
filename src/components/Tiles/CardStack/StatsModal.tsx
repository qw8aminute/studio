import { useState, useEffect } from 'react'
import './StatsModal.css'

interface ThrowRecord {
  id: string
  cardName: string
  distance: number
  timestamp: number
  angle: number
}

interface StatsModalProps {
  isOpen: boolean
  onClose: () => void
  currentSessionThrows: Array<{ cardId: string; distance: number; angle: number }>
  cardNames: Map<string, string>
}

export default function StatsModal({ 
  isOpen, 
  onClose, 
  currentSessionThrows,
  cardNames 
}: StatsModalProps) {
  const [allThrows, setAllThrows] = useState<ThrowRecord[]>([])
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied' | 'sharing'>('idle')

  // Load throws from localStorage and merge with current session
  useEffect(() => {
    if (!isOpen) return

    const stored = localStorage.getItem('card-throw-history')
    const historical: ThrowRecord[] = stored ? JSON.parse(stored) : []
    
    // Convert current session to records
    const sessionRecords: ThrowRecord[] = currentSessionThrows.map(t => ({
      id: `${Date.now()}-${Math.random()}`,
      cardName: cardNames.get(t.cardId) || 'Unknown Card',
      distance: t.distance,
      timestamp: Date.now(),
      angle: t.angle,
    }))

    // Merge and save
    const combined = [...historical, ...sessionRecords]
    setAllThrows(combined)
    localStorage.setItem('card-throw-history', JSON.stringify(combined))
  }, [isOpen, currentSessionThrows, cardNames])

  const topFive = [...allThrows]
    .sort((a, b) => b.distance - a.distance)
    .slice(0, 5)

  const bottomFive = [...allThrows]
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5)

  const totalDistance = allThrows.reduce((sum, t) => sum + t.distance, 0)
  const averageDistance = allThrows.length > 0 ? Math.floor(totalDistance / allThrows.length) : 0

  const handleShare = async () => {
    const shareText = `I've thrown ${allThrows.length} cards ${totalDistance.toLocaleString()} light-years into the void. 🌌

Top throw: ${topFive[0]?.distance.toLocaleString() || 0} ly
Average: ${averageDistance.toLocaleString()} ly

Can you beat my distance?`

    // Try native share first
    if (navigator.share) {
      try {
        setShareStatus('sharing')
        await navigator.share({
          text: shareText,
        })
        setShareStatus('idle')
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          // Fall back to clipboard
          copyToClipboard(shareText)
        }
        setShareStatus('idle')
      }
    } else {
      // Fall back to clipboard
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
    if (confirm('Clear all throw history? This cannot be undone.')) {
      localStorage.removeItem('card-throw-history')
      setAllThrows([])
    }
  }

  if (!isOpen) return null

  return (
    <div className="stats-modal-overlay" onClick={onClose}>
      <div className="stats-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="stats-modal-header">
          <h2 className="stats-modal-title">Throw Statistics</h2>
          <button className="stats-modal-close" onClick={onClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Summary Stats */}
        <div className="stats-summary">
          <div className="stat-box">
            <div className="stat-value">{allThrows.length}</div>
            <div className="stat-label">Total Throws</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{totalDistance.toLocaleString()}</div>
            <div className="stat-label">Total Light-Years</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{averageDistance.toLocaleString()}</div>
            <div className="stat-label">Average Distance</div>
          </div>
        </div>

        {/* Top 5 */}
        <div className="stats-section">
          <h3 className="stats-section-title">
            <span className="section-icon">🚀</span>
            Top 5 Distances
          </h3>
          {topFive.length > 0 ? (
            <table className="stats-table">
              <thead>
                <tr>
                  <th className="rank-col">#</th>
                  <th className="card-col">Card</th>
                  <th className="distance-col">Distance</th>
                </tr>
              </thead>
              <tbody>
                {topFive.map((record, idx) => (
                  <tr key={record.id} className="top-row">
                    <td className="rank-col">
                      <span className="rank-badge">{idx + 1}</span>
                    </td>
                    <td className="card-col">{record.cardName}</td>
                    <td className="distance-col">
                      {record.distance.toLocaleString()} <span className="unit">ly</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">No throws yet. Go throw some cards!</div>
          )}
        </div>

        {/* Bottom 5 */}
        <div className="stats-section">
          <h3 className="stats-section-title">
            <span className="section-icon">🐌</span>
            Bottom 5 Distances
          </h3>
          {bottomFive.length > 0 ? (
            <table className="stats-table">
              <thead>
                <tr>
                  <th className="rank-col">#</th>
                  <th className="card-col">Card</th>
                  <th className="distance-col">Distance</th>
                </tr>
              </thead>
              <tbody>
                {bottomFive.map((record, idx) => (
                  <tr key={record.id} className="bottom-row">
                    <td className="rank-col">
                      <span className="rank-badge bottom">{idx + 1}</span>
                    </td>
                    <td className="card-col">{record.cardName}</td>
                    <td className="distance-col">
                      {record.distance.toLocaleString()} <span className="unit">ly</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">No throws yet. Go throw some cards!</div>
          )}
        </div>

        {/* Actions */}
        <div className="stats-actions">
          <button 
            className="share-button"
            onClick={handleShare}
            disabled={allThrows.length === 0}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
            </svg>
            {shareStatus === 'copied' ? 'Copied!' : shareStatus === 'sharing' ? 'Sharing...' : 'Share Stats'}
          </button>

          {allThrows.length > 0 && (
            <button className="clear-button" onClick={clearHistory}>
              Clear History
            </button>
          )}
        </div>
      </div>
    </div>
  )
}