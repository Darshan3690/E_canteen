"use client";

import { useState } from "react";
import { foods } from "../../../data/foods";


export default function CuisinesModal({ onClose }: any) {
  const [search, setSearch] = useState("");

  const filtered = foods.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-[#0f1116] z-50 overflow-y-auto p-6">

      <div className="flex justify-center pt-4">
        <button
          onClick={onClose}
          className="w-12 h-12 bg-white/10 rounded-full text-white text-xl"
        >
          ✕
        </button>
      </div>

      <div className="mt-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search cuisines..."
          className="w-full p-3 rounded-xl bg-[#1c1f26] text-white outline-none"
        />
      </div>

      <div className="grid grid-cols-3 gap-6 mt-8">
        {filtered.map((item, index) => (
          <div key={index} className="flex flex-col items-center cursor-pointer">
            <img
              src={item.image}
              className="w-20 h-20 object-contain"
            />
            <p className="mt-2 text-sm text-gray-300 text-center">
              {item.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
