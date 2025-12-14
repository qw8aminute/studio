import type { HeaderProps } from '../../types'
import QSTULogo from './QSTULogo/QSTULogo'
import ForceGraph from '../Hero/ForceGraph'
import './Header.css'

export type HeaderPanel = 'about' | 'contact' | 'resume'

type Props = HeaderProps & {
  onOpenPanel?: (panel: HeaderPanel) => void
}

const NODE_TO_PANEL = {
  ABOUT: 'about',
  CONTACT: 'contact',
  RESUME: 'resume',
} as const satisfies Record<string, HeaderPanel>

export default function Header({ transparent = false, onOpenPanel }: Props) {
  const openFromNode = (id: string) => {
    const panel = NODE_TO_PANEL[id as keyof typeof NODE_TO_PANEL]
    if (panel) onOpenPanel?.(panel)
  }

  return (
    <header className={`header ${transparent ? 'transparent' : ''}`}>
      <div className="header-logo">
        {/* Logo menu buttons */}
        <QSTULogo onSelect={onOpenPanel} />
      </div>

      <div className="header-motif">
        {/* Force graph node clicks */}
        <ForceGraph onNodeSelect={openFromNode} />
      </div>
    </header>
  )
}
