import { useRef, createContext } from 'react';
import { useMotionValue, MotionValue } from 'framer-motion';
import './Dock.css';

interface DockProps {
  children: React.ReactNode;
}

export const MouseContext = createContext<MotionValue<number> | null>(null);

export default function Dock({ children }: DockProps) {
  const dockRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(Infinity);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.pageX);
  };

  const handleMouseLeave = () => {
    mouseX.set(Infinity);
  };

  return (
    <MouseContext.Provider value={mouseX}>
      <div className="dock-container">
        <div
          ref={dockRef}
          className="dock"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {children}
        </div>
      </div>
    </MouseContext.Provider>
  );
}