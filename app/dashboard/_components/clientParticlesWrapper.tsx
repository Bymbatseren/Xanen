
"use client";

import dynamic from "next/dynamic";
const Particles = dynamic(() => import("./../../_components/particles"), {
  ssr: false,
});

export default function ClientParticlesWrapper() {
  return <Particles />;
}
