"use client";

import HeroBanner from "@/app/student/components/HeroBanner";
import CategoryScroll from "@/app/student/components/CategoryScroll";
import FilterChips from "@/app/student/components/FilterChips";
import ExploreSection from "@/app/student/components/ExploreSection";
import RestaurantCard from "@/app/student/components/RestaurantCard";
import BottomNav from "@/app/student/components/BottomNav";

interface CanteenListItem {
  id: string;
  name: string;
  coverImageUrl: string | null;
  location: string;
  isOpenNow: boolean;
}

export default function CanteensStudentView({
  canteens,
}: {
  canteens: CanteenListItem[];
}) {
  return (
    <div className="min-h-screen bg-[#0f1116] text-white">
      <HeroBanner />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <CategoryScroll />
        <FilterChips />
        <ExploreSection />

        <div className="px-1 mt-8">
          <h2 className="text-gray-400 text-sm tracking-widest mb-4">
            ALL CANTEENS
          </h2>

          {canteens.length === 0 ? (
            <div className="bg-[#1c1f26] border border-[#2b2f3a] rounded-2xl p-8 text-center text-gray-400">
              No canteens found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {canteens.map((canteen) => (
                <RestaurantCard
                  key={canteen.id}
                  canteen={{
                    id: canteen.id,
                    name: canteen.name,
                    image: canteen.coverImageUrl,
                    rating: 4.5,
                    eta: "15-25 mins",
                    location: canteen.location || "Campus",
                    isOpenNow: canteen.isOpenNow,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
