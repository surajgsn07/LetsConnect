import React from 'react';
import axiosInstance from '../axiosConfig/axiosConfig'; // Adjust the path accordingly
import { toast } from 'react-toastify';

const RequestCard = ({ image, name, profession, requestId, onStatusChange }) => {
  const handleAccept = async () => {
    try {
      console.log("reqe i d " , requestId)
      const response = await axiosInstance.patch(`/users/friend-request/update/${requestId}`, { isAccepted: true });
      if(response.data){
        toast.success("Accepted successfully")
      }

    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error("Error while accepting request");
    }
  };
  const handleReject = async () => {
    try {
      const response = await axiosInstance.patch(`/users/friend-request/update/${requestId}`, { isRejected: true });
      if(response.data){
        toast.success("Rejected successfully");
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error("Error while rejecting request")
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-800 bg-opacity-60 p-4 px-2 rounded-lg mb-4">
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
          className="bg-green-600 text-white px-4 py-2 rounded-lg mb-2 md:mb-0 hover:bg-green-700"
        >
          Accept
        </button>
        <button
          onClick={handleReject}
          className="bg-red-600 text-white px-4 py-2 rounded-lg mb-2 md:mb-0 hover:bg-red-700"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default RequestCard;
