import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { Star, Users, ArrowUpRight } from 'lucide-react'

const RoomCard = ({ room }) => {
  const { navigate } = useContext(AppContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative h-60 overflow-hidden">
        <img
          src={`${backendUrl}/images/${room.images[0]}`}
          alt={room.roomType}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-heading flex items-center gap-1">
          <Star size={12} className="text-yellow-400 fill-yellow-400" /> {room.rating || 4.0}
        </div>
      </div>

      <div className="p-5">
        <h4 className="text-sm font-semibold text-primary mb-1">{room.hotel?.hotelName || 'Hotel'}</h4>
        <h3 className="text-xl font-bold text-heading mb-2">{room.roomType}</h3>

        <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>2 Guests</span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <span>Free Wifi</span>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-lg font-bold text-primary">₹{room.pricePerNight}</span>
            <span className="text-xs text-gray-400">/night</span>
          </div>

          <button
            onClick={() => {
              navigate(`/room/${room._id}`);
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
            className="p-2 rounded-full bg-blue-50 text-primary hover:bg-primary hover:text-white transition-colors"
          >
            <ArrowUpRight size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoomCard
