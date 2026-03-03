import React, { useCallback, useContext, useEffect, useState } from 'react'
import toast from "react-hot-toast";
import { MapPin, Calendar, Users, CreditCard, CheckCircle, Clock, XCircle } from "lucide-react"
import { AppContext } from '../../context/AppContext.jsx';

const Bookings = () => {

  const { axios } = useContext(AppContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://hotel-booking-backend-vsqu.onrender.com";

  const [bookingData, setBookingData] = useState([]);

  const fetchMyBookings = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/bookings/hotel");

      if (data.success) {
        setBookingData(data.bookings);

      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [axios]);

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]);



  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
      case "completed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";

      default:
        return "bg-gray-500";
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case "confirmed":
      case "completed":
        return "text-green-500";
      case "pending":
        return "text-yellow-500";
      case "cancelled":
        return "text-red-500";

      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
      case "completed":
        return CheckCircle;
      case "pending":
        return Clock;
      case "cancelled":
        return XCircle;

      default:
        return Clock;
    }
  };



  return (
    <div className='min-h-screen bg-gray-50 py-32'>
      <div className='max-w-7xl mx-auto px-4'>
        {/* header  */}

        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-800 mb-4'>Bookings</h1>


          <p className='text-gray-600 text-lg'>

            {""}
            Here are your hotel bookings. You can view details and manage your reservations.
          </p>
        </div>
        {/* booking list  */}
        <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>

          {/* desktop header  */}
          <div className='hidden md:grid md:grid-cols-12 bg-gray-50 px-6 py-4 border-b border-gray-200 font-semibold text-gray-700'>

            <div className='col-span-4'>Hotel & Room</div>
            <div className='col-span-4'>Dates</div>
            <div className='col-span-4'>Payment</div>
            <div className='col-span-4'>Actions</div>
          </div>

          <div className='divide-y divide-gray-100'>
            {bookingData.map((booking) => {
              const currentDate = new Date();
              const checkOutDate = new Date(booking.checkOut);
              const isCompleted = booking.status !== "cancelled" && currentDate > checkOutDate;

              const displayStatus = isCompleted ? "completed" : booking.status;
              const isPaymentCompleted = booking.isPaid || displayStatus === "completed";
              const StatusIcon = getStatusIcon(displayStatus);

              return (
                <div key={booking._id} className='p-6 hover:bg-gray-50 transition-colors'>
                  <div className='grid grid-cols-1 md:grid-cols-12 gap-6 items-start md:items-center'>

                    {/* Hotel & Room Info  */}
                    <div className='col-span-1 md:col-span-4'>
                      <div className='flex gap-4'>
                        {booking.room ? (
                          <img src={`${backendUrl}/images/${booking.room.images[0]}`} alt={booking.room.roomType}
                            className='w-20 h-16 md:w-24 md:h-20 rounded-lg object-cover flex-shrink:0' />
                        ) : (
                          <div className='w-20 h-16 md:w-24 md:h-20 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 text-xs flex-shrink-0'>
                            No Image
                          </div>
                        )}

                        <div className='flex-1 min-w-0'>
                          <h3 className='font-semibold text-gray-800 text-lg mb-1'>
                            {booking.hotel ? booking.hotel.hotelName : "Hotel Deleted"}
                          </h3>
                          <p className='text-blue-600 font-medium mb-1 '>
                            {booking.room ? booking.room.roomType : "Room Deleted"}
                          </p>

                          {booking.hotel && (
                            <div className='flex items-start gap-1 text-gray-500 text-sm mb-1'>
                              <MapPin className='w-3 h-3 mt-0.5 flex-shrink-0' />
                              <span className='break-words whitespace-normal max-w-full'>
                                {booking.hotel.hotelAddress}
                              </span>
                            </div>
                          )}

                          <div className='flex items-center gap-1 text-gray-500 text-sm'>
                            <Users className='w-3 h-3' />
                            <span>
                              {booking.persons} Guest
                              {booking.persons > 1 ? "s" : ""}</span>

                          </div>
                        </div>

                      </div>

                    </div>

                    {/* dates  */}
                    <div className='col-sapn-1 md:col-span-3'>
                      <div className='space-y-2'>
                        <div className='flex items-center gap-2'>
                          <Calendar className='h-4 w-4 text-gray-400' />
                          <div>
                            <p className='text-sm text-gray-500'> Check-in</p>
                            <p className='font-medium text-graby-800'>
                              {new Date(booking.checkIn).toLocaleDateString("en-Us", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>

                          </div>

                        </div>

                        <div className='flex items-center gap-2'>
                          <Calendar className='h-4 w-4 text-gray-400' />
                          <div>
                            <p className='text-sm text-gray-500'> Check-out</p>
                            <p className='font-medium text-graby-800'>
                              {new Date(booking.checkOut).toLocaleDateString("en-Us", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>

                          </div>

                        </div>


                      </div>
                    </div>
                    {/* Payments  */}
                    <div className='col-span-1 md:col-span-2 '>
                      <div className='space-y-2'>
                        <div className='flex items-center gap-2'>
                          <CreditCard className='w-4 h-4 text-gray-400' />
                          <span className='text-sm text-gray-600'>{booking.paymentMethod}</span>

                        </div>

                        <p className='font-bold text-lg text-gray-800'>
                          ₹{booking.totalPrice}
                        </p>
                        <div
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${isPaymentCompleted
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}>
                          <p>{isPaymentCompleted ? "Paid" : "Pending"}</p>

                        </div>

                      </div>

                    </div>

                    {/* staus  */}
                    <div className="col-span-1 md:col-span-2">
                      <div className="flex flex-col gap-1">

                        {/* Status row */}
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(displayStatus)}`} />
                          <StatusIcon className={`w-4 h-4 ${getStatusTextColor(displayStatus)}`} />
                          <span className={`font-medium capitalize ${getStatusTextColor(displayStatus)}`}>
                            {displayStatus}
                          </span>
                        </div>

                        {/* Cancelled info */}
                        {booking.status === "cancelled" && booking.cancelledBy === "user" && (
                          <p className="text-xs text-red-500 ml-5">
                            Cancelled by user
                          </p>
                        )}

                      </div>
                    </div>



                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </div>

    </div>


  )
}

export default Bookings;
