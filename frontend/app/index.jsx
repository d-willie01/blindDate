import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { Link } from 'expo-router';
import Logo from '../assets/images/blinderLogo.png';
import * as WebBrowser from 'expo-web-browser';
import comingSoon from '../assets/images/comingSoon.png'
import { auth } from '../firebaseConfig';

WebBrowser.maybeCompleteAuthSession();

export default function index() {
  const bobbingAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create the bobbing animation effect
    const bobbing = Animated.loop(
      Animated.sequence([
        Animated.timing(bobbingAnimation, {
          toValue: -10, // Move the button 10 units up
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(bobbingAnimation, {
          toValue: 0, // Move the button back to its original position
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );

    bobbing.start(); // Start the animation loop
    return () => bobbing.stop(); // Cleanup when the component is unmounted
  }, []);


  const authO = () =>{


console.log(auth);

  }

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Image style={styles.logo} source={Logo} />
          <Link href={'/auth'}>
            <TouchableOpacity style={styles.loginButton}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Profile Images */}
        <View style={styles.imagesContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: 'https://cdn2.stylecraze.com/wp-content/uploads/2013/06/Different-Beautiful-American-Girls.jpg',
              }}
              style={styles.image}
            />
          </View>
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: 'https://t3.ftcdn.net/jpg/06/95/65/86/360_F_695658623_qQOKTAa5f0NJ9QIvwDoImSiYGQvRbltI.jpg',
              }}
              style={styles.image}
            />
          </View>
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa_giq5ZzKgf_VqDfEZGyFHl9TH0dkiyZH5tkIqN55B7Y7bnnI8kuKyOq-N4y6ov7cGe4&usqp=CAU',
              }}
              style={styles.image}
            />
          </View>
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwuwRiZVscOhwKhyHTXcqd_Q0_U90Npu5WTg&s',
              }}
              style={styles.image}
            />
          </View>
        </View>

        {/* Main Text */}
        <Text style={styles.mainText}>BLIND DATE VIDEO CHAT</Text>
        <Text style={styles.subText}>1v1Chat - Real People, Real Connections</Text>

        {/* Buttons */}
        <Link href={'/auth'}>
          <Animated.View style={[styles.startButton, { transform: [{ translateY: bobbingAnimation }] }]}>
            <Text style={styles.startButtonText}>Start BLINDER</Text>
          </Animated.View>
        </Link>
        
        <TouchableOpacity onPress={authO} style={styles.downloadButton}>
          <Text style={styles.downloadButtonText}>Download App</Text>
        </TouchableOpacity>

        <View style={{
          //borderWidth:3
        }}>
        <Image style={{
          height:100,
          width:100,
          resizeMode: 'contain',
        }}source={comingSoon}/>
        </View>
        
      {/* Bottom Header with Social Media Logos */}
      <View style={styles.bottomHeader}>
        <View style={styles.socialMediaWrapper}>
          <Image
            source={{ uri: 'https://i.etsystatic.com/7628211/r/il/bf5665/5167793793/il_570xN.5167793793_f4yw.jpg' }} // Twitter logo
            style={styles.socialLogo}
          />
          <Image
            source={{ uri: 'https://i.pinimg.com/originals/b6/c9/dd/b6c9dda4b3983c5ecba8cf867a01bc6f.png' }} // TikTok logo
            style={styles.socialLogo}
          />
          <Image
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png' }} // Instagram logo
            style={styles.socialLogo}
          />
        </View>
      </View>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
    position: 'relative', // To position the bottom header absolutely
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#1E1E1E', // Dark background to match registration screen
    paddingBottom: 120, // Adjust space to accommodate the bottom header (more space for scrollable content)
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logo: {
    flex: 2,
    width: 150,
    height: 80,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  loginButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#b9ffb8', // Green border
    backgroundColor: '#1A1A1A', // Dark background for button
  },
  loginText: {
    color: '#b9ffb8', // Light green text
    fontSize: 14,
  },
  imagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginBottom: 20,
  },
  imageWrapper: {
    width: 90,
    height: 130,
    backgroundColor: '#1E1E1E', // Dark background for image wrappers
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mainText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', // White text to contrast with dark background
    marginVertical: 10,
  },
  subText: {
    fontSize: 14,
    color: '#b9ffb8', // Green text to match the theme
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#b9ffb8', // Green button
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
    marginBottom: 15,
  },
  startButtonText: {
    fontSize: 18,
    color: '#000',
  },
  downloadButton: {
    backgroundColor: '#000', // Dark background
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
  },
  downloadButtonText: {
    fontSize: 18,
    color: '#fff', // White text for download button
  },
  bottomHeader: {
    position: 'absolute', // Fix the bottom header to the bottom of the screen
    bottom: 0, // Place it at the very bottom
    backgroundColor: '#1E1E1E', // Dark background matching the theme
    width: '100%',
    borderTopColor: "#b9ffb8", // Green border at the top
    borderWidth: 1,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialMediaWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  socialLogo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    borderRadius: 5,
  },
});






