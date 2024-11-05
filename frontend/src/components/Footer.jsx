import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:justify-between">
                    <div className="mb-6 md:mb-0">
                        <h3 className="text-lg font-semibold text-white">Let's Connect</h3>
                        <p className="mt-2">
                            Grow Together
                        </p>
                    </div>
                    <div className="flex flex-col md:flex-row md:space-x-8">
                        <div className="mb-6 md:mb-0">
                            <h4 className="text-sm font-semibold text-white">Quick Links</h4>
                            <ul className="mt-2 space-y-2">
                                <li><a href="/login" className="hover:underline">Login</a></li>
                                <li><a href="/signup" className="hover:underline">Signup</a></li>
                                <li><a href="#" className="hover:underline">About Us</a></li>
                                <li><a href="#" className="hover:underline">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-white">Follow Us</h4>
                            <div className="mt-2 flex space-x-4">
                                <a href="#" className="hover:underline">Facebook</a>
                                <a href="#" className="hover:underline">Twitter</a>
                                <a href="#" className="hover:underline">Instagram</a>
                                <a href="#" className="hover:underline">LinkedIn</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-800 pt-6 text-center md:text-left">
                    <p>&copy; 2024 Let's Connect. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
