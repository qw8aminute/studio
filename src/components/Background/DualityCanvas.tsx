import { useEffect, useRef } from 'react';
import './DualityCanvas.css';

const TOKENS = {
  cosmic: '#0b1220',
  starlight: '#f2efe8',
  aurora: '#e63946',
};

export default function DualityCanvas() {
  return (
    <>
      <Starfield />
      <ConstellationQ />
    </>
  );
}

// ============ Starfield Component ============
const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const starsRef = useRef<
    Array<{ x: number; y: number; z: number; size: number; phase: number; twinkleSpeed: number }>
  >([]);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      starsRef.current = Array.from({ length: 200 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1 + 0.2,
        size: (Math.random() * 1.5 + 0.5) * dpr,
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.001 + 0.0005,
      }));
    };

    const draw = (time: number) => {
      ctx.fillStyle = TOKENS.cosmic;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const offsetX = (mouseRef.current.x - 0.5) * 20;
      const offsetY = (mouseRef.current.y - 0.5) * 15;

      starsRef.current.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.phase);
        const alpha = Math.max(0.2, Math.min(1, 0.6 + twinkle * 0.4));

        ctx.globalAlpha = alpha;
        ctx.fillStyle = TOKENS.starlight;

        const x = star.x + offsetX * (1.5 - star.z);
        const y = star.y + offsetY * (1.5 - star.z);

        ctx.beginPath();
        ctx.arc(x, y, star.size * star.z, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouseRef.current = {
          x: e.touches[0].clientX / window.innerWidth,
          y: e.touches[0].clientY / window.innerHeight,
        };
      }
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isReducedMotion) {
      draw(performance.now());
    } else {
      draw(0);
    }

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
};

// ============ Constellation Component ============
const ConstellationQ: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Flipped Y coordinates (1 - original) to shoot upward
    const points: [number, number][] = [
      [0.72, 0.72], // was 0.28
      [0.79, 0.64], // was 0.36
      [0.78, 0.50], // stays same (middle)
      [0.66, 0.42], // was 0.58
      [0.54, 0.48], // was 0.52
      [0.50, 0.62], // was 0.38
      [0.60, 0.72], // was 0.28
      [0.72, 0.72], // was 0.28
      [0.74, 0.56], // was 0.44
      [0.82, 0.38], // was 0.62 - tail shoots UP
    ];

    const connections: [number, number][] = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 0],
      [8, 9],
      [0, 8],
    ];

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = TOKENS.starlight;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.15;

      connections.forEach(([a, b]) => {
        const ax = points[a][0] * canvas.width;
        const ay = points[a][1] * canvas.height;
        const bx = points[b][0] * canvas.width;
        const by = points[b][1] * canvas.height;

        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      });

      ctx.fillStyle = TOKENS.starlight;
      points.forEach((point, i) => {
        const x = point[0] * canvas.width;
        const y = point[1] * canvas.height;
        const pulse = Math.sin(time * 0.002 + i * 0.5) * 0.3 + 1;

        ctx.globalAlpha = 0.4 + pulse * 0.1;
        ctx.beginPath();
        ctx.arc(x, y, 3 * pulse, 0, Math.PI * 2);
        ctx.fill();
      });

      // Tail glow (now at top)
      const tailX = points[9][0] * canvas.width;
      const tailY = points[9][1] * canvas.height;
      const gradient = ctx.createRadialGradient(tailX, tailY, 0, tailX, tailY, 60);
      gradient.addColorStop(0, 'rgba(230, 57, 70, 0.3)');
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.globalAlpha = Math.sin(time * 0.001) * 0.15 + 0.2;
      ctx.beginPath();
      ctx.arc(tailX, tailY, 60, 0, Math.PI * 2);
      ctx.fill();

      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!isReducedMotion) {
        connections.forEach(([a, b], i) => {
          const progress = (time * 0.0002 * (i + 1)) % 1;
          const ax = points[a][0] * canvas.width;
          const ay = points[a][1] * canvas.height;
          const bx = points[b][0] * canvas.width;
          const by = points[b][1] * canvas.height;

          const x = ax + (bx - ax) * progress;
          const y = ay + (by - ay) * progress;

          ctx.fillStyle = TOKENS.aurora;
          ctx.globalAlpha = 0.6;
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        });

        animationRef.current = requestAnimationFrame(draw);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isReducedMotion) {
      draw(performance.now());
    } else {
      draw(0);
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
};
