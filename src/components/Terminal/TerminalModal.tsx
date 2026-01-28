// src/components/Terminal/TerminalModal.tsx
import { useState } from 'react';
import {
  useTransition,
  useSpring,
  useChain,
  config,
  animated,
  useSpringRef,
} from '@react-spring/web';
import './TerminalModal.css';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  title: string;
  children: React.ReactNode;
}

export default function TerminalModal({ 
  isOpen, 
  onClose, 
  onMinimize,
  title, 
  children 
}: TerminalModalProps) {
  const [isMaximized, setIsMaximized] = useState(false);

  const springApi = useSpringRef();
  const modalSpring = useSpring({
    ref: springApi,
    config: config.stiff,
    from: { 
      opacity: 0,
      scale: 0.8,
    },
    to: {
      opacity: isOpen ? 1 : 0,
      scale: isOpen ? 1 : 0.8,
    },
  });

  const transApi = useSpringRef();
  const contentTransition = useTransition(isOpen ? [1] : [], {
    ref: transApi,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: config.gentle,
  });

  useChain(isOpen ? [springApi, transApi] : [transApi, springApi], [
    0,
    isOpen ? 0.15 : 0.1,
  ]);

  if (!isOpen && modalSpring.opacity.get() === 0) return null;

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleMinimize = () => {
    if (onMinimize) {
      onMinimize();
    } else {
      onClose();
    }
  };

  return (
    <div className="terminal-canvas">
      <animated.div
        className={`terminal-window ${isMaximized ? 'maximized' : ''}`}
        style={{
          opacity: modalSpring.opacity,
          transform: modalSpring.scale.to(s => `scale(${s})`),
        }}
      >
        {contentTransition((style, item) => 
          item ? (
            <animated.div 
              className="terminal-content"
              style={style}
            >
              <div className="terminal-header">
                <div className="terminal-controls">
                  <button 
                    className="terminal-btn close" 
                    onClick={onClose}
                    title="Close"
                  />
                  <button 
                    className="terminal-btn minimize" 
                    onClick={handleMinimize}
                    title="Minimize"
                  />
                  <button 
                    className="terminal-btn maximize" 
                    onClick={handleMaximize}
                    title={isMaximized ? "Restore" : "Maximize"}
                  />
                </div>
                <div className="terminal-title">{title}</div>
              </div>
              <div className="terminal-body">
                {children}
              </div>
            </animated.div>
          ) : null
        )}
      </animated.div>
    </div>
  );
}
