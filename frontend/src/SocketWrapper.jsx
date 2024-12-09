
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useSelector} from "react-redux"

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const user = useSelector(state=>state.auth.user);

  useEffect(() => {
    const socketInstance = io('https://letsconnect-6jnn.onrender.com'); // Replace with your socket server URL
    setSocket(socketInstance);
    

    if (user?._id) {
      socketInstance.emit('register', user?._id);
      
    }

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
