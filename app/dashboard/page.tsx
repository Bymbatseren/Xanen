"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    router.replace("/");
  };

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

  if (loading) return <div className="text-white text-center p-10">Түр хүлээнэ үү...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl">Welcome to your Dashboard</h1>
      <p>You are successfully authenticated 🎉</p>
      <button onClick={handleLogout} className="mt-4 px-4 py-2 bg-red-600 text-white rounded">
        Logout
      </button>
    </div>
  );
}
