import React, { useEffect, useState } from 'react';
import RequestCard from './RequestCard'; // Assume you have a RequestCard component
import axiosInstance from '../axiosConfig/axiosConfig';
import {toast} from 'react-toastify'
import { useSelector } from 'react-redux';

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  console.log("requests : " ,requests)
  const user  = useSelector(state=>state.auth.user)

  
const fetchRequests = async()=>{
  try {
    const res = await axiosInstance(`/users/friend-requests/${user._id}`);

    if(res.data){
      // console.log("res : " , res);
      setRequests(res?.data);
    }
  } catch (error) {
    console.log("error : " , error)
  }
}


  const handleAccept = async(id) => {
    // Logic to accept the request
    try {
      const res = await axiosInstance.patch(`/users/friend-request/update/${id}` , {
        isAccepted:true
      });
  
      if(res.data){
        toast.success("Request accepted successfully")
        
      }
    } catch (error) {
      console.log("error : " , error)
      toast.error("Error while accepting request");
    }


    setRequests(requests.filter(request => request.id !== id));
  };

  const handleReject = async(id) => {
    // Logic to reject the request
    try {
      const res = await axiosInstance.patch(`/users/friend-request/update/${id}` , {
        isRejected:true
      });
  
      if(res.data){
        toast.success("Request rejected successfully")
        
      }
    } catch (error) {
      console.log("error : " , error)
      toast.error("Error while rejecting request");
    }
  };

  useEffect(() => {
    fetchRequests()
    
  }, [ ])
  

  return (
    <div className="p-4 w-full md:w-[70%] mx-auto min-h-[400px]">
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
        />
      ))}
    </div>
  );
};

export default RequestsPage;
