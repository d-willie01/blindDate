import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import axios from 'axios';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const [data, setData] = useState({ maleCount: 0, femaleCount: 0, allTransactions: [], allFeedback: [] });
  const [selectedHeader, setSelectedHeader] = useState(null);

  //const baseURL = 'http://localhost:3000';

  const baseURL = 'https://stream-ses0.onrender.com';

  useEffect(() => {

    
    const getAppData = async () => {
      try {
        const response = await axios.get(`${baseURL}/analytics/getData`);
        // Sort transactions by date (assuming transactions have a 'date' field)
        const sortedTransactions = response.data.allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        setData({ ...response.data, allTransactions: sortedTransactions });
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to fetch data');
      }
    };


    getAppData();
  }, []);

  const handlePassword = () => {
    const passKey = '0325';
    if (password === passKey) {
      setSuccess(true);
    } else {
      Alert.alert('Wrong Password');
    }
  };

  const handlePress = (item) => {
    setSelectedHeader(item);
  };

  const renderTransaction = ({ item, index }) => (
    <View style={styles.transactionItem}>
      <Text>
        {index + 1}. {item.description} - {item.amount} - {new Date(item.date).toLocaleString()}
      </Text>
    </View>
  );

  const renderFeedback = ({ item, index }) => (
    <View style={styles.feedbackItem}>
      <Text style={styles.feedbackText}>
        {index + 1}. {item.userEmail} ({item.type}) - {item.message} - Follow-up: {item.followup}
      </Text>
    </View>
  );

  if (!success) {
    return (
      <View style={styles.loginContainer}>
        <View>
          <TextInput
            style={styles.input}
            placeholder="PASSWORD"
            secureTextEntry
            onChangeText={(text) => setPassword(text)}
          />

          <TouchableOpacity onPress={handlePassword} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerItem} onPress={() => handlePress('Transactions')}>
            <Text style={styles.headerText}>Transactions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerItem} onPress={() => handlePress('Reports')}>
            <Text style={styles.headerText}>Reports</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerItem} onPress={() => handlePress('Feedback')}>
            <Text style={styles.headerText}>Feedback</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {selectedHeader === 'Transactions' && (
            <View style={styles.transactionsContainer}>
              <Text style={styles.contentText}>Total Transactions: {data.allTransactions.length}</Text>
              <FlatList
                data={data.allTransactions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderTransaction}
              />
            </View>
          )}

          {selectedHeader === 'Reports' && (
            <View>
              <Text style={styles.contentText}>Male Users: {data.maleCount}</Text>
              <Text style={styles.contentText}>Female Users: {data.femaleCount}</Text>
            </View>
          )}

          {selectedHeader === 'Feedback' && (
            <View style={styles.feedbackContainer}>
              <Text style={styles.contentText}>Total Feedback: {data.allFeedback.length}</Text>
              <FlatList
                data={data.allFeedback}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderFeedback}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E9D1F9',
  },
  input: {
    borderWidth: 2,
    padding: 10,
    color: 'black',
    backgroundColor: 'white',
    borderRadius: 10,
    width: 200,
    textAlign: 'center',
  },
  submitButton: {
    padding: 10,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    marginTop: 10,
  },
  submitButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#E9D1F9',
  },
  headerItem: {
    padding: 10,
    flex: 1,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  headerText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  contentText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  transactionsContainer: {
    width: '100%',
    flex: 1,
  },
  transactionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    width: '100%',
    margin: 5,
  },
  feedbackContainer: {
    width: '100%',
    flex: 1,
  },
  feedbackItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    width: '100%',
    margin: 5,
  },
  feedbackText: {
    fontSize: 14,
  },
});





