"use client"


export default function Header(){
    return (
        <>
                   <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f0f]/95 backdrop-blur-md border-b border-[#2a2a2a] px-4 py-3">
                <div className="max-w-2xl mx-auto flex items-center justify-between">

                    
                    <div className="flex-1 max-w-xs w-full ml-22 md:ml-50">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Хайх..."
                                className="w-full  bg-[#1a1a1a] text-white placeholder-gray-500 text-sm rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                            <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button className="text-gray-400 hover:text-white transition">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </button>
                        <div className="w-9 h-9 rounded-full bg-linear-to-tr from-purple-500 to-pink-500 p-0.5 cursor-pointer">
                            <div className="w-full h-full rounded-full bg-[#0f0f0f] flex items-center justify-center text-white text-xs font-bold">
                                F
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}