import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";

export default function ProfileScreen() {
  const [user, setUser] = useState();

  useEffect(() => {
    userInfo();
  }, []);

  const userInfo = async () => {
    const userData = await AsyncStorage.getItem("user");
    const userParsed = JSON.parse(userData);
    setUser(userParsed);
  };

  // Function to convert ISO date to dd/mm/yyyy
  const convertDateToDDMMYYYY = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      
<Link href={'/home/profile'} style={{
        alignSelf:'flex-start'
        
      }}>
      <Text style={{
          color: 'white',
          fontWeight:"bold",
          fontSize:20
        }}> X  </Text>
        </Link>
      {/* <View style={styles.profileSection}>


        <Image
          source={{ uri: "https://via.placeholder.com/100" }}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.editIcon}>
          <Text style={styles.editIconText}>✏️</Text>
        </TouchableOpacity>
      </View> */}

      <View style={styles.formSection}>
        {/* Name Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput style={styles.input} placeholder={user?.name} placeholderTextColor="#A0A0A0" />
        </View>

        {/* Email Address Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.emailContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder={user?.email}
              editable={false}
              placeholderTextColor="#A0A0A0"
            />
            <Text style={styles.verified}>VERIFIED</Text>
          </View>
        </View>

        {/* Phone Number Input */}
        {/* <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder={user?.phone}
            placeholderTextColor="#A0A0A0"
            keyboardType="phone-pad"
          />
        </View> */}

        {/* Date of Birth Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date of Birth</Text>
          <TextInput
            editable={false}
            style={styles.input}
            placeholder={convertDateToDDMMYYYY(user?.dateOfBirth)}
            placeholderTextColor="#A0A0A0"
          />
        </View>

        {/* Country Input */}
        {/* <View style={styles.inputGroup}>
          <Text style={styles.label}>Country</Text>
          <TextInput
            style={styles.input}
            placeholder={user?.country}
            placeholderTextColor="#A0A0A0"
          />
        </View> */}

<View style={styles.saveButton}>
<Link href={"/home/profile"} >
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </Link>
      </View>
      </View>

      {/* Save Changes Button */}
      


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#1E1E1E", // Dark mode background
    alignItems: "center",
    padding: 20,
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#b9ffb8", // Green for border
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 120,
    backgroundColor: "#1A1A1A",
    padding: 5,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#b9ffb8",
  },
  editIconText: {
    fontSize: 12,
    color: "#fff",
  },
  formSection: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#fff",
  },
  input: {
    backgroundColor: "#1A1A1A",
    padding: 10,
    borderRadius: 8,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#444",
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  verified: {
    fontSize: 12,
    color: "#b9ffb8",
    backgroundColor: "#1A1A1A",
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "#444",
  },
  saveButton: {
    //flex:1,
    backgroundColor: "#b9ffb8", // Green button
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent:'center',
    marginTop: 20,
    //width: "100%",
  },
  saveButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});
