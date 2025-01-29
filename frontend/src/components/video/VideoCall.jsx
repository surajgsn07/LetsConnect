import React, { useEffect, useRef } from "react";
import  {usePeerContext}  from "../wrappers/peer";
import { useParams } from "react-router-dom";
import { useSocket } from "../../SocketWrapper";

const VideoCall = () => {
  const { peerId,peer, makeCall, currentCall, localStream, endCall ,anotherPersonId} = usePeerContext();
  const{otherPeerId , role} = useParams()
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  
  const socket = useSocket();

  // useEffect(() => {
    
  //   console.log("anotherPersonId: " , anotherPersonId)
  //   if(otherPeerId && role=="receiver" ){
  //     makeCall(otherPeerId);
  //   }
    
  // }, [anotherPersonId])

  useEffect(() => {
    const conn = peer?.connections;
    console.log({conn})
    if(!conn){
      console.log("inside the conn cndn")
      localStream?.getTracks()[0]?.stop();
      
    }
    
    
  }, [peer?.connections]);
  

  // Display the local stream in the video element
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Display the remote stream in the video element
  useEffect(() => {
    
    
    if (currentCall) {
      currentCall.on("stream", (remoteStream) => {
        
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      });
    }else{
      localStream?.getTracks()[0]?.stop();
    }

  }, [currentCall]);

  const handleCall = (id) => {
    if (id) {
      makeCall(id);
    }
  };

  useEffect(() => {
    if(otherPeerId && role=="receiver" ){
      makeCall(otherPeerId);
    }

    // Cleanup: Ensure endCall is called when component unmounts
    return () => {
      console.log("VideoCall component unmounted. Ending the call...");
      endCall();
      localStream?.getTracks()[0]?.stop();
    };
    
  }, [])


  
  return (
    <div className="relative mx-auto flex items-center justify-center w-[90%] max-h-[90vh] overflow-hidden bg-gray-900 text-white">
      {/* Remote Video: Fullscreen */}
      <div className="w-full h-full bg-black">
        {currentCall ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            className="w-full h-full py-10 object-cover"
            style={{ aspectRatio: "16/9" }}
          ></video>
        ) : (
          <p className="absolute top-1/2 left-1/2 text-gray-400 transform -translate-x-1/2 -translate-y-1/2">
            Waiting for remote video...
          </p>
        )}
      </div>

      {/* Local Video: Small Overlay */}
      <div className="absolute bottom-4 right-4 w-32 h-24 md:w-48 md:h-36 bg-black rounded-lg overflow-hidden shadow-lg">
        {localStream ? (
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="w-full h-full object-cover"
            style={{ aspectRatio: "16/9" }}
          ></video>
        ) : (
          <p className="text-center text-gray-400 mt-8">Your Video</p>
        )}
      </div>

      {/* End Call Button */}
      <div className="absolute bottom-0 w-full py-4  flex justify-center">
        <button
          onClick={endCall}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md transition duration-200"
        >
          End Call
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
