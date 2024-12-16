import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";


const ModalScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState("both");
  const router = useRouter();

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
  };

  const handleStartLinking = async() => {
    
    await AsyncStorage.removeItem('preferences');
    await AsyncStorage.setItem('preferences',  JSON.stringify(selectedFilter));
    router.replace('/home/connect'); // Navigates back to the previous screen
     // Pass the selected filter data
  };

  return (
    <View style={styles.overlay}>
      {/* Dismiss Modal on Outside Press */}
      <Link href={"/home/connect"} style={styles.overlayBackground} />

      {/* Modal Content */}
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Filter Preferences:</Text>
          <Link href={"/home/connect"} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </Link>
        </View>

        {/* Scrollable Content */}
        <ScrollView contentContainerStyle={styles.content}>
          {/* Gender Filter */}
          <Text style={styles.sectionTitle}>Gender</Text>
          <View style={styles.filterOptions}>
            <TouchableOpacity
              onPress={() => handleFilterSelect("female")}
              style={[
                styles.filterButton,
                selectedFilter === "female" && styles.activeButton,
              ]}
            >
              <Text style={styles.filterIcon}>👩‍🦰</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleFilterSelect("male")}
              style={[
                styles.filterButton,
                selectedFilter === "male" && styles.activeButton,
              ]}
            >
              <Text style={styles.filterIcon}>👨</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleFilterSelect("both")}
              style={[
                styles.filterButton,
                selectedFilter === "both" && styles.activeButton,
              ]}
            >
              <Text style={styles.filterButtonText}>Both</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleStartLinking}
            style={styles.linkingButton}
          >
            <Text style={styles.linkingButtonText}>START LINKING</Text>
          </TouchableOpacity>
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
    height: height * 0.3, // Increased height for better view
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
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
    color: "white",
    marginBottom: 10,
  },
  filterOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  filterButton: {
    flex: 1,
    padding: 15,
    margin: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    minWidth: 100,
  },
  activeButton: {
    backgroundColor: "#4caf50",
    borderWidth: 2,
    borderColor: "#388e3c",
  },
  filterIcon: {
    fontSize: 50,
  },
  filterButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  linkingButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4caf50",
    marginTop: 10,
  },
  linkingButtonText: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 16,
  },
});

export default ModalScreen;
