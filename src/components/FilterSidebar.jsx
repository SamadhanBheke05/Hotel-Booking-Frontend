import React from 'react';
import { SlidersHorizontal, Star, X } from 'lucide-react';

const FilterSidebar = ({ filters, setFilters, maxPrice, onClose }) => {

    const handleSortChange = (e) => {
        setFilters({ ...filters, sort: e.target.value });
    };

    const handlePriceChange = (e) => {
        setFilters({ ...filters, priceRange: [0, Number(e.target.value)] });
    };

    const handleRatingChange = (rating) => {
        const newRatings = filters.ratings.includes(rating)
            ? filters.ratings.filter(r => r !== rating)
            : [...filters.ratings, rating];
        setFilters({ ...filters, ratings: newRatings });
    };

    const handleAmenityChange = (amenity) => {
        const newAmenities = filters.amenities.includes(amenity)
            ? filters.amenities.filter(a => a !== amenity)
            : [...filters.amenities, amenity];
        setFilters({ ...filters, amenities: newAmenities });
    };

    const clearFilters = () => {
        setFilters({
            priceRange: [0, maxPrice],
            ratings: [],
            amenities: [],
            sort: 'relevant'
        });
    };

    const amenitiesList = ["Pool", "Gym", "Parking", "Spa", "Restaurant"];

    return (
        <aside className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit overflow-y-auto max-h-[calc(100vh-100px)] sticky top-24">

            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-heading flex items-center gap-2">
                    <SlidersHorizontal size={20} className="text-primary" />
                    Filters
                </h3>
                <button
                    onClick={onClose}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-full text-gray-500"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Sort By */}
            <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                <select
                    value={filters.sort}
                    onChange={handleSortChange}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                >
                    <option value="relevant">Most Popular</option>
                    <option value="priceLow">Price: Low to High</option>
                    <option value="priceHigh">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                </select>
            </div>

            {/* Price Range */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-semibold text-gray-700">Price Range</label>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
                        ₹0 - ₹{filters.priceRange[1]}
                    </span>
                </div>
                <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    step="100"
                    value={filters.priceRange[1]}
                    onChange={handlePriceChange}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary"
                />
            </div>

            {/* Star Rating */}
            <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Star Rating</label>
                <div className="space-y-2">
                    {[5, 4, 3].map((star) => (
                        <label key={star} className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    checked={filters.ratings.includes(star)}
                                    onChange={() => handleRatingChange(star)}
                                    className="peer h-5 w-5 rounded-md border-2 border-gray-200 text-primary focus:ring-primary/20 transition-all cursor-pointer"
                                />
                                <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-white transition-opacity" viewBox="0 0 14 14" fill="none">
                                    <path d="M3.5 7L5.5 9L10.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="flex items-center gap-1 group-hover:text-primary transition-colors">
                                <div className="flex">
                                    {[...Array(star)].map((_, i) => (
                                        <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500 font-medium ml-1">& Up</span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Amenities */}
            <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Amenities</label>
                <div className="space-y-2.5">
                    {amenitiesList.map((amenity) => (
                        <label key={amenity} className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    checked={filters.amenities.includes(amenity)}
                                    onChange={() => handleAmenityChange(amenity)}
                                    className="peer h-5 w-5 rounded-md border-2 border-gray-200 text-primary focus:ring-primary/20 transition-all cursor-pointer"
                                />
                                <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-white transition-opacity" viewBox="0 0 14 14" fill="none">
                                    <path d="M3.5 7L5.5 9L10.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">{amenity}</span>
                        </label>
                    ))}
                </div>
            </div>

            <button
                onClick={clearFilters}
                className="w-full py-3 text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl border border-gray-100 transition-all"
            >
                Clear All Filters
            </button>

        </aside>
    );
};

export default FilterSidebar;
