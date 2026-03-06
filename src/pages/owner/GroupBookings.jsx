import React, { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import {
    Users, Hash, MapPin, Calendar, DollarSign, CheckCircle,
    Clock, XCircle, ChevronDown, ChevronUp, Loader2
} from "lucide-react";

const STATUS_COLORS = {
    confirmed: "bg-green-100 text-green-700",
    completed: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-700",
};

const StatusIcon = ({ status }) => {
    if (status === "confirmed" || status === "completed") return <CheckCircle size={14} />;
    if (status === "cancelled") return <XCircle size={14} />;
    return <Clock size={14} />;
};

const GroupBookings = () => {
    const { axios } = useContext(AppContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

    const fetchGroupBookings = useCallback(async () => {
        try {
            const { data } = await axios.get("/api/owner/group-bookings");
            if (data.success) {
                setBookings(data.bookings);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load group bookings");
        } finally {
            setLoading(false);
        }
    }, [axios]);

    useEffect(() => {
        fetchGroupBookings();
    }, [fetchGroupBookings]);

    const cancelBooking = async (bookingId) => {
        if (!window.confirm("Cancel this group booking?")) return;
        try {
            const { data } = await axios.delete(`/api/bookings/group/${bookingId}`);
            if (data.success) {
                toast.success("Group booking cancelled");
                fetchGroupBookings();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Cancel failed");
        }
    };

    // Stats
    const totalRevenue = bookings
        .filter((b) => b.status !== "cancelled")
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const totalRooms = bookings
        .filter((b) => b.status !== "cancelled")
        .reduce((sum, b) => sum + (b.totalRooms || 0), 0);
    const totalMembers = bookings
        .filter((b) => b.status !== "cancelled")
        .reduce((sum, b) => sum + (b.totalMembers || 0), 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 w-full">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8 bg-white rounded-2xl shadow-xl p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-1">Group Bookings</h1>
                    <p className="text-gray-500">Manage all group reservations for your hotels</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Total Group Bookings", value: bookings.length, icon: <Hash className="text-blue-500" /> },
                        { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: <DollarSign className="text-green-500" /> },
                        { label: "Total Rooms Booked", value: totalRooms, icon: <MapPin className="text-purple-500" /> },
                        { label: "Total Members Hosted", value: totalMembers, icon: <Users className="text-orange-500" /> },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">{stat.icon}</div>
                            <div>
                                <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                                <p className="text-xs text-gray-500">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bookings Table */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {bookings.length === 0 ? (
                        <div className="text-center py-16 text-gray-500">
                            <Users size={48} className="mx-auto mb-3 text-gray-300" />
                            <p className="text-lg font-medium">No group bookings yet</p>
                            <p className="text-sm">Group bookings will appear here once guests create them.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                                    <tr>
                                        {["Group Code", "Hotel", "Leader", "Rooms", "Members", "Total Price", "Dates", "Status", "Actions"].map((h) => (
                                            <th key={h} className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {bookings.map((booking, index) => {
                                        const isCompleted = booking.status !== "cancelled" && new Date() > new Date(booking.checkOut);
                                        const displayStatus = isCompleted ? "completed" : booking.status;
                                        return (
                                        <React.Fragment key={booking._id}>
                                            <tr className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>

                                                {/* Group Code */}
                                                <td className="px-4 py-4">
                                                    <span className="font-mono text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded">
                                                        {booking.groupCode}
                                                    </span>
                                                </td>

                                                {/* Hotel */}
                                                <td className="px-4 py-4 text-sm font-medium text-gray-700">
                                                    {booking.hotel?.hotelName || "—"}
                                                </td>

                                                {/* Leader */}
                                                <td className="px-4 py-4 text-sm text-gray-600">
                                                    {booking.leaderName || "—"}
                                                </td>

                                                {/* Rooms */}
                                                <td className="px-4 py-4">
                                                    <span className="text-sm font-semibold text-gray-800">{booking.totalRooms}</span>
                                                </td>

                                                {/* Members */}
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-1 text-sm text-gray-700">
                                                        <Users size={13} /> {booking.totalMembers}
                                                    </div>
                                                </td>

                                                {/* Total Price */}
                                                <td className="px-4 py-4">
                                                    <span className="font-bold text-green-600">₹{(booking.totalPrice || 0).toLocaleString()}</span>
                                                </td>

                                                {/* Dates */}
                                                <td className="px-4 py-4 text-xs text-gray-500 space-y-1">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar size={11} /> {new Date(booking.checkIn).toLocaleDateString("en-IN")}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar size={11} /> {new Date(booking.checkOut).toLocaleDateString("en-IN")}
                                                    </div>
                                                </td>

                                                {/* Status */}
                                                <td className="px-4 py-4">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[displayStatus] || "bg-gray-100 text-gray-600"}`}>
                                                        <StatusIcon status={displayStatus} />
                                                        {displayStatus}
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => setExpandedId(expandedId === booking._id ? null : booking._id)}
                                                            className="text-xs text-blue-600 border border-blue-300 px-2 py-1 rounded hover:bg-blue-50 flex items-center gap-1">
                                                            {expandedId === booking._id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                                            Details
                                                        </button>
                                                        {booking.status !== "cancelled" && new Date() < new Date(booking.checkIn) && (
                                                            <button
                                                                onClick={() => cancelBooking(booking._id)}
                                                                className="text-xs text-red-600 border border-red-300 px-2 py-1 rounded hover:bg-red-50">
                                                                Cancel
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* Expanded Room Details */}
                                            {expandedId === booking._id && (
                                                <tr>
                                                    <td colSpan={9} className="bg-indigo-50 px-6 py-4">
                                                        <div className="text-sm">
                                                            <p className="font-semibold text-gray-700 mb-2">Booked Rooms</p>
                                                            {booking.rooms && booking.rooms.length > 0 ? (
                                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                                    {booking.rooms.map((r, i) => (
                                                                        <div key={i} className="bg-white rounded-lg p-3 border border-indigo-100">
                                                                            <p className="font-medium text-gray-700">{r.roomId?.roomType || "Room"}</p>
                                                                            <p className="text-green-600 font-semibold">₹{r.price?.toLocaleString()}</p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p className="text-gray-500 text-xs">No room details available</p>
                                                            )}
                                                            <div className="mt-3 text-xs text-gray-500">
                                                                <span>Booked on: {new Date(booking.createdAt).toLocaleDateString("en-IN", {
                                                                    day: "numeric", month: "short", year: "numeric"
                                                                })}</span>
                                                                {booking.user && (
                                                                    <span className="ml-4">Guest: {booking.user.name} ({booking.user.email})</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    )})}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GroupBookings;
