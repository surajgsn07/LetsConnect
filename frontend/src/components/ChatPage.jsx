import React, { useEffect, useState } from 'react';
import ChatMessageBox from './ChatMessageBox';
import axiosInstance from '../axiosConfig/axiosConfig';
import { useParams } from 'react-router-dom';

import { useSocket } from '../SocketWrapper'; // Import SocketContext hook
import { useSelector } from 'react-redux';

const ChatPage = () => {
  const [messages, setMessages] = useState([
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [userInfo, setuserInfo] = useState(null)
  const {personId} = useParams();
  const socket = useSocket();
  const user = useSelector(state=>state.auth.user);
  const userId = user?._id; // Assume the logged-in user has an ID of 1
 
  

  const fetchPersonDetails = async()=>{
    try {
      const res = await axiosInstance(`/users/getuserbyid/${personId}`);
      if(res.data){
        
        setuserInfo(res.data.data);
      }
    } catch (error) {
      console.log("error : " , error);
    }
  }


  const fetchMessages =async()=>{
    try {
      const res = await axiosInstance(`/messages/conversation/${personId}`);

      if(res.data){
        
        setMessages(res?.data?.data)
      }
    } catch (error) {
      console.log("error : " , error)
    }
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // setMessages([
      //   ...messages,
      //   { id: messages.length + 1, senderId: userId, text: newMessage.trim() },
      // ]);
      socket.emit("private message" , {senderId:userId , recipientId: personId , message:newMessage , name:userInfo.name})
      const msg = { receiver: userId, sender: userId, content: newMessage }
      setMessages((prev)=>[...prev , msg])

      setNewMessage('');
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on('private message', ({senderId, recipientId, message, name, fileUrl }) => {
        
        const msg = { sender: senderId, receiver: userId, content: message }
        setMessages((prevMessages) => [...prevMessages, msg]);
      });

      return () => {
        socket.off('private message');
      };
    }
  }, [socket]);

  // Sample user info (you can replace this with actual data)
  // const userInfo = {
  //   image: 'https://via.placeholder.com/40', // Replace with actual image URL
  //   name: 'John Doe',
  //   profession: 'Software Engineer',
  // };

  useEffect(() => {
    fetchPersonDetails()
  }, [personId])

  useEffect(() => {
    fetchMessages()
  }, [personId ])
  

  if(!userInfo){
    return <>
    loading</>
  }
  

  return (
    <div className="flex flex-col min-h-screen h-full w-full p-4 backdrop-filter backdrop-blur-lg bg-opacity-30 bg-gray-900 rounded-lg">
      {/* Header with user info */}
      <div className="flex items-center p-4 bg-gray-800 bg-opacity-50 rounded-lg mb-4">
        <img
          src={userInfo.profilePicture}
          alt={`${userInfo.name}'s profile`}
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <h2 className="text-lg font-semibold text-white">{userInfo.name}</h2>
          <p className="text-sm text-gray-400">{userInfo.field}</p>
        </div>
      </div>

      {/* Chat messages area */}
      <div className="flex-grow overflow-auto mb-2">
        <ChatMessageBox messages={messages} userId={userId} />
      </div>

      {/* Input field */}
      <div className="bg-gray-800  p-4 flex items-center rounded-lg sticky bottom-0 z-10">
        <input
          type="text"
          className="flex-grow border border-gray-700 rounded-lg p-2 mr-2 bg-gray-700 bg-opacity-50 placeholder-gray-400 text-white"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
