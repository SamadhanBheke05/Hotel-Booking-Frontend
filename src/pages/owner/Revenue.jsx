import React, { useEffect, useState, useContext, useRef } from "react";
import { AppContext } from "../../context/AppContext";
import {
  ChevronDown,
  Search,
  IndianRupee,
  Calendar,
  CheckCircle2,
  AlertCircle,
  XCircle,
  LayoutDashboard
} from "lucide-react";

const Revenue = () => {
  const { axios } = useContext(AppContext);

  // State
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("all"); // Default to "all"
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  // Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  // Fetch Hotels on Mount
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const { data } = await axios.get("/api/owner/hotels");
        if (data.success) {
          setHotels(data.hotels);
        }
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };
    fetchHotels();
  }, [axios]);

  // Fetch Stats when Hotel is selected
  useEffect(() => {
    // If selectedHotel is null/undefined, don't fetch (though default is now "all")
    if (!selectedHotel) return;

    const fetchRevenue = async () => {
      setLoading(true);
      try {
        // Use "all" or specific ID
        const hotelId = selectedHotel === "all" ? "all" : selectedHotel._id;
        const { data } = await axios.get(`/api/owner/revenue/${hotelId}`);
        if (data.success) {
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching revenue:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, [selectedHotel, axios]);

  // Handle outside click for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset search when dropdown closes
  useEffect(() => {
    if (!isDropdownOpen) {
      setSearchTerm("");
    }
  }, [isDropdownOpen]);

  // Filter hotels for search
  const filteredHotels = hotels.filter(hotel =>
    hotel.hotelName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 font-sans">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
          <LayoutDashboard className="w-8 h-8 text-blue-600" />
          Revenue Analytics
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          Monitor your hotel performance, revenue, and booking trends in real-time.
        </p>
      </div>

      {/* Hotel Selector */}
      <div className="mb-10 w-full max-w-md relative" ref={dropdownRef}>
        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
          Select Hotel
        </label>

        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`w-full flex items-center justify-between px-4 py-3 bg-white border rounded-xl shadow-sm text-left transition-all duration-200 
            ${isDropdownOpen ? 'ring-2 ring-blue-100 border-blue-500' : 'border-gray-200 hover:border-blue-400'}`}
        >
          <span className={`block truncate ${selectedHotel ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
            {selectedHotel === "all" ? "All Hotels" : selectedHotel.hotelName}
          </span>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
            <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Search properties */}
              <div className="p-2 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search hotels..."
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>

              {/* List */}
              <ul className="max-h-60 overflow-y-auto">
                {/* "All Hotels" Option */}
                <li
                  onClick={() => {
                    setSelectedHotel("all");
                    setIsDropdownOpen(false);
                  }}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between group transition-colors border-b border-gray-50"
                >
                  <span className="text-gray-700 group-hover:text-blue-700 font-medium font-sans">
                    All Hotels
                  </span>
                  {selectedHotel === "all" && (
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  )}
                </li>

                {filteredHotels.length > 0 ? (
                  filteredHotels.map((hotel) => (
                    <li
                      key={hotel._id}
                      onClick={() => {
                        setSelectedHotel(hotel);
                        setIsDropdownOpen(false);
                      }}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between group transition-colors"
                    >
                      <span className="text-gray-700 group-hover:text-blue-700 font-medium">
                        {hotel.hotelName}
                      </span>
                      {selectedHotel?._id === hotel._id && (
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      )}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-8 text-center text-gray-400 text-sm">
                    No hotels found
                  </li>
                )}
              </ul>
              <div className="px-4 py-2 bg-gray-50 text-xs text-gray-400 border-t border-gray-100">
                Total Hotels: {hotels.length}
              </div>
            </div>
          )}
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {loading ? (
          // Loading State
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Loading revenue data...</p>
          </div>
        ) : !stats ? (
          <div className="text-center py-10 text-gray-500">Failed to load data.</div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Total Bookings */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Bookings</p>
                  <h2 className="text-4xl font-bold text-gray-900">{stats.totalBookings}</h2>
                  <div className="text-xs text-green-600 mt-2 font-medium flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    Active bookings
                  </div>
                </div>
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <BookingsIcon className="w-7 h-7 text-blue-600" />
                </div>
              </div>

              {/* Card 2: Total Revenue */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
                  <h2 className="text-4xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</h2>
                  <div className="text-xs text-green-600 mt-2 font-medium flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    from last month
                  </div>
                </div>
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center">
                  <IndianRupee className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </div>

            {/* Recent Bookings Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Recent Bookings</h3>
                <span className="text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">
                  {stats.recentBookings.length} Records
                </span>
              </div>

              <div className="overflow-x-auto">
                {stats.recentBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500">No bookings found better luck next time.</p>
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                        {(selectedHotel === "all") && (
                          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Hotel Name</th>
                        )}
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Room Type</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {stats.recentBookings.map((booking) => {
                        const currentDate = new Date();
                        const checkOutDate = new Date(booking.checkOut);
                        const isCompleted = booking.status !== "cancelled" && currentDate > checkOutDate;
                        const displayStatus = isCompleted ? "completed" : booking.status;

                        return (
                          <tr key={booking._id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                                  {booking.user?.name?.charAt(0) || "U"}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{booking.user?.name || "Unknown User"}</p>
                                  <p className="text-xs text-gray-500">{booking.user?.email || "No Email"}</p>
                                </div>
                              </div>
                            </td>
                            {(selectedHotel === "all") && (
                              <td className="px-6 py-4">
                                <span className="text-sm text-gray-700 font-medium">
                                  {booking.hotel?.hotelName || "N/A"}
                                </span>
                              </td>
                            )}

                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-700 font-medium bg-gray-100 px-3 py-1 rounded-lg">
                                {booking.room?.roomType || "Standard Room"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-bold text-gray-900">₹{booking.totalPrice?.toLocaleString() || booking.amount?.toLocaleString() || 0}</span>
                            </td>
                            <td className="px-6 py-4">
                              <StatusBadge status={displayStatus} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Helper Components

const BookingsIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v.756l2.108.405a9.783 9.783 0 013.375 1.482l.859-.496a.75.75 0 01.918 1.155l-.859.496c.6.76 1.054 1.636 1.33 2.583l2.108.405a.75.75 0 010 1.487l-2.108.405a9.771 9.771 0 01-1.33 2.583l.858.496a.75.75 0 01-.918 1.155l-.858-.496a9.783 9.783 0 01-3.375 1.482L12.75 21a.75.75 0 01-1.5 0l-.792-4.116a9.783 9.783 0 01-3.375-1.482l-.859.496a.75.75 0 01-.918-1.155l.859-.496a9.771 9.771 0 01-1.33-2.583l-2.108-.405a.75.75 0 010-1.487l2.108-.405a9.783 9.783 0 011.33-2.583l-.858-.496a.75.75 0 01.918-1.155l.858.496a9.783 9.783 0 013.375-1.482L12 3a.75.75 0 010-1.5zM12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" clipRule="evenodd" />
  </svg>
);

const StatusBadge = ({ status }) => {
  const styles = {
    paid: "bg-green-100 text-green-700 border-green-200",
    confirmed: "bg-green-100 text-green-700 border-green-200",
    completed: "bg-blue-100 text-blue-700 border-blue-200", // Blue for completed
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    failed: "bg-red-100 text-red-700 border-red-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
  };

  const icons = {
    paid: <CheckCircle2 className="w-3.5 h-3.5 mr-1" />,
    confirmed: <CheckCircle2 className="w-3.5 h-3.5 mr-1" />,
    completed: <CheckCircle2 className="w-3.5 h-3.5 mr-1" />,
    pending: <AlertCircle className="w-3.5 h-3.5 mr-1" />,
    failed: <XCircle className="w-3.5 h-3.5 mr-1" />,
    cancelled: <XCircle className="w-3.5 h-3.5 mr-1" />,
  };

  const normalizedStatus = status?.toLowerCase() || "pending";
  const activeStyle = styles[normalizedStatus] || styles.pending;
  const ActiveIcon = icons[normalizedStatus] || icons.pending;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${activeStyle}`}>
      {ActiveIcon}
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Pending"}
    </span>
  );
};

export default Revenue;
