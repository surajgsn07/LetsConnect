import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TailSpin } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/authSlice';
import { setCookie } from '../axiosConfig/cookieFunc';

const VerifyOtp = () => {
    
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const email = useSelector((state) => state.email.email);

    const handleChange = (e) => {
        setOtp(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('https://letsconnect-6jnn.onrender.com/users/verifyOtp', { email, otp });
            if(response.data){
                setSuccess('OTP verified successfully!');
                
                setError('');
                
                
                toast.success('OTP verified successfully!');
                setCookie('accessToken', response?.data?.data?.accessToken, 7);
                setCookie('refreshToken', response?.data?.data?.refreshToken, 7);

                dispatch(login({user:response.data.data.user}))
                console.log('OTP verification successful:', response.data);
                navigate('/dashboard');
            }
        } catch (err) {
            console.error('Error during OTP verification:', err);
            setError('Invalid OTP. Please try again.');
            setSuccess('');
            toast.error('Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-16 mx-2 min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-800 via-gray-900 to-black">
            <div className="w-full max-w-md p-8 bg-white bg-opacity-5 backdrop-blur-lg rounded-lg shadow-lg border border-white border-opacity-20">
                <h1 className="text-4xl font-bold text-center text-white mb-8">OTP Verification</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input type="hidden" name="email" value={email} />
                    <div>
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-200">Enter OTP:</label>
                        <input
                            type="text"
                            id="otp"
                            name="otp"
                            value={otp}
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
                            'Verify OTP'
                        )}
                    </button>
                    {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
                    {success && <div className="mt-2 text-green-500 text-sm">{success}</div>}
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default VerifyOtp;
