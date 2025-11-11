"use client";
import { useEffect, useRef, useState } from "react";

export default function Posts() {
    const [feedData, setFeedData] = useState<any[]>([]);
    const feedRef = useRef<HTMLDivElement>(null);
    const targetScroll = useRef(0);
    const currentScroll = useRef(0);
    const velocity = useRef(0);
    const rafId = useRef<number | null>(null);
    const mongolianContents = [
        "Улаанбаатарт өнөөдөр цас орлоо. Гудамж бүр цагаан хивс тавьчихсан шиг гоё байна!",
        "Монголчууд бид яагаад адилхан хувцас өмсдөг вэ? Уламжлал уу, эсвэл тренд үү?",
        "Гэртээ хийсэн буузны амт яг л ээжийнх шиг болчихлоо. Жор хуваалцъя!",
        "Хөдөө явах замдаа нар жаргахыг харлаа. Зураг авсан ч гэрэл зургийн аппарат хүрэхгүй байсан.",
        "Монголын түүхийг мэдэхгүй бол ирээдүйгээ зөв төлөвлөж чадахгүй гэдэг үнэн.",
        "Өглөө босоод кофе уухын оронд сүүтэй цай уувал өдөржин эрч хүчтэй байдаг.",
        "Танай гэр бүлд хамгийн их хэрэглэдэг үг юу вэ? Манайд “яараад байх юм уу” гэдэг.",
        "Монголд бизнес эхлүүлэхэд хамгийн хэцүү зүйл юу вэ? Туршлагаасаа хуваалцъя.",
        "Хүүхдүүдэд монгол хэл заах гэж оролдож байна. Ямар арга хэрэглэдэг вэ?",
        "Улаанбаатарын түгжрэлд хэрхэн тэвчээртэй байх вэ? Миний 3 арга.",
    ];

    const titles = [
        "Цас орлоо!", "Уламжлал vs Тренд", "Буузны жор", "Нар жаргах", "Түүх ба Ирээдүй",
        "Сүүтэй цайны ач тус", "Гэр бүлийн хэллэг", "Бизнес эхлүүлэхэд...", "Монгол хэл заах арга", "Түгжрэлд тэвчээртэй байх"
    ];

    const users = ["Бат-Эрдэнэ", "Сувд", "Тэмүүлэн", "Оюун", "Ганбат", "Наран", "Эрдэнэ", "Хулан", "Болд", "Сарантуяа"];
    const locations = ["Улаанбаатар", "Дархан", "Эрдэнэт", "Хөвсгөл", "Говь-Алтай"];

    const generatePost = (id: number) => {
        const idx = Math.floor(Math.random() * mongolianContents.length);
        return {
            id,
            title: titles[idx] || `Пост ${id + 1}`,
            content: mongolianContents[idx] || "Монгол контент...",
            user: users[Math.floor(Math.random() * users.length)],
            timeAgo: `${Math.floor(Math.random() * 23) + 1} ${Math.random() > 0.5 ? 'цаг' : 'минут'}ын өмнө`,
            location: locations[Math.floor(Math.random() * locations.length)],
            likes: Math.floor(Math.random() * 3000),
            comments: Math.floor(Math.random() * 200),
            shares: Math.floor(Math.random() * 50),
        };
    };

    useEffect(() => {
        const data = Array.from({ length: 15 }, (_, i) => generatePost(i));
        setFeedData(data);
    }, []);
    useEffect(() => {
        const feed = feedRef.current;
        if (!feed) return;

        const animate = () => {
            const diff = targetScroll.current - currentScroll.current;
            if (Math.abs(diff) > 0.5 || Math.abs(velocity.current) > 0.5) {
                velocity.current = diff * 0.125;
                currentScroll.current += velocity.current;
                if (feedRef.current) feedRef.current.scrollTop = currentScroll.current;
                rafId.current = requestAnimationFrame(animate);
            } else {
                rafId.current = null;
            }
        };

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const max = feed.scrollHeight - feed.clientHeight;
            targetScroll.current += e.deltaY * 1.3;
            targetScroll.current = Math.max(0, Math.min(targetScroll.current, max));
            if (!rafId.current) rafId.current = requestAnimationFrame(animate);
        };

        window.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            window.removeEventListener("wheel", handleWheel);
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, [feedData]);

    return (
        <>

            <div className="pt-10 pb-10">
                <div
                    ref={feedRef}
                    className="relative z-10 w-full max-w-2xl mx-auto h-screen overflow-y-auto bg-[#0f0f0f]  rounded-md px-4 py-6 space-y-4 feed-scroll"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {feedData.length === 0 ? (
                        <div className="text-center text-gray-500 py-10">Ачаалж байна...</div>
                    ) : (
                        feedData.map((post) => (
                            <div
                                key={post.id}
                                className="bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-[#2a2a2a]"
                            >

                                <div className="flex items-center justify-between p-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-11 h-11 rounded-full bg-linear-to-tr from-cyan-500 to-blue-600 p-0.5">
                                            <div className="w-full h-full rounded-full bg-[#1a1a1a] flex items-center justify-center text-white font-bold text-sm">
                                                {post.user[0]}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold text-sm">{post.user}</p>
                                            <p className="text-xs text-gray-400">{post.timeAgo} · {post.location}</p>
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-white">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <circle cx="12" cy="7" r="1.5" />
                                            <circle cx="12" cy="12" r="1.5" />
                                            <circle cx="12" cy="17" r="1.5" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="px-3 pb-2">
                                    <h3 className="text-white font-medium text-base mb-1">{post.title}</h3>
                                    <p className="text-gray-300 text-sm leading-relaxed">{post.content}</p>
                                </div>
                                <div className="bg-linear-to-br from-[#2a2a2a] to-[#1a1a1a] h-64 mx-3 rounded-xl flex items-center justify-center border border-[#333] mb-3">
                                    <span className="text-gray-500 text-xs">Зураг байхгүй</span>
                                </div>
                                <div className="flex items-center justify-between px-3 pb-3 text-gray-400">
                                    <div className="flex items-center space-x-5">
                                        <button className="flex items-center space-x-1 hover:text-red-500 transition group">
                                            <svg className="w-6 h-6 group-hover:fill-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                            <span className="text-xs">{post.likes > 999 ? (post.likes / 1000).toFixed(1) + 'K' : post.likes}</span>
                                        </button>
                                        <button className="flex items-center space-x-1 hover:text-blue-500 transition">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                            <span className="text-xs">{post.comments}</span>
                                        </button>
                                        <button className="flex items-center space-x-1 hover:text-green-500 transition">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.632 2.684a3 3 0 10-6-3.684m6 3.684a9 9 0 11-12 0 9 9 0 0112 0z" />
                                            </svg>
                                            <span className="text-xs">{post.shares}</span>
                                        </button>
                                    </div>
                                    <button className="hover:text-yellow-500 transition">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <style jsx global>{`
        .feed-scroll::-webkit-scrollbar { display: none; }
        html, body { overflow: hidden; height: 100%; background: #0f0f0f; margin: 0; }
      `}</style>
        </>
    );
}