import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  MapPin, Calendar, Users, CreditCard, CheckCircle,
  Clock, XCircle, Hash, User
} from "lucide-react";
import { AppContext } from "../context/AppContext.jsx";

const getStatusColor = (status) => ({
  confirmed: "bg-green-500", completed: "bg-green-500", pending: "bg-yellow-500", cancelled: "bg-red-500"
}[status] || "bg-gray-500");

const getStatusTextColor = (status) => ({
  confirmed: "text-green-500", completed: "text-green-500", pending: "text-yellow-500", cancelled: "text-red-500"
}[status] || "text-gray-500");

const getStatusIcon = (status) =>
  ({ confirmed: CheckCircle, completed: CheckCircle, pending: Clock, cancelled: XCircle }[status] || Clock);

const MyBookings = () => {
  const { axios, getImageUrl } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("single");
  const [bookingData, setBookingData] = useState([]);
  const [groupBookings, setGroupBookings] = useState([]);
  const navigate = useNavigate();

  const fetchMyBookings = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/bookings/user");
      if (data.success) setBookingData(data.bookings);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  }, [axios]);

  const fetchGroupBookings = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/bookings/user/group");
      if (data.success) setGroupBookings(data.bookings);
    } catch {
      // silently ignore if no group bookings
    }
  }, [axios]);

  useEffect(() => {
    fetchMyBookings();
    fetchGroupBookings();
  }, [fetchMyBookings, fetchGroupBookings]);

  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const { data } = await axios.put(`/api/bookings/cancel/${bookingId}`);
      if (data.success) { toast.success("Booking cancelled"); fetchMyBookings(); }
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Cancel failed");
    }
  };

  const cancelGroupBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this group booking?")) return;
    try {
      const { data } = await axios.delete(`/api/bookings/group/${bookingId}`);
      if (data.success) { toast.success("Group booking cancelled"); fetchGroupBookings(); }
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Cancel failed");
    }
  };

  const handlePayNow = async (booking) => {
    try {
      if (booking.status === "cancelled") { toast.error("This booking is cancelled."); return; }
      if (booking.isPaid) { toast.error("Already paid"); return; }
      const { data } = await axios.post("/api/payments/create-order", { bookingId: booking._id });
      if (!data.success) { toast.error("Unable to create payment order"); return; }
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY, amount: data.order.amount, currency: "INR",
        name: "Hotel Booking", description: "Room Payment", order_id: data.order.id,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post("/api/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking._id,
            });
            if (verifyRes.data.success) {
              toast.success("Payment Successful");
              fetchMyBookings();
              fetchGroupBookings();
            }
            else toast.error("Payment verification failed");
          } catch { toast.error("Payment verification failed"); }
        },
        prefill: { name: "Hotel Guest", email: "guest@example.com", contact: "9999999999" },
        theme: { color: "#2563eb" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch { toast.error("Payment failed"); }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-32">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">My Bookings</h1>
          <p className="text-gray-600">View and manage all your reservations.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 justify-center">
          {[
            { id: "single", label: `🛏 Single Bookings (${bookingData.length})` },
            { id: "group", label: `👥 Group Bookings (${groupBookings.length})` },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all
                ${activeTab === tab.id
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── SINGLE BOOKINGS ─── */}
        {activeTab === "single" && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="hidden md:grid md:grid-cols-12 bg-gray-50 px-6 py-4 border-b border-gray-200 font-semibold text-gray-700">
              <div className="col-span-4">Hotel &amp; Room</div>
              <div className="col-span-3">Dates</div>
              <div className="col-span-2">Payment</div>
              <div className="col-span-3">Status</div>
            </div>
            <div className="divide-y divide-gray-100">
              {bookingData.map((booking) => {
                const isCompleted = booking.status !== "cancelled" && new Date() > new Date(booking.checkOut);
                const displayStatus = isCompleted ? "completed" : booking.status;
                const StatusIcon = getStatusIcon(displayStatus);
                return (
                  <div key={booking._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      <div className="md:col-span-4 flex gap-4">
                        <img src={getImageUrl(booking.room.images[0])}
                          alt={booking.room.roomType}
                          className="w-24 h-20 rounded-lg object-cover" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-800 text-lg">{booking.hotel.hotelName}</h3>
                          </div>
                          <p className="text-blue-600 font-medium">{booking.room.roomType}</p>
                          <div className="flex items-start gap-1 text-gray-500 text-sm">
                            <MapPin className="w-3 h-3 mt-1" />{booking.hotel.hotelAddress}
                          </div>
                          <div className="flex items-center gap-1 text-gray-500 text-sm">
                            <Users className="w-3 h-3" />{booking.persons} Guest{booking.persons > 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>
                      <div className="md:col-span-3 space-y-2">
                        {[["Check-in", booking.checkIn], ["Check-out", booking.checkOut]].map(([label, date]) => (
                          <div key={label} className="flex gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">{label}</p>
                              <p className="font-medium text-gray-800">{new Date(date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="md:col-span-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600"><CreditCard className="w-4 h-4" />{booking.paymentMethod}</div>
                        <p className="font-bold text-lg text-gray-800">₹{booking.totalPrice}</p>
                        {booking.isPaid ? (
                          <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Paid</span>
                        ) : displayStatus === "completed" ? (
                          <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">Pay at Hotel</span>
                        ) : (
                          <button onClick={() => handlePayNow(booking)}
                            className="mt-1 px-3 py-1 text-xs rounded-full bg-red-100 text-red-700 font-semibold hover:underline">Pay Now</button>
                        )}
                      </div>
                      <div className="md:col-span-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(displayStatus)}`} />
                          <StatusIcon className={`w-4 h-4 ${getStatusTextColor(displayStatus)}`} />
                          <span className={`capitalize font-medium ${getStatusTextColor(displayStatus)}`}>{displayStatus}</span>
                        </div>
                        {displayStatus === "completed" ? (
                          <button onClick={() => navigate(`/room/${booking.room._id}`)}
                            className="text-xs text-blue-600 border border-blue-300 px-3 py-1 rounded hover:bg-blue-50">Review</button>
                        ) : booking.status !== "cancelled" && new Date() < new Date(booking.checkIn) ? (
                          <button onClick={() => cancelBooking(booking._id)}
                            className="text-xs text-red-600 border border-red-300 px-3 py-1 rounded hover:bg-red-100">Cancel</button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
              {bookingData.length === 0 && (
                <div className="text-center py-12 text-gray-500">No single bookings yet.</div>
              )}
            </div>
          </div>
        )}

        {/* ─── GROUP BOOKINGS TAB ─── */}
        {activeTab === "group" && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {groupBookings.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <Users size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium">No group bookings yet</p>
                <p className="text-sm">Visit a hotel page and create your first group booking.</p>
              </div>
            ) : (
              <>
                <div className="hidden md:grid md:grid-cols-12 bg-gray-50 px-6 py-4 border-b border-gray-200 font-semibold text-gray-700">
                  <div className="col-span-2">Group Code</div>
                  <div className="col-span-2">Hotel</div>
                  <div className="col-span-2">Leader</div>
                  <div className="col-span-1">Rooms</div>
                  <div className="col-span-1">Members</div>
                  <div className="col-span-2">Dates</div>
                  <div className="col-span-1">Price</div>
                  <div className="col-span-1">Status/Action</div>
                </div>
                <div className="divide-y divide-gray-100">
                  {groupBookings.map((booking) => {
                    const isCompleted = booking.status !== "cancelled" && new Date() > new Date(booking.checkOut);
                    const displayStatus = isCompleted ? "completed" : booking.status;
                    const StatusIcon = getStatusIcon(displayStatus);
                    return (
                      <div key={booking._id} className="p-5 hover:bg-gray-50 transition-colors">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                          <div className="md:col-span-2">
                            <span className="font-mono text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded">
                              {booking.groupCode}
                            </span>
                          </div>
                          <div className="md:col-span-2 text-sm font-medium text-gray-700">
                            {booking.hotel?.hotelName || "—"}
                          </div>
                          <div className="md:col-span-2 flex items-center gap-1 text-sm text-gray-600">
                            <User size={13} /> {booking.leaderName || "—"}
                          </div>
                          <div className="md:col-span-1 text-sm font-semibold text-gray-800">
                            {booking.totalRooms}
                          </div>
                          <div className="md:col-span-1 flex items-center gap-1 text-sm text-gray-600">
                            <Users size={13} /> {booking.totalMembers}
                          </div>
                          <div className="md:col-span-2 text-xs text-gray-500 space-y-1">
                            <div className="flex gap-1"><Calendar size={11} className="mt-0.5" />{new Date(booking.checkIn).toLocaleDateString("en-IN")}</div>
                            <div className="flex gap-1"><Calendar size={11} className="mt-0.5" />{new Date(booking.checkOut).toLocaleDateString("en-IN")}</div>
                          </div>
                          <div className="md:col-span-1">
                            <span className="font-bold text-green-600 text-sm">₹{(booking.totalPrice || 0).toLocaleString()}</span>
                          </div>
                          <div className="md:col-span-1 space-y-1">
                            <div className={`flex items-center gap-1 text-xs font-medium capitalize ${getStatusTextColor(displayStatus)}`}>
                              <StatusIcon size={13} /> {displayStatus}
                            </div>
                            {!booking.isPaid && displayStatus !== "completed" && booking.status !== "cancelled" && (
                              <button
                                onClick={() => handlePayNow(booking)}
                                className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold hover:underline"
                              >
                                Pay Now
                              </button>
                            )}
                            {booking.status !== "cancelled" && new Date() < new Date(booking.checkIn) && (
                              <button onClick={() => cancelGroupBooking(booking._id)}
                                className="text-xs text-red-600 border border-red-300 px-2 py-0.5 rounded hover:bg-red-50">
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
