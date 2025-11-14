"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle
} from "@/components/ui/dialog";
import { X, Upload, GripVertical, Loader2, MapPin } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import validate from "@/app/_components/functions";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// === DYNAMIC IMPORTS (Сервер дээр ачаалахгүй!) ===
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
import { useMapEvents } from "react-leaflet";



function SortableImage({ id, src, onRemove }: { id: string; src: string; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group rounded-lg overflow-hidden border border-[#333]"
    >
      <img src={src} alt="" className="w-full h-32 object-cover" />
      <button
        onClick={onRemove}
        className="absolute top-1 right-1 bg-black/70 hover:bg-black/90 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
      >
        <X className="h-3 w-3 text-white" />
      </button>
      <div
        {...attributes}
        {...listeners}
        className="absolute bottom-1 left-1 bg-black/70 rounded p-1 cursor-move opacity-0 group-hover:opacity-100 transition"
      >
        <GripVertical className="h-4 w-4 text-white" />
      </div>
    </div>
  );
}

export function CreatePostDialog() {
  useEffect(() => {
  if (typeof window === "undefined") return;

  // Suppress TypeScript error for importing CSS from a third-party package
  // since there may be no type declarations for it in @types.
  // @ts-ignore
  void import("leaflet/dist/leaflet.css");

  const L = require("leaflet");
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}, []);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"LOST" | "FOUND">("LOST");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [images, setImages] = useState<any>([]);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [error,setError]=useState("")
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const MAX_IMAGES = 5;
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
 const handleImageChange = async (files: FileList | null) => {
  if (!files || files.length === 0) return;
  if (images.length + files.length > MAX_IMAGES) {
    alert(`Хамгийн их ${MAX_IMAGES} зураг оруулж болно`);
    return;
  }

  setUploading(true);
  const uploadPromises = Array.from(files).map(async (file) => {
    const reader = new FileReader();
    const preview = await new Promise<string>((resolve) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Xanen_cloudinary");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/df88yvhqr/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      return { id: `${Date.now()}-${Math.random()}`, src: data.secure_url };
    } catch {
      return { id: `${Date.now()}-${Math.random()}`, src: preview };
    }
  });

  const uploaded = await Promise.all(uploadPromises);
  setImages((prev:any) => [...prev, ...uploaded]);
  setUploading(false);
};
 const  handleError= async(value:any)=>{
  if(value){
    setError('')
  }
  setPhone(value)
 }
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

const handleDrop = async (e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(false);
  if (e.dataTransfer.files?.[0]) await handleImageChange(e.dataTransfer.files);
};
 const removeImage = (id: string) => {
  setImages((prev:any) => prev.filter((img:any) => img.id !== id));
};
 const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;
  if (!over || active.id === over.id) return;
  setImages((items:any) => {
    const oldIndex = items.findIndex((i:any) => i.id === active.id);
    const newIndex = items.findIndex((i:any) => i.id === over.id);
    return arrayMove(items, oldIndex, newIndex);
  });
};

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        reverseGeocode(lat, lng);
      },
    });
    return position === null ? null : (
      <Marker position={position}>
        <Popup>Энд байна!</Popup>
      </Marker>
    );
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          reverseGeocode(latitude, longitude);
        },
        () => alert("Байршил авах боломжгүй")
      );
    }
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      setAddress(data.display_name.split(",")[0] || "Тодорхойгүй");
    } catch {
      setAddress("Газар нэр олдсонгүй");
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery + ", Улаанбаатар"
        )}`
      );
      const data = await res.json();
      if (data[0]) {
        const { lat, lon } = data[0];
        setPosition([parseFloat(lat), parseFloat(lon)]);
        setAddress(data[0].display_name.split(",")[0]);
      }
    } catch {
      alert("Хайлт амжилтгүй");
    }
  };


  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !phone.trim() || !position) {
      alert("Бүх талбарыг бөглөнө үү!");
      return;
    }
    if(!validate(phone,setError)) return;


    setLoading(true);
    try {
      const res = await fetch("/api/post", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          title,
          description,
          phone,
          lat: position[0],
          lng: position[1],
          address,
          images: images.map((img:any) => img.src),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Пост амжилттай нийтлэгдлээ!");
        closeDialog();
      } else {
        alert(data.error || "Алдаа гарлаа");
      }
    } catch {
      alert("Серверт алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  const closeDialog = () => {
    setType("LOST");
    setTitle("");
    setDescription("");
    setPhone("");
    setImages([]);
    setPosition(null);
    setAddress("");
    setSearchQuery("");
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

      <DialogContent className="**:data-[slot='dialog-close']:hidden bg-[#0a0a0a] border border-[#333] text-white p-0 max-w-2xl w-full mx-auto rounded-2xl overflow-hidden h-[90dvh]">
        <div className="flex flex-col h-full">
          
          <DialogHeader className="flex items-center justify-between  border-b border-[#333]">
            <div className="flex w-full justify-end items-center">
                <button
              onClick={closeDialog}
              className="rounded-full p-2 hover:bg-[#1a1a1a] transition-all"
            >
              <X className="h-5 w-5" />
            </button>
            </div>
            
          </DialogHeader>
          <DialogTitle></DialogTitle>

          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setType("LOST")}
                className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
                  type === "LOST" ? "bg-red-500 text-white shadow-lg" : "bg-[#1a1a1a] text-gray-400"
                }`}
              >
                Алга болсон
              </button>
              <button
                onClick={() => setType("FOUND")}
                className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
                  type === "FOUND" ? "bg-green-500 text-white shadow-lg" : "bg-[#1a1a1a] text-gray-400"
                }`}
              >
                Олсон
              </button>
            </div>

            <div className="flex gap-4">
             

              <div className="flex-1 flex flex-col h-full space-y-4">
       
                <div className="relative">
                  <textarea
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Гарчиг (жишээ: Хар iPhone 13, Сүхбаатарын талбайд алга боллоо...)"
                    className="w-full bg-transparent text-xl font-bold text-white placeholder-gray-500 outline-none resize-none overflow-hidden"
                    rows={1}
                    maxLength={100}
                    
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = "auto";
                      target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                    }}
                  />
                  <div className="absolute bottom-1 right-0 text-xs text-gray-400">
                    <span className={title.length > 90 ? "text-yellow-500" : title.length >= 100 ? "text-red-500 animate-pulse" : ""}>
                      {title.length}
                    </span>
                    <span>/100</span>
                  </div>
                </div>

              
                <div className="flex-1 min-h-0 -mx-5 px-5">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Дэлгэрэнгүй тайлбар (хаана, хэзээ, ямар онцлогтой вэ? Утас заавал!)"
                    className="w-full h-full bg-transparent text-white placeholder-gray-500 outline-none resize-none"
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = "auto";
                      target.style.height = `${target.scrollHeight}px`;
                    }}
                  />
                </div>
                <input
                  value={phone}
                  onChange={(e)=>handleError(e.target.value)}
                  placeholder="Утасны дугаар (99112233)"
                  className="w-full bg-[#1a1a1a] rounded-lg p-3 text-sm placeholder-gray-500 outline-none"
                />
                {error && <p className="text-red-400 text-sm">{error}</p>}

              
                <div className="space-y-3">
             <div
    ref={dropRef}
    onClick={() => fileInputRef.current?.click()}
    onDragEnter={handleDrag}
    onDragLeave={handleDrag}
    onDragOver={handleDrag}
    onDrop={handleDrop}
    className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
      dragActive ? "border-purple-500 bg-purple-500/10" : "border-[#333] hover:border-purple-500"
    }`}
  >
    {uploading ? (
      <div className="flex items-center justify-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
        <span className="text-sm text-purple-400">Байршуулж байна...</span>
      </div>
    ) : (
      <>
        <Upload className="w-8 h-8 mx-auto mb-2 text-purple-400" />
        <p className="text-sm text-gray-400">
          {images.length === 0
            ? "Зураг чирж оруул эсвэл дарна уу"
            : `${images.length}/${MAX_IMAGES} зураг оруулсан`}
        </p>
      </>
    )}
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      multiple
      onChange={(e) => handleImageChange(e.target.files)}
      className="hidden"
    />
  </div>

  {images.length > 0 && (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={images.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="grid grid-cols-3 gap-2">
          {images.map((img:any) => (
            <SortableImage key={img.id} id={img.id} src={img.src} onRemove={() => removeImage(img.id)} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )}

  <p className="text-xs text-gray-500 text-center">
    {images.length}/{MAX_IMAGES} зураг
  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-purple-400">
                    <MapPin className="w-5 h-5" />
                    <span className="font-medium">{address || "Байршил сонгоогүй"}</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      placeholder="Газар хайх..."
                      className="flex-1 bg-[#1a1a1a] rounded-lg px-3 py-2 text-sm placeholder-gray-500 outline-none"
                    />
                    <button
                      onClick={handleSearch}
                      className=" cursor-pointer bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      Хайх
                    </button>
                  </div>

                  <div className="h-64 rounded-xl overflow-hidden border border-[#333]">
                    <MapContainer center={position || [47.9188, 106.9172]} zoom={13} style={{ height: "100%" }}>
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <LocationMarker />
                    </MapContainer>
                  </div>

                  <button
                    onClick={getCurrentLocation}
                    className="w-full bg-;linear-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg text-sm font-medium hover:opacity-90"
                  >
                    Одоогийн байршлыг тэмдэглэх
                  </button>
                </div>
                <div className="flex justify-end pt-4 border-t border-[#333]">
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || !title || !description || !phone || !position}
                    className=" cursor-pointer bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-6 py-2 rounded-full text-sm disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "НИЙТЛЭХ"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}