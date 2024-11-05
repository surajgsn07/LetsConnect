import React, { useEffect, useState } from 'react';
import ConnectionCard from './ConnectionCard';
import axiosInstance from '../axiosConfig/axiosConfig';
import {useSelector} from "react-redux"
import { toast } from 'react-toastify';

const ConnectionsPage = () => {
  const [connections, setConnections] = useState([]);
  
  
const user = useSelector(state=>state.auth.user);


const fetchConnections = async()=>{
  try {
    const res = await axiosInstance(`/users/connections/${user?._id}`);

    if(res){
      // console.log("res : " , res);
      setConnections(res?.data);
    }
  } catch (error) {
    console.log("error : " , error)
  }
}

  const handleRemove = async(id) => {

  try {
    const res = await axiosInstance.post(`/users/deleteConnection` , {
      userId1:id,
      userId2:user._id
    });

    if(res.data){
      // console.log("res : " , res);
    setConnections(connections.filter(connection => connection._id !== id));
      toast.success("Connection removed successfully");
    }
  } catch (error) {
    console.log("error : " , error)
    toast.error("Error while removing connection")
  }
  };

  useEffect(() => {
    fetchConnections()
  }, [])
  

  return (
    <div className="p-4 w-full md:w-[60%] mx-auto min-h-[400px] ">
        {!connections || connections.length==0 ? (
      <h2 className="text-3xl mt-20 w-full font-bold mb-4 text-center text-white ">No connections found</h2>
      ) : <h2 className="text-3xl w-full font-bold mb-4 text-center text-white ">Your Connections</h2>}
      
      {connections && connections?.map(connection => (
        <ConnectionCard
          key={connection?._id}
          image={connection?.profilePicture}
          name={connection.username}
          profession={connection.profession}
          onRemove={() => handleRemove(connection._id)}
        />
      ))}

      
    </div>
  );
};

export default ConnectionsPage;
