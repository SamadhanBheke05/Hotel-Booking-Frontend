import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast"


const AddRoom = () => {
  const { axios, navigate } = useContext(AppContext);
  const [roomData, setRoomData] = useState({
    hotel: "",
    roomType: "",
    pricePerNight: "",
    description: "",
    rating: "", // Add rating
    images: [],
    amenities: [],
    isAvailable: true,
  });

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



  const handelChange = (e) => {
    setRoomData({ ...roomData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedImages = [...roomData.images];
      updatedImages[index] = file;
      setRoomData({ ...roomData, images: updatedImages });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("hotel", roomData.hotel);
    formData.append("roomType", roomData.roomType);
    formData.append("pricePerNight", roomData.pricePerNight);
    formData.append("description", roomData.description);
    formData.append("rating", roomData.rating); // Add rating
    formData.append("isAvailable", roomData.isAvailable);
    formData.append("amenities", roomData.amenities);

    for (let i = 0; i < roomData.images.length; i++) {
      formData.append("images", roomData.images[i]);
    }

    try {
      const { data } = await axios.post("/api/room/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (data.success) {
        toast.success(data.message);
        navigate("/owner/rooms");

      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add room");
    }



  };
  return (
    <div className="py-10 flex flex-col justify-between bg-white">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">Room Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {Array(4).fill("").map((_, index) => (
              <label key={index} htmlFor={`image${index}`}>
                <input type="file" accept="images/*" id={`image${index}`} hidden onChange={(e) => handleImageChange(e, index)} />
                <img
                  className="max-w-24 rounded-md cursor-pointer" src={roomData.images[index]
                    ? URL.createObjectURL(roomData.images[index])
                    : "https://raw.githubusercontent.com/prebuildui/prebuildui/main/assets/e-commerce/uploadArea.png"
                  } alt="upload" width={100} height={100} />

              </label>
            ))}

          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">Room Type</label>
          <input type="text" name="roomType" value={roomData.roomType} onChange={handelChange} placeholder="Type here" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-description">Room Description</label>
          <textarea name="description" value={roomData.description} onChange={handelChange} rows={4} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none" placeholder="Type here"></textarea>
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-description"> Room Amenities</label>
          <textarea name="amenities" value={roomData.amenities} onChange={handelChange} rows={4} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none" placeholder="Type here"></textarea>
        </div>

        <div className="w-full flex flex-col gap-1">
          <label htmlFor=""> Select Hotel</label>
          <select name="hotel" value={roomData.hotel} onChange={handelChange} className="outline-none md:py-2.5 py-2 px-3
                  rounded border border-gray-500/40">
            <option value="">Select Hotel </option>
            {
              hotelData.map((item) => (
                <option key={item._id} value={item._id}> {item.hotelName}</option>
              ))
            }

          </select>

        </div>

        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor=""> pricePerNight</label>
            <input type="number" name="pricePerNight" value={roomData.pricePerNight} onChange={handelChange} placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
          </div>

          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor=""> Rating (0-5)</label>
            <input
              type="number"
              name="rating"
              value={roomData.rating}
              onChange={handelChange}
              placeholder="4.5"
              min="0"
              max="5"
              step="0.1"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            />
          </div>

        </div>

        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col-1 gap-2 w-32">
            <label className="text-base font-medium" htmlFor=""> isAvailable
              <input type="checkbox" name="isAvailable" value={roomData.isAvailable} onChange={handelChange} placeholder="0"
                className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
            </label>
          </div>

        </div>


        <button className="px-8 py-2.5 bg-primary text-white font-medium rounded">Add Room</button>
      </form>
    </div>
  );
};

export default AddRoom;
