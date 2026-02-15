"use client";

interface Props {
    onClose: () => void;
}

export default function LocationModal({ onClose }: Props) {
    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-end">

            <div className="bg-[#0f1116] w-full max-h-[85vh] rounded-t-3xl p-6 overflow-y-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">
                        Select a location
                    </h2>
                    <button onClick={onClose} className="text-gray-400">
                        ✕
                    </button>
                </div>

                {/* Search */}
                <input
                    placeholder="Search for area, street name..."
                    className="w-full p-3 rounded-xl bg-[#1c1f26] mb-6 outline-none"
                />

                {/* Use Current Location */}
                <div className="bg-[#1c1f26] p-4 rounded-xl mb-4">
                    <p className="text-green-500 font-medium">
                        📍 Use current location
                    </p>
                    <p className="text-gray-400 text-sm">
                        Rajkot
                    </p>
                </div>

                {/* Add Address */}
                <div className="bg-[#1c1f26] p-4 rounded-xl mb-6">
                    <p className="text-green-500 font-medium">
                        ➕ Add Address
                    </p>
                </div>

                {/* Saved Addresses */}
                <h3 className="text-gray-400 text-sm tracking-widest mb-3">
                    SAVED ADDRESSES
                </h3>

                <div className="bg-[#1c1f26] p-4 rounded-xl mb-6">
                    <p className="font-medium">Hotel</p>
                    <p className="text-gray-400 text-sm">
                        Shirnathji Boys hostel near by janki deri
                    </p>
                </div>

                {/* Recent Locations */}
                <h3 className="text-gray-400 text-sm tracking-widest mb-3">
                    RECENT LOCATIONS
                </h3>

                <div className="bg-[#1c1f26] p-4 rounded-xl mb-4">
                    <p className="font-medium">Rajkot</p>
                    <p className="text-gray-400 text-sm">
                        India
                    </p>
                </div>

                <div className="bg-[#1c1f26] p-4 rounded-xl">
                    <p className="font-medium">Marwadi University</p>
                    <p className="text-gray-400 text-sm">
                        Rajkot, Gujarat
                    </p>
                </div>

            </div>
        </div>
    );
}
