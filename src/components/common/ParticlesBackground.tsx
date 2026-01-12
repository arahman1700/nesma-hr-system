import React, { useEffect, useRef } from "react";
import { cn } from "../../utils/cn";

interface ParticlesBackgroundProps {
  count?: number;
  color?: string;
  className?: string;
  minSize?: number;
  maxSize?: number;
  minDuration?: number;
  maxDuration?: number;
}

export const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({
  count = 25,
  color = "#80D1E9",
  className,
  minSize = 2,
  maxSize = 6,
  minDuration = 15,
  maxDuration = 30,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear existing particles
    container.innerHTML = "";

    // Create particles
    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";

      // Random properties
      const size = minSize + Math.random() * (maxSize - minSize);
      const left = Math.random() * 100;
      const delay = Math.random() * maxDuration;
      const duration =
        minDuration + Math.random() * (maxDuration - minDuration);
      const opacity = 0.1 + Math.random() * 0.3;

      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        left: ${left}%;
        opacity: 0;
        animation: particleFloat ${duration}s linear infinite;
        animation-delay: ${delay}s;
        pointer-events: none;
      `;

      container.appendChild(particle);
    }
  }, [count, color, minSize, maxSize, minDuration, maxDuration]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed inset-0 overflow-hidden pointer-events-none z-0",
        className,
      )}
      style={{
        background: "transparent",
      }}
    />
  );
};

// Full portal background with gradient and particles
interface PortalBackgroundProps {
  showParticles?: boolean;
  particleCount?: number;
  className?: string;
}

export const PortalBackground: React.FC<PortalBackgroundProps> = ({
  showParticles = true,
  particleCount = 25,
  className,
}) => {
  return (
    <div className={cn("fixed inset-0 z-0", className)}>
      {/* Main gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #0E2841 0%, #203366 50%, #0E2841 100%)",
        }}
      />

      {/* Hero gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at top, rgba(128, 209, 233, 0.2) 0%, transparent 70%),
            radial-gradient(ellipse at bottom right, rgba(46, 49, 146, 0.25) 0%, transparent 70%)
          `,
        }}
      />

      {/* Particles */}
      {showParticles && <ParticlesBackground count={particleCount} />}
    </div>
  );
};

export default ParticlesBackground;
