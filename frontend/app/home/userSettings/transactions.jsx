import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Transactions() {

    const [userTransactions, setUserTransactions] = useState([]);
  // Sample transaction data
 

  useEffect(()=>{

        const getData = async() =>{
            
            const userDataRaw = await AsyncStorage.getItem('user');

            const userData = JSON.parse(userDataRaw);
            console.log(userData.transactions);
            setUserTransactions(userData.transactions)

        }

        getData();
  },[])

  const renderTransaction = ({ item }) => (

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
      <Text style={styles.transactionDate}>{item.date}</Text>

      
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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transactions</Text>
      <FlatList
        data={userTransactions}
        keyExtractor={(item) => item.id}
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
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
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

