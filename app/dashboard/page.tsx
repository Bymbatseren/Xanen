"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Particles from "../_components/particles";
import Posts from "./_components/posts";
import Header from "./_components/header";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/dashboard/proxy", { credentials: "include" });
        const data = await res.json();

        if (!data.authenticated) {
          router.replace("/");
        } else {
          setLoading(false);
        }
      } catch {
        router.replace("/");
      }
    })();
  }, [router]);

  if (loading)
    return <div className="text-white text-center p-10">Түр хүлээнэ үү...</div>;

  return (
    <div className="relative min-h-screen w-full bg-[#1c1c1d] text-white overflow-hidden flex justify-center items-center">
 
      <div className="absolute inset-0 z-0">
        <Particles />
      </div>
     <Header/>
    <Posts/>
      
    </div>
  );
}

