import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Peer from "peerjs";

const usePeer = () => {
  const [peerId, setPeerId] = useState(null); // Holds the PeerJS ID
  const [currentCall, setCurrentCall] = useState(null); // Holds the current call object
  const [localStream, setLocalStream] = useState(null); // Local media stream
  const peerRef = useRef(null); // Reference for the PeerJS instance
  const [anotherPersonId, setAnotherPersoonId] = useState(null);

  useEffect(() => {
    if (!peerRef.current) {
      const newPeer = new Peer();

      // Event listeners for PeerJS
      newPeer.on("open", (id) => {
        console.log("PeerJS ID:", id);
        setPeerId(id);
      });

      // Handle incoming call
      newPeer.on("call", (call) => {
        // console.log("Incoming call:", call);
        answerCall(call); // Use the answerCall function
      });

      newPeer.on("error", (err) => console.error("PeerJS error:", err));

      peerRef.current = newPeer;
    }
  }, []);

  // Function to answer an incoming call
  const answerCall = useCallback(
    
    async (call) => {
      
      try {
        // Request local media stream if not already available
        let stream = localStream;
        if (!localStream) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          setLocalStream(stream);
        }
        
        call.answer(stream); // Answer the call
        setCurrentCall(call);

        // Listen for the remote stream
        call.on("stream", (remoteStream) => {
          console.log("Received remote stream:", remoteStream);
        });

        call.on("close", () => {
          console.log("Call ended");
          setCurrentCall(null);
        });
      } catch (error) {
        console.error("Error answering call:", error);
      }
    },
    [localStream]
  );

  // Function to make a call
  const makeCall = useCallback(async (otherPeerId) => {
    if (!peerRef.current) return;

    console.log({otherPeerId})

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);

      const call = peerRef.current.call(otherPeerId, stream);
      setCurrentCall(call);

      call?.on("stream", (remoteStream) => {
        console.log("Received remote stream:", remoteStream);
      });

      call?.on("close", () => {
        console.log("Call ended");
        setCurrentCall(null);
      });
    } catch (error) {
      console.error("Error making call:", error);
    }
  }, []);

  // Function to end a call
const endCall = useCallback(async() => {
  // 1. Close the current call
  if (currentCall) {
    currentCall.close(); // Close the WebRTC connection
    setCurrentCall(null); // Clear the current call state
    console.log("Call object closed.");
  }

  localStream.getTracks()[0].stop();

  

  // 2. Stop all tracks in the local media stream
  if (localStream) {
    localStream.getTracks().forEach((track) => {
      track.stop(); // Stop the media stream tracks (audio & video)
    });
    setLocalStream(null); // Clear the local stream state
    console.log("Local media stream stopped.");
  }

  // 3. Close all existing data connections (if any)
  if (peerRef.current && anotherPersonId) {
    
    const conn = peerRef.current.connections[anotherPersonId];
    if (conn) {
      conn.forEach((connection) => {
        connection.close(); // Close any active data connections
      });
      console.log("Data connections closed.");
    }
  }

  
  
  console.log("Call completely ended. No further data transmission.");
}, [currentCall, localStream, anotherPersonId]);


  useEffect(() => {
    console.log("anotherPersonId: " , anotherPersonId)
  }, [anotherPersonId])
  

  // Return state and functions
  const peerState = useMemo(
    () => ({
      peer: peerRef.current,
      peerId,
      currentCall,
      makeCall,
      answerCall, // Expose the answerCall function
      endCall,
      localStream,
      setAnotherPersoonId,
      anotherPersonId
    }),
    [peerId, currentCall, makeCall, answerCall, endCall, localStream]
  );

  return peerState;
};

export default usePeer;
