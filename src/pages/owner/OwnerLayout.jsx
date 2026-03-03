import { Warehouse, CalendarArrowDown, Users, UsersRound, LayoutDashboard, CircleDollarSign } from "lucide-react"
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";
import { Link, Outlet, useLocation } from "react-router-dom";

const OwnerLayout = () => {
    const { pathname } = useLocation();
    const { owner, setOwner, navigate, axios } = useContext(AppContext);

    const dashboardIcon = (
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5Zm16 14a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2ZM4 13a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6Zm16-2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6Z" />
        </svg>
    );

    const revenueIcon = (
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M7.111 20A3.111 3.111 0 0 1 4 16.889v-12C4 4.398 4.398 4 4.889 4h4.444a.89.89 0 0 1 .89.889v12A3.111 3.111 0 0 1 7.11 20Zm0 0h12a.889.889 0 0 0 .889-.889v-4.444a.889.889 0 0 0-.889-.89h-4.389a.889.889 0 0 0-.62.253l-3.767 3.665a.933.933 0 0 0-.146.185c-.868 1.433-1.581 1.858-3.078 2.12Zm0-3.556h.009m7.933-10.927 3.143 3.143a.889.889 0 0 1 0 1.257l-7.974 7.974v-8.8l3.574-3.574a.889.889 0 0 1 1.257 0Z" />
        </svg>
    );

    const sidebarLinks = [
        { name: "Dashboard", path: "/owner", icon: dashboardIcon },
        { name: "Rooms", path: "/owner/rooms", icon: <Warehouse className="w-5 h-5" /> },
        { name: "Bookings", path: "/owner/bookings", icon: <CalendarArrowDown className="w-5 h-5" /> },
        { name: "Group Bookings", path: "/owner/group-bookings", icon: <UsersRound className="w-5 h-5" /> },
        { name: "Revenue", path: "/owner/revenue", icon: revenueIcon },
        { name: "User Management", path: "/owner/users", icon: <Users className="w-5 h-5" /> },
    ];

    const logout = async () => {
        try {
            const { data } = await axios.get("/api/user/logout");
            if (data.success) {
                toast.success(data.message);
                setOwner(false);
                navigate("/");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Logout failed");
        }
    };

    const isActive = (path) => {
        if (path === "/owner") return pathname === "/owner";
        return pathname.startsWith(path);
    };

    return (
        <>
            {/* Top Nav */}
            <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
                <Link to="/owner">
                    <img className="h-9" src="/logo1.png" alt="logo" />
                </Link>
                <div className="flex items-center gap-5 text-gray-500">
                    <p className="hidden md:block">Hi! {owner?.name || "Admin"}</p>
                    <button onClick={logout} className='border rounded-full text-sm px-4 py-1 hover:bg-gray-50 transition-colors'>Logout</button>
                </div>
            </div>

            {/* Sidebar + Content */}
            <div className="flex">
                <div className="md:w-56 w-14 border-r min-h-screen text-base border-gray-200 pt-4 flex flex-col bg-white transition-all">
                    {sidebarLinks.map((item) => (
                        <Link to={item.path} key={item.path}
                            className={`flex items-center py-3 px-4 gap-3 transition-all duration-150
                                ${isActive(item.path)
                                    ? "border-r-4 border-indigo-500 bg-indigo-500/10 text-indigo-600"
                                    : "border-r-4 border-transparent hover:bg-gray-50 text-gray-600 hover:text-gray-800"
                                }`}>
                            {item.icon}
                            <p className="md:block hidden text-sm font-medium">{item.name}</p>
                        </Link>
                    ))}
                </div>
                <div className="flex-1 overflow-auto">
                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default OwnerLayout;