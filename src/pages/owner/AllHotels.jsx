import React, { useCallback, useContext, useState, useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import { Star, Users, Edit2, Trash2 } from 'lucide-react';
import toast from "react-hot-toast"

const AllHotels = () => {
  const { navigate, axios, getImageUrl } = useContext(AppContext);
  const [hotelData, setHotelData] = useState([]);

  const fetchOwnerHotels = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/hotel/get-all");
      if (data.success) {
        setHotelData(data.hotels);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [axios]);

  useEffect(() => {
    fetchOwnerHotels();
  }, [fetchOwnerHotels]);

  const deleteHotel = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hotel?")) return;
    try {
      const { data } = await axios.delete(`/api/hotel/delete/${id}`);
      if (data.success) {
        toast.success(data.message);
        fetchOwnerHotels();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6'>
      <div className='max-w-7xl mx-auto'>

        {/* Header */}
        <div className='mb-8 flex flex-col md:flex-row justify-between items-center bg-white rounded-2xl shadow-xl p-6'>
          <div>
            <h1 className='text-4xl font-bold text-gray-800 mb-2'>Premium Hotels Collections</h1>
            <p className='text-gray-600'>Discover exceptional stays around the world</p>
          </div>
          <button className='bg-primary text-white px-6 py-2 rounded-md cursor-pointer hover:bg-blue-700 transition-colors'
            onClick={() => navigate("/owner/register-hotel")}>
            + Register Hotel
          </button>
        </div>

        {/* Table */}
        <div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white'>
                <tr>
                  <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider'>Hotel</th>
                  <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider'>Location</th>
                  <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider'>Owner</th>
                  <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider'>Rating</th>
                  <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider'>Price/Night</th>
                  <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider'>Group Booking</th>
                  <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {hotelData.map((hotel, index) => (
                  <tr key={hotel._id}
                    className={`hover:bg-blue-50 transition-all duration-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>

                    {/* Hotel Name + Image */}
                    <td className='px-6 py-5'>
                      <div className='flex items-center gap-4'>
                        <img
                          src={getImageUrl(hotel.image)}
                          alt={hotel.hotelName}
                          className='w-20 h-16 rounded-lg object-cover shadow-sm'
                        />
                        <h3 className='font-semibold text-gray-900 line-clamp-2'>{hotel.hotelName}</h3>
                      </div>
                    </td>

                    {/* Location */}
                    <td className='px-6 py-5'>
                      <span className='text-sm text-gray-600 line-clamp-2'>{hotel.hotelAddress}</span>
                    </td>

                    {/* Owner */}
                    <td className='px-6 py-5 text-sm text-gray-600'>{hotel.owner?.name}</td>

                    {/* Rating */}
                    <td className='px-6 py-5'>
                      <div className='flex items-center gap-1'>
                        <Star className='w-4 h-4 text-yellow-400 fill-current' />
                        <span className='text-sm text-gray-600'>{hotel.rating}</span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className='px-6 py-5'>
                      <span className='text-xl font-bold text-green-600'>₹{hotel.price}</span>
                    </td>

                    {/* Group Booking Badge */}
                    <td className='px-6 py-5'>
                      {hotel.groupBookingAllowed ? (
                        <div className='space-y-1'>
                          <span className='inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium'>
                            <Users size={11} /> Enabled
                          </span>
                          <div className='text-xs text-gray-500'>
                            <div>Max {hotel.maxGroupMembers} members</div>
                            <div>Max {hotel.maxGroupRooms} rooms</div>
                          </div>
                        </div>
                      ) : (
                        <span className='inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full'>
                          Disabled
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className='px-6 py-5'>
                      <div className='flex items-center gap-2'>
                        <button
                          onClick={() => navigate(`/owner/edit-hotel/${hotel._id}`)}
                          className='flex items-center gap-1 bg-blue-500 text-white py-1 px-3 rounded-full text-xs hover:bg-blue-600 transition-colors'>
                          <Edit2 size={12} /> Edit
                        </button>
                        <button
                          onClick={() => deleteHotel(hotel._id)}
                          className='flex items-center gap-1 bg-red-500 text-white py-1 px-3 rounded-full text-xs hover:bg-red-600 transition-colors'>
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {hotelData.length === 0 && (
              <div className='text-center py-12 text-gray-500'>No hotels registered yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllHotels

