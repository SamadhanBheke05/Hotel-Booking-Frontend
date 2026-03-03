import React, { useContext } from 'react';
import { MapPin, Star, Wifi, Car, Utensils, Waves } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const HotelCard = ({ hotel }) => {
    const { navigate } = useContext(AppContext);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://hotel-booking-backend-vsqu.onrender.com";
    const hotelAmenities = Array.isArray(hotel.amenities)
        ? hotel.amenities
        : typeof hotel.amenities === "string"
            ? hotel.amenities.split(",").map((item) => item.trim()).filter(Boolean)
            : [];

    // Map amenities to icons
    const getAmenityIcon = (amenity) => {
        const lower = amenity.toLowerCase();
        if (lower.includes('wifi')) return <Wifi size={14} />;
        if (lower.includes('parking')) return <Car size={14} />;
        if (lower.includes('pool')) return <Waves size={14} />;
        if (lower.includes('restaurant') || lower.includes('breakfast')) return <Utensils size={14} />;
        return null;
    };

    return (
        <div
            onClick={() => {
                navigate(`/hotel/${hotel._id}`);
                window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
            {/* Image Section */}
            <div className="md:w-72 md:min-w-[18rem] relative overflow-hidden">
                <img
                    src={hotel.image.startsWith('http') ? hotel.image : `${backendUrl}/images/${hotel.image}`}
                    alt={hotel.hotelName}
                    className="w-full h-56 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Mobile Price Badge */}
                <div className="absolute bottom-4 right-4 md:hidden bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
                    <span className="font-bold text-lg text-primary">₹{hotel.price}</span>
                    <span className="text-xs text-gray-500">/night</span>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-5 lg:p-6 flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-heading group-hover:text-primary transition-colors line-clamp-1">
                            {hotel.hotelName}
                        </h3>
                        <div className="flex items-center gap-1.5 text-gray-500 mt-2 text-sm">
                            <MapPin size={16} className="text-primary shrink-0" />
                            <span className="leading-relaxed">{hotel.hotelAddress}</span>
                        </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-lg shrink-0">
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-sm text-blue-700">{hotel.rating}</span>
                    </div>
                </div>

                {/* Amenities */}
                <div className="flex items-center gap-3 mt-4 text-gray-500">
                    {hotelAmenities.slice(0, 4).map((amenity, index) => (
                        <div key={index} className="flex items-center gap-1.5 text-xs bg-gray-50 px-2.5 py-1.5 rounded-full border border-gray-100">
                            {getAmenityIcon(amenity)}
                            <span>{amenity}</span>
                        </div>
                    ))}
                    {hotelAmenities.length > 4 && (
                        <span className="text-xs text-gray-400">+{hotelAmenities.length - 4} more</span>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="hidden md:block">
                        <p className="text-xs text-gray-500">Starting from</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-heading">₹{hotel.price}</span>
                            <span className="text-sm text-gray-500 font-medium">/ night</span>
                        </div>
                    </div>

                    <button className="w-full md:w-auto bg-white text-primary border border-primary/20 hover:bg-blue-50 px-6 py-2.5 rounded-xl font-semibold transition-colors">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HotelCard;
