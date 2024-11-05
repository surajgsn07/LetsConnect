import React from 'react';

const ConnectionCard = ({ image, name, profession, onRemove }) => {
  return (
    <div className="flex items-center justify-between bg-gray-800 text-white p-2 rounded-lg my-2 h-12">
      <div className="flex items-center">
        <img src={image} alt={`${name}'s profile`} className="w-10 h-10 rounded-full mr-4" />
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-sm text-gray-400">{profession}</p>
        </div>
      </div>
      <button onClick={onRemove} className="bg-red-600 px-2 py-1 rounded-lg hover:bg-red-700">Remove</button>
    </div>
  );
};

export default ConnectionCard;
