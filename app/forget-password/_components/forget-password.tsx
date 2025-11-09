"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { OTPInputGroup } from "../../_components/otp-input";

export default function ForgetPasswordForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "" });
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pagination, setPagination] = useState(1);  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const handlePopState = () => {
      setPagination((prev) => Math.max(prev - 1, 1));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
  const validateEmail = () => {
    const { email } = formData;
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setError("Зөв э-мэйл хаяг оруулна уу");
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    if (password.length < 6) {
      setError("Нууц үг дор хаяж 6 тэмдэгттэй байх ёстой");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Нууц үг таарахгүй байна");
      return false;
    }
    return true;
  };
  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Алдаа гарлаа");
       setError("")
      localStorage.setItem("forgotEmail", formData.email);
      setPagination(2);
      window.history.pushState({}, "", "");
     
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = localStorage.getItem("forgotEmail") || formData.email;
    if (otp.length < 6) {
      setError("OTP код бүрэн биш байна");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Алдаа гарлаа");
      setError("")
      localStorage.setItem("resetToken", data.resetToken);
      setResetToken(data.resetToken);
      setPagination(3);
      window.history.pushState({}, "", "");
     
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
 const handlePasswordReset = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validatePassword()) return;

  setLoading(true);
  try {
    const token = localStorage.getItem("resetToken") || resetToken;
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword: password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Алдаа гарлаа");
    localStorage.clear(); 
    setFormData({ email: "" });
    setOtp("");
    setResetToken("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setPagination(1);
    router.push("/")
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="w-full md:w-1/2  rounded-2xl  p-6 sm:p-8 ">
      {pagination === 1 && (
        <>
          <h2 className="text-2xl font-semibold text-[#DCDDDE] mb-2">
            Тавтай морил
          </h2>
          <h3 className="text-sm text-[#DCDDDE] mb-6">
            Та өөрийн бүртгэлтэй э-мэйл хаягаа оруулна уу.
          </h3>
          <form onSubmit={handleSubmitEmail} className="space-y-4">
            <input
              type="email"
              placeholder="Э-мэйл"
              className="w-full p-3 rounded-lg bg-black text-white border border-gray-600 focus:outline-none focus:border-purple-400"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              className={`w-full bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-lg font-semibold shadow-lg transition duration-300 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Түр хүлээнэ үү..." : "Нууц үг сэргээх"}
            </button>
          </form>
        </>
      )}

      {pagination === 2 && (
        <>
          <h3 className="text-sm text-[#DCDDDE] mb-6">
            Таны э-мэйлээр ирсэн баталгаажуулах кодыг оруулна уу.
          </h3>
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="flex justify-center">
              <OTPInputGroup length={6} onChange={setOtp} />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              className={`w-full bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-lg font-semibold shadow-lg transition duration-300 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Баталгаажуулж байна..." : "Баталгаажуулах"}
            </button>
          </form>
        </>
      )}

      {pagination === 3 && (
        <>
          <h3 className="text-sm text-[#DCDDDE] mb-4">
            Шинэ нууц үгээ тохируулна уу
          </h3>
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <input
              type="password"
              placeholder="Шинэ нууц үг"
              className="w-full p-3 rounded-lg bg-black text-white border border-gray-600 focus:outline-none focus:border-purple-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Нууц үг давтах"
              className="w-full p-3 rounded-lg bg-black text-white border border-gray-600 focus:outline-none focus:border-purple-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              className={`w-full bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-lg font-semibold shadow-lg transition duration-300 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Шинэчилж байна..." : "Нууц үг шинэчлэх"}
            </button>
          </form>
        </>
      )}

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
  );
}
