
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';

// WebSocket URL for signaling server


export default function Connect() {
  

  
  const socket = new WebSocket('wss://stream-ses0.onrender.com/');
  //const socket = new WebSocket('ws://localhost:3000');
  const peerConnection = new RTCPeerConnection();


  socket.onmessage = async (event) => {
    const message = JSON.parse(event.data);
  
    if (message.type === 'matched') {
      // Proceed only if in a stable state (no remote offer exists)
      if (peerConnection.signalingState === "stable") {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const localVideoElement = document.getElementById('localVideo');
        localVideoElement.srcObject = stream;
  
        // Add tracks and create an offer
        stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.send(JSON.stringify({ type: 'offer', offer }));
      } else {
        console.warn("Cannot create offer, peerConnection is not in stable state:", peerConnection.signalingState);
      }
    } else if (message.type === 'offer') {
      // Check if remote description can be set
      if (peerConnection.signalingState === "stable" || peerConnection.signalingState === "have-local-offer") {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.send(JSON.stringify({ type: 'answer', answer }));
      } else {
        console.warn("Received offer in unexpected state:", peerConnection.signalingState);
      }
    } else if (message.type === 'answer') {
      // Only set the remote description if there's a local offer
      if (peerConnection.signalingState === "have-local-offer") {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(message.answer));
      } else {
        console.warn("Received answer in unexpected state:", peerConnection.signalingState);
      }
    } else if (message.type === 'candidate') {
      // Add ICE candidate only if the remote description is already set
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
    console.log("receiving video")
    const remoteVideoElement = document.getElementById('remoteVideo');
      
    remoteVideoElement.srcObject = event.streams[0];
  }

}




  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.profileName}>bijlee Sharma</Text>
          <Text style={styles.country}>🇮🇳 India</Text>
        </View>
        <TouchableOpacity style={styles.closeButton}>
          <Text style={styles.closeText}>✖️</Text>
        </TouchableOpacity>
      </View>

      {/* Interests */}
      <View style={styles.interestsContainer}>
        {['Music', 'Dance', 'Shopping', 'Travel', 'Food'].map((interest) => (
          <View key={interest} style={styles.interestTag}>
            <Text style={styles.interestText}>{interest}</Text>
          </View>
        ))}
      </View>

      {/* Video Placeholders */}
      
      <View style={styles.videosContainer}>
        <View style={styles.videoContainer}>
          <video id="localVideo" style={styles.video} autoPlay muted playsInline />
        </View>
        <View style={styles.videoContainer}>
          <video id="remoteVideo" style={styles.video} autoPlay muted playsInline />
        </View>
      </View>

      {/* Like and Next Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.likeButton}>
          <Text style={styles.likeText}>❤️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton}>
          <Text style={styles.nextText}>Next ➡️</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}


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




























