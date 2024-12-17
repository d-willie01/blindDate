import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';

export default function Transactions() {

    const [userTransactions, setUserTransactions] = useState([]);
    const [date, setDate] = useState();
  // Sample transaction data
 

  useEffect(() => {
    const getData = async () => {
      try {
        const userDataRaw = await AsyncStorage.getItem('user');
  
        if (userDataRaw) {
          const userData = JSON.parse(userDataRaw);
  
          // Sort transactions by date (most recent first)
          const sortedTransactions = userData.user.transactions.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
  
          //console.log(sortedTransactions);
          setUserTransactions(sortedTransactions);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    getData();
  }, []);
  

  const renderTransaction = ({ item }) =>{
    const isoDate = item.date
    const nonHumanDate = new Date(isoDate);

    const date = nonHumanDate.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true, // Use 12-hour format; set to false for 24-hour format
    });
    
    
    

    return(

      <View style={{
          flex:1,
          flexDirection:'row'
      }}>
  
      <View style={styles.transactionInfo}>
      
        <Text style={styles.transactionType}>{item.type}</Text>
        <Text
          style={[
            styles.transactionAmount,
            item.type === 'purchase' ? styles.purchase : styles.spend,
          ]}
        >
          {item.type === 'purchase' ? `+${item.amount}` : `-${item.amount}`} coins
        </Text>
        <Text style={styles.transactionDate}>{date}</Text>
  
        
      </View>
  
      <View style={{
        
  
          justifyContent:'center',
          marginLeft: 10,
          width:'20%'
  
        }}>
  
          <TouchableOpacity style={{
              backgroundColor:'#6FFF6F',
              borderRadius:20,
              padding:10
          }}>
  
          <Text style={{
              textAlign:"center",
              color: 'white'
          
          }}>Dispute</Text>
  
          </TouchableOpacity>
  
        </View>
  
  
      </View>
    );
  }
    
   

  return (
    <View style={styles.container}>
      <Link href={'/home/profile'}>
      <Text style={{
        color: 'white',
        fontWeight:"bold",
        fontSize:20
      }}>X</Text>
      </Link>
      <Text style={styles.header}>Transactions</Text>
      <FlatList
        data={userTransactions}
        keyExtractor={(item) => 
          item.date}
        renderItem={renderTransaction}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyMessage}>No transactions yet.</Text>}
      />
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:  "#1E1E1E",
      padding: 20,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: "#000",
      marginBottom: 20,
      borderBottomWidth:2
    },
    list: {
      paddingBottom: 20,
    },
    transactionInfo: {
    
    alignItems:"center",
      backgroundColor:  "#333",
      padding: 15,
      borderRadius: 8,
      marginBottom: 10,
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      elevation: 3,
      width:'70%'
    },
    transactionType: {
      fontSize: 16,
      fontWeight: 'bold',
      color:  "#000",
    },
    transactionAmount: {
      fontSize: 14,
      fontWeight: "bold",
    },
    purchase: {
      color: "#4CAF50", // Green for purchases
    },
    spend: {
      color: "#FF5252", // Red for spending
    },
    transactionDate: {
      fontSize: 12,
      color:   "#777",
      marginTop: 5,
    },
    emptyMessage: {
      textAlign: 'center',
      color:   "#777",
      fontSize: 16,
      marginTop: 20,
    },
  });

