"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
   const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const validate = () => {
    const { email, password } = formData;
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setError("Зөв и-мэйл хаяг оруулна уу");
      return false;
    }

    if (password.length < 6) {
      setError("Нууц үг дор хаяж 6 тэмдэгттэй байх ёстой");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
        credentials: "include", 
      });

      if (res.ok) {
        console.log("Sign in successful");
        const proxyRes = await fetch("/dashboard/proxy", {
          method: "GET",
          credentials: "include",
        });

        if (proxyRes.ok) {
          router.push("/dashboard"); 
        } else {
          router.push("/signin");
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
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center px-4">
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-700">
        <h2 className="text-[28px] font-semibold text-[#DCDDDE]  mb-2 ">
          Тавтай морил
        </h2>
        <h3 className="text-[12px] font-semibold text-[#DCDDDE]  mb-6">Та өөрийн бүртгэлтэй и-мэйл хаяг болон нууц үгээ оруулна уу.</h3>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            placeholder="И-мэйл"
            className="w-full p-3 rounded-lg bg-gray-700/70 text-white border border-gray-600 focus:outline-none focus:border-purple-400"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />

          <input
            type="password"
            placeholder="Нууц үг"
            className="w-full p-3 rounded-lg bg-gray-700/70 text-white border border-gray-600 focus:outline-none focus:border-purple-400"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex justify-end">
            <button className="text-[12px] cursor-pointer hover:text-purple-300 transition duration-300">
              Нууц үг мартсан уу?
            </button>
          </div>

          <button
            type="submit"
            className={`cursor-pointer w-full bg-purple-600 hover:bg-purple-500 transition duration-300 text-white py-2 rounded-lg font-semibold shadow-lg ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Түр хүлээнэ үү..." : "Нэвтрэх"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-400 mt-4">
          Бүртгэлгүй юу?{" "}
          <a
            href="/signup"
            className="text-purple-400 hover:text-purple-300 cursor-pointer"
          >
            Бүртгүүлэх
          </a>
        </p>
      </div>
    </div>
  );
}
