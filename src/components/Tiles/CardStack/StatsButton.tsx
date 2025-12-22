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
      <svg 
        className="stats-icon" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Bar chart icon */}
        <path d="M3 3v18h18" />
        <path d="M18 17V9" />
        <path d="M13 17V5" />
        <path d="M8 17v-3" />
      </svg>
      <span className="stats-text">Stats</span>
      {throwCount > 0 && (
        <span className="stats-badge">{throwCount}</span>
      )}
    </button>
  )
}