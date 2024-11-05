import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addEmail } from '../store/signIn.slice';
import { ClipLoader } from 'react-spinners';

const fieldSuggestions = [
    'Web Development',
    'Cybersecurity',
    'Data Science',
    'Machine Learning',
    'Artificial Intelligence',
    'Software Engineering',
    'Cloud Computing',
    'DevOps',
    'Network Administration',
    'UI/UX Design',
    'Project Management',
    'Product Management'
];

const SignupForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        name: '',
        field: ''
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (name === 'field') {
            const filteredSuggestions = fieldSuggestions.filter((suggestion) =>
                suggestion.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setFormData({
            ...formData,
            field: suggestion
        });
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:3000/users/initiateRegister', formData , {
                withCredentials: true  // Ensure credentials are sent with the request
            });
            console.log('Signup successful:', response.data);
            if (response.data.success) {
                const email = formData.email;
                const obj = { email };
                dispatch(addEmail(obj));
                localStorage.setItem("accessToken" , response?.data?.data?.accessToken);
                localStorage.setItem("refreshToken" , response?.data?.data?.refreshToken);
                navigate("/verifyOtp");
            }
        } catch (err) {
            console.error('Error during signup:', err);
            toast.error('An error occurred during signup. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-16 mx-2 min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-800 via-gray-900 to-black">
            <div className="w-full max-w-md p-8 bg-white bg-opacity-5 backdrop-blur-lg rounded-lg shadow-lg border border-white border-opacity-20">
                <h1 className="text-4xl font-bold text-center text-white mb-8">Sign Up</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-200">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full p-3 rounded-md bg-gray-700 bg-opacity-30 text-white border border-white border-opacity-20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full p-3 rounded-md bg-gray-700 bg-opacity-30 text-white border border-white border-opacity-20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-200">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full p-3 rounded-md bg-gray-700 bg-opacity-30 text-white border border-white border-opacity-20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-200">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full p-3 rounded-md bg-gray-700 bg-opacity-30 text-white border border-white border-opacity-20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="field" className="block text-sm font-medium text-gray-200">Field</label>
                        <input
                            type="text"
                            id="field"
                            name="field"
                            value={formData.field}
                            onChange={handleChange}
                            required
                            onFocus={() => setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Use setTimeout to allow click events to register before hiding suggestions
                            className="mt-1 block w-full p-3 rounded-md bg-gray-700 bg-opacity-30 text-white border border-white border-opacity-20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {showSuggestions && suggestions.length > 0 && (
                            <ul className="mt-2 bg-gray-700 bg-opacity-30 text-white border border-white border-opacity-20 rounded-md max-h-48 overflow-y-auto">
                                {suggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        className="px-3 py-2 cursor-pointer hover:bg-gray-600"
                                        onMouseDown={() => handleSuggestionClick(suggestion)}
                                    >
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center"
                    >
                        {loading ? <ClipLoader size={24} color={"#ffffff"} /> : "Sign Up"}
                    </button>
                    {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
                </form>
                <p className="mt-4 text-center text-gray-400">Already have an account? 
                    <span 
                        className="text-indigo-500 hover:underline cursor-pointer"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
};

export default SignupForm;
