import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { MapPin, ArrowRight } from 'lucide-react'

const MostPicked = () => {

  const { hotelData, navigate } = useContext(AppContext)

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-10 lg:px-20">

        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-heading mb-4">Most Picked Hotels</h2>
          <p className="text-paragraph max-w-xl mx-auto">
            Explore our top-rated accommodations, loved by guests for their comfort, location, and exceptional service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotelData.slice(0, 6).map((item) => (
            <div
              key={item._id}
              onClick={() => {
                navigate(`/hotel/${item._id}`)
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
              className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Image */}
              <div className="h-72 w-full overflow-hidden">
                <img
                  src={`${backendUrl}/images/${item.image}`}
                  alt={item.hotelName}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-xl font-bold mb-1">{item.hotelName}</h3>
                <div className="flex items-center gap-1 text-gray-200 text-sm mb-3">
                  <MapPin size={14} />
                  <p className="leading-relaxed">{item.hotelAddress}</p>
                </div>

                <div className="flex items-center justify-between mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  <p className="text-lg font-semibold text-secondary">₹{item.price}<span className="text-xs text-gray-300 font-normal">/night</span></p>
                  <span className="bg-white/20 hover:bg-white/30 p-2 rounded-full backdrop-blur-sm transition-colors">
                    <ArrowRight size={18} />
                  </span>
                </div>
              </div>

              {/* Featured Badge */}
              <div className="absolute top-4 right-4 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                POPULAR
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MostPicked
