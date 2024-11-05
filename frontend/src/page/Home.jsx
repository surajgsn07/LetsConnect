import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const HomePage = () => {

    const status = useSelector(state=>state.auth.status);
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-800 via-gray-900 to-black">
            <div className="text-center px-4 py-6 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <h1 className="text-5xl font-bold text-white sm:text-6xl md:text-7xl leading-tight">
                    Let's Connect
                </h1>
                <p className="mt-4 text-lg text-gray-300 sm:mt-6 sm:text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto">
                    Grow Together
                </p>
                {
                    !status && (
                        <div className="mt-8 flex flex-col sm:flex-row sm:justify-center lg:justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="rounded-md shadow">
                        <Link
                            to="/login"
                            className="w-full flex items-center justify-center px-8 py-2 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600"
                        >
                            Login
                        </Link>
                    </div>
                    <div className="rounded-md shadow">
                        <Link
                            to="/signup"
                            className="w-full flex items-center justify-center px-8 py-2 border border-transparent text-lg font-medium rounded-md text-white bg-green-500 hover:bg-green-600"
                        >
                            Signup
                        </Link>
                    </div>
                </div>
                    )
                }
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left text-gray-300">
                    <div className="p-6 bg-gray-700 bg-opacity-50 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-semibold text-white">Community Building</h3>
                        <p className="mt-2">
                            Join a vibrant community of like-minded individuals and grow together.
                        </p>
                    </div>
                    <div className="p-6 bg-gray-700 bg-opacity-50 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-semibold text-white">Networking Opportunities</h3>
                        <p className="mt-2">
                            Connect with professionals and expand your network in various fields.
                        </p>
                    </div>
                    <div className="p-6 bg-gray-700 bg-opacity-50 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-semibold text-white">Collaborative Projects</h3>
                        <p className="mt-2">
                            Work together on projects and achieve great things as a team.
                        </p>
                    </div>
                    <div className="p-6 bg-gray-700 bg-opacity-50 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-semibold text-white">Resource Sharing</h3>
                        <p className="mt-2">
                            Share and access valuable resources to enhance your skills and knowledge.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
