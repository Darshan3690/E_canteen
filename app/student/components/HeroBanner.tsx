"use client";

import { useState } from "react";
import LocationModal from "./LocationModal";
import SearchModal from "./SearchModal";

export default function HeroBanner() {
    const [locationOpen, setLocationOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <>
            <div className="relative w-full h-[65vh] overflow-hidden">

                {/* 🎥 Background Video */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src="/4kvideopizza.mp4" type="video/mp4" />
                </video>

                {/* 🌑 Dark Gradient Overlay */}
                <div className=""></div>

                {/* ================= TOP HEADER ================= */}
                <div className="absolute top-6 left-6 right-6 flex justify-between items-center text-white z-10">

                    {/* 📍 Location */}
                    <div
                        onClick={() => setLocationOpen(true)}
                        className="cursor-pointer"
                    >
                        <h1 className="text-lg font-semibold flex items-center gap-1">
                            Rajkot
                            <span className="text-yellow-400 text-sm">▾</span>
                        </h1>
                        <p className="text-xs text-gray-300">India</p>
                    </div>

                    {/* 👤 Profile */}
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center font-medium text-sm shadow-lg">
                        D
                    </div>
                </div>

                {/* ================= SEARCH BAR ================= */}
                <div className="absolute top-24 left-6 right-6 z-10">
                    <div
                        onClick={() => setSearchOpen(true)}
                        className="w-full p-3 rounded-xl bg-black/60 backdrop-blur-md 
                       text-white text-sm text-gray-300 shadow-md 
                       cursor-pointer"
                    >
                        Search 'pizza'
                    </div>
                </div>

                {/* ================= HERO CONTENT ================= */}
                <div className="absolute bottom-20 left-0 right-0 text-center text-white px-6 z-10">

                    <h2 className="text-2xl md:text-3xl font-semibold drop-shadow-xl">
                        Fresh & Hot Pizza
                    </h2>

                    <p className="text-gray-300 text-sm mt-2">
                        Made with love & extra cheese
                    </p>

                    <button className="mt-5 bg-white text-black px-6 py-2 
                             rounded-full text-sm font-medium 
                             shadow-lg hover:scale-105 
                             transition-all duration-300">
                        Order Now →
                    </button>

                </div>

            </div>

            {/* ================= MODALS ================= */}
            {locationOpen && (
                <LocationModal onClose={() => setLocationOpen(false)} />
            )}

            {searchOpen && (
                <SearchModal onClose={() => setSearchOpen(false)} />
            )}
        </>
    );
}
