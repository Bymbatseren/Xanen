"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { X, Image, BarChart3, Smile, MapPin } from "lucide-react";
import { useState, useRef } from "react";

export function DialogDemo() {
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxChars = 280;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const closeDialog = () => {
    setText("");
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          onClick={() => setOpen(true)}
          className="w-full bg-[#2a2a2a] text-white text-sm rounded-full py-4 px-4 text-left transition hover:bg-[#333] flex items-center"
        >
          <span className="text-gray-500">What you lost?</span>
        </button>
      </DialogTrigger>

      <DialogContent
        className="bg-[#0f0f0f] border border-[#2f3336] text-white p-0 overflow-hidden max-w-2xl w-full mx-auto  sm:max-h-[80dvh] [&_[data-slot='dialog-close']]:hidden"
        // dvh = dynamic viewport height → iOS Safari-д зөв ажиллана
      >
        <div className="flex flex-col h-full">
          {/* HEADER – Close + Title */}
          <DialogHeader className="flex items-center justify-between p-3 sm:p-4 border-b border-[#2f3336]">
            <div className="flex w-full justify-end items-center">
                <button
              onClick={closeDialog}
              className="rounded-full p-2 hover:bg-[#1a1a1a] transition-all"
            >
              <X className="h-5 w-5" />
            </button>
            </div>
          <DialogTitle></DialogTitle>
          
          </DialogHeader>

          {/* MAIN CONTENT */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="flex gap-3 sm:gap-4">
              {/* Аватар */}
              <div className="shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-0.5">
                  <div className="w-full h-full rounded-full bg-[#1a1a1a] flex items-center justify-center text-white font-bold text-base sm:text-lg">
                    U
                  </div>
                </div>
              </div>

              {/* Текст + Зураг */}
              <div className="flex-1 min-w-0">
                <textarea
                  rows={3}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="What you lost?"
                  className="w-full bg-transparent text-lg sm:text-xl text-white placeholder-gray-500 resize-none outline-none scrollbar-hide"
                  style={{ fieldSizing: "content" } as any}
                />

                {/* Зураг Preview */}
                {image && (
                  <div className="mt-3 relative rounded-xl overflow-hidden border border-[#2f3336]">
                    <img
                      src={image}
                      alt="Preview"
                      className="w-full h-auto max-h-64 sm:max-h-96 object-cover"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 rounded-full p-1.5 transition"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                )}

                {/* Toolbar */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#2f3336]">
                  <div className="flex gap-2 sm:gap-3 text-purple-500">
                    <label className="cursor-pointer hover:bg-[#1a2a3a] p-2 rounded-full transition">
                      <Image className="w-5 h-5" />
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <button className="hover:bg-[#1a2a3a] p-2 rounded-full transition">
                      <BarChart3 className="w-5 h-5" />
                    </button>
                    <button className="hover:bg-[#1a2a3a] p-2 rounded-full transition">
                      <Smile className="w-5 h-5" />
                    </button>
                    <button className="hover:bg-[#1a2a3a] p-2 rounded-full transition">
                      <MapPin className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <span
                      className={`text-sm font-medium ${
                        text.length > maxChars
                          ? "text-red-500"
                          : text.length > maxChars * 0.9
                          ? "text-yellow-500"
                          : "text-gray-500"
                      }`}
                    >
                      {text.length}/{maxChars}
                    </span>
                    <Button
                      onClick={() => {
                        console.log("Posting:", { text, image });
                        closeDialog();
                      }}
                      disabled={!text.trim() && !image}
                      className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-4 py-1.5 rounded-full text-sm disabled:opacity-50"
                    >
                      Постлох
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}