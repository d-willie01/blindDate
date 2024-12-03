import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";
import Animated, { SlideInUp } from "react-native-reanimated";

export default function FeedbackModal() {
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

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
        <Text style={styles.title}>Sorry to hear this...</Text>
        <Text style={styles.subtitle}>we never want negative experiences at Blinder, but they do happen </Text>

        {/* Emoji Rating */}
        

        {/* Feedback Input */}
        <TextInput
          style={styles.input}
          placeholder="Please share your experience here"
          multiline
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
          <TouchableOpacity style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
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
    backgroundColor: "#1E1E1E",
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
    color: "#333",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    color: 'white'
  },
  subtitle: {
    fontSize: 14,
    color: "#CCC",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    minHeight: 60,
    textAlignVertical: "top",
    color:'white'
  },
  question: {
    fontSize: 14,
    color: "white",
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
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#b9ffb8",
  },
  radioText: {
    fontSize: 14,
    color: "#FFF"
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sendButton: {
    backgroundColor: "#b9ffb8",
    flex: 1,
    marginRight: 10,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  sendButtonText: {
    backgroundColor: "#b9ffb8",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
  },
});