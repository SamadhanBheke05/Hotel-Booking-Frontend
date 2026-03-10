import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { AppContext } from "../../context/AppContext";

const EditRoom = () => {
  const { roomId } = useParams();
  const { axios, navigate, getImageUrl } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hotelData, setHotelData] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const [roomData, setRoomData] = useState({
    hotel: "",
    roomType: "",
    pricePerNight: "",
    description: "",
    rating: "",
    amenities: "",
    isAvailable: true,
  });

  const handleImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = getImageUrl("");
  };

  const newImagePreviews = useMemo(
    () => newImages.map((file) => URL.createObjectURL(file)),
    [newImages]
  );

  useEffect(() => {
    return () => {
      newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newImagePreviews]);

  const fetchData = useCallback(async () => {
    try {
      const [hotelsRes, roomsRes] = await Promise.all([
        axios.get("/api/hotel/get"),
        axios.get("/api/room/get"),
      ]);

      if (hotelsRes.data.success) {
        setHotelData(hotelsRes.data.hotels || []);
      }

      if (!roomsRes.data.success) {
        throw new Error(roomsRes.data.message || "Failed to load room");
      }

      const targetRoom = (roomsRes.data.rooms || []).find((room) => room._id === roomId);
      if (!targetRoom) {
        toast.error("Room not found");
        navigate("/owner/rooms");
        return;
      }

      setRoomData({
        hotel: targetRoom.hotel?._id || "",
        roomType: targetRoom.roomType || "",
        pricePerNight: targetRoom.pricePerNight ?? "",
        description: targetRoom.description || "",
        rating: targetRoom.rating ?? "",
        amenities: targetRoom.amenities || "",
        isAvailable: !!targetRoom.isAvailable,
      });
      setExistingImages(targetRoom.images || []);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to load room");
    } finally {
      setLoading(false);
    }
  }, [axios, navigate, roomId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRoomData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setNewImages(files.slice(0, 4));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("hotel", roomData.hotel);
      formData.append("roomType", roomData.roomType.trim());
      formData.append("pricePerNight", roomData.pricePerNight);
      formData.append("description", roomData.description.trim());
      formData.append("amenities", roomData.amenities.trim());
      formData.append("isAvailable", String(roomData.isAvailable));
      formData.append("rating", roomData.rating === "" ? "4" : roomData.rating);

      newImages.forEach((file) => formData.append("images", file));

      const { data } = await axios.put(`/api/room/update/${roomId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!data.success) {
        toast.error(data.message || "Failed to update room");
        return;
      }

      toast.success("Room updated successfully");
      navigate("/owner/rooms");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update room");
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

  return (
    <div className="py-10 flex flex-col justify-between bg-white">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Edit Room</h2>

        <div>
          <p className="text-base font-medium mb-2">Current Images</p>
          <div className="flex flex-wrap gap-3 mb-3">
            {existingImages.length > 0 ? (
              existingImages.map((img, index) => (
                <img
                  key={`${img}-${index}`}
                  src={getImageUrl(img)}
                  alt={`room-${index}`}
                  className="w-20 h-16 rounded-lg object-cover shadow-sm"
                  onError={handleImgError}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500">No images uploaded</p>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagesChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
          <p className="text-xs text-gray-400 mt-1">Upload new images only if you want to replace old images.</p>

          {newImagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {newImagePreviews.map((src, index) => (
                <img key={src} src={src} alt={`preview-${index}`} className="w-20 h-16 rounded-lg object-cover shadow-sm" />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="hotel">Select Hotel</label>
          <select
            id="hotel"
            name="hotel"
            value={roomData.hotel}
            onChange={handleChange}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          >
            <option value="">Select Hotel</option>
            {hotelData.map((item) => (
              <option key={item._id} value={item._id}>{item.hotelName}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="roomType">Room Type</label>
          <input
            id="roomType"
            type="text"
            name="roomType"
            value={roomData.roomType}
            onChange={handleChange}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="description">Room Description</label>
          <textarea
            id="description"
            name="description"
            value={roomData.description}
            onChange={handleChange}
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            required
          />
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="amenities">Room Amenities</label>
          <textarea
            id="amenities"
            name="amenities"
            value={roomData.amenities}
            onChange={handleChange}
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            required
          />
        </div>

        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="pricePerNight">Price Per Night</label>
            <input
              id="pricePerNight"
              type="number"
              name="pricePerNight"
              min="0"
              value={roomData.pricePerNight}
              onChange={handleChange}
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>

          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="rating">Rating (0-5)</label>
            <input
              id="rating"
              type="number"
              name="rating"
              value={roomData.rating}
              onChange={handleChange}
              min="0"
              max="5"
              step="0.1"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-base font-medium" htmlFor="isAvailable">isAvailable</label>
          <input
            id="isAvailable"
            type="checkbox"
            name="isAvailable"
            checked={roomData.isAvailable}
            onChange={handleChange}
            className="outline-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/owner/rooms")}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-2.5 bg-primary text-white font-medium rounded hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-60"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRoom;
