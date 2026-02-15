export default function ExploreSection() {
    const items = [
        { title: "Offers", emoji: "🏷️" },
        { title: "Food on train", emoji: "🚆" },
        { title: "Plan a party", emoji: "🎉" },
        { title: "Collections", emoji: "🍔" },
    ];

    return (
        <div className="px-5 mt-6">
            <h2 className="text-gray-400 text-sm tracking-widest mb-4">
                EXPLORE MORE
            </h2>

            <div className="grid grid-cols-2 gap-4">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="bg-[#1c1f26] p-6 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-[#252a33] transition"
                    >
                        <div className="text-3xl mb-2">
                            {item.emoji}
                        </div>
                        <p className="text-sm font-medium">
                            {item.title}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
