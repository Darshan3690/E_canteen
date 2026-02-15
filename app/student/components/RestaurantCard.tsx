import Link from "next/link";

interface Props {
  restaurant: {
    id: string;
    name: string;
    image: string;
    rating: number;
    deliveryTime: string;
    isVeg: boolean;
  };
}

export default function RestaurantCard({ restaurant }: Props) {
  return (
    <Link href={`/student/${restaurant.id}`}>
      <div className="bg-[#1c1f26] rounded-2xl overflow-hidden shadow-md hover:scale-[1.02] transition duration-300 cursor-pointer">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-48 object-cover"
        />

        <div className="p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{restaurant.name}</h3>
            <span className="bg-green-600 px-2 py-1 rounded-lg text-sm">
              ⭐ {restaurant.rating}
            </span>
          </div>

          <p className="text-gray-400 text-sm mt-2">
            ⏱ {restaurant.deliveryTime}
          </p>

          {restaurant.isVeg && (
            <span className="text-green-500 text-xs mt-2 block">
              Pure Veg
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
