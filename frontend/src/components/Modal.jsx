import React from 'react';

const Modal = ({ isOpen, connections, onClose, onSelect }) => {
  if (!isOpen) return null;
  console.log("connections" , connections)

  return (
    <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 text-white p-4 rounded-lg w-11/12 sm:w-3/4 max-w-lg overflow-y-auto max-h-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Select a Connection</h3>
          <button onClick={onClose} className="text-red-500">✖</button>
        </div>
        {connections.map(connection => (
          <div key={connection.id} className="flex items-center justify-between bg-gray-700 p-2 rounded-lg my-2 h-12">
            <div className="flex items-center">
              <img src={connection.profilePicture} alt={`${connection.name}'s profile`} className="w-10 h-10 rounded-full mr-4" />
              <div>
                <h4 className="font-semibold">{connection.username}</h4>
                <p className="text-sm text-gray-400">{connection.profession}</p>
              </div>
            </div>
            <button onClick={() => onSelect(connection._id)} className="bg-blue-600 px-2 py-1 rounded-lg hover:bg-blue-700">Select</button>
          </div>
        ))}
        {connections.length === 0 && isOpen && (
        <div className="mt-4">No connections available to start a new chat.</div>
      )}
      </div>
    </div>
  );
};

export default Modal;
