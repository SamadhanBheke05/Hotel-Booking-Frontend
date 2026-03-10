import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const rawBackendUrl = (import.meta.env.VITE_BACKEND_URL || "")
  .trim()
  .replace(/^['"]|['"]$/g, "");
const isHttpsPage = typeof window !== "undefined" && window.location.protocol === "https:";
const localhostHttpRegex = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;
const defaultBackendUrl = isHttpsPage
  ? "https://hotel-booking-back.onrender.com"
  : "http://localhost:5000";
const shouldIgnoreEnvLocalhost = isHttpsPage && localhostHttpRegex.test(rawBackendUrl);
const candidateBackendUrl =
  rawBackendUrl && !shouldIgnoreEnvLocalhost ? rawBackendUrl : defaultBackendUrl;

const backendUrl = (() => {
  try {
    const parsed = new URL(candidateBackendUrl);
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return defaultBackendUrl.replace(/\/$/, "");
  }
})();

axios.defaults.withCredentials = true;
axios.defaults.baseURL = backendUrl;

export const AppContext = createContext();

// Fallback image used when a hotel/room image is missing or invalid
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&auto=format&q=80";

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

  const getImageUrl = (imagePath) => {
    // If nothing is provided, immediately return a nice placeholder image
    if (!imagePath) return FALLBACK_IMAGE;

    // Already-embedded data URL
    if (/^data:image\//i.test(imagePath)) return imagePath;

    // Secure remote URL (Cloudinary, Unsplash, etc.)
    if (/^https:\/\//i.test(imagePath)) return imagePath;

    // Upgrade insecure HTTP image URLs when possible
    if (/^http:\/\//i.test(imagePath)) {
      try {
        const parsed = new URL(imagePath);

        // Old localhost-style URLs – we no longer serve from /images,
        // so fall back to placeholder instead of a broken link.
        if (/localhost|127\.0\.0\.1/i.test(parsed.hostname)) {
          return FALLBACK_IMAGE;
        }

        // For other hosts, just upgrade to HTTPS
        return imagePath.replace(/^http:\/\//i, "https://");
      } catch {
        // On any parsing error, use fallback
        return FALLBACK_IMAGE;
      }
    }

    // For legacy filename-only values (e.g. "hotel1.jpg") we no longer
    // have a local /images folder on the backend, so show the fallback
    // instead of requesting a non-existent resource.
    return FALLBACK_IMAGE;
  };

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
      if (error.response?.status === 401) {
        setUser(null);
        setOwner(null);
      }
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

