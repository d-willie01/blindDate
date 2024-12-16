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
import { Link, useRouter } from "expo-router";
import api from "../../api/apiCalls";
import AsyncStorage from "@react-native-async-storage/async-storage";
  
export default function ProfileScreen() {

  const router = useRouter();
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState(null);
  const [joinTime, setJoinTime] = useState(""); // Store the time since joining

  const bobbingAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const bobbing = Animated.loop(
      Animated.sequence([
        Animated.timing(bobbingAnimation, {
          toValue: -10, // Move the element up
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(bobbingAnimation, {
          toValue: 0, // Move back to the original position
          duration: 500,
          useNativeDriver: false,
        }),
      ])
    );

    bobbing.start(); // Start the animation loop
    return () => bobbing.stop(); // Cleanup when unmounted
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataRaw = await AsyncStorage.getItem('user')

        const userData = JSON.parse(userDataRaw);

        setUser(userData.user);
        
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        const timeSinceJoined = timeSince(userData.user.createdAt);
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

    const intervals = {
      year: 31536000,
      month: 2592000,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [unit, value] of Object.entries(intervals)) {
      const count = Math.floor(seconds / value);
      if (count >= 1) {
        return `joined ${count} ${unit}${count > 1 ? "s" : ""} ago`;
      }
    }

    return "joined just now";
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

  // const toggleDarkMode = () => setDarkMode(!darkMode);

  const styles = createStyles(darkMode);

  const handleLogout = async() => {

      await AsyncStorage.clear()
      router.replace('/');

  }
  const handleDelete = () =>{

    router.replace('/')
    
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          {/* <View style={styles.profilePicture}>
            <Text style={styles.profileText}>Pic</Text>
          </View> */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{user?.name || "Name"}</Text>
            <Text style={styles.subtitle}>
              {user?.dateOfBirth
                ? `${calculateAge(user.dateOfBirth)} years old`
                : ""}
            </Text>
            <Text style={styles.subtitle}>{user?.gender || "Gender"}</Text>
            <Text style={styles.subtitle}>{joinTime}</Text>
          </View>
          <Link href={"/home/connect"}>
            <Animated.View
              style={[
                styles.goButton,
                { transform: [{ translateY: bobbingAnimation }] },
              ]}
            >
              <Text style={styles.goButtonText}>GO!</Text>
            </Animated.View>
          </Link>
        </View>

        {/* Other sections */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Profile</Text>
          <TouchableOpacity style={styles.option}>
            <Link href={
              "/home/userSettings/editProfile"
            }>
              <Text style={styles.optionText}>View Profile </Text>
              <Text style={styles.optionText}>›</Text>
            </Link>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <Link href={"/home/userSettings/communication/reportAbuse"}>
              <Text style={styles.optionText}>Report Abuse</Text>
              <Text style={styles.optionText}>›</Text>
            </Link>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Settings</Text>
          <TouchableOpacity style={styles.option}>
            <Link href={"/home/userSettings/communication/supportFeedback"}>
              <Text style={styles.optionText}>Support & Feedback</Text>
              <Text style={styles.optionText}>›</Text>
            </Link>
          </TouchableOpacity>
          {/* <View style={styles.option}>
            <Text style={styles.optionText}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              thumbColor={darkMode ? "#007BFF" : "#EEE"}
            />
          </View> */}


<TouchableOpacity style={styles.option}>
            <Link href={"/home/userSettings/transactions"}>
              <Text style={styles.optionText}>Transactions</Text>
              <Text style={styles.optionText}>›</Text>
            </Link>
          </TouchableOpacity>
        </View>

            <View style={{
              flex:1,
            }}>
            <TouchableOpacity onPress={handleLogout} style={styles.goButton}>
          <Text style={{
            fontWeight:"bold"
            
          }}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Text style={{
            fontWeight:"bold"
          }}>Delete Account</Text>
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
      paddingBottom: 20,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 30,
    },
    profilePicture: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: "#C4C4C4",
      justifyContent: "center",
      alignItems: "center",
    },
    profileText: {
      fontWeight: "bold",
      fontSize: 16,
    },
    textContainer: {
      flex: 1,
      marginLeft: 15,
    },
    goButton: {
      width: 150,
      height: 70,
      borderRadius: 35,
      backgroundColor: "#b9ffb8",
      justifyContent: "center",
      alignItems: "center",
    },
    deleteButton: {
      width: 150,
      height: 70,
      borderRadius: 35,
      backgroundColor: "red",
      justifyContent: "center",
      alignItems: "center",
      marginTop:10
    },
    goButtonText: {
      fontSize: 20,
      fontWeight: "bold",
      color: "black",
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
  });


