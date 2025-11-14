"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Posts from "./_components/posts";


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
    <>
    <Posts/>
    
    </>
    
  );
}

