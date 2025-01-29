
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useSelector} from "react-redux"
import { usePeerContext } from './components/wrappers/peer';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const user = useSelector(state=>state.auth.user);
  const {peerId} = usePeerContext();
  
  useEffect(() => {
    const socketInstance = io('http://localhost:3000'); // Replace with your socket server URL
    setSocket(socketInstance);
    

    if (user?._id) {
      console.log("peerid in socket wrapper: " , peerId)
      socketInstance.emit('register-socket', user._id);
    }

    if(peerId && peerId){
      console.log("peerid in socket wrapper: " , peerId)
      socketInstance.emit('register-peer', peerId , user?._id);
    }

    return () => {
      socketInstance.disconnect();
    };
  }, [user?._id , peerId]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
