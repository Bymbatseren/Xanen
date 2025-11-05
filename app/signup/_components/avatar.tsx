"use client";

import { set } from "mongoose";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AvatarUpload({ id }: { id: string }) {
  
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    avatar: "",
    phone: "",
    bio: ""
  });
  const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
      const [error, setError] = useState("");


    const validate=()=>{
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        if(formData.phone && !phoneRegex.test(formData.phone)){
           setError("Зөв утасны дугаар оруулна уу.");
            return false;
        }
        return true;
    }
  const handleUpload = async (input: HTMLInputElement) => {
    try {
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onloadend = () => setAvatarPreview(reader.result as string);
        reader.readAsDataURL(file);
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "Xanen_cloudinary")
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/df88yvhqr/upload",
          { method: "POST", body: data }
        );
        if (!response.ok) throw new Error("Image upload failed");
        const dataJson = await response.json();
        setFormData({ ...formData, avatar: dataJson.secure_url });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Зураг оруулах явцад алдаа гарлаа. Дахин оролдоно уу!");
    }
  };

  const handleSubmit = async () => {
    setError("");
    if(!validate()) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/user/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        router.push("/signin");
      } else {
        const error = await res.json();
        alert(error.error || "Профайл шинэчлэхэд алдаа гарлаа.");
      }
    } catch (err) {
      console.error(err);
      alert("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsLoading(false);
    }
  };
 const handleSkip=async()=>{
    setIsLoading(true);
    try {
        router.push("/signin");
    } catch (err) {
      console.error(err);
      alert("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsLoading(false);
    }
    }

  return (
    <div >
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
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="w-full h-full object-cover"
              />
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

        <div className="flex gap-2">
            <button
          onClick={handleSubmit}
          className="w-full bg-gray-600 hover:bg-gray-500 cursor-pointer transition duration-300 mt-6 text-white py-2 rounded-lg font-semibold shadow-lg"
          disabled={isLoading}
        >
          {isLoading ? "Шинэчилж байна..." : "Алгасах"}
        </button>
        <button
          onClick={handleSkip}
          className="w-full bg-purple-600 cursor-pointer hover:bg-purple-500 transition duration-300 mt-6 text-white py-2 rounded-lg font-semibold shadow-lg"
          disabled={isLoading}
        >
          {isLoading ? "Шинэчилж байна..." : "Хадгалах"}
        </button>
        </div>
      </div>
    </div>
  );
}
