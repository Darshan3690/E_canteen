"use client";

import { useState } from "react";
import { foods } from "@/data/foods";
import CuisinesModal from "./CuisinesModal";

export default function CategoryScroll() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="px-4 mt-6">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide">

          {foods.slice(0, 12).map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center min-w-[90px] cursor-pointer group"
            >
              {/* IMAGE */}
              <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-110">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* TEXT */}
              <p className="text-sm mt-3 text-gray-300 group-hover:text-white transition">
                {item.name}
              </p>
            </div>
          ))}

          {/* SEE ALL */}
          <div
            onClick={() => setOpen(true)}
            className="flex flex-col items-center min-w-[90px] cursor-pointer group"
          >
            <div className="w-20 h-20 rounded-full bg-green-900/30 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
              <span className="text-green-400 text-lg">🍴</span>
            </div>
            <p className="text-sm mt-3 text-green-400">
              See All
            </p>
          </div>

        </div>
      </div>

      {open && <CuisinesModal onClose={() => setOpen(false)} />}
    </>
  );
}
