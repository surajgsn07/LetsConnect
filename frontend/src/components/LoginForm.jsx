import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TailSpin } from 'react-loader-spinner';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import { setCookie } from '../axiosConfig/cookieFunc';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        identifier: '',
        password: ''
    });
    const navigate = useNavigate();
    const dispatch  = useDispatch();

    const [error, setError] = useState('');
    const [loginMethod, setLoginMethod] = useState('email');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('https://letsconnect-6jnn.onrender.com/users/login', formData, {
                withCredentials: true  // Ensure credentials are sent with the request
            });
            
            
            dispatch(login({user:response.data.data.user}))
            
            
            setCookie('accessToken', response?.data?.data?.accessToken, 7);
            setCookie('refreshToken', response?.data?.data?.refreshToken, 7);
            navigate("/dashboard");
            
            toast.success('Login successful!');
        } catch (err) {
            e.error('Error during login:', err);
            const errorMessage = err?.response?.data?.message || 'An error occurred during login. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-800 via-gray-900 to-black">
            <div className="w-full max-w-md p-8 bg-white bg-opacity-5 backdrop-blur-lg rounded-lg shadow-lg border border-white border-opacity-20">
                <h1 className="text-4xl font-bold text-center text-white mb-8">Login</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center mb-4">
                        <button
                            type="button"
                            onClick={() => setLoginMethod('email')}
                            className={`px-4 py-2 rounded-l-md ${loginMethod === 'email' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                        >
                            Email
                        </button>
                        <button
                            type="button"
                            onClick={() => setLoginMethod('username')}
                            className={`px-4 py-2 rounded-r-md ${loginMethod === 'username' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                        >
                            Username
                        </button>
                    </div>
                    <div>
                        <label htmlFor="identifier" className="block text-sm font-medium text-gray-200">
                            {loginMethod === 'email' ? 'Email' : 'Username'}
                        </label>
                        <input
                            type={loginMethod === 'email' ? 'email' : 'text'}
                            id="identifier"
                            name="identifier"
                            value={formData.identifier}
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
                    <button
                        type="submit"
                        className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <TailSpin
                                height="24"
                                width="24"
                                color="#fff"
                                ariaLabel="loading"
                            />
                        ) : (
                            'Login'
                        )}
                    </button>
                    {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
                </form>
                <p className="mt-4 text-center text-gray-400">Don't have an account? 
                    <span 
                        className="text-indigo-500 hover:underline cursor-pointer"
                        onClick={() => navigate("/signup")}
                    >
                        Register
                    </span>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;
