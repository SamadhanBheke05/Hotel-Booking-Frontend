import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import RoomCard from "../components/RoomCard";
import toast from "react-hot-toast";
import {
  Users, Calendar, CheckSquare, Square, User,
  AlertCircle, CheckCircle, Loader2, Info, Hash
} from "lucide-react";

const HotelRooms = () => {
  const { id } = useParams();
  const { roomData, axios, navigate, user, getImageUrl } = useContext(AppContext);


  const [bookingMode, setBookingMode] = useState("single"); // "single" | "group"
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [groupForm, setGroupForm] = useState({
    leaderName: "",
    totalMembers: 1,
    checkIn: "",
    checkOut: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Get rooms belonging to this hotel
  const filteredRooms = roomData.filter((room) => {
    if (!room.hotel) return false;
    return typeof room.hotel === "string" ? room.hotel === id : room.hotel._id === id;
  });

  // Derive hotel directly from populated room data (reactive, no useEffect needed)
  const hotel = filteredRooms.length > 0 && filteredRooms[0].hotel && typeof filteredRooms[0].hotel !== "string"
    ? filteredRooms[0].hotel
    : null;

  // Calculate total price
  const nights =
    groupForm.checkIn && groupForm.checkOut
      ? Math.max(1, Math.ceil((new Date(groupForm.checkOut) - new Date(groupForm.checkIn)) / (1000 * 3600 * 24)))
      : 1;

  const selectedRoomsData = filteredRooms.filter((r) => selectedRooms.includes(r._id));
  const totalPrice = selectedRoomsData.reduce((sum, r) => sum + r.pricePerNight * nights, 0);

  const toggleRoom = (roomId) => {
    if (selectedRooms.includes(roomId)) {
      setSelectedRooms(selectedRooms.filter((id) => id !== roomId));
    } else {
      if (hotel && selectedRooms.length >= hotel.maxGroupRooms) {
        toast.error(`Maximum ${hotel.maxGroupRooms} rooms allowed for group booking`);
        return;
      }
      setSelectedRooms([...selectedRooms, roomId]);
    }
  };

  const handleGroupSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to make a group booking");
      navigate("/login");
      return;
    }
    if (selectedRooms.length === 0) {
      toast.error("Please select at least one room");
      return;
    }
    if (!groupForm.checkIn || !groupForm.checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }
    if (new Date(groupForm.checkIn) >= new Date(groupForm.checkOut)) {
      toast.error("Check-out must be after check-in");
      return;
    }
    if (hotel && Number(groupForm.totalMembers) > hotel.maxGroupMembers) {
      toast.error(`Max group members allowed is ${hotel.maxGroupMembers}`);
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await axios.post("/api/bookings/group", {
        hotelId: id,
        roomIds: selectedRooms,
        leaderName: groupForm.leaderName,
        totalMembers: Number(groupForm.totalMembers),
        checkInDate: groupForm.checkIn,
        checkOutDate: groupForm.checkOut,
      });

      if (data.success) {
        toast.success(`Group booking confirmed! Code: ${data.groupCode}`);
        navigate("/my-bookings");
        window.scrollTo(0, 0);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!roomData || roomData.length === 0) {
    return <p className="text-center py-10 animate-pulse text-gray-500">Loading rooms...</p>;
  }

  const groupAllowed = hotel?.groupBookingAllowed;

  return (
    <div className="pt-24 pb-12 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">

        {/* Hotel Header */}
        {hotel && (
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{hotel.hotelName}</h1>
            <p className="text-gray-500 mb-3">{hotel.hotelAddress}</p>
            {groupAllowed && (
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <Users size={14} /> Group bookings available — up to {hotel.maxGroupMembers} members, {hotel.maxGroupRooms} rooms
              </span>
            )}
          </div>
        )}

        {/* Booking Mode Tabs — only show if group booking is allowed */}
        {groupAllowed && (
          <div className="flex gap-2 mb-6 justify-center">
            {["single", "group"].map((mode) => (
              <button
                key={mode}
                onClick={() => { setBookingMode(mode); setSelectedRooms([]); }}
                className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 capitalize
                  ${bookingMode === mode
                    ? "bg-primary text-white shadow-md shadow-blue-200"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}>
                {mode === "single" ? "🛏 Single Booking" : "👥 Group Booking"}
              </button>
            ))}
          </div>
        )}

        {/* ─── GROUP BOOKING MODE ─── */}
        {bookingMode === "group" && groupAllowed ? (
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Left: Room Selection */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
                <CheckSquare size={20} className="text-primary" /> Select Rooms
                <span className="text-sm font-normal text-gray-400">(Select up to {hotel?.maxGroupRooms} rooms)</span>
              </h2>

              {filteredRooms.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No rooms available for this hotel</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredRooms.map((room) => {
                    const isSelected = selectedRooms.includes(room._id);
                    return (
                      <div
                        key={room._id}
                        onClick={() => toggleRoom(room._id)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-200 flex flex-col
                          ${isSelected
                            ? "border-primary shadow-lg shadow-blue-100 scale-[1.01]"
                            : "border-gray-100 hover:border-blue-200 hover:shadow-md"}`}>

                        {/* Selection badge */}
                        <div className={`absolute top-2 right-2 z-10 transition-all ${isSelected ? "opacity-100" : "opacity-0"}`}>
                          <span className="bg-primary text-white px-1.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-0.5">
                            <CheckCircle size={9} /> Selected
                          </span>
                        </div>

                        {/* Image — top 55% */}
                        <div className="h-[55%] flex-shrink-0 overflow-hidden">
                          <img
                            src={getImageUrl(room.images?.[0])}
                            alt={room.roomType}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Info — bottom 45% */}
                        <div className="h-[45%] bg-white px-3 py-2.5 flex flex-col justify-between">
                          <div>
                            <h3 className="font-bold text-gray-800 text-base leading-tight line-clamp-1">{room.roomType}</h3>
                            <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-snug">{room.description}</p>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center gap-1.5">
                              {isSelected
                                ? <CheckSquare size={15} className="text-primary" />
                                : <Square size={15} className="text-gray-300" />}
                              <span className={`text-xs font-medium ${isSelected ? "text-primary" : "text-gray-400"}`}>
                                {isSelected ? "Remove" : "Select"}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-primary text-base">₹{room.pricePerNight}</p>
                              <p className="text-[10px] text-gray-400">/ night</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>


            {/* Right: Group Booking Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Hash size={18} className="text-primary" /> Group Booking Details
                </h3>

                <form onSubmit={handleGroupSubmit} className="space-y-4">
                  {/* Leader Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Leader Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="text" value={groupForm.leaderName} required
                        onChange={(e) => setGroupForm({ ...groupForm, leaderName: e.target.value })}
                        placeholder="Group leader's name"
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary transition-colors" />
                    </div>
                  </div>

                  {/* Total Members */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                      Total Members <span className="text-gray-400 font-normal">(max {hotel?.maxGroupMembers})</span>
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="number" min="1" max={hotel?.maxGroupMembers} required
                        value={groupForm.totalMembers}
                        onChange={(e) => setGroupForm({ ...groupForm, totalMembers: e.target.value })}
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary transition-colors" />
                    </div>
                  </div>

                  {/* Dates */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Check-in</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="date" required
                        min={new Date().toISOString().split("T")[0]}
                        value={groupForm.checkIn}
                        onChange={(e) => setGroupForm({ ...groupForm, checkIn: e.target.value })}
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Check-out</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="date" required
                        min={groupForm.checkIn || new Date().toISOString().split("T")[0]}
                        value={groupForm.checkOut}
                        onChange={(e) => setGroupForm({ ...groupForm, checkOut: e.target.value })}
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary transition-colors" />
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="border-t pt-4 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Rooms selected</span>
                      <span className="font-medium">{selectedRooms.length} / {hotel?.maxGroupRooms}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Nights</span>
                      <span className="font-medium">{nights}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base text-gray-800 border-t pt-2">
                      <span>Total Price</span>
                      <span className="text-primary">₹{totalPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  <button type="submit" disabled={submitting || selectedRooms.length === 0}
                    className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {submitting && <Loader2 size={16} className="animate-spin" />}
                    {submitting ? "Confirming..." : "Confirm Group Booking"}
                  </button>
                  <p className="text-center text-xs text-gray-400">You won't be charged yet</p>
                </form>
              </div>
            </div>
          </div>

        ) : bookingMode === "group" && !groupAllowed ? (
          // Group booking not allowed message
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center mb-8">
            <AlertCircle size={40} className="mx-auto text-yellow-500 mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Group Bookings Not Available</h3>
            <p className="text-gray-600 text-sm">This hotel currently does not allow group bookings.</p>
          </div>
        ) : (
          // ─── SINGLE BOOKING MODE (default) ───
          <>
            <h1 className="text-3xl font-semibold text-center mb-6">Available Rooms</h1>
            {filteredRooms.length === 0 ? (
              <p className="text-center text-gray-500">No rooms available for this hotel</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredRooms.map((room) => (
                  <RoomCard key={room._id} room={room} />
                ))}
              </div>
            )}

            {/* Nudge to group booking */}
            {groupAllowed && (
              <div className="mt-10 bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-center gap-4">
                <Info size={24} className="text-blue-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">Travelling with a group?</p>
                  <p className="text-sm text-gray-600">Switch to <strong>Group Booking</strong> to book multiple rooms at once and get a shared group code.</p>
                </div>
                <button onClick={() => setBookingMode("group")}
                  className="ml-auto px-4 py-2 bg-primary text-white text-sm rounded-xl font-semibold hover:bg-blue-700 flex-shrink-0">
                  Switch
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default HotelRooms;
