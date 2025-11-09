"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SigninPage from "./_components/main";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/dashboard/proxy", { credentials: "include" });
        const data = await res.json();

        if (data.authenticated) {
          router.replace("/dashboard");
        } else {
          setLoading(false);
        }
      } catch {
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading) return <div className="text-white text-center p-10">Түр хүлээнэ үү...</div>;

  return <SigninPage />;
}
