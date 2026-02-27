export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-12 h-12 mb-4">
        <div className="absolute inset-0 bg-linear-to-r from-blue-400 to-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-1 bg-white rounded-full"></div>
      </div>
      <p className="text-slate-600 font-medium">Validating...</p>
    </div>
  );
}
