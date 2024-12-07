import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig/axiosConfig'; // Adjust the import path based on your project structure
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa'; // Import the loader icon
import { getCookie } from '../axiosConfig/cookieFunc';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userConnections, setUserConnections] = useState([]);
  const [requestedConnections, setRequestedConnections] = useState([]);
  const user = useSelector(state => state.auth.user);

  const token = getCookie("accessToken");
  console.log({token})
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await axiosInstance.get(`/users/connections/${user?._id}`);
        if (response.data) {
          setUserConnections(response.data);
        }
      } catch (error) {
        console.error('Error fetching user connections:', error);
      }
    };
    fetchConnections();
  }, [user?._id]);

  useEffect(() => {
    const fetchSentRequests = async () => {
      try {
        const response = await axiosInstance.get(`/users/sent-requests`);
        if (response.data) {
          setRequestedConnections(response.data.recipients);
        }
      } catch (error) {
        console.error('Error fetching sent requests:', error);
      }
    };
    fetchSentRequests();
  }, [user?._id]);

  useEffect(() => {
    if (!query || query.length === 0) {
      setResults([]);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/users/search`, { params: { q: query } });
        if (response.data) {
          const filteredResults = response.data.data.filter((result) =>
            result?._id !== user?._id && !userConnections.includes(result)
          );
          setResults(filteredResults);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceFetch = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(debounceFetch);
  }, [query, user?._id, userConnections]);

  const isConnection = (userId) => userConnections.some(connection => connection?._id === userId);
  const isRequested = (userId) => requestedConnections.some(connection => connection?._id === userId);

  const handleAddConnection = async (userId) => {
    try {
      const response = await axiosInstance.post(`/users/createRequest/${userId}`, { userId });
      if (response.data) {
        toast.success("Request made successfully");
        setRequestedConnections([...requestedConnections, { _id: userId }]);
      }
    } catch (error) {
      console.error('Error adding connection:', error);
      toast.error("Error while making request");
    }
  };

  const handleRemoveConnection = async (userId) => {
    try {
      const response = await axiosInstance.delete(`/users/connections/${userId}`);
      if (response.data.success) {
        setUserConnections(userConnections.filter(connection => connection?._id !== userId));
        setRequestedConnections(requestedConnections.filter(requested => requested?._id !== userId));
      }
    } catch (error) {
      console.error('Error removing connection:', error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-3xl mx-auto">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by username..."
          className="w-full p-3 rounded-lg border border-gray-300 text-black"
        />
        {loading ? (
          <div className="mt-4 text-center">
            <FaSpinner className="animate-spin text-3xl text-white mx-auto" /> {/* Rotating spinner */}
          </div>
        ) : (
          <div className="mt-4">
            {results.length > 0 ? (
              results.map((resultUser) => (
                <div key={resultUser?._id} className="p-4 bg-gray-800 rounded-lg mb-2 flex items-center">
                  <img src={resultUser?.profilePicture} alt={resultUser.username} className="w-12 h-12 rounded-full" />
                  <div className="ml-4">
                    <div className="text-lg font-semibold">{resultUser.username}</div>
                    <div className="text-sm text-gray-500">{resultUser.profession}</div>
                    {isConnection(resultUser?._id) ? (
                      <button
                        onClick={() => handleRemoveConnection(resultUser._id)}
                        className="mt-2 px-4 py-2 bg-red-600 rounded-lg"
                      >
                        { loading ? <FaSpinner className="animate-spin" /> : 'Remove Connection' }
                      </button>
                    ) : isRequested(resultUser?._id) ? (
                      <div className="mt-2 px-4 py-2 bg-yellow-600 rounded-lg">
                        Requested
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddConnection(resultUser?._id)}
                        className="mt-2 px-4 py-2 bg-green-600 rounded-lg"
                      >
                        {loading ? <FaSpinner className="animate-spin" /> : "Add Connection"}
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              query.length > 0 && <div className="mt-4 text-center">No results found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
