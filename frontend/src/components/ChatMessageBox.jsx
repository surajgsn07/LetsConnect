import React, { useState } from 'react';

const ChatMessageBox = ({ messages, userId }) => {
  return (
    <div className="flex flex-col h-full p-4 overflow-y-auto backdrop-filter backdrop-blur-lg bg-opacity-30 bg-gray-900 rounded-lg">
      {messages.map((message) => (
        <div
          key={message._id}
          className={`flex my-2 ${message.sender === userId ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-xs p-3 rounded-lg ${
              message.senderId === userId ? 'bg-blue-600 text-white' : 'bg-gray-300 text-black'
            }`}
          >
            {message.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatMessageBox;
