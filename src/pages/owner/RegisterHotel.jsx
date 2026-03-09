import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { ToggleLeft, ToggleRight, Users } from "lucide-react";

const RegisterHotel = () => {
  const { axios, navigate } = useContext(AppContext);

  const [data, setData] = useState({
    hotelName: "",
    hotelAddress: "",
    rating: "",
    price: "",
    amenities: "",
    groupBookingAllowed: false,
    maxGroupMembers: "",
    maxGroupRooms: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) setPreview(URL.createObjectURL(selectedFile));
  };

  const fileToDataUrl = (inputFile) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Failed to read image file"));
      reader.readAsDataURL(inputFile);
    });

  const uploadImageAndGetUrl = async (inputFile) => {
    const cloudName = (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "").trim();
    const uploadPreset = (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "").trim();

    if (cloudName && uploadPreset) {
      const cloudinaryData = new FormData();
      cloudinaryData.append("file", inputFile);
      cloudinaryData.append("upload_preset", uploadPreset);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: cloudinaryData,
      });
      const data = await response.json();

      if (!response.ok || !data?.secure_url) {
        throw new Error(data?.error?.message || "Cloud upload failed");
      }
      return data.secure_url;
    }

    // Fallback when cloud config is absent: keep request JSON-only using a data URL.
    return fileToDataUrl(inputFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hotelName = data.hotelName.trim();
    const hotelAddress = data.hotelAddress.trim();
    const amenities = data.amenities.trim();
    const rating = Number(data.rating);
    const price = Number(data.price);

    if (!hotelName) return toast.error("Hotel name is required");
    if (!hotelAddress) return toast.error("Hotel address is required");
    if (!amenities) return toast.error("Amenities are required");
    if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
      return toast.error("Rating must be between 0 and 5");
    }
    if (!Number.isFinite(price) || price < 0) {
      return toast.error("Price must be a valid non-negative number");
    }
    if (!file) return toast.error("Hotel image is required");

    try {
      setSaving(true);
      const imageUrl = await uploadImageAndGetUrl(file);
      const payload = {
        hotelName,
        hotelAddress,
        rating,
        price,
        amenities,
        imageUrl,
        groupBookingAllowed: data.groupBookingAllowed,
        maxGroupMembers: data.groupBookingAllowed ? Number(data.maxGroupMembers || 0) : 0,
        maxGroupRooms: data.groupBookingAllowed ? Number(data.maxGroupRooms || 0) : 0,
      };

      const { data: res } = await axios.post("/api/hotel/register-v2", payload, {
        withCredentials: true,
      });

      if (res.success) {
        toast.success(res.message);
        navigate("/owner");
      } else {
        toast.error(res.message || "Failed to register hotel");
      }
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message || "Failed to register hotel";
      toast.error(status ? `${message} (HTTP ${status})` : message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="py-10 flex flex-col justify-between bg-white">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Register New Hotel</h2>

        {/* Hotel Image */}
        <div>
          <p className="text-base font-medium mb-2">Hotel Image</p>
          {preview && (
            <div className="mb-3 flex justify-center">
              <img src={preview} alt="preview" className="w-24 h-24 object-cover rounded shadow" />
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} required
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
        </div>

        {/* Hotel Name */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">Hotel Name</label>
          <input type="text" name="hotelName" value={data.hotelName} onChange={handleChange}
            placeholder="Type here" required
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" />
        </div>

        {/* Hotel Address */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">Hotel Address</label>
          <textarea name="hotelAddress" value={data.hotelAddress} onChange={handleChange}
            rows={3} placeholder="Type here" required
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none" />
        </div>

        {/* Rating & Price */}
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-base font-medium">Rating</label>
            <input type="number" name="rating" value={data.rating} onChange={handleChange}
              placeholder="0" min="0" max="5" step="0.1" required
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-base font-medium">Price / Night (₹)</label>
            <input type="number" name="price" value={data.price} onChange={handleChange}
              placeholder="0" min="0" required
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" />
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">Amenities (comma separated)</label>
          <textarea name="amenities" value={data.amenities} onChange={handleChange}
            rows={3} placeholder="WiFi, Pool, Spa..." required
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none" />
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

        <button type="submit" disabled={saving}
          className="px-8 py-2.5 bg-primary text-white font-medium rounded hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
          {saving ? "Registering..." : "Register Hotel"}
        </button>
      </form>
    </div>
  );
};

export default RegisterHotel;
