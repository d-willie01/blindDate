import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";

const ModalScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.overlay}>
      {/* Dismiss Modal on Outside Press */}
      <Pressable style={styles.overlayBackground} onPress={() => router.back()} />

      {/* Modal Content */}
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Filter Preferences</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable Content */}
        <ScrollView contentContainerStyle={styles.content}>
          {/* Gender Filter */}
          <Text style={styles.sectionTitle}>Gender</Text>
          <View style={styles.filterOptions}>
            <TouchableOpacity style={[styles.filterButton, styles.disabledButton]}>
              <Text style={[styles.filterButtonText, styles.disabledText]}>Girls Only</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterButton, styles.disabledButton]}>
              <Text style={[styles.filterButtonText, styles.disabledText]}>Guys Only</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterButton, styles.activeButton]}>
              <Text style={styles.filterButtonText}>Both</Text>
            </TouchableOpacity>
          </View>

          {/* Region Filter */}
          <Text style={styles.sectionTitle}>Region</Text>
          <View style={styles.filterOptions}>
            <TouchableOpacity style={[styles.filterButton, styles.activeButton]}>
              <Text style={styles.filterButtonText}>Global</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterButton, styles.disabledButton]}>
              <Text style={[styles.filterButtonText, styles.disabledText]}>Europe</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterButton, styles.disabledButton]}>
              <Text style={[styles.filterButtonText, styles.disabledText]}>Asia</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        
      </View>
    </View>
  );
};

const { height } = Dimensions.get("screen");

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Dimmed background
  },
  overlayBackground: {
    flex: 1,
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: height * 0.4, // Covers 3/4 of the screen
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: "#999",
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 10,
  },
  filterOptions: {
    flexDirection: "row",
    marginBottom: 20,
  },
  filterButton: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    backgroundColor: "#f0f0f0",
  },
  activeButton: {
    backgroundColor: "#4caf50",
  },
  disabledButton: {
    backgroundColor: "#ddd",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#333",
  },
  disabledText: {
    color: "#999",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  joinButton: {
    backgroundColor: "#ffeb3b",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default ModalScreen;
