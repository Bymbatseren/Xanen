"use client"
import { useRouter } from "next/navigation";
import LogoHover from "./logo";
import { useState } from "react";

export default function SigninForm(){
     const router = useRouter();
      const [formData, setFormData] = useState({ email: "", password: "" });
      const [error, setError] = useState("");
      const [loading, setLoading] = useState(false);
    
      const validate = () => {
        const { email, password } = formData;
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
          setError("Зөв Э-мэйл хаяг оруулна уу");
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
        if (!validate()) return;
    
        try {
          setLoading(true);
          const res = await fetch("/api/auth/sign-in", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
            credentials: "include",
          });
    
          if (res.ok) {
            const proxyRes = await fetch("/dashboard/proxy", {
              method: "GET",
              credentials: "include",
            });
            if (proxyRes.ok) router.push("/dashboard");
            else router.push("/signin");
          } else {
            const error = await res.json();
            alert(error.error || "Sign in failed");
          }
        } catch (err) {
          console.error(err);
          alert("Something went wrong");
        } finally {
          setLoading(false);
        }
      };
      const handleForgetPassword=()=>{
        router.push("/forget-password")
      }

 return (
    
     
        <div className="w-full md:w-1/2  rounded-2xl p-6 sm:p-8 ">
          <h2 className="text-2xl sm:text-[28px] font-semibold text-[#DCDDDE] mb-2">
            Тавтай морил
          </h2>
          <h3 className="text-xs sm:text-sm text-[#DCDDDE] mb-6">
            Та өөрийн бүртгэлтэй э-мэйл хаяг болон нууц үгээ оруулна уу.
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Э-мэйл"
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
              <button
                type="button"
                onClick={handleForgetPassword}
                className="text-xs sm:text-sm text-gray-400 cursor-pointer hover:text-purple-300 transition duration-300"
              >
                Нууц үг мартсан уу?
              </button>
            </div>

            <button
              type="submit"
              className={`w-full bg-purple-600 hover:bg-purple-500 transition duration-300 text-white py-2 rounded-lg font-semibold shadow-lg ${
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
    
 )
}