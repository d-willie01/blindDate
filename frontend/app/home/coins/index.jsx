import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import goldCoins from '../../../assets/images/goldCoins.png'
import { Link, useRouter} from 'expo-router';
import api from '../../../api/apiCalls'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Confetti from 'react-native-simple-confetti';
import Coins from '../../../assets/images/goldCoins.png'
import oneCoin from '../../../assets/images/goldCoin.png'
import Logo from '../../../assets/images/logo.png'

export default function CoinShop() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [userCoins, setUserCoins] = useState(0)
  const tokenAmount = useRef(0);
  const [purchaseNumber, setPurchaseNumber] = useState();
  const [transaction, setTransaction] = useState(false);
  const router = useRouter();
  


  useEffect(()=>{

    const fetchUserData = async() =>{
      const userDataRaw = await AsyncStorage.getItem('user')

      const userData = JSON.parse(userDataRaw);

      console.log(userData);
      
      setUserCoins(userData.tokenCount);

      console.log(tokenAmount.current)
    }

    fetchUserData()

  },[])

  const coins = [

    { amount: 200, 
      oldPrice: 3.99,
      price: 2.50, 


      //real value
       stripePriceString: 'price_1QTgi7Dfy3ekqWSiMkuF7aUL', 

      //testvalue
      //stripePriceString:'price_1QTgm3Dfy3ekqWSiaTk5Id04',



      image: 'https://cdn.vectorstock.com/i/500p/54/84/stack-of-gold-coins-on-transparent-background-vector-18945484.jpg' 
    },


    { 
      amount: 400, 
      oldPrice: 5.99,
      price:5,
      stripePriceString: 'price_1QUGLIDfy3ekqWSiiUmNlO4z', 
      image: 'https://cdn.vectorstock.com/i/1000v/34/13/stack-of-coins-vector-1103413.jpg' },


    { 
      amount: 800, 
      oldPrice: 7.99, 
      price: 10,
      stripePriceString: 'price_1QUGOMDfy3ekqWSiVFVa0etw',
      image: 'https://example.com/coin3.png' 
    },


    { 
      amount: 2500, 
      oldPrice: 15.99, 
      price: 15, 
      stripePriceString: 'price_1QUGhxDfy3ekqWSiI4S2UysK', 
      image: 'https://example.com/coin4.png' 
    },


    { 
      amount: 5000, 
      oldPrice: 30.99, 
      price: 25, 
      stripePriceString: 'price_1QUGjuDfy3ekqWSiahkKULka', 
      image: 'https://example.com/coin5.png' 
    },


    { 
      amount: 10000,
      oldPrice: 60.99,
      price: 40,
      stripePriceString: 'price_1QUGktDfy3ekqWSiv3jLnTtw',
      image: 'https://example.com/coin6.png'
    },


    { 
      amount: 20000,
      oldPrice: 100, 
      price: 75, 
      stripePriceString: 'price_1QUGhxDfy3ekqWSiI4S2UysK', 
      image: 'https://example.com/coin7.png' 
    },


    { 
      amount: 50000,
      oldPrice: 350, 
      price: 150, 
      stripePriceString: 'price_1QUGn4Dfy3ekqWSiBp5WKDC6', 
      image: 'https://example.com/coin8.png' 
    },
  ];

  const darkMode = true; // Assuming dark mode is always active; adjust as needed.

  const styles = createStyles(darkMode);



  const handlePurchase = async() =>{

    console.log(selectedTransaction);


    try {

      const response = await api.post('/transactions/addCoins', {
        transaction: selectedTransaction
      })

      console.log(response);

      if(response.status == 200)
      {
        console.log("find the coins:", selectedTransaction.amount)
        window.location.href = response.data.url;
        // setTransaction(true) ;
        // setPurchaseNumber(selectedTransaction.amount);
      }

      
    } catch (error) {
      
    }
    
  }

  
    return (
      <View style={styles.container}>
        {/* Header */}
        
        <View style={styles.header}>
  
       
  
        <Link href={'/home/connect'}>
  
        <View style={{
          
          
        }}>
        <Text style={{
            color: 'white',
            fontWeight:"bold",
            fontSize:20
          }}> X  </Text>
          </View>
  
  
          <View style={styles.coinBadge}>
          
            <Text style={styles.coinCount}>{userCoins}</Text>
            <View style={styles.coinIcon} />
          </View>
          </Link>
          
          
        </View>
  
        {/* Coins Grid */}
        <ScrollView contentContainerStyle={styles.grid}>
          {coins.map((coin, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.card,
                selectedIndex === index && styles.selectedCard, // Highlight selected card
              ]}
              onPress={() => {setSelectedIndex(index), setSelectedTransaction(coin)}} // Set selected index
            >
              <Text style={styles.coinAmount}>{coin.amount} Coins</Text>
              <Image source={goldCoins} style={styles.coinImage} />
              <Text style={styles.oldPrice}>${coin.oldPrice}</Text>
              <Text style={styles.price}>${coin.price}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
  
        {/* Purchase Button */}
              <TouchableOpacity onPress={handlePurchase}
                      style={[
                        styles.purchaseButton,
                        selectedIndex === null && styles.disabledPurchaseButton, // Disable button if no card is selected
                      ]}
                      disabled={selectedIndex === null} // Button is disabled until a selection is made
                    >
                      <Text style={styles.purchaseText}>Purchase</Text>
              </TouchableOpacity>
  
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>All payments are refundable within 14 days.</Text>
          <Text style={styles.footerText}>All transactions are secure and encrypted.</Text>
        </View>
      </View>
    );
  
}

const createStyles = (darkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: darkMode ? '#1E1E1E' : '#F9F9F9',
    },
    confettiContainer: {
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





