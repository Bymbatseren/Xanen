"use client";
import { useEffect, useState } from "react";

export default function Particles() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768; 
    const count = isMobile ? 250 : 1550;

    const arr = [...Array(count)].map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      animationDelay: Math.random() * 10,
      animationDuration: 8 + Math.random() * 6,
    }));
    setParticles(arr);
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      const newCount = newIsMobile ? 250 : 1550;
      if (newCount !== particles.length) {
        const newArr = [...Array(newCount)].map(() => ({
          top: Math.random() * 100,
          left: Math.random() * 100,
          animationDelay: Math.random() * 10,
          animationDuration: 8 + Math.random() * 6,
        }));
        setParticles(newArr);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white/30 rounded-full animate-floatParticle"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            animationDelay: `${p.animationDelay}s`,
            animationDuration: `${p.animationDuration}s`,
          }}
        />
      ))}
    </>
  );
}
