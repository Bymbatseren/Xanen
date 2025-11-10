"use client";

import { useState } from "react";
import Avatar from "./_components/avatar";
import LogoHover from "../_components/logo";
import Particles from "../_components/particles";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(1);
  const [id, setId] = useState("");

  const validate = () => {
    const { username, email, password } = formData;

    if (username.length < 3) {
      setError("Хэрэглэгчийн нэр дор хаяж 3 тэмдэгттэй байх ёстой");
      return false;
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setError("Зөв э-мэйл хаяг оруулна уу");
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
    setError("");

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Алдаа гарлаа");
      } else {
        setId(data.userId);
        setPagination(2);
      }
    } catch (err) {
      console.error(err);
      setError("Сүлжээний алдаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black text-white">
       <div className="absolute inset-0 bg-linear-to-b from-black via-gray-900 to-gray-800" />
      <div className="absolute inset-0 bg-[url('/fog1.png')] opacity-25 animate-fogMove bg-cover bg-center" />
      <div className="absolute inset-0 bg-[url('/fog2.png')] opacity-15 animate-fogMoveReverse bg-cover bg-center" />
      <div className="absolute top-1/3 left-1/4 w-[40vw] h-[40vh] bg-[radial-gradient(circle,rgba(255,0,100,0.2),transparent_70%)] blur-3xl animate-pulseSlow"></div>
      <div className="absolute bottom-1/4 right-1/5 w-[35vw] h-[35vh] bg-[radial-gradient(circle,rgba(0,150,255,0.15),transparent_80%)] blur-2xl animate-pulseSlow delay-700"></div>
      <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden  text-white">
        <Particles />
        <div className="absolute top-4 left-4 md:hidden z-20">
          <LogoHover className="w-[150px] h-[150px] sm:w-[150px] sm:h-[150px]" />
        </div>
        <div className="relative flex flex-col md:flex-row items-center justify-center w-full max-w-6xl gap-8 py-10">
          <div className="hidden md:flex justify-center md:justify-end w-full md:w-1/2">
            <LogoHover
              className="w-[180px] h-[180px] sm:w-[250px] sm:h-[250px] md:w-[350px] md:h-[350px] lg:w-[500px] lg:h-[500px] xl:w-[650px] xl:h-[650px]"
            />
          </div>
           <div className=" backdrop-blur-lg rounded-2xl  p-8 max-w-md w-full ">
        {pagination === 1 ? (
          <div>
            <h2 className="text-3xl font-bold  text-white mb-6">
              Бүртгэл үүсгэх
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Хэрэглэгчийн нэр"
                className="w-full p-3 rounded-lg bg-gray-700/70 text-white border border-gray-600 focus:outline-none focus:border-purple-400"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
              />

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

              <button
                type="submit"
                className={`cursor-pointer w-full bg-purple-600 hover:bg-purple-500 transition duration-300 text-white py-2 rounded-lg font-semibold shadow-lg ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Түр хүлээнэ үү..." : "Бүртгүүлэх"}
              </button>
            </form>

            <p className="text-sm text-center text-gray-400 mt-4">
              Бүртгэлтэй юу?{" "}
              <a
                href="/"
                className="text-purple-400 hover:text-purple-300 cursor-pointer"
              >
                Нэвтрэх
              </a>
            </p>
          </div>
        ) : (
          <div>
            <Avatar id={id} />
          </div>
        )}
      </div>
        
        </div>
      </div>
    </div>
  );
}
