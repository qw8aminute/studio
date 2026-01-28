import './StatsButton.css'

interface StatsButtonProps {
  onClick: () => void
  throwCount: number
}

export default function StatsButton({ onClick, throwCount }: StatsButtonProps) {
  return (
    <button 
      className="stats-button" 
      onClick={onClick}
      aria-label="View throw statistics"
    >
      <span className="stats-text">Stats</span>
      {throwCount > 0 && (
        <span className="stats-badge">{throwCount}</span>
      )}
    </button>
  )
}