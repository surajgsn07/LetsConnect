import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChatInbox = ({ chats }) => {
  console.log("chats",chats)
  const navigate = useNavigate();
  return (
    <div className="p-4 w-full">
      <h2 className="text-3xl font-semibold mb-4 w-full text-center text-white ">Chat Inbox</h2>
      {chats.map(chat => (
        <div key={chat._id} className="flex cursor-pointer items-center justify-between  bg-gray-800 text-white p-2 rounded-lg my-2 h-12 md:w-[80%] mx-auto " onClick={()=>{
          navigate(`/dashboard/chat/${chat?.user?._id}`);
        }} >
          <div className="flex items-center">
            <img src={chat?.user?.profilePicture} alt={`${chat?.user?.name}'s profile`} className="w-10 h-10 rounded-full mr-4" />
            <div>
              <h4 className="font-semibold">{chat?.user?.name}</h4>
              <p className="text-sm text-gray-400">{chat?.lastMessage?.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatInbox;
