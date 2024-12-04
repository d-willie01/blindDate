import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Link } from 'expo-router';

const interests = [
  { id: 1, label: 'Animals', emoji: '🐱' },
  { id: 2, label: 'Comedy', emoji: '😂' },
  { id: 3, label: 'Travel', emoji: '🏖️' },
  { id: 4, label: 'Food', emoji: '🍔' },
  { id: 5, label: 'Sports', emoji: '🏀' },
  { id: 6, label: 'Beauty & Style', emoji: '💄' },
  { id: 7, label: 'Art', emoji: '🎨' },
  { id: 8, label: 'Gaming', emoji: '🎮' },
  { id: 9, label: 'Science & Education', emoji: '🧐' },
  { id: 10, label: 'Dance', emoji: '💃' },
  { id: 11, label: 'DIY', emoji: '✂️' },
  { id: 12, label: 'Auto', emoji: '🚗' },
  { id: 13, label: 'Music', emoji: '🎵' },
  { id: 14, label: 'Life Hacks', emoji: '💡' },
  { id: 15, label: 'Oddly Satisfying', emoji: '🤯' },
];

const ChooseInterestsScreen = () => {
  const [selectedInterests, setSelectedInterests] = useState([]);

  const toggleInterest = (id) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isSelected = (id) => selectedInterests.includes(id);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose your interests</Text>
      <Text style={styles.subtitle}>Get better video recommendations</Text>
      <ScrollView contentContainerStyle={styles.interestsContainer}>
        {interests.map((interest) => (
          <TouchableOpacity
            key={interest.id}
            style={[
              styles.interestButton,
              isSelected(interest.id) && styles.selectedButton,
            ]}
            onPress={() => toggleInterest(interest.id)}
          >
            <Text
              style={[
                styles.interestText,
                isSelected(interest.id) && styles.selectedText,
              ]}
            >
              {interest.emoji} {interest.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.skipButton}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton}>
        <Link href="/home/connect" >
          <Text style={styles.nextButtonText}>Next</Text>
        </Link>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color:"white"
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  interestButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
    backgroundColor: '#fff',
  },
  selectedButton: {
    backgroundColor: '#b9ffb8',
    borderColor: 'black',
  },
  interestText: {
    fontSize: 16,
    color: '#000',
  },
  selectedText: {
    color: 'black',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  skipButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 30,
    backgroundColor: 'black',
    marginRight: 10,
  },
  skipButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  nextButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 30,
    backgroundColor: '#71FD71',
    marginRight: 10,
  },
  nextButtonText: {

    
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ChooseInterestsScreen;

