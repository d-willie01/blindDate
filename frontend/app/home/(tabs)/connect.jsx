import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';

export default function Connect() {
  const socket = useRef(null);
  const peerConnection = useRef(null);
  const pendingCandidates = useRef([]); // Buffer for ICE candidates
  const stateStore = useRef({
    peerConnectionState: "new",
    remoteDescriptionSet: false,
  });


  useEffect(() => {
    // Initialize WebSocket connection
    //socket.current = new WebSocket('ws://localhost:3000');
    socket.current = new WebSocket('wss://stream-ses0.onrender.com/');

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
    <ScrollView contentContainerStyle={styles.container}>
      {/* UI Layout */}
      <View style={styles.header}>
        <View>
          <Text style={styles.profileName}>Bijlee Sharma</Text>
          <Text style={styles.country}>🇮🇳 India</Text>
        </View>
        <TouchableOpacity style={styles.closeButton}>
          <Text style={styles.closeText}>✖️</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.interestsContainer}>
        {['Music', 'Dance', 'Shopping', 'Travel', 'Food'].map((interest) => (
          <View key={interest} style={styles.interestTag}>
            <Text style={styles.interestText}>{interest}</Text>
          </View>
        ))}
      </View>
      <View style={styles.videosContainer}>
        <View style={styles.videoContainer}>
          <video id="localVideo" style={styles.video} autoPlay muted playsInline />
        </View>
        <View style={styles.videoContainer}>
          <video id="remoteVideo" style={styles.video} autoPlay muted playsInline />
        </View>
      </View>
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.likeButton}>
          <Text style={styles.likeText}>❤️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextText}>Next ➡️</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}




// import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
// import React, { useState, useEffect, useRef } from 'react';

// // WebSocket URL for signaling server


// export default function Connect() {

//   //const socket = new WebSocket('wss://stream-ses0.onrender.com/');
//   // Use ref for the peer connection to allow reassignment
//   const socket = new WebSocket('ws://localhost:3000');
//   const peerConnection = useRef(new RTCPeerConnection());

//   socket.onmessage = async (event) => {
//     const message = JSON.parse(event.data);

//     if (message.type === 'matched') {
//       if (peerConnection.current.signalingState === "stable") {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//         const localVideoElement = document.getElementById('localVideo');
//         localVideoElement.srcObject = stream;

//         // Add tracks and create an offer
//         stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));
//         const offer = await peerConnection.current.createOffer();
//         await peerConnection.current.setLocalDescription(offer);
//         socket.send(JSON.stringify({ type: 'offer', offer }));
//       } else {
//         console.warn("Cannot create offer, peerConnection is not in stable state:", peerConnection.current.signalingState);
//       }
//     } else if (message.type === 'offer') {
//       if (peerConnection.current.signalingState === "stable" || peerConnection.current.signalingState === "have-local-offer") {
//         await peerConnection.current.setRemoteDescription(new RTCSessionDescription(message.offer));
//         const answer = await peerConnection.current.createAnswer();
//         await peerConnection.current.setLocalDescription(answer);
//         socket.send(JSON.stringify({ type: 'answer', answer }));
//       } else {
//         console.warn("Received offer in unexpected state:", peerConnection.current.signalingState);
//       }
//     } else if (message.type === 'answer') {
//       if (peerConnection.current.signalingState === "have-local-offer") {
//         await peerConnection.current.setRemoteDescription(new RTCSessionDescription(message.answer));
//       } else {
//         console.warn("Received answer in unexpected state:", peerConnection.current.signalingState);
//       }
//     } else if (message.type === 'candidate') {
//       if (peerConnection.current.remoteDescription) {
//         await peerConnection.current.addIceCandidate(new RTCIceCandidate(message.candidate));
//       } else {
//         console.warn("Received ICE candidate but remote description is not set.");
//       }
//     }
//   };
  


// peerConnection.ontrack = (event) =>{
  
//   if(event.streams[0])
//   {
//     console.log("receiving video")
//     const remoteVideoElement = document.getElementById('remoteVideo');
      
//     remoteVideoElement.srcObject = event.streams[0];
//   }

// }

// const handleNext = () => {
//   // Close the current peer connection and reset it
//   if (peerConnection.current) {
//     peerConnection.current.close();
//     peerConnection.current = new RTCPeerConnection();
//   }

//   // Send a message to the server to indicate that this user wants to rejoin the queue
//   socket.send(JSON.stringify({ type: 'next' }));

//   // Reset local and remote video elements
//   const localVideoElement = document.getElementById('localVideo');
//   const remoteVideoElement = document.getElementById('remoteVideo');
//   if (localVideoElement) localVideoElement.srcObject = null;
//   if (remoteVideoElement) remoteVideoElement.srcObject = null;
// };




//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <View>
//           <Text style={styles.profileName}>bijlee Sharma</Text>
//           <Text style={styles.country}>🇮🇳 India</Text>
//         </View>
//         <TouchableOpacity style={styles.closeButton}>
//           <Text style={styles.closeText}>✖️</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Interests */}
//       <View style={styles.interestsContainer}>
//         {['Music', 'Dance', 'Shopping', 'Travel', 'Food'].map((interest) => (
//           <View key={interest} style={styles.interestTag}>
//             <Text style={styles.interestText}>{interest}</Text>
//           </View>
//         ))}
//       </View>

//       {/* Video Placeholders */}
      
//       <View style={styles.videosContainer}>
//         <View style={styles.videoContainer}>
//           <video id="localVideo" style={styles.video} autoPlay muted playsInline />
//         </View>
//         <View style={styles.videoContainer}>
//           <video id="remoteVideo" style={styles.video} autoPlay muted playsInline />
//         </View>
//       </View>

//       {/* Like and Next Buttons */}
//       <View style={styles.actionContainer}>
//         <TouchableOpacity style={styles.likeButton}>
//           <Text style={styles.likeText}>❤️</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
//           <Text style={styles.nextText}>Next ➡️</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#e0f8e6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2b2b2b',
  },
  country: {
    fontSize: 14,
    color: '#2b2b2b',
  },
  closeButton: {
    backgroundColor: '#000',
    borderRadius: 20,
    padding: 5,
  },
  closeText: {
    color: '#fff',
    fontSize: 16,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '90%',
    marginBottom: 20,
  },
  interestTag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 5,
  },
  interestText: {
    fontSize: 12,
    color: '#2b2b2b',
  },
  videosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginBottom: 20,
  },
  videoContainer: {
    width: '45%',
    aspectRatio: 1,
    backgroundColor: '#000',
    borderRadius: 10,
    overflow: 'hidden', // Ensures video stays within rounded corners
  },
  video: {
    width: '100%',
    height: '100%',
    borderRadius: 10, // Matches container for consistent rounding
    objectFit: 'cover', // Ensures video fits within the frame
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '90%',
    marginBottom: 20,
  },
  likeButton: {
    backgroundColor: '#e0ffe0',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeText: {
    fontSize: 28,
    color: '#ff6b6b',
  },
  nextButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#000',
    borderRadius: 20,
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
  },
});




























