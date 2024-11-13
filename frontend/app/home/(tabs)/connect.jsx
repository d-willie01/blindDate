
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';

// WebSocket URL for signaling server


export default function Connect() {
  

  
  const socket = new WebSocket('wss://stream-ses0.onrender.com/');

  const peerConnection = new RTCPeerConnection();


  socket.onmessage = async (event) => {
  const message = JSON.parse(event.data);

  if (message.type === 'matched') {

    console.log('This is the message server sending back: ',message)


    // if matched, begin loading local Video Stream to show and send
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    

    //show it to user
    const localVideoElement = document.getElementById('localVideo');
      console.log('This is STREAM #1:', stream)
      localVideoElement.srcObject = stream;

    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
    // Initiate connection if matched
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.send(JSON.stringify({ type: 'offer', offer }));



  
  } else if (message.type === 'offer') {


    console.log('This is the message server sending back: ',message)
    // Only set the remote description if in the correct state
    if (peerConnection.signalingState === "stable") {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.send(JSON.stringify({ type: 'answer', answer }));
    } else {
      console.warn("Received offer while in an unexpected signaling state:", peerConnection.signalingState);
    }

  
  } else if (message.type === 'answer') {

    console.log('This is the message server sending back: ',message)
    console.log('peer state: ', peerConnection.signalingState)
    // Set the answer only if in the correct state
    if (peerConnection.signalingState === "have-local-offer") {
      console.log('we setting the remote as their local baby')
      await peerConnection.setRemoteDescription(new RTCSessionDescription(message.answer));
      
    } else {
      console.warn("Received answer while in an unexpected signaling state:", peerConnection.signalingState);
    }




  
  } else if (message.type === 'candidate') {

    console.log('This is the message server sending back: ',message)
    // Handle ICE candidate only if remote description is set
    if (peerConnection.remoteDescription) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
    } else {
      console.warn("Received ICE candidate but remote description is not set.");
    }
  }
};


peerConnection.ontrack = (event) =>{
  
  if(event.streams[0])
  {
    console.log('eat ass puss boi')
    const remoteVideoElement = document.getElementById('remoteVideo');
      
    remoteVideoElement.srcObject = event.streams[0];
  }

}




  return (
    <ScrollView>
    <View style={styles.container}>
      <Button title="Join" onPress="" />

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
    </ScrollView>
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






















