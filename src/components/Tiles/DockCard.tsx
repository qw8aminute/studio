import { useRef, useState, useContext } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { MouseContext } from './Dock';
import './DockCard.css';

interface DockCardProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function DockCard({ children, onClick }: DockCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isBouncing, setIsBouncing] = useState(false);
  
  const mouseXContext = useContext(MouseContext);
  const fallbackMouseX = useMotionValue(Infinity);
  const mouseX = mouseXContext ?? fallbackMouseX;

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Base size 140px, grows 40% to ~196px on direct hover
  // Neighbors also grow proportionally based on distance
  const widthSync = useTransform(distance, [-250, 0, 250], [140, 196, 140]);
  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  // Cards rise OUT of the dock on hover - this is the macOS magic
  const ySync = useTransform(distance, [-250, 0, 250], [0, -48, 0]);
  const y = useSpring(ySync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const handleClick = () => {
    if (isBouncing) return;
    
    setIsBouncing(true);
    
    setTimeout(() => {
      setIsBouncing(false);
      onClick?.();
    }, 800);
  };

  return (
    <motion.div
      ref={ref}
      className="dock-card"
      style={{ width, y }}
      onClick={handleClick}
      animate={
        isBouncing
          ? {
              y: [0, -60, 0, -35, 0, -15, 0],
              transition: {
                duration: 0.8,
                times: [0, 0.14, 0.28, 0.42, 0.56, 0.7, 1],
                ease: 'easeOut',
              },
            }
          : undefined
      }
      whileTap={!isBouncing ? { scale: 0.95 } : undefined}
    >
      {children}
    </motion.div>
  );
}