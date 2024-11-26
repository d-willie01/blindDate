import React, {useRef, useEffect, useState, } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons, FontAwesome, Entypo } from '@expo/vector-icons';
import { Link } from 'expo-router';

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

        console.log("track drop boi: ", event.streams[0].getTracks())
      
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

    peerConnection.onicecandidateerror = (event) => {
      console.error("ICE Candidate Error:", event);
    };
  };

  const handleSocketMessage = async (event) => {
    const message = JSON.parse(event.data);
    

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
        
        
        
          pendingCandidates.current.push(message.candidate);
        
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
      console.log("prcessing in OFFER", pendingCandidates.current )
      const candidate = pendingCandidates.current.shift();
      await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
    }
    peerConnection.onicecandidateerror = (event) => {
      console.error('ICE Candidate Error in OFFER:', event);
    };

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
      console.log("prcessing in ANSWER", pendingCandidates.current )
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
      <View style={styles.videosContainer}>
        {/* Local Video */}
        <View style={[styles.videoWrapper, styles.topVideoWrapper]}>
          <video
            id="localVideo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'scaleX(-1)',
            }}
            autoPlay
            muted
            playsInline
          />
        </View>
  
        {/* Remote Video */}
        <View style={styles.videoWrapper}>
          <video
            id="remoteVideo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'scaleX(-1)',
            }}
            autoPlay
            muted
            playsInline
          />
          {/* Loader */}
          {loading && (
            <View style={styles.overlay}>
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          )}
          {/* Partner left message */}
          {partnerLeft && (
            <View style={styles.overlay}>
              <Text style={styles.loadingText}>Partner Gone, Press Next!</Text>
            </View>
          )}
        </View>
      </View>
  
      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.stopButton}>
          <Link href={'/home/profile'}>
          <Text style={styles.stopButtonText}>STOP</Text>
          </Link>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>NEXT</Text>
        </TouchableOpacity>
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
    justifyContent: 'space-between',
  },
  videoWrapper: {
    flex: 1,
    backgroundColor: '#000', // Black background for both video screens
    position: 'relative', // Allow absolute positioning for overlay
  },
  topVideoWrapper: {
    borderBottomWidth: 4, // Add dividing line
    borderBottomColor: '#90EE90', // Light green color
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  stopButton: {
    flex: 1,
    borderColor: 'red',
    borderWidth: 2,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  stopButtonText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    flex: 1,
    borderColor: 'green',
    borderWidth: 2,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default VideoChatScreen;
































