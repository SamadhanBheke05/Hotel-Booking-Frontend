import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const rawBackendUrl = (import.meta.env.VITE_BACKEND_URL || "").trim();
const shouldUseFallback =
  !rawBackendUrl || /localhost|127\.0\.0\.1/i.test(rawBackendUrl);
const backendUrl = (
  shouldUseFallback
    ? "https://hotel-booking-backend-vsqu.onrender.com"
    : rawBackendUrl
).replace(/\/$/, "");

axios.defaults.withCredentials = true;
axios.defaults.baseURL = backendUrl;

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [owner, setOwner] = useState(null);
  const [hotelData, setHotelData] = useState([]);
  const [roomData, setRoomData] = useState([]);

  const [search, setSearch] = useState({
    city: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });

  const checkUserLoggedInOrNot = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        if (data.user.role === 'owner') {
          setOwner(data.user);
        }
      }
    } catch (error) {
      // 401 is expected when user is not logged in, so we don't log it
      if (error.response?.status !== 401) {
        console.log("error", error);
      }
    }
  };

  const fetchHotelsData = async () => {
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
  };

  const fetchRoomsData = async () => {
    try {
      const { data } = await axios.get("/api/room/get-all");
      if (data.success) {
        setRoomData(data.rooms);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);

    }
  };
  useEffect(() => {
    checkUserLoggedInOrNot();
    fetchHotelsData();
    fetchRoomsData();
  }, []);

  const value = { navigate, user, setUser, owner, setOwner, hotelData, roomData, axios, search, setSearch, getImageUrl };
  return <AppContext.Provider value={value} > {children}   </AppContext.Provider>;

};

export default AppContextProvider;
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (/^https:\/\//i.test(imagePath)) return imagePath;

    if (/^http:\/\//i.test(imagePath)) {
      try {
        const parsed = new URL(imagePath);
        if (/localhost|127\.0\.0\.1/i.test(parsed.hostname)) {
          const filename = parsed.pathname.split("/").pop();
          return `${backendUrl}/images/${filename}`;
        }
        return imagePath.replace(/^http:\/\//i, "https://");
      } catch {
        return `${backendUrl}/images/${imagePath}`;
      }
    }

    return `${backendUrl}/images/${imagePath}`;
  };
