import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface Props {
    params: Promise<{
        restaurantId: string;
    }>;
}

export default async function RestaurantPage({ params }: Props) {
    const { restaurantId } = await params;

    const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
        include: {
            menuItems: true,
        },
    });

    if (!restaurant) {
        return (
            <div className="bg-[#0f1116] min-h-screen text-white p-6">
                Restaurant not found
            </div>
        );
    }

    return (
        <div className="bg-[#0f1116] min-h-screen text-white px-5 py-6">

            {/* 🔙 Back Button */}
            <Link href="/student">
                <div className="mb-4 text-gray-400 hover:text-white cursor-pointer">
                    ← Back
                </div>
            </Link>

            {/* 🍽 Restaurant Header */}
            <div className="mb-6">
                {restaurant.isVeg && (
                    <span className="text-green-500 text-sm font-medium">
                        Pure Veg
                    </span>
                )}

                <h1 className="text-3xl font-bold mt-2">
                    {restaurant.name}
                </h1>

                <div className="flex justify-between items-center mt-3">
                    <p className="text-gray-400 text-sm">
                        ⏱ {restaurant.deliveryTime}
                    </p>

                    <span className="bg-green-600 px-3 py-1 rounded-lg text-sm font-medium">
                        ⭐ {restaurant.rating}
                    </span>
                </div>
            </div>

            <hr className="border-gray-800 mb-6" />

            {/* 🍔 Recommended Section */}
            <h2 className="text-xl font-semibold mb-6">
                Recommended for you
            </h2>

            <div className="space-y-10">
                {restaurant.menuItems.length === 0 && (
                    <p className="text-gray-500">No menu items available.</p>
                )}

                {restaurant.menuItems.map((item) => (
                    <div
                        key={item.id}
                        className="flex justify-between items-start border-b border-gray-800 pb-6"
                    >
                        {/* Left Side */}
                        <div className="flex-1 pr-4">
                            <p className="text-lg font-medium">{item.name}</p>

                            <p className="text-gray-300 mt-1">
                                ₹ {item.price}
                            </p>

                            <p className="text-gray-500 text-sm mt-2">
                                Freshly prepared and delicious.
                            </p>
                        </div>

                        {/* Right Side */}
                        <div className="flex flex-col items-center">
                            <div className="w-28 h-24 bg-gray-800 rounded-xl mb-2 overflow-hidden">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : null}
                            </div>

                            <button className="bg-green-700 hover:bg-green-600 text-white px-6 py-1 rounded-lg font-medium transition">
                                ADD +
                            </button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
