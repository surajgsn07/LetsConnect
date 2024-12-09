import React, { useEffect, useState } from 'react';
import ChatInbox from './ChatInbox';
import Modal from './Modal';
import axiosInstance from '../axiosConfig/axiosConfig';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BiLoader } from 'react-icons/bi';

const ChatInboxPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingConnections, setLoadingConnections] = useState(true);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const fetchChats = async () => {
    try {
      const res = await axiosInstance.get('/messages/users-with-last-message');
      if (res.data) {
        
        setChats(res.data?.data);
      }
    } catch (error) {
      console.log('Error fetching chats:', error);
    } finally {
      setLoadingChats(false);
    }
  };

  const fetchConnections = async () => {
    try {
      const res = await axiosInstance.get(`/users/connections/${user._id}`);
      if (res.data) {
        
        setConnections(res.data);
      }
    } catch (error) {
      console.log('Error fetching connections:', error);
    } finally {
      setLoadingConnections(false);
    }
  };

  const handleSelectConnection = (id) => {
    
    navigate(`/dashboard/chat/${id}`);
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (user) {
      fetchChats();
      fetchConnections();
    }
  }, [user]);

  return (
    <div className="p-4 w-full min-h-screen text-white">
      {loadingChats ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <BiLoader className="animate-spin text-4xl text-blue-600" />
        </div>
      ) : chats.length > 0 ? (
        <ChatInbox chats={chats} />
      ) : (
        <div>No chat history available.</div>
      )}

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 mt-4"
      >
        New Chat
      </button>

      <Modal
        isOpen={isModalOpen}
        connections={connections}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelectConnection}
        loadingConnections={loadingConnections}
      />
    </div>
  );
};

export default ChatInboxPage;
