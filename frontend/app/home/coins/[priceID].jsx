import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import Confetti from 'react-native-simple-confetti';
import Coins from '../../../assets/images/goldCoins.png'
import oneCoin from '../../../assets/images/goldCoin.png'
import Logo from '../../../assets/images/logo.png'
import { useRouter } from 'expo-router';

export default function priceID() {

  router = useRouter()

  const handleLinkButton = () =>{

    router.replace('/home/connect');
    
   
  }
  return (


    <View style={{
      
      flex:1,
      backgroundColor:'#1E1E1E'

    }}>

      <View style={{
        backgroundColor: '#4CAF50', // Green button
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        
        
      }}>
               <TouchableOpacity style={{
                
               }} onPress={handleLinkButton}>
       <Text style={{ textAlign:"center", color: 'white', fontSize: 16, fontWeight: 'bold', }}>Start Linking</Text>
       </TouchableOpacity>

      </View>

      <View
     style={{
      
       
       //backgroundColor:'red',
      
       alignItems: 'center', // Centers horizontally
       justifyContent: 'center', // Centers vertically
       //paddingHorizontal: 20, // Adds spacing for better responsiveness
     }}
     
   >


<Image resizeMode='contain' source={Logo} style={{
  
       height:150,
       width:150,
       
     }}/>

<Text
       style={{
        color:'white',
         fontWeight: 'bold',
         fontSize: 40, // Adjust for better text size balance
         textAlign: 'center', // Centers text within the container
         // Space between the title and subheading
       }}
     >
       Congratulations on Your Purchase!
     </Text>

     <Text
       style={{
        color:'white',
         fontSize: 20,
         textAlign: 'center', // Centers the subheading
         marginBottom: 20, // Space between the subheading and button
       }}
     >
       Use your {""} <Image resizeMode='contain'
       style={{
         height:25,
         width:25,
         
       }} source={Coins}/> to start linking and explore more features...
     </Text>


     
   </View>

<View style={{position:'absolute',
  width:'100%'
}}>
<Confetti start={1500} itemSize={50} images={[oneCoin]} count={75} type="tumble" />
</View>
          

    </View>

 
 )
  
}

const styles = (darkMode) =>
  StyleSheet.create({
    container: {
      
    },
    confettiContainer: {
      borderWidth:5,
      flex: 1,
      backgroundColor: darkMode ? '#1E1E1E' : '#F9F9F9',
      justifyContent:"center",
      alignItems:"center"
    },
    header: {
      padding: 16,
      backgroundColor: darkMode ? '#2B2B2B' : '#FFFFFF',
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    coinBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#6FFF6F',
      borderRadius: 20,
      paddingVertical: 5,
      paddingHorizontal: 10,
    },
    coinCount: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginRight: 5,
    },
    coinIcon: {
      width: 20,
      height: 20,
      backgroundColor: '#FFD700',
      borderRadius: 10,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      padding: 8,
    },
    card: {
      width: '45%',
      backgroundColor: darkMode ? '#333333' : '#FFFFFF',
      borderRadius: 8,
      padding: 12,
      margin: 8,
      alignItems: 'center',
      borderColor: darkMode ? '#555555' : '#DDDDDD',
      borderWidth: 1,
    },
    selectedCard: {
      borderColor: '#6FFF6F',
      borderWidth: 2,
    },
    coinAmount: {
      fontSize: 18,
      fontWeight: 'bold',
      color: darkMode ? '#FFFFFF' : '#000000',
      marginBottom: 8,
    },
    coinImage: {
      width: 50,
      height: 50,
      marginBottom: 8,
    },
    oldPrice: {
      fontSize: 14,
      color: '#888888',
      textDecorationLine: 'line-through',
    },
    price: {
      fontSize: 16,
      fontWeight: 'bold',
      color: darkMode ? '#FFFFFF' : '#333333',
    },
    purchaseButton: {
      backgroundColor: '#6FFF6F',
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: 'center',
      margin: 16,
    },
    disabledPurchaseButton: {
      backgroundColor: '#555555',
    },
    purchaseText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    footer: {
      padding: 16,
      backgroundColor: darkMode ? '#2B2B2B' : '#FFFFFF',
      borderTopWidth: 1,
      borderTopColor: '#444444',
    },
    footerText: {
      fontSize: 12,
      color: darkMode ? '#CCCCCC' : '#888888',
      textAlign: 'center',
    },
  });