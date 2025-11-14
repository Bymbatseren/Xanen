"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import validate from "@/app/_components/functions";

export default function Avatar({ id }: { id: string }) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({ avatar: "", phone: "", bio: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();



  const handleUpload = async (input: HTMLInputElement) => {
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "Xanen_cloudinary");

    const res = await fetch("https://api.cloudinary.com/v1_1/df88yvhqr/upload", {
      method: "POST",
      body: data,
    });

    const json = await res.json();
    setFormData({ ...formData, avatar: json.secure_url });
  };

  const handleSubmit = async () => {
    setError("");
    if (!validate(formData.phone,setError)) return;
    setIsLoading(true);

    try {
      const res = await fetch(`/api/user/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/");
      } else {
        const json = await res.json();
        setError(json.error || "Профайл шинэчлэхэд алдаа гарлаа");
      }
    } catch (err) {
      console.error(err);
      setError("Сүлжээний алдаа");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => router.push("/");

  return (
    <div>
      <h2 className="text-15px 2xl:text-xl font-bold text-white mb-6">
        Профайл үүсгэх (заавал биш)
      </h2>

      <div className="flex flex-col items-center">
        <label
          htmlFor="avatar"
          className="w-24 h-24 rounded-full bg-gray-700 mb-4 flex items-center justify-center cursor-pointer overflow-hidden border-2 border-gray-600 hover:border-purple-400 transition"
        >
          {avatarPreview ? (
            <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-400">Фото</span>
          )}
        </label>
        <input
          type="file"
          id="avatar"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files && handleUpload(e.target)}
        />
      </div>

      <input
        type="text"
        placeholder="Утасны дугаар"
        className="w-full p-3 mt-4 rounded-lg bg-gray-700/70 text-white border border-gray-600 focus:outline-none focus:border-purple-400"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      />
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <textarea
        placeholder="Товч танилцуулга"
        className="w-full p-3 mt-4 h-24 resize-none rounded-lg bg-gray-700/70 text-white border border-gray-600 focus:outline-none focus:border-purple-400"
        value={formData.bio}
        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
      />

      <div className="flex gap-2 mt-6">
        <button
          onClick={handleSkip}
          className="w-full bg-gray-600 hover:bg-gray-500 cursor-pointer transition duration-300 text-white py-2 rounded-lg font-semibold shadow-lg"
          disabled={isLoading}
        >
          Алгасах
        </button>
        <button
          onClick={handleSubmit}
          className="w-full bg-purple-600 cursor-pointer hover:bg-purple-500 transition duration-300 text-white py-2 rounded-lg font-semibold shadow-lg"
          disabled={isLoading}
        >
          {isLoading ? "Шинэчилж байна..." : "Хадгалах"}
        </button>
      </div>
    </div>
  );
}
