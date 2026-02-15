export default function FilterChips() {
    const filters = ["Filters", "Under ₹200", "Schedule", "Great offers"];
  
    return (
      <div className="px-5 mt-4 overflow-x-auto">
        <div className="flex gap-3">
          {filters.map((f, i) => (
            <div
              key={i}
              className="bg-[#1c1f26] px-4 py-2 rounded-xl text-sm text-gray-300"
            >
              {f}
            </div>
          ))}
        </div>
      </div>
    );
  }
  