"use client";
import React from "react";
import Particles from "./particles";

export default function Gooey3DLoader() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-linear-to-b from-black via-gray-900 to-gray-800" />
      <div className="absolute inset-0 bg-[url('/fog1.png')] opacity-25 animate-fogMove bg-cover bg-center" />
      <div className="absolute inset-0 bg-[url('/fog2.png')] opacity-15 animate-fogMoveReverse bg-cover bg-center" />
      <div className="absolute top-1/3 left-1/4 w-[40vw] h-[40vh] bg-[radial-gradient(circle,rgba(255,0,100,0.2),transparent_70%)] blur-3xl animate-pulseSlow"></div>
      <div className="absolute bottom-1/4 right-1/5 w-[35vw] h-[35vh] bg-[radial-gradient(circle,rgba(0,150,255,0.15),transparent_80%)] blur-2xl animate-pulseSlow delay-700"></div>
      <div className="absolute inset-0 overflow-hidden">
      </div>
      <svg
        className="w-20 h-20 relative z-10"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 20 -10"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>

          <radialGradient id="grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#d8b4fe" />
            <stop offset="100%" stopColor="#7c3aed" />
          </radialGradient>
        </defs>

        <g filter="url(#goo)">
          {[...Array(5)].map((_, i) => (
            <circle
              key={i}
              cx={50}
              cy={50}
              r="8"
              fill="url(#grad)"
              className="circle-spin"
              style={{ transformOrigin: "50px 50px", animationDuration: `${1 + i * 0.2}s` }}
            />
          ))}
        </g>
      </svg>

      <style jsx>{`
        .circle-spin {
          animation-name: spin;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg) translateX(25px) rotate(0deg); }
          50% { transform: rotate(180deg) translateX(25px) rotate(-180deg); }
          100% { transform: rotate(360deg) translateX(25px) rotate(-360deg); }
        }
      `}</style>
    </div>
  );
}
