import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import goldCoins from '../../../assets/images/goldCoins.png'
import { Link } from 'expo-router';

export default function CoinShop() {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const coins = [
    { amount: 360, oldPrice: 3, price: 2, image: 'https://cdn.vectorstock.com/i/500p/54/84/stack-of-gold-coins-on-transparent-background-vector-18945484.jpg' },
    { amount: 650, oldPrice: 3.9, price: 3.3, image: 'https://cdn.vectorstock.com/i/1000v/34/13/stack-of-coins-vector-1103413.jpg' },
    { amount: 1250, oldPrice: 7.5, price: 6, image: 'https://example.com/coin3.png' },
    { amount: 2500, oldPrice: 14.7, price: 11, image: 'https://example.com/coin4.png' },
    { amount: 5000, oldPrice: 30, price: 21, image: 'https://example.com/coin5.png' },
    { amount: 10000, oldPrice: 61.5, price: 40, image: 'https://example.com/coin6.png' },
    { amount: 20000, oldPrice: 130.8, price: 78.5, image: 'https://example.com/coin7.png' },
    { amount: 50000, oldPrice: 350, price: 192.5, image: 'https://example.com/coin8.png' },
  ];

  const darkMode = true; // Assuming dark mode is always active; adjust as needed.

  const styles = createStyles(darkMode);

  return (
    <View style={styles.container}>
      {/* Header */}
      
      <View style={styles.header}>

      <Link href={'/home/connect'}>
        <View style={styles.coinBadge}>
        <Text> 🢀 </Text>
          <Text style={styles.coinCount}>46</Text>
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
            onPress={() => setSelectedIndex(index)} // Set selected index
          >
            <Text style={styles.coinAmount}>{coin.amount} Coins</Text>
            <Image source={goldCoins} style={styles.coinImage} />
            <Text style={styles.oldPrice}>${coin.oldPrice}</Text>
            <Text style={styles.price}>${coin.price}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Purchase Button */}
            <TouchableOpacity
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
    header: {
      padding: 16,
      backgroundColor: darkMode ? '#2B2B2B' : '#FFFFFF',
      flexDirection: 'row',
      justifyContent: 'center',
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





