import type { HeaderProps } from '../../types'
import QSTULogo, { type QSTUPanel } from './QSTULogo/QSTULogo'
import ForceGraph from '../Hero/ForceGraph'
import './Header.css'

type Props = HeaderProps & {
  onOpenPanel?: (panel: QSTUPanel) => void
}

export default function Header({ transparent = false, onOpenPanel }: Props) {
  const openFromNode = (id: string) => {
    if (id === 'ABOUT') onOpenPanel?.('about')
    if (id === 'CONTACT') onOpenPanel?.('contact')
    if (id === 'RESUME') onOpenPanel?.('resume')
  }

  return (
    <header className={`header ${transparent ? 'transparent' : ''}`}>
      <div className="header-logo">
        <QSTULogo onSelect={onOpenPanel} />
      </div>

      <div className="header-motif">
        <ForceGraph onNodeSelect={openFromNode} />
      </div>
    </header>
  )
}
