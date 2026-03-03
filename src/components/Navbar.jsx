import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";
import { Menu, X, LogOut, Calendar } from "lucide-react";

const Navbar = () => {

    const { navigate, user, setUser, axios } = useContext(AppContext);
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Hotels', path: '/hotels' },
        { name: 'Rooms', path: '/rooms' },
        { name: 'About', path: '/about' },
    ];


    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const logout = async () => {
        try {
            const { data } = await axios.get("/api/user/logout");
            if (data.success) {
                toast.success(data.message);
                setUser(false);
                navigate("/");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed");
        }
    };

    const isActive = (path) => {
        return location.pathname === path ? "text-primary font-medium" : "text-gray-600 hover:text-primary";
    }

    return (

        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "glassmorphism py-3" : "bg-transparent py-5"}`}>
            <div className="container mx-auto px-4 md:px-10 lg:px-20 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <img src="/logo1.png"
                        alt="logo"
                        className={`h-10 object-contain`} />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link, i) => (
                        <Link key={i} to={link.path} className={`text-sm transition-colors duration-200 ${isActive(link.path)}`}>
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Desktop Right */}
                <div className="hidden md:flex items-center gap-4">

                    {
                        user ? (
                            <div className="relative group inline-block">
                                <div className="flex items-center gap-2 cursor-pointer p-1 rounded-full border border-transparent hover:border-gray-200 transition-all">
                                    <img src="/user-img.png" alt="" className="w-10 h-10 rounded-full object-cover shadow-sm" />
                                </div>

                                {/* Dropdown Menu */}
                                <div className="absolute right-0 pt-2 w-48 opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200 z-50 transform origin-top-right">
                                    <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100 ring-1 ring-black ring-opacity-5">
                                        <ul className="py-1">
                                            <li>
                                                <Link to={"/my-bookings"} className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                    <Calendar size={16} />
                                                    My Bookings
                                                </Link>
                                            </li>
                                            <li onClick={logout}>
                                                <div className="flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 cursor-pointer transition-colors">
                                                    <LogOut size={16} />
                                                    Logout
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                        ) : (
                            <button onClick={() => navigate("/login")} className="px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                        bg-primary text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0">
                                Login
                            </button>
                        )

                    }

                </div>

                {/* Mobile Menu Button */}
                <div className="flex items-center gap-3 md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 z-40 bg-white/95 backdrop-blur-lg transform transition-transform duration-300 ease-in-out md:hidden flex flex-col items-center justify-center gap-8 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>

                <button className="absolute top-6 right-6 p-2 text-gray-500 hover:bg-gray-100 rounded-full" onClick={() => setIsMenuOpen(false)}>
                    <X size={28} />
                </button>

                <div className="flex flex-col items-center gap-8 text-xl font-medium text-gray-800">
                    {navLinks.map((link, i) => (
                        <Link key={i} to={link.path} onClick={() => setIsMenuOpen(false)} className="hover:text-primary transition-colors">
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="flex flex-col items-center gap-6 mt-4">
                    {
                        user ? (
                            <>
                                <Link to="/my-bookings" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-gray-700">
                                    <Calendar size={20} /> My Bookings
                                </Link>
                                <button onClick={() => { logout(); setIsMenuOpen(false); }} className="flex items-center gap-2 text-red-600 font-medium">
                                    <LogOut size={20} /> Logout
                                </button>
                            </>
                        ) : (
                            <button onClick={() => { navigate("/login"); setIsMenuOpen(false); }} className="px-10 py-3 rounded-full text-lg font-medium bg-primary text-white shadow-lg">
                                Login
                            </button>
                        )
                    }
                </div>
            </div>
        </nav>

    );
}

export default Navbar
