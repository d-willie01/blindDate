import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Switch,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import { Link } from "expo-router";

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = useState(false);

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

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: darkMode ? "#1E1E1E" : "#F9F9F9",
      paddingHorizontal: "5%",
      paddingTop: 80, // Ensure enough space for animation at the top
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 30,
    },
    animatedContainer: {
      position: "absolute",
      top: 20, // Position at the top
      left: 20, // Position at the left
      zIndex: 10, // Ensure it stays above other elements
    },
    profileImage: {
      width: 70, // Smaller image
      height: 70,
      borderRadius: 35, // Circular shape
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
      marginLeft: 100, // Leave space for the animated element
    },
    text: {
      color: darkMode ? "#FFF" : "#000",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
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
    button: {
      backgroundColor: "#b9ffb8",
      paddingVertical: 15,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 30,
    },
    buttonText: {
      color: "black",
      fontWeight: "bold",
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Animated Profile Image */}

        <Link href={'/home/connect'}>
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

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.textContainer}>
            <Text style={[styles.text, styles.title]}>David Robinson</Text>
            <Text style={[styles.text, styles.subtitle]}>Joined 1 year ago</Text>
          </View>
        </View>

        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Profile</Text>
          <TouchableOpacity style={styles.option}>
            <Text style={[styles.text, { fontSize: 16 }]}>Manage user</Text>
            <Text style={[styles.text, { fontSize: 16 }]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Settings</Text>

          <TouchableOpacity style={styles.option}>
            <Text style={[styles.text, { fontSize: 16 }]}>Notifications</Text>
            <Text style={[styles.text, { fontSize: 16 }]}>›</Text>
          </TouchableOpacity>

          <View style={styles.option}>
            <Text style={[styles.text, { fontSize: 16 }]}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              thumbColor={darkMode ? "#007BFF" : "#EEE"}
            />
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.button}>
            <Link href={'/'}>
          <Text style={styles.buttonText}>Sign Out</Text>
          </Link>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}



// import React, { useState } from "react";
// import {
//   StyleSheet,
//   View,
//   Text,
//   Image,
//   Switch,
//   TouchableOpacity,
//   ScrollView,
// } from "react-native";

// export default function ProfileScreen() {
//   const [darkMode, setDarkMode] = useState(false);

//   const toggleDarkMode = () => setDarkMode(!darkMode);

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: darkMode ? "#1E1E1E" : "#F9F9F9",
//       paddingHorizontal: "5%",
//       paddingVertical: "5%",
//     },
//     header: {
//       flexDirection: "row",
//       alignItems: "center",
//       marginBottom: 30,
//     },
//     profileImage: {
//       flex: 0.3,
//       aspectRatio: 1, // Ensures the image is square
//       borderRadius: 100, // Circular shape
//       backgroundColor: "#DDD",
//       marginRight: 20,
//     },
//     textContainer: {
//       flex: 0.7,
//     },
//     text: {
//       color: darkMode ? "#FFF" : "#000",
//     },
//     title: {
//       fontSize: 24,
//       fontWeight: "bold",
//     },
//     subtitle: {
//       fontSize: 14,
//       color: darkMode ? "#CCC" : "#777",
//     },
//     section: {
//       marginVertical: 20,
//     },
//     sectionHeader: {
//       fontSize: 18,
//       fontWeight: "bold",
//       color: darkMode ? "#FFF" : "#000",
//       marginBottom: 10,
//     },
//     option: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//       paddingVertical: 15,
//       borderBottomWidth: 1,
//       borderBottomColor: darkMode ? "#333" : "#EEE",
//     },
//     button: {
//       backgroundColor: '#b9ffb8',
//       paddingVertical: 15,
//       borderRadius: 8,
//       alignItems: "center",
//       marginTop: 30,
//     },
//     buttonText: {
//       color: "vlack",
//       fontWeight: "bold",
//     },
//   });

//   return (
//     <View style={styles.container}>
//       <ScrollView>
//         {/* Header */}
//         <View style={styles.header}>
//           <Image
//             source={{
//               uri: "https://via.placeholder.com/100", // Placeholder image
//             }}
//             style={styles.profileImage}
//           />
//           <View style={styles.textContainer}>
//             <Text style={[styles.text, styles.title]}>David Robinson</Text>
//             <Text style={[styles.text, styles.subtitle]}>Joined 1 year ago</Text>
//           </View>
//         </View>

//         {/* Profile Section */}
//         <View style={styles.section}>
//           <Text style={styles.sectionHeader}>Profile</Text>
//           <TouchableOpacity style={styles.option}>
//             <Text style={[styles.text, { fontSize: 16 }]}>Manage user</Text>
//             <Text style={[styles.text, { fontSize: 16 }]}>›</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Settings Section */}
//         <View style={styles.section}>
//           <Text style={styles.sectionHeader}>Settings</Text>

//           <TouchableOpacity style={styles.option}>
//             <Text style={[styles.text, { fontSize: 16 }]}>Notifications</Text>
//             <Text style={[styles.text, { fontSize: 16 }]}>›</Text>
//           </TouchableOpacity>

//           <View style={styles.option}>
//             <Text style={[styles.text, { fontSize: 16 }]}>Dark Mode</Text>
//             <Switch
//               value={darkMode}
//               onValueChange={toggleDarkMode}
//               thumbColor={darkMode ? "#007BFF" : "#EEE"}
//             />
//           </View>
//         </View>

//         {/* Sign Out Button */}
//         <TouchableOpacity style={styles.button}>
//           <Text style={styles.buttonText}>Sign Out</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </View>
//   );
// }
