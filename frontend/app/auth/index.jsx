import React, {useEffect, useState} from 'react'
import { Link, useRouter } from 'expo-router';
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

//blinderLogo right here
import Logo from '../../assets/images/logo.png';

//Google Logo
import GoogleLogo from '../../assets/images/googleLogo.png';
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';

//update api call
import api from '../../api/apiCalls'

//update auth call
import { auth } from '../../firebaseConfig';
import { signInWithPopup, GoogleAuthProvider, TwitterAuthProvider } from "firebase/auth";




export default function SignInPage() {

  const [loading, setLoading] = useState(false);
  const googleProvider = new GoogleAuthProvider();
  const twitterProvider = new TwitterAuthProvider()

  const router = useRouter();
 

  const saveTokens = async(accessToken, refreshToken) => {

    if(accessToken)
    {
        await AsyncStorage.setItem('accessToken', accessToken);
    }
    if(refreshToken)
    {
        await AsyncStorage.setItem('refreshToken', refreshToken)
    }
}

  
  const sendGoogleToken = async (authentication) => {
    try {
      const response = await api.post('/auth/google', { authentication });
      if (response.status === 200) {
        const { jwtAccessToken, refreshToken, NewUser } = response.data;
        if (NewUser) {
          await saveTokens(jwtAccessToken, refreshToken);
          router.replace('/auth/registration');
        } else {
          await saveTokens(jwtAccessToken, refreshToken);
          router.replace('/home/connect');
        }
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
      setLoading(false);
    }
  };

  const sendTwitterToken = async (authentication) => {
    try {

      console.log("these are the two things twitter needs before they are sent:",authentication.token, authentication.secret   )

      const token = authentication.token
      const secret = authentication.secret

      const response = await api.post('/auth/twitter', { token, secret  });

      console.log(response);





      if (response.status === 200) {
        const { jwtAccessToken, refreshToken, NewUser } = response.data;
        if (NewUser) {
          await saveTokens(jwtAccessToken, refreshToken);
          router.replace('/auth/registration');
        } else {
          await saveTokens(jwtAccessToken, refreshToken);
          router.replace('/home/connect');
        }
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
      setLoading(false);
    }
  };
  



  const handleGoogle = () => {
    signInWithPopup(auth, googleProvider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const idToken = credential.idToken; // Extract the ID token here
    const user = result.user;

    if (idToken) {
      console.log(idToken);
      console.log(user);
      sendGoogleToken(idToken); // Send the ID token, not the access token
    }
  })
  .catch((error) => {
    console.error("Error during Google Sign-In:", error.message);
  });

  };

  const handleTwitter = () => {

    console.log("wtf")
    
    signInWithPopup(auth, twitterProvider)
    .then((result) => {
      const credential = TwitterAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const secret = credential.secret; // Capture the secret

      const user = result.user;

      console.log("This is the twitter user and the token:", user, token);

      // Send both token and secret to the backend
      sendTwitterToken({ token, secret });
    })
    .catch((error) => {
      console.error("Twitter Sign-In Error:", error.message);
    });

  }
  

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
      <TouchableOpacity  onPress={() => {
        
        
        // promptAsync({ useProxy: true }),
        handleGoogle(),
        setLoading(true)
        
        }} style={[styles.authButton, styles.googleButton]}>
        <View style={styles.buttonContent}>
          <Text style={styles.authButtonText}>Sign up with</Text>
          <Image
            source={
              GoogleLogo}
            style={styles.authLogo}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleTwitter} style={[styles.authButton, styles.appleButton]}>
        <View style={styles.buttonContent}>
          <Text style={styles.authButtonText}>Sign up with</Text>
          <Image
            source={{
              uri: 'https://cdn.prod.website-files.com/5d66bdc65e51a0d114d15891/64cebdd90aef8ef8c749e848_X-EverythingApp-Logo-Twitter.jpg',
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
    backgroundColor: '#1E1E1E',
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
    color: '#b9ffb8',
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
    color: 'white',
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

