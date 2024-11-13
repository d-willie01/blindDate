
import { View, Text, StyleSheet, Button } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';

// WebSocket URL for signaling server


export default function Connect() {
  const [isRemoteVideoOn, setIsRemoteVideoOn] = useState(false);
  const remoteUrl = useRef('ass')
  const socket = new WebSocket('ws://localhost:3000');
  const peerConnection = new RTCPeerConnection();

  // Handling WebSocket messages
  useEffect(() => {
    socket.onmessage = async (event) => {
      console.log(event.data)
      const message = JSON.parse(event.data);

      if (message.type === 'offer') {
        await handleOffer(message.offer);
      } else if (message.type === 'answer') {
        await handleAnswer(message.answer);
      } else if (message.type === 'candidate') {
        handleCandidate(message.candidate);
      }
    };
  }, []);

  useEffect(() => {
    console.log("Component has mounted, remoteUrl:", remoteUrl.current);
  }, []);  // Empty dependency array means this runs only once after component mounts
  



  const startConnection = async () => {

    

    

    try {

      //get local video stream and make viewable
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

      const localVideoElement = document.getElementById('localVideo');
      console.log('This is STREAM #1:', stream)
      localVideoElement.srcObject = stream;

  

    // Handle ICE candidates and send to server
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
      }
    };

    peerConnection.ontrack = (event) => {
      console.log("this is an onTrack log:", event);
    
      if (event.streams[0]) {
        console.log('This is STREAM #2:', event.streams[0].getTracks());
  
        const remoteVideoElement = document.getElementById('remoteVideo');
      
      remoteVideoElement.srcObject = event.streams[0];
    
        
        
      }
    
      setIsRemoteVideoOn(true);
    };
    

    // Create and send offer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    console.log(offer)
    socket.send(JSON.stringify({ type: 'offer', offer }));
    } catch (error) {
      console.log(error);
    }

  };






  // Handle offer from other peer
  const handleOffer = async (offer) => {
    try {
      console.log('Received offer:', offer);
  
      // Set the remote description with the received offer first
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      
      // Then create and send an answer
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.send(JSON.stringify({ type: 'answer', answer }));
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  };

  // Handle answer from other peer
  const handleAnswer = async (answer) => {
    console.log('This is an snswer: ', answer);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  };

  // Handle ICE candidates
  const handleCandidate = (candidate) => {
    try {
      console.log('Received ICE candidate:', candidate);
  
      // Add the ICE candidate only if remote description is set
      if (peerConnection.remoteDescription) {
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
          .catch(error => console.error('Error adding ICE candidate:', error));
      } else {
        console.warn("Remote description is not set yet, ignoring candidate");
      }
    } catch (error) {
      console.error('Error handling candidate:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Join" onPress={startConnection} />

      {/* Display the local video */}
      <video id="localVideo" style={styles.video} autoPlay muted playsInline />

      {/* Render remote video only when ready */}
      
        <video
          id='remoteVideo'
          style={styles.video}
          autoPlay
          muted
          playsInline
        />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
  video: {
    width: 300,
    height: 200,
    backgroundColor: 'black',
    marginTop: 10,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
});
















// import { View, Text, StyleSheet, Button } from 'react-native'
// import React, {useEffect, useState, useRef} from 'react'
// import { types } from '@babel/core'

// export default function connect() {
  
//   const [isRemoteVideoOn, setisRemoteVideoOn] = useState(false)

//   const remoteUrl = useRef(null);
//   const socket = new WebSocket('ws://localhost:3000')

  
//   useEffect(() =>{

    

//     socket.onopen = () =>{
//       console.log('WebSocket connection established')
//     }

//     socket.onclose = () =>{
//       console.log('WebSocket connection closed')
//     }

//     socket.onmessage = async(event) =>{
//       console.log('Received Something:', event)
//       if (event.data)
//       {
//         console.log('we are inside stepmom')
//       }
//       else
//       {
//         try {
//           const message = JSON.parse(event.data);
    
//           switch (message.type) {
//             case 'offer':
//               await handleOffer(message.offer);
//               break;
//             case 'answer':
//               await handleAnswer(message.answer);
//               break;
//             case 'candidate':
//               await handleCandidate(message.candidate);
//               break;
//             default:
//               console.warn('Unknown message type:', message.type);
//           }
//         } catch (error) {
//           console.error('Error parsing message:', error);
//         }
//       }
//     }

//   },[])

//   const getLocalData = async () =>{
//     try {

//         //this function receives the audio and video from whatever device is being used
//         const stream = await navigator.mediaDevices.getUserMedia({video:true, audio:true})
        

//         const localStream = document.getElementById('localVideo');

//         //this sets that exact stream to the canvas video tag
//         localStream.srcObject = stream

//         //create new class for peers
//         const peerConnection = new RTCPeerConnection();

        

//         //load the class with the audio and video stream from the local device to send to the peer
//         stream.getTracks().forEach(track => {
          
//           peerConnection.addTrack(track, stream)
          
//         });
//         //ability to connect through firewalls and ips
//         peerConnection.onicecandidate = (event) =>{
//           if(event.candidate)
//           {
//             console.log(event.candidate)
//             socket.send(JSON.stringify({type:'candidate', candidate: event.candidate}))
//           }
//         }

//         //event of receiving the remote track
//         peerConnection.ontrack = (event) =>{
//           console.log('remote track received', event)

//           if(event.streams)
//           {
//             //event at the first array positions should be the stream for the remote video
//             remoteUrl.current = event.streams[0]
//             const remoteStream = document.getElementById('remoteVideo');

//             remoteStream.srcObject = remoteUrl.current
//             setisRemoteVideoOn(true);

//           }
//           else
//           {
//             console.log('error setting the track to the html div')
//           }
        
//         }
    
//     //function sending information to the server so another person can connect
//     const offer = await peerConnection.createOffer()
//     console.log(offer)
//     socket.send(JSON.stringify({types:'offer', offer}))

//     } catch (error) {
//       console.log(error)
//     }

//   }

  












//   return (
//     <View style={styles.container}>
//       <Button title="Join" onPress={getLocalData} />

//       {/* Display the local video */}
//       <video id="localVideo" style={styles.video} autoPlay muted playsInline />

//       {/* Render remote video only when ready */}
//       {isRemoteVideoOn ? (
//         <video
//           id="remoteVideo"
//           ref={remoteUrl}
//           style={styles.video}
//           autoPlay
//           muted
//           playsInline
//           onLoadedMetadata={() => console.log('Remote video metadata loaded')}
//         />
//       ) : (
//         <Text style={styles.text}>Waiting for remote video...</Text>
//       )}
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f7f7f7',
//   },
//   video: {
//     width: 300,
//     height: 200,
//     backgroundColor: 'black',
//     marginTop: 10,
//   },
//   text: {
//     marginTop: 20,
//     fontSize: 16,
//     color: '#333',
//   },
// });






















