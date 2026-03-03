import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from "../context/AppContext";
import HotelCard from '../components/HotelCard';
import FilterSidebar from '../components/FilterSidebar';
import { Filter } from 'lucide-react';

const normalizeAmenities = (amenities) => {
  if (Array.isArray(amenities)) return amenities;
  if (typeof amenities === 'string') {
    return amenities
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const Hotels = () => {
  const { hotelData, search } = useContext(AppContext);

  // Calculate max price for slider
  const maxPrice = useMemo(() => {
    if (!hotelData.length) return 1000;
    return Math.max(...hotelData.map(hotel =>
      typeof hotel.price === 'string'
        ? parseInt(hotel.price.replace(/[^0-9]/g, ''))
        : hotel.price
    ));
  }, [hotelData]);

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, maxPrice],
    ratings: [],
    amenities: [],
    sort: 'relevant'
  });

  // Filtering Logic
  const filteredHotels = useMemo(() => {
    let result = [...hotelData];

    // 1. Search Filter (City)
    if (search.city) {
      result = result.filter(hotel =>
        hotel.city?.toLowerCase().includes(search.city.toLowerCase()) ||
        hotel.hotelAddress?.toLowerCase().includes(search.city.toLowerCase())
      );
    }

    // 2. Price Filter
    if (filters.priceRange) {
      result = result.filter(hotel => {
        const price = typeof hotel.price === 'string'
          ? parseInt(hotel.price.replace(/[^0-9]/g, ''))
          : hotel.price;
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      });
    }

    // 3. Rating Filter
    if (filters.ratings.length > 0) {
      result = result.filter(hotel =>
        filters.ratings.some(rating => hotel.rating >= rating)
      );
    }

    // 4. Amenities Filter
    if (filters.amenities.length > 0) {
      result = result.filter(hotel =>
        filters.amenities.every((amenity) =>
          normalizeAmenities(hotel.amenities).some((hotelAmenity) =>
            hotelAmenity.toLowerCase().includes(amenity.toLowerCase())
          )
        )
      );
    }

    // 5. Sorting
    if (filters.sort === 'priceLow') {
      result.sort((a, b) => {
        const priceA = typeof a.price === 'string' ? parseInt(a.price.replace(/[^0-9]/g, '')) : a.price;
        const priceB = typeof b.price === 'string' ? parseInt(b.price.replace(/[^0-9]/g, '')) : b.price;
        return priceA - priceB;
      });
    } else if (filters.sort === 'priceHigh') {
      result.sort((a, b) => {
        const priceA = typeof a.price === 'string' ? parseInt(a.price.replace(/[^0-9]/g, '')) : a.price;
        const priceB = typeof b.price === 'string' ? parseInt(b.price.replace(/[^0-9]/g, '')) : b.price;
        return priceB - priceA;
      });
    } else if (filters.sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [hotelData, search, filters]);


  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12">

      {/* Search Header (Mobile Only) */}
      <div className="lg:hidden px-4 mb-6">
        <button
          onClick={() => setShowFilters(true)}
          className="w-full flex items-center justify-center gap-2 bg-white p-3 rounded-xl border border-gray-200 shadow-sm font-semibold text-gray-700"
        >
          <Filter size={18} /> Filters & Sort
        </button>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-80 shrink-0">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              maxPrice={maxPrice}
            />
          </div>

          {/* Filters Sidebar - Mobile Drawer */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
              <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
                <div className="p-2 flex justify-center sticky top-0 bg-white z-10">
                  <div className="w-12 h-1.5 bg-gray-300 rounded-full my-2" />
                </div>
                <FilterSidebar
                  filters={filters}
                  setFilters={setFilters}
                  maxPrice={maxPrice}
                  onClose={() => setShowFilters(false)}
                />
              </div>
            </div>
          )}

          {/* Hotels Grid */}
          <div className="flex-1">

            {/* Results Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-heading">
                  {search.city ? `Hotels in ${search.city}` : 'All Hotels'}
                </h1>
                <p className="text-gray-500 mt-1">
                  {filteredHotels.length} properties found
                  {search.guests > 1 && ` - ${search.guests} Guests`}
                </p>
              </div>
            </div>

            {/* Hotel List */}
            <div className="space-y-6">
              {filteredHotels.length > 0 ? (
                filteredHotels.map((hotel) => (
                  <HotelCard key={hotel._id || hotel.id} hotel={hotel} />
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Filter size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No hotels found</h3>
                  <p className="text-gray-500 max-w-xs mx-auto">
                    We couldn't find any properties matching your criteria. Try adjusting your filters.
                  </p>
                  <button
                    onClick={() => setFilters({
                      priceRange: [0, maxPrice],
                      ratings: [],
                      amenities: [],
                      sort: 'relevant'
                    })}
                    className="mt-6 text-primary font-semibold hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hotels;
