import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const backendUrl = (
  import.meta.env.VITE_BACKEND_URL ||
  "https://hotel-booking-backend-vsqu.onrender.com"
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

  const value = { navigate, user, setUser, owner, setOwner, hotelData, roomData, axios, search, setSearch };
  return <AppContext.Provider value={value} > {children}   </AppContext.Provider>;

};

export default AppContextProvider;
