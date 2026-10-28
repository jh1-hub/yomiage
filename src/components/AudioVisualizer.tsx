/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isPlaying: boolean;
  rate: number;
  pitch: number;
  theme: 'light' | 'dark' | 'sepia';
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isPlaying,
  rate,
  pitch,
  theme,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const phaseRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;
    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      if (!canvas || !ctx) return;
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const numBars = 36;
      const barSpacing = width / numBars;
      const barWidth = Math.max(2, barSpacing * 0.45);
      const centerY = height / 2;

      // Color scheme based on theme
      let primaryColor = '59, 130, 246'; // blue-500
      if (theme === 'dark') {
        primaryColor = '96, 165, 250'; // blue-400
      } else if (theme === 'sepia') {
        primaryColor = '194, 65, 12'; // amber-700
      }

      if (isPlaying) {
        phaseRef.current += 0.08 * (rate || 1);
      } else {
        phaseRef.current += 0.02;
      }

      for (let i = 0; i < numBars; i++) {
        const x = i * barSpacing + (barSpacing - barWidth) / 2;
        const norm = i / (numBars - 1); // 0 to 1
        const bellCurve = Math.sin(norm * Math.PI); // higher in middle

        let barHeight: number;
        let opacity: number;

        if (isPlaying) {
          // Dynamic frequency oscillation
          const wave1 = Math.sin(phaseRef.current + i * 0.35 * pitch);
          const wave2 = Math.cos(phaseRef.current * 1.5 + i * 0.2);
          const combined = (wave1 + wave2 + 2) / 4; // 0 to 1
          const energy = Math.max(0.15, combined * bellCurve);
          barHeight = energy * (height * 0.78);
          opacity = 0.4 + energy * 0.6;
        } else {
          // Subtle idle ambient wave
          const idleWave = Math.sin(phaseRef.current + i * 0.2);
          barHeight = (4 + idleWave * 3) * (height / 40);
          opacity = 0.25;
        }

        const y = centerY - barHeight / 2;

        ctx.fillStyle = `rgba(${primaryColor}, ${opacity})`;
        ctx.beginPath();
        // Rounded pill bar
        const r = barWidth / 2;
        ctx.roundRect(x, y, barWidth, Math.max(barWidth, barHeight), r);
        ctx.fill();
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      window.removeEventListener('resize', resize);
    };
  }, [isPlaying, rate, pitch, theme]);

  return (
    <div className="w-full h-10 px-2 flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};
