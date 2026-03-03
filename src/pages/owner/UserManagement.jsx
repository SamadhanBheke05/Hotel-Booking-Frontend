import React, { useCallback, useEffect, useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import {
    Search,
    Users,
    Filter,
    MoreVertical,
    Trash2,
    Ban,
    CheckCircle,
    Eye,
    AlertTriangle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const UserManagement = () => {
    const { axios } = useContext(AppContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All'); // 'All', 'user', 'owner'
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    // Modal States
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [actionMenuOpenId, setActionMenuOpenId] = useState(null);
    const [menuPosition, setMenuPosition] = useState(null);

    // Fetch Users
    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/owner/users');
            if (data.success) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    }, [axios]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);




    // Filter Logic
    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = filterType === 'All' || user.role === filterType;

        return matchesSearch && matchesType;
    });

    // Actions
    const handleStatusChange = async () => {
        if (!selectedUser) return;

        // Toggle status
        const newStatus = selectedUser.status === 'active' ? 'suspended' : 'active';

        try {
            const { data } = await axios.put(`/api/owner/users/${selectedUser._id}/status`, {
                status: newStatus
            });

            if (data.success) {
                toast.success(data.message);
                fetchUsers();
                setShowStatusModal(false);
                setActionMenuOpenId(null);
            }
        } catch (error) {
            console.error("Status update error:", error);
            toast.error(error.response?.data?.message || "Update failed");
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;

        try {
            const { data } = await axios.delete(`/api/owner/users/${selectedUser._id}`);

            if (data.success) {
                toast.success(data.message);
                fetchUsers();
                setShowDeleteModal(false);
                setActionMenuOpenId(null);
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error(error.response?.data?.message || "Delete failed");
        }
    };

    // Helper for Badge Colors
    const getRoleBadgeColor = (role) => {
        return role === 'owner'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-purple-100 text-purple-700'; // Customer/User
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700';
            case 'suspended': return 'bg-red-100 text-red-700';
            case 'pending': return 'bg-orange-100 text-orange-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 font-sans">

            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
                    <Users className="w-8 h-8 text-blue-600" />
                    User Management
                </h1>
                <p className="text-gray-500 mt-2 text-lg">
                    View and manage users who interact with your hotels.
                </p>
            </div>

            {/* Controls Section */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">

                {/* Search */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by username or email"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Filter */}
                <div className="relative w-full md:w-auto">
                    <button
                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                        className="flex items-center justify-between w-full md:w-48 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">
                                {filterType === 'All' ? 'All Users' : filterType === 'owner' ? 'Owners' : 'Customers'}
                            </span>
                        </div>
                        <span className="text-xs font-semibold bg-gray-100 px-2 py-0.5 rounded text-gray-600 ml-2">
                            {filteredUsers.length}
                        </span>
                    </button>

                    {showFilterDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden">
                            {['All', 'user', 'owner'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => {
                                        setFilterType(type);
                                        setShowFilterDropdown(false);
                                    }}
                                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                                >
                                    {type === 'All' ? 'All Users' : type === 'owner' ? 'Owners' : 'Customers'}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800">All Users</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Username</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User Type</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Manage</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                // Skeleton Loading
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                                        <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded w-16"></div></td>
                                        <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded w-16"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                                        <td className="px-6 py-4"><div className="h-8 w-8 bg-gray-200 rounded-full ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                        No users found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">

                                        {/* Username */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm uppercase">
                                                    {user.name?.charAt(0) || "U"}
                                                </div>
                                                <span className="font-medium text-gray-900">{user.name}</span>
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {user.email}
                                        </td>

                                        {/* Role */}
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                                {user.role === 'owner' ? 'Owner' : 'Customer'}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadgeColor(user.status || 'active')}`}>
                                                {user.status || 'active'}
                                            </span>
                                        </td>

                                        {/* Date */}
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Close if clicking same
                                                    if (actionMenuOpenId === user._id) {
                                                        setActionMenuOpenId(null);
                                                        setMenuPosition(null);
                                                        return;
                                                    }

                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    setMenuPosition({
                                                        top: rect.bottom + window.scrollY,
                                                        left: rect.left - 150 // Shift left to align (width of menu is w-48 = 12rem = 192px approx)
                                                    });
                                                    setActionMenuOpenId(user._id);
                                                }}
                                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600 focus:outline-none"
                                            >
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Fixed Position Action Menu */}
            {actionMenuOpenId && menuPosition && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-transparent"
                        onClick={() => {
                            setActionMenuOpenId(null);
                            setMenuPosition(null);
                        }}
                    ></div>
                    <div
                        className="fixed z-50 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden w-48"
                        style={{
                            top: `${menuPosition.top}px`,
                            left: `${menuPosition.left}px`
                        }}
                    >
                        {/* Find the user object for the open menu */}
                        {(() => {
                            const user = users.find(u => u._id === actionMenuOpenId);
                            if (!user) return null;

                            return (
                                <div className="py-1">
                                    <button
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setShowDetailsModal(true);
                                            setActionMenuOpenId(null);
                                        }}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <Eye className="w-4 h-4 mr-2 text-gray-400" />
                                        View Details
                                    </button>

                                    <button
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setShowStatusModal(true);
                                            setActionMenuOpenId(null);
                                        }}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        {user.status === 'suspended' ? (
                                            <>
                                                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                                Activate User
                                            </>
                                        ) : (
                                            <>
                                                <Ban className="w-4 h-4 mr-2 text-orange-500" />
                                                Suspend User
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setShowDeleteModal(true);
                                            setActionMenuOpenId(null);
                                        }}
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete User
                                    </button>
                                </div>
                            );
                        })()}
                    </div>
                </>
            )}

            {/* Modals */}
            <>

                {/* Detail Modal */}
                {showDetailsModal && selectedUser && (
                    <Modal onClose={() => setShowDetailsModal(false)} title="User Details">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                                    {selectedUser.name?.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{selectedUser.name}</h3>
                                    <p className="text-gray-500">{selectedUser.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-gray-500 mb-1">Role</p>
                                    <p className="font-medium capitalize">{selectedUser.role}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-gray-500 mb-1">Status</p>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold capitalize ${getStatusBadgeColor(selectedUser.status)}`}>
                                        {selectedUser.status || 'active'}
                                    </span>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg col-span-2">
                                    <p className="text-gray-500 mb-1">Joined Date</p>
                                    <p className="font-medium">{new Date(selectedUser.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </Modal>
                )}

                {/* Status Confirmation Modal */}
                {showStatusModal && selectedUser && (
                    <Modal onClose={() => setShowStatusModal(false)} title={selectedUser.status === 'suspended' ? "Activate User" : "Suspend User"}>
                        <div className="text-center">
                            <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-4 ${selectedUser.status === 'suspended' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                {selectedUser.status === 'suspended' ? <CheckCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                            </div>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to <strong>{selectedUser.status === 'suspended' ? 'activate' : 'suspend'}</strong> this user?
                                {selectedUser.status !== 'suspended' && " They won't be able to log in while suspended."}
                            </p>
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={() => setShowStatusModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleStatusChange}
                                    className={`px-4 py-2 rounded-lg text-white font-medium ${selectedUser.status === 'suspended' ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-500 hover:bg-orange-600'}`}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </Modal>
                )}


                {/* Delete Confirmation Modal */}
                {showDeleteModal && selectedUser && (
                    <Modal onClose={() => setShowDeleteModal(false)} title="Delete User">
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center mb-4">
                                <Trash2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Are you absolutely sure?</h3>
                            <p className="text-gray-600 mb-6 text-sm">
                                This action cannot be undone. This will permanently delete <strong>{selectedUser.name}</strong> from the database.
                            </p>
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteUser}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                                >
                                    Delete User
                                </button>
                            </div>
                        </div>
                    </Modal>
                )}

            </>

        </div>
    );
};

// Reusable Modal Component
const Modal = ({ children, title, onClose }) => (
    <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
    >
        <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            onClick={e => e.stopPropagation()}
        >
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">{title}</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    </div>
);

export default UserManagement;
