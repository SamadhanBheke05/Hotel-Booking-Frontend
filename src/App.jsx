import React, { useContext } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Hotels from './pages/Hotels';
import Rooms from './pages/Rooms';
import SingleRoom from './pages/SingleRoom';
import Signup from './pages/Signup';
import VerifyOtp from "./pages/VerifyOtp";
import About from './pages/About';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';
import { AppContext } from './context/AppContext';
import OwnerLayout from './pages/owner/OwnerLayout';
import AllHotels from './pages/owner/AllHotels';
import RegisterHotel from './pages/owner/RegisterHotel';
import EditHotel from './pages/owner/EditHotel';
import AllRooms from './pages/owner/AllRooms';
import AddRoom from './pages/owner/AddRoom';
import EditRoom from './pages/owner/EditRoom';
import Bookings from './pages/owner/Bookings';
import HotelRooms from './pages/HotelRooms';
import Revenue from "./pages/owner/Revenue";
import UserManagement from './pages/owner/UserManagement';
import GroupBookings from './pages/owner/GroupBookings';

const App = () => {
  const ownerPath = useLocation().pathname.includes("owner");
  const { owner } = useContext(AppContext);
  return (
    <div className='w-full mx-auto'>
      <Toaster />

      {!ownerPath && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/room/:id" element={<SingleRoom />} />
        <Route path="/hotel/:id" element={<HotelRooms />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/my-bookings" element={<MyBookings />} />

        {/* Owner Dashboard Routes */}
        <Route path='/owner' element={owner ? <OwnerLayout /> : <Login />}>
          <Route index element={owner ? <AllHotels /> : <Login />} />
          <Route path="revenue" element={owner ? <Revenue /> : <Login />} />
          <Route path="users" element={owner ? <UserManagement /> : <Login />} />
          <Route path="register-hotel" element={owner ? <RegisterHotel /> : <Login />} />
          <Route path="edit-hotel/:hotelId" element={owner ? <EditHotel /> : <Login />} />
          <Route path="rooms" element={owner ? <AllRooms /> : <Login />} />
          <Route path="add-room" element={owner ? <AddRoom /> : <Login />} />
          <Route path="edit-room/:roomId" element={owner ? <EditRoom /> : <Login />} />
          <Route path="bookings" element={owner ? <Bookings /> : <Login />} />
          <Route path="group-bookings" element={owner ? <GroupBookings /> : <Login />} />
        </Route>
      </Routes>

      {!ownerPath && <Footer />}
    </div>
  );
};

export default App;
