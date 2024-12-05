import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const status = useSelector(state => state.auth.status);
    const dispatch = useDispatch();
    const user = useSelector(state=>state.auth.user);
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        dispatch(logout());
        navigate('/')
        // console.log(")

    };

    return (
        <nav className="bg-gradient-to-r from-gray-800 via-gray-900 to-black">
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="absolute inset-y-0 left-0 flex items-center">
                        <Link to="/" className="text-white text-2xl font-bold w-auto h-7">
                            <img style={{ width: "100%", height: "100%", objectFit: "cover" }} src="Logo.png" alt="Logo" />
                        </Link>
                    </div>

                    {/* Menu (desktop) */}
                    <div className="hidden sm:flex sm:ml-6">
                        <div className="space-x-4" style={{ marginLeft: "140px" }}>
                            <Link to="/" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>

                            {/* Conditional Links based on Auth Status */}
                            {status ? (
                                <>
                                    <Link to="/dashboard" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                                    <Link to="/dashboard/chat" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Chats</Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                                    <Link to="/signup" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Signup</Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Rightmost section */}
                    <div className="absolute inset-y-0 right-0 flex items-center">
                        {status && (
                            <div className="flex items-center space-x-4">
                                {/* Profile Picture */}
                                <Link to="/">
                                    <img
                                        src={user?.profilePicture} // Replace with actual profile picture URL
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full"
                                    />
                                </Link>

                                {/* Logout Button */}
                                <button
                                    onClick={handleLogout}
                                    className="text-red-600 hidden sm:block hover:bg-gray-700 hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Logout
                                </button>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <div className="sm:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white"
                                aria-label="Main menu"
                            >
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="sm:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <Link to="/" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-center font-medium">Home</Link>
                        {status ? (
                            <>
                                <Link to="/dashboard" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-center font-medium">Dashboard</Link>
                                <Link to="/chats" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-center font-medium">Chats</Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-center font-medium w-full"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-center font-medium">Login</Link>
                                <Link to="/signup" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-center font-medium">Signup</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
            <hr style={{ opacity: "0.1" }} />
        </nav>
    );
};

export default Navbar;
