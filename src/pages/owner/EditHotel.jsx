import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { ToggleLeft, ToggleRight, Users, Loader2 } from "lucide-react";

const EditHotel = () => {
    const { hotelId } = useParams();
    const { axios, navigate } = useContext(AppContext);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);

    const [data, setData] = useState({
        hotelName: "",
        hotelAddress: "",
        location: "",
        rating: "",
        price: "",
        amenities: "",
        groupBookingAllowed: false,
        maxGroupMembers: "",
        maxGroupRooms: "",
        image: "",
    });

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const { data: res } = await axios.get("/api/hotel/get-all");
                if (res.success) {
                    const hotel = res.hotels.find((h) => h._id === hotelId);
                    if (hotel) {
                        setData({
                            hotelName: hotel.hotelName || "",
                            hotelAddress: hotel.hotelAddress || "",
                            location: hotel.location || "",
                            rating: hotel.rating || "",
                            price: hotel.price || "",
                            amenities: hotel.amenities || "",
                            groupBookingAllowed: hotel.groupBookingAllowed || false,
                            maxGroupMembers: hotel.maxGroupMembers || "",
                            maxGroupRooms: hotel.maxGroupRooms || "",
                            image: hotel.image || "",
                        });
                    } else {
                        toast.error("Hotel not found");
                        navigate("/owner");
                    }
                }
            } catch {
                toast.error("Failed to load hotel");
            } finally {
                setLoading(false);
            }
        };
        fetchHotel();
    }, [hotelId, axios, navigate]);

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) setPreview(URL.createObjectURL(selectedFile));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append("hotelName", data.hotelName);
            formData.append("hotelAddress", data.hotelAddress);
            formData.append("location", data.location);
            formData.append("rating", data.rating);
            formData.append("price", data.price);
            formData.append("amenities", data.amenities);
            formData.append("groupBookingAllowed", data.groupBookingAllowed);
            formData.append("maxGroupMembers", data.maxGroupMembers || 0);
            formData.append("maxGroupRooms", data.maxGroupRooms || 0);
            if (file) formData.append("image", file);

            const { data: res } = await axios.put(`/api/hotel/update/${hotelId}`, formData);
            if (res.success) {
                toast.success("Hotel updated successfully!");
                navigate("/owner");
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://hotel-booking-backend-vsqu.onrender.com";

    return (
        <div className="py-10 flex flex-col justify-between bg-white">
            <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Edit Hotel</h2>

                {/* Current / New Image */}
                <div>
                    <p className="text-base font-medium mb-2">Hotel Image</p>
                    <div className="mb-3 flex justify-center">
                        <img
                            src={preview || `${backendUrl}/images/${data.image}`}
                            alt="hotel"
                            className="w-24 h-24 object-cover rounded shadow"
                        />
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
                    <p className="text-xs text-gray-400 mt-1">Leave blank to keep current image</p>
                </div>

                {/* Hotel Name */}
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium">Hotel Name</label>
                    <input type="text" name="hotelName" value={data.hotelName} onChange={handleChange}
                        required className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" />
                </div>

                {/* Hotel Address */}
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium">Hotel Address</label>
                    <textarea name="hotelAddress" value={data.hotelAddress} onChange={handleChange}
                        rows={3} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none" />
                </div>

                {/* Location */}
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium">Google Map Location (Link)</label>
                    <input type="text" name="location" value={data.location} onChange={handleChange}
                        required className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" />
                </div>

                {/* Rating & Price */}
                <div className="flex items-center gap-5 flex-wrap">
                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-base font-medium">Rating</label>
                        <input type="number" name="rating" value={data.rating} onChange={handleChange}
                            min="0" max="5" step="0.1" required
                            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" />
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-base font-medium">Price / Night (₹)</label>
                        <input type="number" name="price" value={data.price} onChange={handleChange}
                            min="0" required
                            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" />
                    </div>
                </div>

                {/* Amenities */}
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium">Amenities (comma separated)</label>
                    <textarea name="amenities" value={data.amenities} onChange={handleChange}
                        rows={3} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none" />
                </div>

                {/* ─── Group Booking Settings ─── */}
                <div className="max-w-md border border-blue-200 rounded-xl p-4 bg-blue-50 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users size={18} className="text-blue-600" />
                            <span className="font-semibold text-gray-800">Group Booking</span>
                        </div>
                        <button type="button"
                            onClick={() => setData({ ...data, groupBookingAllowed: !data.groupBookingAllowed })}
                            className="flex items-center gap-2 text-sm font-medium">
                            {data.groupBookingAllowed
                                ? <><ToggleRight size={32} className="text-blue-600" /><span className="text-blue-600">Enabled</span></>
                                : <><ToggleLeft size={32} className="text-gray-400" /><span className="text-gray-500">Disabled</span></>
                            }
                        </button>
                    </div>

                    {data.groupBookingAllowed && (
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Max Group Members</label>
                                <input type="number" name="maxGroupMembers" value={data.maxGroupMembers}
                                    onChange={handleChange} placeholder="e.g. 20" min="1" required
                                    className="outline-none py-2 px-3 rounded border border-blue-200 bg-white text-sm" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Max Group Rooms</label>
                                <input type="number" name="maxGroupRooms" value={data.maxGroupRooms}
                                    onChange={handleChange} placeholder="e.g. 5" min="1" required
                                    className="outline-none py-2 px-3 rounded border border-blue-200 bg-white text-sm" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex gap-3">
                    <button type="button" onClick={() => navigate("/owner")}
                        className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" disabled={saving}
                        className="px-8 py-2.5 bg-primary text-white font-medium rounded hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-60">
                        {saving && <Loader2 size={16} className="animate-spin" />}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditHotel;

