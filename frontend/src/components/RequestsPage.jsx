import React, { useEffect, useState } from 'react';
import RequestCard from './RequestCard'; // Assume you have a RequestCard component
import axiosInstance from '../axiosConfig/axiosConfig';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa'; // Import spinner icon from React Icons

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false); // State for loader
  const user = useSelector(state => state.auth.user);

  const fetchRequests = async () => {
    setLoading(true); // Show loader while fetching requests
    try {
      const res = await axiosInstance.get(`/users/friend-requests/${user._id}`);

      if (res.data) {
        setRequests(res?.data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Error fetching connection requests.');
    } finally {
      setLoading(false); // Hide loader after fetch is complete
    }
  };

  const handleAccept = async (id) => {
    try {
      const res = await axiosInstance.patch(`/users/friend-request/update/${id}`, {
        isAccepted: true,
      });

      if (res.data) {
        toast.success('Request accepted successfully');
        setRequests(requests.filter(request => request.id !== id));
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error('Error while accepting request.');
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await axiosInstance.patch(`/users/friend-request/update/${id}`, {
        isRejected: true,
      });

      if (res.data) {
        toast.success('Request rejected successfully');
        setRequests(requests.filter(request => request.id !== id));
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Error while rejecting request.');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [setRequests]);

  return (
    <div className="p-4 w-full md:w-[70%] mx-auto min-h-[400px]">
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <FaSpinner className="text-white text-5xl animate-spin" />
        </div>
      ) : (
        <>
          {!requests.length ? (
            <h2 className="text-3xl mt-20 w-full font-bold mb-4 text-center text-white">
              No connection requests found
            </h2>
          ) : (
            <h2 className="text-3xl w-full font-bold mb-4 text-center text-white">
              Connection Requests
            </h2>
          )}

          {requests.map(request => (
            <RequestCard
              key={request._id}
              image={request?.from?.profilePicture}
              name={request?.from?.username}
              profession={request?.from?.profession}
              requestId={request._id}
              requests={requests}
              setRequests={setRequests}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default RequestsPage;
