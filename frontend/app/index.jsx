import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import React from 'react'
import { Link } from 'expo-router'

export default function index() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuIcon}>
          <Text style={styles.menuText}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.title}>BLIND DATE</Text>
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Images */}
      <View style={styles.imagesContainer}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: 'faceShot' }} style={styles.image} />
        </View>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: 'faceShot' }} style={styles.image} />
        </View>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: 'faceShot' }} style={styles.image} />
        </View>
      </View>

      {/* Main Text */}
      <Text style={styles.mainText}>BLIND DATE VIDEO CHAT</Text>
      <Text style={styles.subText}>1v1Chat - Real People, Real Connections</Text>

      {/* Buttons */}
      <Link href={'/home'}>
      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.startButtonText}>Start Dating</Text>
        
      </TouchableOpacity>
      </Link>
      <TouchableOpacity style={styles.downloadButton}>
        <Text style={styles.downloadButtonText}>Download App</Text>
      </TouchableOpacity>
    </ScrollView>
  )
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
    width: '90%',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  menuIcon: {
    padding: 10,
  },
  menuText: {
    fontSize: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2b2b2b',
  },
  loginButton: {
    backgroundColor: '#000',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  loginText: {
    color: '#fff',
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
    backgroundColor: '#e0f8e6',
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
    color: '#2b2b2b',
    marginVertical: 10,
  },
  subText: {
    fontSize: 14,
    color: '#2b2b2b',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#b9ffb8',
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
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
  },
  downloadButtonText: {
    fontSize: 18,
    color: '#fff',
  },
});