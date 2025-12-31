import { useEffect, useRef } from 'react';

interface SpectrumVisualizerProps {
  isPlaying: boolean;
}

export function SpectrumVisualizer({ isPlaying }: SpectrumVisualizerProps) {
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let animationId: number;

    const animate = () => {
      barsRef.current.forEach(bar => {
        if (bar) {
          bar.style.height = isPlaying ? `${Math.random() * 100}%` : '5%';
        }
      });
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying]);

  return (
    <div className="spectrum">
      {[0, 1, 2, 3, 4].map(i => (
        <div
          key={i}
          ref={el => {
            barsRef.current[i] = el;
          }}
        />
      ))}
    </div>
  );
}
