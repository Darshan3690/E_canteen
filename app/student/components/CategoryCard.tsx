"use client";

import { useState } from "react";
import CuisinesModal from "./CuisinesModal";

const categories = [
  { name: "Pizza", image: "/foods/Pizza.png" },
  { name: "Cake", image: "/foods/Cake.png" },
  { name: "Burger", image: "/foods/Burger.png" },
  { name: "Biryani", image: "/foods/Biryani.png" },
  { name: "Thali", image: "/foods/Thali.png" },
  { name: "Rolls", image: "/foods/Rolls.png" },
  { name: "Paneer", image: "/foods/Paneer.png" },
  { name: "Fried Rice", image: "/foods/FriedRice.png" },
  { name: "Sandwich", image: "/foods/Sandwich.png" },
  { name: "Dosa", image: "/foods/Dosa.png" },
  { name: "Fries", image: "/foods/Fries.png" },
  { name: "Noodles", image: "/foods/Noodles.png" },
  { name: "Paratha", image: "/foods/Paratha.png" },
  { name: "Ice Cream", image: "/foods/IceCream.png" },
  { name: "Chaat", image: "/foods/Chaat.png" },
  { name: "Idli", image: "/foods/Idli.png" },
];

export default function CategoryScroll() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="px-4 mt-6">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide">

          {categories.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center min-w-[90px] group cursor-pointer"
            >
              {/* Circle */}
              <div
                className="
                  w-20 h-20 
                  rounded-full 
                  bg-gradient-to-b from-white to-gray-100
                  shadow-lg 
                  flex items-center justify-center 
                  overflow-hidden
                  transition-all duration-300
                  group-hover:scale-105
                "
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-contain"
                />
              </div>

              {/* Name */}
              <p className="text-xs mt-3 text-gray-300 text-center">
                {item.name}
              </p>
            </div>
          ))}

          {/* See All */}
          <div
            onClick={() => setOpen(true)}
            className="flex flex-col items-center min-w-[90px] cursor-pointer group"
          >
            <div
              className="
                w-20 h-20 
                rounded-full 
                bg-green-900/30 
                flex items-center justify-center
                shadow-lg
                transition-all duration-300
                group-hover:scale-105
              "
            >
              <span className="text-green-400 text-2xl">🍴</span>
            </div>

            <p className="text-xs mt-3 text-green-400 text-center">
              See All
            </p>
          </div>

        </div>
      </div>

      {open && <CuisinesModal onClose={() => setOpen(false)} />}
    </>
  );
}
