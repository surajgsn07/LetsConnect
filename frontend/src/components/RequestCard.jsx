import React, { useState } from 'react';
import axiosInstance from '../axiosConfig/axiosConfig'; // Adjust the path accordingly
import { toast } from 'react-toastify';
import { BiLoaderAlt } from 'react-icons/bi'; // Import loader icon

const RequestCard = ({ image, name, profession, requestId, requests, setRequests }) => {
  const [isLoading, setIsLoading] = useState(false); // State for loader
  const [id, setid] = useState(null)

  const handleAccept = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await axiosInstance.patch(`/users/friend-request/update/${requestId}`, { isAccepted: true });
      if (response.data) {
        toast.success('Accepted successfully');
        setRequests(requests.filter(request => request._id !== requestId));
        setid(requestId)
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error('Error while accepting request');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleReject = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await axiosInstance.patch(`/users/friend-request/update/${requestId}`, { isRejected: true });
      if (response.data) {
        toast.success('Rejected successfully');
        setRequests(requests.filter(request => request._id !== requestId));
        setid(requestId)
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Error while rejecting request');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className={`flex ${id === requestId ? 'hidden' : ''} flex-col sm:flex-row items-center justify-between bg-gray-800 bg-opacity-60 p-4 px-2 rounded-lg mb-4`}>
      <div className="flex items-center mb-2 md:mb-0">
        <img
          src={image}
          alt={`${name}'s profile`}
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <h4 className="text-lg font-semibold text-white">{name}</h4>
          <p className="text-sm text-gray-400">{profession}</p>
        </div>
      </div>
      <div className="flex flex-row items-baseline gap-3 md:space-x-2">
        <button
          onClick={handleAccept}
          disabled={isLoading}
          className={`${
            isLoading ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'
          } flex items-center justify-center gap-2 text-white px-4 py-2 rounded-lg mb-2 md:mb-0`}
        >
          {isLoading ? <BiLoaderAlt className="animate-spin text-xl" /> : null}
          {isLoading ? 'Processing...' : 'Accept'}
        </button>
        <button
          onClick={handleReject}
          disabled={isLoading}
          className={`${
            isLoading ? 'bg-gray-500' : 'bg-red-600 hover:bg-red-700'
          } flex items-center justify-center gap-2 text-white px-4 py-2 rounded-lg mb-2 md:mb-0`}
        >
          {isLoading ? <BiLoaderAlt className="animate-spin text-xl" /> : null}
          {isLoading ? 'Processing...' : 'Reject'}
        </button>
      </div>
    </div>
  );
};

export default RequestCard;
