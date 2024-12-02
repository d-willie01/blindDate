import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import { Link } from "expo-router";
import api from "../../api/apiCalls";

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState(null);
  const [joinTime, setJoinTime] = useState(""); // Store the time since joining

  const bobbingAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create the bobbing animation effect
    const bobbing = Animated.loop(
      Animated.sequence([
        Animated.timing(bobbingAnimation, {
          toValue: -10, // Move the element up
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(bobbingAnimation, {
          toValue: 0, // Move back to the original position
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );

    bobbing.start(); // Start the animation loop
    return () => bobbing.stop(); // Cleanup when unmounted
  }, []);

  useEffect(() => {
    // Fetch user details and calculate time since joining
    const fetchUserData = async () => {
      try {
        const response = await api.get("/user/self");
        const userData = response.data;

        setUser(userData);
        console.log(userData)

        // Calculate how long ago the user joined
        const timeSinceJoined = timeSince(userData.createdAt);
        setJoinTime(timeSinceJoined);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const timeSince = (dateString) => {
    const createdAt = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - createdAt) / 1000);

    // Define time thresholds
    const intervals = {
      year: 31536000, // seconds in a year
      month: 2592000, // seconds in a month
      day: 86400, // seconds in a day
      hour: 3600, // seconds in an hour
      minute: 60, // seconds in a minute
    };

    for (const [unit, value] of Object.entries(intervals)) {
      const count = Math.floor(seconds / value);
      if (count >= 1) {
        return `joined ${count} ${unit}${count > 1 ? "s" : ""} ago`;
      }
    }

    return "joined just now"; // Fallback for very recent joins
  };

  const calculateAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const isBeforeBirthday =
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate());
    if (isBeforeBirthday) {
      age -= 1;
    }
    return age;
  };
  

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleSignOut = () => {
    console.log("User signed out");
    // Add your logout logic here
  };

  const handleDeleteAccount = () => {
    console.log("User account deleted");
    // Add your delete logic here
  };

  const styles = createStyles(darkMode); // Generate styles dynamically

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Link href={"/home/connect"}>
          <Animated.View
            style={[
              styles.animatedContainer,
              { transform: [{ translateY: bobbingAnimation }] },
            ]}
          >
            <View style={styles.profileImage}>
              <Text style={styles.profileText}>GO!</Text>
            </View>
          </Animated.View>
        </Link>

        <View style={styles.header}>
  <View style={styles.textContainer}>
    <Text style={styles.title}>{user?.name || "Name"}</Text>
    <Text style={styles.subtitle}>
      {user?.dateOfBirth ? `${calculateAge(user.dateOfBirth)} years old` : ""}
    </Text>
    <Text style={styles.subtitle}>{user?.gender || "Gender"}</Text>
    <Text style={styles.subtitle}>{joinTime}</Text>
  </View>
</View>

        <View style={styles.section}>
          
          <Text style={styles.sectionHeader}>Profile</Text>



            
          <TouchableOpacity style={styles.option}>
          <Link href={'/home/userSettings/editProfile'}>
            <Text style={styles.optionText}>Edit Profile </Text>
            <Text style={styles.optionText}>›</Text>
            </Link>
          </TouchableOpacity>
          



          <TouchableOpacity style={styles.option}>
         <Link href={'/home/userSettings/reportAbuse'}>
            <Text style={styles.optionText}>Report Abuse</Text>
            <Text style={styles.optionText}>›</Text>
            </Link>
          </TouchableOpacity>
          
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Settings</Text>



          <TouchableOpacity style={styles.option}>
            <Link href={'/home/userSettings/supportFeedback'}>
            <Text style={styles.optionText}>Support & Feedback</Text>
            <Text style={styles.optionText}>›</Text>
            </Link>
          </TouchableOpacity>


          <View style={styles.option}>
            <Text style={styles.optionText}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              thumbColor={darkMode ? "#007BFF" : "#EEE"}
            />
          </View>
        </View>

        {/* Logout and Delete buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDeleteAccount}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (darkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: darkMode ? "#1E1E1E" : "#F9F9F9",
    },
    scrollViewContent: {
      paddingHorizontal: "5%",
      paddingTop: 80,
      paddingBottom: 20, // Ensure space for bottom buttons
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 30,
    },
    animatedContainer: {
      position: "absolute",
      top: 20,
      left: 20,
      zIndex: 10,
    },
    profileImage: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: "#b9ffb8",
      justifyContent: "center",
      alignItems: "center",
    },
    profileText: {
      color: "black",
      fontWeight: "bold",
      fontSize: 16,
    },
    textContainer: {
      flex: 1,
      marginLeft: 100,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: darkMode ? "#FFF" : "#000",
    },
    subtitle: {
      fontSize: 14,
      color: darkMode ? "#CCC" : "#777",
    },
    section: {
      marginVertical: 20,
    },
    sectionHeader: {
      fontSize: 18,
      fontWeight: "bold",
      color: darkMode ? "#FFF" : "#000",
      marginBottom: 10,
    },
    option: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: darkMode ? "#333" : "#EEE",
    },
    optionText: {
      fontSize: 16,
      color: darkMode ? "#FFF" : "#000",
    },
    buttonContainer: {
      marginTop: 20,
    },
    signOutButton: {
      backgroundColor: "#b9ffb8",
      paddingVertical: 15,
      borderRadius: 8,
      alignItems: "center",
      marginBottom: 10,
    },
    deleteButton: {
      backgroundColor: "red",
      paddingVertical: 15,
      borderRadius: 8,
      alignItems: "center",
    },
    buttonText: {
      color: "black",
      fontWeight: "bold",
    },
    deleteButtonText: {
      color: "white",
      fontWeight: "bold",
    },
    textContainer: {
      flex: 1,
      marginLeft: 100,
      alignItems: "flex-start", // Align the text to the left
    },
    subtitle: {
      fontSize: 16,
      color: darkMode ? "#CCC" : "#777",
      marginTop: 5,
    },
  });
