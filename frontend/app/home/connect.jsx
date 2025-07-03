import React, {useRef, useEffect, useState,  } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, Image, Platform } from 'react-native';
import { Ionicons, FontAwesome, Entypo } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import api from '../../api/apiCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from '../../assets/images/logo.png'

const getWebSocketUrl = () => {
  if (Platform.OS === 'web') {
    return process.env.NODE_ENV === 'development'
      ? 'ws://localhost:3000'
      : 'https://blinddate.onrender.com';
  }
  return 'https://blinddate.onrender.com'; // Default to production URL for native
};

const VideoChatScreen = () => {

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [partnerLeft, setPartnerLeft] = useState(false)
  const [premiumStatus, setPremiumStatus] = useState(false);
  const [user, setUser] = useState();
  const [token, setToken] = useState();
  const [preference, setPreference] = useState('both');





  const socket = useRef(null);
  const peerConnection = useRef(null);
  const pendingCandidates = useRef([]); // Buffer for ICE candidates
  const stateStore = useRef({
    peerConnectionState: "new",
    remoteDescriptionSet: false,
  });
  
  useEffect(() => {

    const fetchUserData = async() =>{

      try {
      const response = await api.get("/user/self");

     
    
      setPremiumStatus(response.data.premiumStatus);
      setUser(response.data.user)
     
      
      await AsyncStorage.removeItem('user');
      await AsyncStorage.setItem('user', JSON.stringify(response.data));

      await AsyncStorage.removeItem('premium');

      const premium = response?.data?.premiumStatus ?? false;
      await AsyncStorage.setItem('premium', JSON.stringify(premium));
      } catch (error) {
        if(error)
        {
          // alert('please login')
          //   router.replace('/')
        }
      }

      const getToken = await AsyncStorage.getItem('accessToken');
      setToken(getToken);

    }
    fetchUserData();
    

    const initializeWebSocket = () => {
      const wsUrl = getWebSocketUrl();
      console.log('Connecting to WebSocket:', wsUrl);
      
      socket.current = new WebSocket(wsUrl);

      socket.current.onmessage = handleSocketMessage;

      socket.current.onopen = async() => {
        console.log('WebSocket connected');
        setLoading(false);
        try {
          const getUserInfoRaw = await AsyncStorage.getItem('user');
          const getUserPreferencesRaw = await AsyncStorage.getItem('preferences');
          const getUserPremiumRaw = await AsyncStorage.getItem('premium');

          if (!getUserInfoRaw) {
            console.error('No user info found');
            return;
          }

          const userInfo = JSON.parse(getUserInfoRaw);
          const userGenderPreferences = getUserPreferencesRaw ? JSON.parse(getUserPreferencesRaw) : 'any';
          const userPremium = getUserPremiumRaw ? JSON.parse(getUserPremiumRaw) : false;

          const userPreferences = {
            _id: userInfo.user.email,
            gender: userInfo.user.gender,
            lookingFor: userPremium ? userGenderPreferences : 'any',
            name: userInfo.user.name
          };

          socket.current.send(JSON.stringify({
            type: 'auth',
            userPreferences
          }));
        } catch (error) {
          console.error('Error in WebSocket onopen:', error);
        }
      };

      socket.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setLoading(false);
      };

      socket.current.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        setLoading(true);
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          if (socket.current?.readyState === WebSocket.CLOSED) {
            console.log('Attempting to reconnect...');
            initializeWebSocket();
          }
        }, 5000);
      };
    };

    initializeWebSocket();

    // Cleanup function
    return () => {
      if (socket.current) {
        socket.current.close();
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }
      // Clean up any existing media streams
      const remoteVideo = document.getElementById('remoteVideo');
      if (remoteVideo && remoteVideo.srcObject) {
        remoteVideo.srcObject.getTracks().forEach(track => track.stop());
        remoteVideo.srcObject = null;
      }
    };
  }, []);


 

  const initializePeerConnection = () => {
    try {
      if (peerConnection.current) {
        peerConnection.current.close();
      }
      
      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          { urls: 'stun:stun3.l.google.com:19302' },
          { urls: 'stun:stun4.l.google.com:19302' },
          // Add TURN server for better connectivity
          {
            urls: 'turn:numb.viagenie.ca',
            username: 'webrtc@live.com',
            credential: 'muazkh'
          }
        ],
        iceCandidatePoolSize: 10
      };
      
      peerConnection.current = new RTCPeerConnection(configuration);
      stateStore.current.peerConnectionState = "new";
      stateStore.current.remoteDescriptionSet = false;
      pendingCandidates.current = []; // Clear any existing candidates

      // ICE Candidate handling
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.current.send(JSON.stringify({ 
            type: 'ice-candidate', 
            candidate: event.candidate 
          }));
        }
      };

      // Connection state changes
      peerConnection.current.onconnectionstatechange = () => {
        const state = peerConnection.current.connectionState;
        console.log('Connection state changed:', state);
        
        switch (state) {
          case 'connected':
            setLoading(false);
            break;
          case 'disconnected':
          case 'failed':
            console.log('Connection failed or disconnected, attempting to reconnect...');
            handleConnectionFailure();
            break;
          case 'closed':
            cleanupConnection();
            break;
        }
      };

      // ICE connection state changes
      peerConnection.current.oniceconnectionstatechange = () => {
        console.log('ICE connection state changed:', peerConnection.current.iceConnectionState);
        if (peerConnection.current.iceConnectionState === 'failed') {
          console.log('ICE connection failed, attempting to reconnect...');
          handleConnectionFailure();
        }
      };

      // Signaling state changes
      peerConnection.current.onsignalingstatechange = () => {
        console.log('Signaling state changed:', peerConnection.current.signalingState);
      };

      // Track event for remote media
      peerConnection.current.ontrack = (event) => {
        console.log('Received remote track:', event.track.kind);
        try {
          if (event.streams && event.streams[0]) {
            const remoteVideoElement = document.getElementById('remoteVideo');
            if (remoteVideoElement) {
              remoteVideoElement.srcObject = event.streams[0];
              remoteVideoElement.onloadedmetadata = () => {
                remoteVideoElement.play().catch(error => {
                  console.error('Error playing video:', error);
                  handleMediaError(error);
                });
              };
            } else {
              console.error('Remote video element not found');
            }
          } else {
            console.error('No streams found in track event');
          }
        } catch (error) {
          console.error('Error handling remote track:', error);
          handleMediaError(error);
        }
      };

    } catch (error) {
      console.error('Error initializing peer connection:', error);
      handleConnectionFailure();
    }
  };

  const handleConnectionFailure = () => {
    setLoading(true);
    cleanupConnection();
    
    // Wait a moment before attempting to reconnect
    setTimeout(() => {
      if (socket.current?.readyState === WebSocket.OPEN) {
        handleNext();
      } else {
        // If WebSocket is closed, attempt to reconnect
        initializeWebSocket();
      }
    }, 2000);
  };

  const cleanupConnection = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    const remoteVideo = document.getElementById('remoteVideo');
    if (remoteVideo && remoteVideo.srcObject) {
      remoteVideo.srcObject.getTracks().forEach(track => track.stop());
      remoteVideo.srcObject = null;
    }

    const localVideo = document.getElementById('localVideo');
    if (localVideo && localVideo.srcObject) {
      localVideo.srcObject.getTracks().forEach(track => track.stop());
      localVideo.srcObject = null;
    }
  };

  const handleMediaError = (error) => {
    console.error('Media error:', error);
    setLoading(true);
    
    // Attempt to restart media connection
    if (peerConnection.current && peerConnection.current.connectionState === 'connected') {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          const localVideoElement = document.getElementById('localVideo');
          if (localVideoElement) {
            localVideoElement.srcObject = stream;
            stream.getTracks().forEach(track => 
              peerConnection.current.addTrack(track, stream)
            );
          }
        })
        .catch(error => {
          console.error('Failed to get user media:', error);
          handleConnectionFailure();
        });
    } else {
      handleConnectionFailure();
    }
  };

  const handleSocketMessage = async (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log('Received message type:', message.type);

      switch (message.type) {
        case 'matched':
          setLoading(false);
          if (stateStore.current.peerConnectionState === "new" || stateStore.current.peerConnectionState === "stable") {
            await handleMatched();
          }
          break;

        case 'offer':
          if (!message.offer) {
            console.error('Received offer message without offer data');
            return;
          }
          await handleOffer(message.offer);
          break;

        case 'answer':
          if (!message.answer) {
            console.error('Received answer message without answer data');
            return;
          }
          await handleAnswer(message.answer);
          break;

        case 'ice-candidate':
          if (!message.candidate) {
            console.error('Received ice-candidate message without candidate data');
            return;
          }
          if (peerConnection.current && peerConnection.current.remoteDescription) {
            try {
              await peerConnection.current.addIceCandidate(new RTCIceCandidate(message.candidate));
            } catch (err) {
              console.error('Error adding received ice candidate:', err);
            }
          } else {
            pendingCandidates.current.push(message.candidate);
          }
          break;

        case 'waiting':
          console.log('Waiting for match...');
          setLoading(true);
          break;

        case 'partnerDisconnected':
          setPartnerLeft(true);
          break;

        default:
          console.warn('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error handling socket message:', error);
    }
  };

  const handleMatched = async () => {
    try {
      if (!peerConnection.current) initializePeerConnection();

      console.log('Getting user media...');
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      console.log('Got local stream:', stream.getTracks().map(t => t.kind));
      
      const localVideoElement = document.getElementById('localVideo');
      if (localVideoElement) {
        localVideoElement.srcObject = stream;
        console.log('Set local video source');
      } else {
        console.error('Local video element not found');
      }

      // Add tracks and create an offer
      stream.getTracks().forEach(track => {
        console.log('Adding track to peer connection:', track.kind);
        peerConnection.current.addTrack(track, stream);
      });

      console.log('Creating offer...');
      const offer = await peerConnection.current.createOffer();
      console.log('Setting local description...');
      await peerConnection.current.setLocalDescription(offer);
      stateStore.current.peerConnectionState = "have-local-offer";

      console.log('Sending offer via WebSocket...');
      socket.current.send(JSON.stringify({ type: 'offer', offer }));
    } catch (error) {
      console.error('Error in handleMatched:', error);
      handleConnectionFailure();
    }
  };

  const handleOffer = async (offer) => {
    try {
      if (!peerConnection.current) initializePeerConnection();

      // Check if we're in a valid state to set remote description
      if (peerConnection.current.signalingState !== 'stable') {
        console.warn('Peer connection not in stable state for setting remote offer:', peerConnection.current.signalingState);
        return;
      }

      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
      stateStore.current.remoteDescriptionSet = true;

      // Process buffered candidates
      while (pendingCandidates.current.length > 0) {
        const candidate = pendingCandidates.current.shift();
        if (peerConnection.current.remoteDescription) {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      }

      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      stateStore.current.peerConnectionState = "stable";

      socket.current.send(JSON.stringify({ type: 'answer', answer }));
    } catch (error) {
      console.error('Error handling offer:', error);
      handleConnectionFailure();
    }
  };

  const handleAnswer = async (answer) => {
    try {
      if (!peerConnection.current) {
        console.error('No peer connection when trying to handle answer');
        return;
      }

      // Only set remote description if we're in the right state
      if (peerConnection.current.signalingState !== 'have-local-offer') {
        console.warn('Peer connection not in correct state for setting remote answer:', peerConnection.current.signalingState);
        return;
      }

      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
      stateStore.current.remoteDescriptionSet = true;

      // Process buffered candidates
      while (pendingCandidates.current.length > 0 && stateStore.current.remoteDescriptionSet) {
        try {
          const candidate = pendingCandidates.current.shift();
          if (peerConnection.current.remoteDescription) {
            await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
          }
        } catch (error) {
          console.error('Error adding ICE candidate:', error);
        }
      }

      stateStore.current.peerConnectionState = "stable";
    } catch (error) {
      console.error('Error handling answer:', error);
      handleConnectionFailure();
    }
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
    // const localVideoElement = document.getElementById('localVideo');
    const remoteVideoElement = document.getElementById('remoteVideo');
    // if (localVideoElement) localVideoElement.srcObject = null;
    if (remoteVideoElement) remoteVideoElement.srcObject = null;
     // Reset candidate queue when moving to the next match
  pendingCandidates.current = [];
  };

  const handleFilterType = () =>{

    socket.current.close();
    if(premiumStatus)
      {
        socket.current.close()
        router.push('/home/filters/filterPremium')
      }
      else
      {
        socket.current.close()
        router.push('/home/filters/filterFree')
      }
    


  }
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
              <Link href={'/home/coins'}style={styles.coinBadge} onPress={() => 
                {
                  
                  //console.log('Coin badge clicked')
                  socket.current.close()


                }
                }>
      <Text style={styles.coinCount}>{user?.tokenCount}</Text>
      <View style={styles.coinIcon} />
    </Link>
        </View>


        <View style={styles.logoBadge}>
          <Image resizeMode='contain' source={Logo} style={{
            height:40,
            width:40,
            
          }}/>

        </View>
  
        {/* Remote Video */}
        <View style={styles.videoWrapper}>

        <View style={styles.remoteVideoPreferences}>
  {/* Girl Option */}
  <TouchableOpacity >
    <View style={[styles.preferenceOption, preference === 'female' && styles.selectedPreference]}>
      <Text style={styles.emojiText}>👩‍🦰</Text>
      <Text style={styles.preferenceLabel}>Female</Text>
    </View>
  </TouchableOpacity>

  {/* Boy Option */}
  <TouchableOpacity >
    <View style={[styles.preferenceOption, preference === 'male' && styles.selectedPreference]}>
      <Text style={styles.emojiText}>👨</Text>
      <Text style={styles.preferenceLabel}>Male</Text>
    </View>
  </TouchableOpacity>

  {/* Both Option */}
  <TouchableOpacity >
    <View style={[styles.preferenceOption, preference === 'both' && styles.selectedPreference]}>
      <Text style={styles.preferenceLabel}>Both</Text>
    </View>
  </TouchableOpacity>
</View>

          <video
            id="remoteVideo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'scaleX(-1)',
            }}
            autoPlay
            
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

       {/* Filters Overlay */}
       <View style={styles.filtersOverlay}>
  <TouchableOpacity onPress={handleFilterType} style={{ flex: 1 }}>
    <View style={styles.filterOption}>
      <Text style={styles.filterText}>👫 Gender</Text>
    </View>
  </TouchableOpacity>

  <View style={styles.filterDivider} />

  <TouchableOpacity onPress={handleFilterType} style={{ flex: 1 }}>
    <View style={styles.filterOption}>
      <Text style={styles.filterText}>Filter</Text>
    </View>
  </TouchableOpacity>
</View>

  
      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => socket.current.close()} style={styles.stopButton}>
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
    backgroundColor: "#1E1E1E",
  },
  videosContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  videoWrapper: {
    flex: 1,
    backgroundColor: "#1E1E1E", // Black background for both video screens
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
    padding: 5,
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
    borderColor: "#b9ffb8",
    borderWidth: 2,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  nextButtonText: {
    color: "#b9ffb8",
    fontSize: 16,
    fontWeight: 'bold',
  },
  filtersOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Distribute space evenly
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent black
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10, // Rounded edges for a softer appearance
    marginHorizontal: 10,
    marginBottom: 5, // Spacing from the bottom buttons
    flexWrap: 'wrap', // Allow items to wrap if space is limited
  },
  filterOption: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5, // Add spacing between options
    paddingVertical: 5, // Padding for touch-friendly size
  },
  filterText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center', // Center text inside the option
  },
  filterDivider: {
    width: 1,
    height: '70%', // Adjust height to make it proportional
    backgroundColor: '#ffffff',
    opacity: 0.5,
    marginHorizontal: 5, // Add spacing between the divider and options
  },
  coinBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6FFF6F',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)' // Adds shadow for Android
  },
  logoBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    //backgroundColor: '#6FFF6F',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)' // Adds shadow for Android
  },
  coinCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 5,
  },
  coinIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#FFD700', // Gold color for the coin
    borderRadius: 10,
    boxShadow: '0px 0px 5px rgba(255, 215, 0, 0.9)',
  },
  remoteVideoPreferences: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    zIndex: 2, // Ensure they appear above the video
  },
  
  preferenceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#444',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 8,
    minWidth: 60, // Ensure a consistent width for all buttons
  },
  
  selectedPreference: {
    backgroundColor: '#6FFF6F', // Highlight color when selected
  },
  
  emojiText: {
    fontSize: 18, // Smaller size for emojis
    marginRight: 5,
    color: '#fff',
  },
  
  preferenceLabel: {
    fontSize: 14, // Smaller text for labels
    color: '#fff',
    fontWeight: 'bold',
  },
 
});
export default VideoChatScreen;
