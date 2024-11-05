import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  MenuIcon, XIcon, UserIcon, ChatAltIcon, DocumentTextIcon, UsersIcon, InboxIcon, PlusCircleIcon
} from '@heroicons/react/outline';
import { VideoCameraIcon } from '@heroicons/react/outline';
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex max-h-screen" style={{ borderRight: "1px solid rgb(55, 65, 81)" }}>
      {/* Sidebar for larger screens */}
      <div className={`fixed md:sticky z-40 top-0 left-0 h-full bg-gray-900 text-white w-64 transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-64'} md:translate-x-0 md:w-64`}>
        <div className="p-4">
          <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
          <ul>
            <li className="mb-2">
              <Link
                to="/dashboard"
                className={`flex items-center p-2 text-lg rounded ${isActive('/dashboard') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              >
                <UserIcon className="h-6 w-6 mr-2" />
                Profile
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/dashboard/chat"
                className={`flex items-center p-2 text-lg rounded ${isActive('/dashboard/chat') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              >
                <ChatAltIcon className="h-6 w-6 mr-2" />
                Chat
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/dashboard/feed"
                className={`flex items-center p-2 text-lg rounded ${isActive('/dashboard/feed') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              >
                <DocumentTextIcon className="h-6 w-6 mr-2" />
                Feed
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/dashboard/connections"
                className={`flex items-center p-2 text-lg rounded ${isActive('/dashboard/connections') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              >
                <UsersIcon className="h-6 w-6 mr-2" />
                Connections
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/dashboard/requests"
                className={`flex items-center p-2 text-lg rounded ${isActive('/dashboard/requests') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              >
                <InboxIcon className="h-6 w-6 mr-2" />
                Requests
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/dashboard/addpost"
                className={`flex items-center p-2 text-lg rounded ${isActive('/dashboard/addpost') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              >
                <PlusCircleIcon className="h-6 w-6 mr-2" />
                Add Post
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/dashboard/search"
                className={`flex items-center p-2 text-lg rounded ${isActive('/dashboard/search') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              >
                <PlusCircleIcon className="h-6 w-6 mr-2" />
                Search
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/dashboard/vc"
                className={`flex items-center p-2 text-lg rounded ${isActive('/dashboard/vc') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              >
                <VideoCameraIcon className="h-6 w-6 mr-2" />
                Video call
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Hamburger Menu for smaller screens */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className={`fixed z-40 rounded-full bg-gray-700 ${isOpen ? 'top-4 left-40' : 'top-20 left-3'} p-2 text-gray-800`}>
          {isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
