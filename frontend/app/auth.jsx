import React, {useEffect, useState} from 'react'
import { Link } from 'expo-router';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import Logo from '../assets/images/blinderLogo.png';
import GoogleLogo from '../assets/images/googleLogo.png';
import * as AuthSession from 'expo-auth-session';



export default function SignInPage() {

  const [loading, setLoading] = useState(false);

  console.log(AuthSession.makeRedirectUri({ useProxy: true }))
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GOOGLE_API,
      responseType: "id_token",
      redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
      scopes: ['profile', 'email','openid'], // Adjust scopes if needed
      usePKCE: false, // Ensure PKCE is disabled
    },
    { authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth' }
  );

  useEffect(() => {
    console.log(response)
  }, [response]);

  

  return (

    <Animated.View entering={FadeIn} style={styles.overlay}>
    {/* Dismiss modal when pressing outside */}
    <Link href={'/'} asChild>
      <Pressable style={StyleSheet.absoluteFill} />
    </Link>

    <Animated.View entering={SlideInDown} style={styles.modalContent}>
      {/* App logo */}
      <Image source={Logo} style={styles.logo} />
      <Text style={styles.title}>1v1 connections that last</Text>

      {/* Authentication buttons */}
      <TouchableOpacity  onPress={() => {promptAsync({ useProxy: true }),setLoading(true)}} style={[styles.authButton, styles.googleButton]}>
        <View style={styles.buttonContent}>
          <Text style={styles.authButtonText}>Sign up with</Text>
          <Image
            source={
              GoogleLogo}
            style={styles.authLogo}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.authButton, styles.appleButton]}>
        <View style={styles.buttonContent}>
          <Text style={styles.authButtonText}>Sign up with</Text>
          <Image
            source={{
              uri: 'https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8ed3d547-94ff-48e1-9f20-8c14a7030a02_2000x2000.jpeg',
            }}
            style={styles.authLogo}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.authButton, styles.phoneButton]}>
        <Text style={styles.authButtonText}>Log in with mobile number</Text>
      </TouchableOpacity>

      {/* Footer */}
      <Text style={styles.footerText}>
        By clicking Log In and using our services you accept our{' '}
        <Text style={styles.linkText}>Terms of Service</Text> and agree to our{' '}
        <Text style={styles.linkText}>Privacy Policy</Text>.
      </Text>
    </Animated.View>
    {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
  </Animated.View>
);
    
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000040',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3AC13A',
    marginBottom: 20,
  },
  authButton: {
    width: '100%',
    paddingVertical: 15,
    marginVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  googleButton: {
    backgroundColor: '#4254f4',
  },
  appleButton: {
    backgroundColor: '#000',
  },
  phoneButton: {
    backgroundColor: '#3AC13A',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 8, // Adds space between text and logo
  },
  authLogo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  footerText: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
  linkText: {
    color: '#4285F4',
    textDecorationLine: 'underline',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 10,
  }
});

