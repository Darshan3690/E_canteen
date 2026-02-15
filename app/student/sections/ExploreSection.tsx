import CategoryCard from "../components/CategoryCard";

export default function ExploreSection() {
  return (
    <div className="mb-8">
      <h2 className="text-gray-400 text-sm tracking-widest mb-4">
        EXPLORE MORE
      </h2>

      <div className="flex gap-4 overflow-x-auto">
        <CategoryCard title="Food" />
        <CategoryCard title="Collections" />
        <CategoryCard title="Gift Cards" />
      </div>
    </div>
  );
}
