import React, { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const VideoCallComponent = () => {
  const { roomID } = useParams();
  const user = useSelector((state) => state.auth.user);
  const videoCallContainer = useRef(null); // Ref for the video call container
  const isRoomJoined = useRef(false); // Flag to prevent repeated join calls

  useEffect(() => {
    const myMeeting = async () => {
      // Avoid rejoining if already joined
      if (isRoomJoined.current) return;
      
      // Check if user and roomID are available
      if (!user || !roomID) {
        console.error("User or roomID is missing.");
        return;
      }

      const appID = 1971394859;
      const serverSecret = "3188f55cefb874d4e2d8c0779b560117";
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, user?._id, user?.username);

      const zp = ZegoUIKitPrebuilt.create(kitToken);

      // Join the room with the required configuration
      zp.joinRoom({
        container: videoCallContainer.current, 
        sharedLinks: [
          {
            name: 'Personal link',
            url: window.location.protocol + '//' + window.location.host + window.location.pathname + '?roomID=' + roomID,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall,
        },
        
        turnOnMicrophoneWhenJoining: true, 
        turnOnCameraWhenJoining: true,
        showPreJoinView: false,
      });

      // Set the flag to true after joining the room
      isRoomJoined.current = true;
    };

    myMeeting(); // Call myMeeting when the component mounts
  }, [roomID, user]); // Dependencies include roomID and user to rerun only when these change

  return (
    <div>
      <div ref={videoCallContainer} style={{ width: '100%', height: '100vh' }} />
    </div>
  );
};

export default VideoCallComponent;
