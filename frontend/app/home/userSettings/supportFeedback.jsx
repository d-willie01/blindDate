import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Link, useRouter } from "expo-router";
import Animated, { SlideInUp } from "react-native-reanimated";
import api from '../../../api/apiCalls';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function FeedbackModal() {
  const router = useRouter();
  const [selectedEmoji, setSelectedEmoji] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [feedbackText, setFeedbackText] = useState("");



  const handleSendFeedback = async() => {


    const userRaw = await AsyncStorage.getItem('user');
    const user = JSON.parse(userRaw)

    console.log("everyhting im finna send:",feedbackText, selectedEmoji, selectedOption)

    try {
      const response = await api.post('/communications/feedback', {
        userEmail: user.email,
        feedbacktext: feedbackText,
        emotion: selectedEmoji,
        followupState: selectedOption,
        type:"feedback"
  
      });
  
      if (response.status === 200)
      {
        alert("Thank you, your feedback has been sent!")
        router.replace('/home/profile')
      }
      
    } catch (error) {


        alert(error.message);

    }

    
    

    
}

  return (
    <Animated.View entering={SlideInUp} style={styles.overlay}>
      {/* Close modal when clicking outside */}
      <Link href="/home/profile" asChild>
        <Pressable style={StyleSheet.absoluteFill} />
      </Link>

      {/* Modal Content */}
      <View style={styles.modal}>
        {/* Close Icon */}
        <Link href="/home/profile" asChild>
          <Pressable style={styles.closeIcon}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </Link>

        {/* Header */}
        <Text style={styles.title}>Give feedback</Text>
        <Text style={styles.subtitle}>What do you think of LiveLinkME? </Text>

        {/* Emoji Rating */}
        <View style={styles.ratingContainer}>
          {["😠", "😞", "😐", "😊", "😍"].map((emoji, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.emojiButton,
                selectedEmoji === index && styles.selectedEmojiButton,
              ]}
              onPress={() => setSelectedEmoji(index)}
            >
              <Text
                style={[
                  styles.emoji,
                  selectedEmoji === index && styles.selectedEmoji,
                ]}
              >
                {emoji}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Feedback Input */}
        <TextInput
          style={styles.input}
          placeholder="Do you have any thoughts you’d like to share?"
          multiline
          onChangeText={(text)=>setFeedbackText(text)}
        />

        {/* Follow-Up Question */}
        <Text style={styles.question}>May we follow up on your feedback?</Text>
        <View style={styles.radioContainer}>
          {["Yes", "No"].map((option, index) => (
            <TouchableOpacity
              key={option}
              style={styles.radioOption}
              onPress={() => setSelectedOption(option)}
            >
              <View style={styles.radioCircle}>
                {selectedOption === option && (
                  <View style={styles.radioSelected} />
                )}
              </View>
              <Text style={styles.radioText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleSendFeedback} style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>



          <View style={styles.cancelButton}>
            <Link href={'/home/profile'}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
            </Link>
          </View>


        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dimmed background
  },
  modal: {
    backgroundColor: "#1E1E1E", // Dark background
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 5,
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    
  },
  closeText: {
    fontSize: 18,
    color: "#333", // White for better contrast
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    color: "#FFF", // White text
  },
  subtitle: {
    fontSize: 14,
    color: "#CCC", // Light gray for subtitles
    textAlign: "center",
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  emojiButton: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
  },
  selectedEmojiButton: {
    backgroundColor: "#b9ffb8", // Green highlight
  },
  emoji: {
    fontSize: 24,
    color: "#FFF", // Default emoji color
  },
  selectedEmoji: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000", // Black for selected emoji
  },
  input: {
    borderWidth: 1,
    borderColor: "#333", // Dark border
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    minHeight: 60,
    textAlignVertical: "top",
    color: "#FFF", // White text
    backgroundColor: "#333", // Dark background for input
  },
  question: {
    fontSize: 14,
    color: "#CCC", // Light gray
    marginBottom: 10,
  },
  radioContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FFF", // White border
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#b9ffb8", // Green selection
  },
  radioText: {
    fontSize: 14,
    color: "#FFF", // White text
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sendButton: {
    backgroundColor: "#b9ffb8", // Green button
    flex: 1,
    marginRight: 10,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  sendButtonText: {
    color: "#000", // Black text for contrast
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#333", // Dark background
  },
  cancelButtonText: {
    color: "#FFF", // White text
    fontSize: 16,
  },
});



