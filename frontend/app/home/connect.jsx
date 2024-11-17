import React, {useRef, useEffect, useState, } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons, FontAwesome, Entypo } from '@expo/vector-icons';

const VideoChatScreen = () => {

  const [loading, setLoading] = useState(true);
  const [partnerLeft, setPartnerLeft] = useState(false)
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
        setLoading(false)
        
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
      

      case 'partnerDisconnected':
        setPartnerLeft(true);


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
    while (pendingCandidates.current.length > 0 && stateStore.current.remoteDescriptionSet) {
      try {
        const candidate = pendingCandidates.current.shift();
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
        console.log('Added ICE candidate:', candidate);
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    }
    

    stateStore.current.peerConnectionState = "stable";
  };

  const handleNext = () => {
    // Close current peer connection and reset state
    setLoading(true);
    setPartnerLeft(false);
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
     // Reset candidate queue when moving to the next match
  pendingCandidates.current = [];
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Videos Container */}
      <View style={styles.videosContainer}>
        <View style={styles.videoWrapper}>
          <video id="localVideo" style={{
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: 'scaleX(-1)', // Flip horizontally for a mirrored effect
  }} autoPlay muted playsInline />
        </View>
        <View style={styles.videoWrapper}>
          <video id="remoteVideo" style={{
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: 'scaleX(-1)', // Flip horizontally for a mirrored effect
  }} autoPlay muted playsInline />
          {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}

{partnerLeft && (
        <View style={styles.overlay}>
          
          <Text style={styles.loadingText}>Partner Gone, Press Next!</Text>
        </View>
      )}
      
        </View>
      </View>

      {/* Stop and Next buttons overlay */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.stopButton}>
          <Text style={styles.stopButtonText}>STOP</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>NEXT</Text>
        </TouchableOpacity>
      </View>

      {/* Icons at the bottom */}
      <View style={styles.iconsContainer}>

        
      <Ionicons name="heart-dislike" size={24} color="white" />
      <Entypo name="flag" size={24} color="white" />
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
  overlay: {
    ...StyleSheet.absoluteFillObject, // Fills the entire screen
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent black
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  mirrorVideo: {
    transform: [{ scaleX: -1 }], // Flips the video horizontally
  },
  
  
});

export default VideoChatScreen;
































