import React, { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { toast } from "react-hot-toast";
import { MapPin, Star, Calendar, Users, CheckCircle, XCircle, Phone, User, Wifi, Car, Utensils, Coffee, Tv, Bath, Eye, Building, TreePine, Mountain } from "lucide-react";
import ReviewSection from '../components/ReviewSection';

const SingleRoom = () => {
  const { roomData, axios, navigate, getImageUrl } = useContext(AppContext)
  const { id } = useParams();
  const room = roomData.find((r) => r._id === id);

  const [selectedImage, setSelectedImage] = useState(0);

  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    persons: 1,
  });
  const [isAvailable, setIsAvailable] = useState(false);

  const onChangeHandler = (e) => {
    if (e.target.name === "checkIn" || e.target.name === "checkOut") {
      setIsAvailable(false);
    }
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const getAmenityIcon = (amenity) => {
    const iconMap = {
      "Ocean View": Eye,
      "Mountain View": Mountain,
      "City View": Building,
      "Garden View": TreePine,
      Balcony: Building,
      "Mini Bar": Coffee,
      "Room Service": Utensils,
      "Free WiFi": Wifi,
      "Premium WiFi": Wifi,
      "Work Desk": Building,
      "Concierge Service": User,
      "Breakfast Included": Coffee,
      Parking: Car,
      "Smart TV": Tv,
      "Spa Access": Bath,
      "Pool Access": Bath,
      Kitchen: Utensils,
      "Living Area": Building,
      "private Terrace": Building,
      "Butler Service": User,
      Jacuzzi: Bath,
      "Panoramic View": Eye,
    };
    return iconMap[amenity] || CheckCircle;
  };

  const checkRoomAvailability = async () => {
    try {
      if (!bookingData.checkIn || !bookingData.checkOut) {
        toast.error("Please select dates");
        return;
      }
      if (bookingData.checkIn >= bookingData.checkOut) {
        toast.error("Check-in date should be before check-out date");
        return;
      }

      const { data } = await axios.post("/api/bookings/check-availability", {
        room: room._id, checkInDate: bookingData.checkIn,
        checkOutDate: bookingData.checkOut,
      });

      if (data.success) {
        if (data.isAvailable) {
          setIsAvailable(true);
          toast.success("Room is available!");
        } else {
          setIsAvailable(false);
          toast.error("Room is not available for selected dates");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }

  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (!isAvailable) {
        return checkRoomAvailability();

      } else {
        const { data } = await axios.post("/api/bookings/book", {
          room: room._id,
          checkInDate: bookingData.checkIn,
          checkOutDate: bookingData.checkOut,
          persons: bookingData.persons,
          paymentMethod: "Pay At Hotel",
        });

        if (data.success) {
          toast.success(data.message);
          navigate("/my-bookings");
          window.scrollTo(0, 0);

        } else {
          toast.error(data.message);
        }
      }

    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!room || !room.hotel) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-500 animate-pulse">Loading room details...</p>
      </div>
    );
  }

  return (
    <div className='py-24 min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 md:px-6 py-8'>

        {/* Header Section */}
        <div className='bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 mb-8'>
          <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6'>
            <div className='flex-1 space-y-3'>
              <div className="flex flex-col gap-1">
                <h2 className="text-lg md:text-xl font-semibold text-primary">{room.hotel.hotelName}</h2>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className='text-3xl md:text-4xl font-bold text-heading'>{room.roomType}</h1>
                  {isAvailable && (
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle size={14} /> Available
                    </span>
                  )}
                </div>
              </div>

              <div className='flex items-center gap-2 text-gray-500 font-medium'>
                <MapPin className='w-5 h-5 text-primary' />
                <span>{room.hotel.hotelAddress}</span>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <div className='flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100'>
                  <Star className='w-4 h-4 text-yellow-500 fill-yellow-500' />
                  <span className="font-bold text-gray-800">{room.hotel.rating}</span>
                  <span className="font-bold text-black text-sm">Rating</span>
                </div>
                <div className='flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100'>
                  <User className='w-4 h-4 text-gray-500' />
                  <span className="text-gray-600 font-medium">Max {4} Guests</span>
                </div>
              </div>
            </div>

            <div className='text-right'>
              <p className="text-gray-400 text-sm font-medium mb-1">Price per night</p>
              <div className='text-4xl font-bold text-primary'>
                ₹{room.pricePerNight}
              </div>
              <div className='text-gray-500 text-sm mt-2 flex items-center justify-end gap-2'>
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Free Cancellation
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className='grid lg:grid-cols-3 gap-8'>

          {/* Left Column: Gallery & Details */}
          <div className='lg:col-span-2 space-y-8'>

            {/* Image Gallery */}
            <div className='bg-white rounded-3xl shadow-sm border border-gray-100 p-4 md:p-6 overflow-hidden'>
              <div className='mb-4 relative group'>
                <img
                  src={getImageUrl(room.images[selectedImage])}
                  alt="Room Main"
                  className='w-full h-[400px] object-cover rounded-2xl transition-transform duration-500 group-hover:scale-[1.01]'
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
                  {selectedImage + 1} / {room.images.length}
                </div>
              </div>
              <div className='flex gap-3 overflow-x-auto pb-2'>
                {room.images.map((image, index) => (
                  <img
                    key={index}
                    src={getImageUrl(image)}
                    alt={`Thumbnail ${index + 1}`}
                    className={`h-20 w-28 object-cover rounded-xl cursor-pointer transition-all duration-200 border-2 
                                            ${selectedImage === index ? "border-primary opacity-100 scale-95" : "border-transparent opacity-70 hover:opacity-100"}`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            </div>

            {/* About Room */}
            <div className='bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8'>
              <h2 className='text-2xl font-bold text-heading mb-4'>About This Room</h2>
              <p className='text-gray-600 leading-relaxed text-lg'>{room.description}</p>
            </div>

            {/* Amenities */}
            <div className='bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8'>
              <h2 className='text-2xl font-bold text-heading mb-6'>What this room offers</h2>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4'>
                {room.amenities.split(",").map((amenity, index) => {
                  const IconComponent = getAmenityIcon(amenity.trim());
                  return (
                    <div key={index} className='flex items-center gap-3 text-gray-700'>
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary">
                        <IconComponent size={20} />
                      </div>
                      <span className="font-medium">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews Section - NEW */}
            <ReviewSection roomId={room._id} />

          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-3xl shadow-xl shadow-blue-900/5 p-6 md:p-8 sticky top-28 border border-gray-100'>
              <div className="flex items-center justify-between mb-6">
                <h2 className='text-xl font-bold text-heading'>Book your stay</h2>
              </div>

              <form onSubmit={onSubmitHandler} className='space-y-5'>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 md:col-span-1 lg:col-span-2">
                    <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2'>Check-in</label>
                    <input
                      type='date'
                      name="checkIn"
                      min={new Date().toISOString().split("T")[0]}
                      value={bookingData.checkIn}
                      onChange={onChangeHandler}
                      className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-gray-700'
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1 lg:col-span-2">
                    <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2'>Check-out</label>
                    <input
                      type='date'
                      name="checkOut"
                      value={bookingData.checkOut}
                      min={bookingData.checkIn}
                      onChange={onChangeHandler}
                      className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-gray-700'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2'>Guests</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type='number'
                      name='persons'
                      min="1"
                      value={bookingData.persons}
                      onChange={onChangeHandler}
                      className='w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-gray-700'
                    />
                  </div>
                </div>

                <div className='border-t border-gray-100 pt-5 mt-2 space-y-3'>
                  <div className='flex justify-between items-center text-sm'>
                    <span className='text-gray-500'>₹{room.pricePerNight} x 1 night</span>
                    <span className='font-medium text-gray-800'>₹{room.pricePerNight}</span>
                  </div>
                  <div className='flex justify-between items-center text-sm'>
                    <span className='text-gray-500'>Service fee</span>
                    <span className='font-medium text-gray-800'>₹0</span>
                  </div>
                  <div className='flex justify-between items-center text-lg font-bold border-t border-gray-100 pt-3'>
                    <span className='text-heading'>Total</span>
                    <span className='text-primary'>₹{room.pricePerNight}</span>
                  </div>
                </div>

                <button
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-blue-500/20
                                        ${isAvailable
                      ? "bg-primary hover:bg-blue-700 text-white"
                      : "bg-heading hover:bg-black text-white"}`}
                  type='submit'
                >
                  {isAvailable ? "Book Now" : "Check Availability"}
                </button>

                {isAvailable && (
                  <p className="text-center text-xs text-gray-400">You won't be charged yet</p>
                )}
              </form>
            </div>

            {/* Host/Owner Info */}
            <div className="mt-6 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-primary font-bold text-xl">
                {room.hotel.owner?.name?.[0] || "H"}
              </div>
              <div>
                <h4 className="font-bold text-heading">{room.hotel.owner?.name || "Hotel Owner"}</h4>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                  <Phone size={12} />
                  <span>+91 98765 43217</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
};

export default SingleRoom
