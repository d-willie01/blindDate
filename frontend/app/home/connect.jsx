import React, {useRef, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

const VideoChatScreen = () => {
    const socket = useRef(null);
  const peerConnection = useRef(null);
  const pendingCandidates = useRef([]); // Buffer for ICE candidates
  const stateStore = useRef({
    peerConnectionState: "new",
    remoteDescriptionSet: false,
  });


  useEffect(() => {
    // Initialize WebSocket connection
    socket.current = new WebSocket('ws://localhost:3000');
    //socket.current = new WebSocket('wss://stream-ses0.onrender.com/');

    // Set up WebSocket event listeners
    socket.current.onmessage = handleSocketMessage;

    // Clean up on unmount
    return () => {
      if (peerConnection.current) peerConnection.current.close();
      if (socket.current) socket.current.close();
    };
  }, []);

  const initializePeerConnection = () => {
    peerConnection.current = new RTCPeerConnection();
    stateStore.current.peerConnectionState = "new";
    stateStore.current.remoteDescriptionSet = false;

    // ICE Candidate handling
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
      }
    };

    // Track event for remote media
    peerConnection.current.ontrack = (event) => {
      if (event.streams[0]) {
        console.log("Adding remote video...");
        const remoteVideoElement = document.getElementById('remoteVideo');
        remoteVideoElement.srcObject = event.streams[0];
      }
    };

    // Connection state change handlers
    peerConnection.current.oniceconnectionstatechange = () => {
      console.log("ICE Connection State:", peerConnection.current.iceConnectionState);
    };

    peerConnection.current.onconnectionstatechange = () => {
      console.log("Connection State:", peerConnection.current.connectionState);
    };
  };

  const handleSocketMessage = async (event) => {
    const message = JSON.parse(event.data);
    console.log(message);

    switch (message.type) {
      case 'matched':
        if (stateStore.current.peerConnectionState === "new" || stateStore.current.peerConnectionState === "stable") {
          await handleMatched();
        }
        break;

      case 'offer':
        if (stateStore.current.peerConnectionState === "stable" || stateStore.current.peerConnectionState === "have-local-offer") {
          await handleOffer(message.offer);
        }
        break;

      case 'answer':
        if (stateStore.current.peerConnectionState === "have-local-offer") {
          await handleAnswer(message.answer);
        }
        break;

      case 'candidate':
        if (stateStore.current.remoteDescriptionSet) {
          console.log("Adding ICE candidate directly...");
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(message.candidate));
        } else {
          console.log("Queuing ICE candidate...");
          pendingCandidates.current.push(message.candidate);
        }
        break;

      default:
        console.warn("Unknown message type:", message.type);
    }
  };

  const handleMatched = async () => {
    if (!peerConnection.current) initializePeerConnection();

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const localVideoElement = document.getElementById('localVideo');
    localVideoElement.srcObject = stream;

    // Add tracks and create an offer
    stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    stateStore.current.peerConnectionState = "have-local-offer";

    socket.current.send(JSON.stringify({ type: 'offer', offer }));
  };

  const handleOffer = async (offer) => {
    if (!peerConnection.current) initializePeerConnection();

    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
    stateStore.current.remoteDescriptionSet = true;

    // Process buffered candidates
    while (pendingCandidates.current.length > 0) {
      const candidate = pendingCandidates.current.shift();
      await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
    }

    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);
    stateStore.current.peerConnectionState = "stable";

    socket.current.send(JSON.stringify({ type: 'answer', answer }));
  };

  const handleAnswer = async (answer) => {
    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
    stateStore.current.remoteDescriptionSet = true;

    // Process buffered candidates
    while (pendingCandidates.current.length > 0) {
      const candidate = pendingCandidates.current.shift();
      await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
    }

    stateStore.current.peerConnectionState = "stable";
  };

  const handleNext = () => {
    // Close current peer connection and reset state
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    stateStore.current.peerConnectionState = "new";
    stateStore.current.remoteDescriptionSet = false;

    // Notify the server
    socket.current.send(JSON.stringify({ type: 'next' }));

    // Reset video elements
    const localVideoElement = document.getElementById('localVideo');
    const remoteVideoElement = document.getElementById('remoteVideo');
    if (localVideoElement) localVideoElement.srcObject = null;
    if (remoteVideoElement) remoteVideoElement.srcObject = null;
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Videos Container */}
      <View style={styles.videosContainer}>
        <View style={styles.videoWrapper}>
          <video id="localVideo" style={styles.video} autoPlay muted playsInline />
        </View>
        <View style={styles.videoWrapper}>
          <video id="remoteVideo" style={styles.video} autoPlay playsInline />
        </View>
      </View>

      {/* Stop and Next buttons overlay */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.stopButton}>
          <Text style={styles.stopButtonText}>STOP</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton}>
          <Text style={styles.nextButtonText}>NEXT</Text>
        </TouchableOpacity>
      </View>

      {/* Icons at the bottom */}
      <View style={styles.iconsContainer}>
        <FontAwesome name="refresh" size={24} color="white" />
        <Ionicons name="heart" size={24} color="white" />
        <Ionicons name="happy" size={24} color="white" />
        <Ionicons name="thumbs-up" size={24} color="white" />
        <Ionicons name="smile" size={24} color="white" />
        <Ionicons name="hand" size={24} color="white" />
        <Ionicons name="heart" size={24} color="white" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videosContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  videoWrapper: {
    flex: 1,
    backgroundColor: '#333',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover', // Ensures the video fills its container
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
    backgroundColor: 'transparent', // Makes it overlay and see-through
    position: 'absolute',
    bottom: 60, // Positioned above the icons bar
    width: '100%',
  },
  stopButton: {
    borderColor: 'red',
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  stopButtonText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    borderColor: 'green',
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  nextButtonText: {
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#222',
  },
});

export default VideoChatScreen;




// import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
// import { Ionicons, FontAwesome } from '@expo/vector-icons';

// const VideoChatScreen = () => {

//   const socket = useRef(null);
//   const peerConnection = useRef(null);
//   const pendingCandidates = useRef([]); // Buffer for ICE candidates
//   const stateStore = useRef({
//     peerConnectionState: "new",
//     remoteDescriptionSet: false,
//   });


//   useEffect(() => {
//     // Initialize WebSocket connection
//     socket.current = new WebSocket('ws://localhost:3000');
//     //socket.current = new WebSocket('wss://stream-ses0.onrender.com/');

//     // Set up WebSocket event listeners
//     socket.current.onmessage = handleSocketMessage;

//     // Clean up on unmount
//     return () => {
//       if (peerConnection.current) peerConnection.current.close();
//       if (socket.current) socket.current.close();
//     };
//   }, []);

//   const initializePeerConnection = () => {
//     peerConnection.current = new RTCPeerConnection();
//     stateStore.current.peerConnectionState = "new";
//     stateStore.current.remoteDescriptionSet = false;

//     // ICE Candidate handling
//     peerConnection.current.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.current.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
//       }
//     };

//     // Track event for remote media
//     peerConnection.current.ontrack = (event) => {
//       if (event.streams[0]) {
//         console.log("Adding remote video...");
//         const remoteVideoElement = document.getElementById('remoteVideo');
//         remoteVideoElement.srcObject = event.streams[0];
//       }
//     };

//     // Connection state change handlers
//     peerConnection.current.oniceconnectionstatechange = () => {
//       console.log("ICE Connection State:", peerConnection.current.iceConnectionState);
//     };

//     peerConnection.current.onconnectionstatechange = () => {
//       console.log("Connection State:", peerConnection.current.connectionState);
//     };
//   };

//   const handleSocketMessage = async (event) => {
//     const message = JSON.parse(event.data);
//     console.log(message);

//     switch (message.type) {
//       case 'matched':
//         if (stateStore.current.peerConnectionState === "new" || stateStore.current.peerConnectionState === "stable") {
//           await handleMatched();
//         }
//         break;

//       case 'offer':
//         if (stateStore.current.peerConnectionState === "stable" || stateStore.current.peerConnectionState === "have-local-offer") {
//           await handleOffer(message.offer);
//         }
//         break;

//       case 'answer':
//         if (stateStore.current.peerConnectionState === "have-local-offer") {
//           await handleAnswer(message.answer);
//         }
//         break;

//       case 'candidate':
//         if (stateStore.current.remoteDescriptionSet) {
//           console.log("Adding ICE candidate directly...");
//           await peerConnection.current.addIceCandidate(new RTCIceCandidate(message.candidate));
//         } else {
//           console.log("Queuing ICE candidate...");
//           pendingCandidates.current.push(message.candidate);
//         }
//         break;

//       default:
//         console.warn("Unknown message type:", message.type);
//     }
//   };

//   const handleMatched = async () => {
//     if (!peerConnection.current) initializePeerConnection();

//     const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//     const localVideoElement = document.getElementById('localVideo');
//     localVideoElement.srcObject = stream;

//     // Add tracks and create an offer
//     stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));
//     const offer = await peerConnection.current.createOffer();
//     await peerConnection.current.setLocalDescription(offer);
//     stateStore.current.peerConnectionState = "have-local-offer";

//     socket.current.send(JSON.stringify({ type: 'offer', offer }));
//   };

//   const handleOffer = async (offer) => {
//     if (!peerConnection.current) initializePeerConnection();

//     await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
//     stateStore.current.remoteDescriptionSet = true;

//     // Process buffered candidates
//     while (pendingCandidates.current.length > 0) {
//       const candidate = pendingCandidates.current.shift();
//       await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
//     }

//     const answer = await peerConnection.current.createAnswer();
//     await peerConnection.current.setLocalDescription(answer);
//     stateStore.current.peerConnectionState = "stable";

//     socket.current.send(JSON.stringify({ type: 'answer', answer }));
//   };

//   const handleAnswer = async (answer) => {
//     await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
//     stateStore.current.remoteDescriptionSet = true;

//     // Process buffered candidates
//     while (pendingCandidates.current.length > 0) {
//       const candidate = pendingCandidates.current.shift();
//       await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
//     }

//     stateStore.current.peerConnectionState = "stable";
//   };

//   const handleNext = () => {
//     // Close current peer connection and reset state
//     if (peerConnection.current) {
//       peerConnection.current.close();
//       peerConnection.current = null;
//     }
//     stateStore.current.peerConnectionState = "new";
//     stateStore.current.remoteDescriptionSet = false;

//     // Notify the server
//     socket.current.send(JSON.stringify({ type: 'next' }));

//     // Reset video elements
//     const localVideoElement = document.getElementById('localVideo');
//     const remoteVideoElement = document.getElementById('remoteVideo');
//     if (localVideoElement) localVideoElement.srcObject = null;
//     if (remoteVideoElement) remoteVideoElement.srcObject = null;
//   };
//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Videos Container */}
//       <View style={styles.videosContainer}>
//         <View style={styles.videoWrapper}>
//           <video id="localVideo" style={styles.video} autoPlay muted playsInline />
//         </View>
//         <View style={styles.videoWrapper}>
//           <video id="remoteVideo" style={styles.video} autoPlay playsInline />
//         </View>
//       </View>

//       {/* Stop and Next buttons overlay */}
//       <View style={styles.overlayButtons}>
//         <TouchableOpacity style={styles.stopButton}>
//           <Text style={styles.stopButtonText}>STOP</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.nextButton}>
//           <Text style={styles.nextButtonText}>NEXT</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Icons at the bottom */}
//       <View style={styles.iconsContainer}>
//         <FontAwesome name="refresh" size={24} color="white" />
//         <Ionicons name="heart" size={24} color="white" />
//         <Ionicons name="happy" size={24} color="white" />
//         <Ionicons name="thumbs-up" size={24} color="white" />
//         <Ionicons name="smile" size={24} color="white" />
//         <Ionicons name="hand" size={24} color="white" />
//         <Ionicons name="heart" size={24} color="white" />
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   videosContainer: {
//     flex: 1,
//     flexDirection: 'column',
//     justifyContent: 'space-between',
//   },
//   videoWrapper: {
//     flex: 1,
//     backgroundColor: '#333',
//   },
//   video: {
//     width: '100%',
//     height: '100%',
//     objectFit: 'cover', // Ensures the video fills its container
//   },
//   overlayButtons: {
//     position: 'absolute',
//     top: '50%',
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'space-evenly',
//     zIndex: 10,
//   },
//   stopButton: {
//     backgroundColor: 'red',
//     paddingVertical: 15,
//     paddingHorizontal: 30,
//     borderRadius: 5,
//   },
//   stopButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   nextButton: {
//     backgroundColor: 'green',
//     paddingVertical: 15,
//     paddingHorizontal: 30,
//     borderRadius: 5,
//   },
//   nextButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   iconsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 20,
//     backgroundColor: '#222',
//   },
// });

// export default VideoChatScreen;





























