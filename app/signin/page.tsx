"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // HTTPOnly cookie дамжуулна
      });

      if (res.ok) {
        console.log("Sign in successful");

        // Proxy route руу шалгуулж, зөв бол dashboard руу шилжүүлэх
        const proxyRes = await fetch("/dashboard/proxy", {
          method: "GET",
          credentials: "include",
        });

        if (proxyRes.ok) {
          router.push("/dashboard"); // Зөвшөөрөгдсөн хэрэглэгч
        } else {
          router.push("/signin"); // Cookie байхгүй эсвэл буруу бол
        }

      } else {
        const error = await res.json();
        alert(error.error || "Sign in failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">Sign In</button>
    </form>
  );
}
