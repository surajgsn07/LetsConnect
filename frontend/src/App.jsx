import { useEffect, useState } from "react";
import { Outlet, useLocation, useMatch, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "./SocketWrapper";
import axiosInstance from "./axiosConfig/axiosConfig";
import { login } from "./store/authSlice";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { getCookie } from "./axiosConfig/cookieFunc";

function App() {
  const socket = useSocket();
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const matchChat = useMatch("/dashboard/chat/:personId");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isReceivingCall, setIsReceivingCall] = useState(false);
  const [callDetails, setCallDetails] = useState(null);
  const [roomId, setRoomId] = useState(null);

  // Fetch the user's information if an access token is present
  const fetchUser = async () => {
    const accessToken = getCookie("accessToken");
    if (accessToken) {
      try {
        const res = await axiosInstance("/users/getuser");
        if (res.data) {
          dispatch(login({ user: res.data.data }));
          
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    }
  };

  // Fetch details of the calling user
  const fetchCallUserDetails = async (targetId) => {
    try {
      const res = await axiosInstance(`/users/getuserbyid/${targetId}`);
      if (res.data) {
        setCallDetails(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching caller details:", error);
    }
  };

  // Handle canceling a call
  const cancelCall = () => {
    if (socket && user && callDetails) {
      socket.emit("reject-vc", { senderId: user._id, targetId: callDetails._id });
      setIsReceivingCall(false);
      setCallDetails(null);
    }
  };

  // Accept the incoming call and navigate to the video call room
  const acceptCall = () => {
    if (socket && user && callDetails && roomId) {
      socket.emit("accept-vc", { senderId: user._id, targetId: callDetails._id, roomId });
      setIsReceivingCall(false);
      setCallDetails(null);

      navigate(`/vc/${roomId}`);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (socket && user) {
      // Register the user with the socket server
      socket.emit("register", user._id);

      // Handle incoming private messages and show toast notifications
      socket.on("private message", ({name, message}) => {
        if (!matchChat) {
          toast.info(`Message Recieved : ${message}`);
        }
      });

      // Handle incoming video call request
      socket.on("make-vc", async ({ senderId, targetId, roomId }) => {
        await fetchCallUserDetails(senderId);
        setIsReceivingCall(true);
        setRoomId(roomId);
      });

      // Handle call rejection
      socket.on("reject-vc", () => {
        setIsReceivingCall(false);
        setCallDetails(null);
      });

      // Clean up socket event listeners on component unmount
      return () => {
        socket.off("private message");
        socket.off("make-vc");
        socket.off("reject-vc");
      };
    }
  }, [socket, user, matchChat]);

  return (
    <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="z-50"
      />
      <Navbar />
      <Outlet />
      <Footer />

      {/* Show the calling modal if there is an incoming call */}
      {isReceivingCall && (
        <CallingModal
          user={callDetails}
          cancelCall={cancelCall}
          acceptCall={acceptCall}
        />
      )}
    </div>
  );
}

// Modal component to display incoming call details
const CallingModal = ({ user, cancelCall, acceptCall }) => {
  return (
    <div className="fixed z-50 inset-0 bg-black bg-opacity-70 flex items-center justify-center">
      <div className="bg-gray-900 text-white p-6 rounded-lg w-11/12 sm:w-3/4 max-w-lg overflow-y-auto max-h-full shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-center">Calling...</h3>
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
        <div className="flex justify-center gap-8 mt-4">
          <button
            onClick={acceptCall}
            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg shadow-md transition duration-200 transform hover:scale-105"
          >
            Accept
          </button>
          <button
            onClick={cancelCall}
            className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg shadow-md transition duration-200 transform hover:scale-105"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
