import Link from "next/link";

interface Props {
  canteen: {
    id: string;
    name: string;
    image: string | null;
    rating: number;
    eta: string;
    location: string;
    isOpenNow: boolean;
  };
}

export default function RestaurantCard({ canteen }: Props) {
  return (
    <Link href={`/canteen/${canteen.id}`}>
      <div className="bg-[#1c1f26] rounded-2xl overflow-hidden shadow-md hover:scale-[1.02] transition duration-300 cursor-pointer border border-[#2b2f3a]">
        <div className="relative w-full h-48">
          <img
            src={canteen.image || "https://placehold.co/600x400/1c1f26/e2e8f0?text=Canteen"}
            alt={canteen.name}
            className="w-full h-full object-cover"
          />
          <span
            className={`absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-semibold ${
              canteen.isOpenNow ? "bg-green-600 text-white" : "bg-red-600 text-white"
            }`}
          >
            {canteen.isOpenNow ? "OPEN" : "CLOSED"}
          </span>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">{canteen.name}</h3>
            <span className="bg-green-600 px-2 py-1 rounded-lg text-sm">
              ⭐ {canteen.rating}
            </span>
          </div>

          <p className="text-gray-400 text-sm mt-2">
            ⏱ {canteen.eta}
          </p>

          <span className="text-gray-500 text-xs mt-2 block">{canteen.location}</span>
        </div>
      </div>
    </Link>
  );
}
