import React, { useState } from 'react';
import { View, Text, ScrollView, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';

const PrivacyPolicyScreen = () => {
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();

  const handleAccept = () => {
    setAccepted(true);
    router.replace('/home/connect'); // Replace '/home' with the route to your main screen.
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Privacy Policy</Text>

      <Text style={styles.paragraph}>
        Welcome to our app. Your privacy is important to us. Please read the following carefully.
      </Text>

      <Text style={styles.subHeader}>1. Information Collection and Usage</Text>
      <Text style={styles.paragraph}>
        We collect user information to provide and improve our services, including:
      </Text>
      <Text style={styles.listItem}>- Video and audio data for real-time communication.</Text>
      <Text style={styles.listItem}>- Device information and IP addresses for security purposes.</Text>
      <Text style={styles.listItem}>- Usage data to enhance the user experience.</Text>

      <Text style={styles.subHeader}>2. Data Deletion</Text>
      <Text style={styles.paragraph}>
        You have the right to request the deletion of your personal data at any time. Contact us at{' '}
        <Text style={styles.bold}>support@example.com</Text> to initiate the process.
      </Text>

      <Text style={styles.subHeader}>3. Age Requirement</Text>
      <Text style={{fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
    textAlign: 'justify',
    color:"red"}}>
        Users must be at least <Text style={styles.bold}>18 years old</Text> to use this app. By accepting this policy,
        you confirm that you meet this requirement.
      </Text>

      <Text style={styles.subHeader}>4. Compliance with Laws</Text>
      <Text style={styles.paragraph}>
        We are committed to complying with applicable laws. Any unlawful activity or misuse of the platform will be
        reported to the proper authorities.
      </Text>

      <Text style={styles.subHeader}>5. Video Chat-Specific Policies</Text>
      <Text style={styles.paragraph}>
        - Your video and audio communications are not recorded unless explicitly stated.
        {'\n'}- Do not share sensitive personal information during chats.
        {'\n'}- We take reasonable measures to ensure secure and private communication, but complete security cannot be guaranteed.
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Accept and Continue"
          onPress={handleAccept}
          color="#28a745"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#1E1E1E",
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color:"white"
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color:"white"
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
    textAlign: 'justify',
    color:"white"
  },
  listItem: {
    fontSize: 16,
    marginLeft: 20,
    marginBottom: 5,
    color:"white"
  },
  bold: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 30,
  },
});

export default PrivacyPolicyScreen;


