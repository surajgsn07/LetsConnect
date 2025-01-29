import React, { useEffect ,useState} from 'react';
import { FaVideo } from 'react-icons/fa'; // Import video call icon from react-icons
import { FaSpinner } from 'react-icons/fa'; // Import the loading spinner icon
import { useSelector } from 'react-redux';
import axiosInstance from '../../axiosConfig/axiosConfig';
import { useSocket } from '../../SocketWrapper';
import { v4 as uuidv4 } from 'uuid'; // Import v4 version
import { useNavigate } from 'react-router-dom';
// import { usePeer } from '../wrappers/peer';

const demoConnections = [
  {
    id: 1,
    name: 'John Doe',
    field: 'Web Developer',
    picture: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: 2,
    name: 'Jane Smith',
    field: 'AI Specialist',
    picture: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: 3,
    name: 'Samuel Green',
    field: 'Data Scientist',
    picture: 'https://randomuser.me/api/portraits/men/3.jpg'
  },
  // Add more connections as needed
];

const Video = () => {
  const user = useSelector(state=>state.auth.user);
  const [connections, setConnections] = useState([]);
  const [isCalling, setisCalling] = useState(false);
  const [userToCall, setuserToCall] = useState(null);
  const [roomId, setroomId] = useState(null);
  const navigate = useNavigate();
  const [loading, setloading] = useState(false)
  
  

  const socket = useSocket();

  const cancelCall =()=>{
    socket.emit('reject-vc' , {senderId:user?._id , targetId: userToCall?._id} );
    setuserToCall(null);
    setisCalling(false);    
  }

  

  const fetchConnections = async () => {
    setloading(true);
    try {
      
      const res = await axiosInstance.get(`/users/connections/${user._id}`);
      if (res.data) {
        
        setConnections(res.data)
      }
    } catch (error) {
      console.log("Error fetching connections:", error);
    }
    setloading(false);
  };

  useEffect(() => {
    fetchConnections();
    
  }, [])

  useEffect(() => {
    socket?.on('reject-vc' , ({ senderId , targetId })=>{
      
      setuserToCall(null);
      setisCalling(false);
      setroomId(null);
    })


    socket?.on("accept-vc" , ({roomId , otherPeerId})=>{
      setisCalling(false);
      

      navigate(`/vc/videocall/${otherPeerId}/sender`)
    })
  }, [socket])
  
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className='text-white font-bold text-2xl text-center mb-10' >Make Video call with:</div>
      <div className="space-y-6">
        {connections.map((connection) => (
          <div key={connection._id} className="bg-gray-900 shadow-lg rounded-lg p-4 flex items-center">
            <img
              src={connection.profilePicture}
              alt={connection.name}
              className="w-12 h-12 rounded-full object-cover mr-4"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">{connection.name}</h3>
              <p className="text-gray-600">{connection.field}</p>
            </div>
            <button
              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full"
              title="Start Video Call"
              onClick={() => {
                const roomId = uuidv4();
                socket.emit("make-vc", {senderId:user?._id, targetId: connection._id  , roomId });
                setisCalling(true)
                setuserToCall(connection)
                setroomId(roomId)
              }}
            >
              <FaVideo size={20} />
            </button>
          </div>
        ))}

        {!loading && connections.length === 0 && (
          <p className="text-gray-600 text-center">No connections found.</p>
        )}

        {loading && (
          <div className="flex items-center justify-center mt-4">
            <FaSpinner className="animate-spin text-gray-300 mr-2" size={24} />
            
          </div>
        )}


      </div>
      {isCalling && 
      <CallingModal user={userToCall} cancelCall={cancelCall} />}
    </div>
  );
};


const CallingModal = ({ user, cancelCall }) => {
  return (
    <div className="fixed z-50 inset-0 bg-black bg-opacity-70 flex items-center justify-center">
      <div className="bg-gray-900 text-white p-6 rounded-lg w-11/12 sm:w-3/4 max-w-lg overflow-y-auto max-h-full shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-center">Connecting...</h3>
          <button onClick={cancelCall} className="text-red-400 hover:text-red-600">
            ✖
          </button>
        </div>
        <div className="flex flex-col items-center mb-4">
          <img 
            src={user?.profilePicture} 
            alt={user?.name} 
            className="w-16 h-16 rounded-full object-cover border-4 border-green-500 shadow-md mb-2" 
          />
          <h4 className="font-bold text-xl">{user?.name}</h4>
          <p className="text-gray-300">{user?.field}</p>
        </div>
        <div className="flex justify-center mt-4">
          <div className="flex items-center">
            <FaSpinner className="animate-spin text-gray-300 mr-2" size={24} />
            <p className="text-lg font-semibold text-gray-300">Waiting...</p>
          </div>
        </div>
        <div className="flex justify-center">
          <button 
            onClick={cancelCall} 
            className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg shadow-md transition duration-200 transform hover:scale-105 mt-4"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};




export default Video;
