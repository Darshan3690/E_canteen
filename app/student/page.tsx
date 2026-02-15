import { prisma } from "@/lib/prisma";
import HeroBanner from "./components/HeroBanner";
import CategoryScroll from "./components/CategoryScroll";
import FilterChips from "./components/FilterChips";
import ExploreSection from "./components/ExploreSection";
import RestaurantCard from "./components/RestaurantCard";
import BottomNav from "./components/BottomNav";

export default async function StudentPage() {
  const restaurants = await prisma.restaurant.findMany();

  return (
    <div className="bg-[#0f1116] min-h-screen text-white pb-20">

      <HeroBanner />
      <CategoryScroll />
      <FilterChips />
      <ExploreSection />

      <div className="px-5 mt-6">
        <h2 className="text-gray-400 text-sm tracking-widest mb-4">
          ALL RESTAURANTS
        </h2>

        <div className="space-y-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
            />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
