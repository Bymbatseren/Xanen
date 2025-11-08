"use client";

import { useState } from "react";
import Avatar from "./_components/avatar";

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
    setError("");

    if (!validate()) return; 

    setLoading(true);

    try {
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch (err) {
        console.log("No JSON returned", err);
      }

      if (!res.ok) {
        setError(data?.error || "Алдаа гарлаа");
      } else {
        setId(data.userId);
       setPagination(2);
       
      }
    } catch (err) {
      setError("Сүлжээний алдаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center px-4">
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-700">
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
        </div>) : (
         <div>
          <Avatar id={id} />
         </div>
        )}
      </div>
      
    </div>
    
  );
}
