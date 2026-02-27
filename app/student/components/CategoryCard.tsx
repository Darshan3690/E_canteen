"use client";

interface CategoryCardProps {
  title: string;
}

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

export default function CategoryCard({ title }: CategoryCardProps) {
  return (
    <div className="flex flex-col items-center gap-2 cursor-pointer group">
      <div className="w-24 h-24 rounded-lg bg-linear-to-b from-blue-400 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
        <span className="text-4xl">{title.charAt(0)}</span>
      </div>
      <p className="text-sm font-medium text-gray-300 group-hover:text-white transition">
        {title}
      </p>
    </div>
  );
}
