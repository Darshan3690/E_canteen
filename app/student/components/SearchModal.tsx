"use client";

import { foods } from "../../../data/foods";


export default function SearchModal({ onClose }: any) {
  return (
    <div className="fixed inset-0 bg-[#0f1116] z-50 overflow-y-auto p-6">

      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onClose}
          className="text-white text-xl"
        >
          ←
        </button>

        <input
          autoFocus
          placeholder="Search..."
          className="flex-1 p-3 rounded-xl bg-[#1c1f26] text-white outline-none"
        />
      </div>

      <h2 className="text-white text-lg mb-6 tracking-wide">
        WHAT’S ON YOUR MIND?
      </h2>

      <div className="grid grid-cols-3 gap-6">
        {foods.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center cursor-pointer"
          >
            <img
              src={item.image}
              className="w-20 h-20 object-contain"
            />
            <p className="text-gray-300 text-sm mt-2 text-center">
              {item.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
