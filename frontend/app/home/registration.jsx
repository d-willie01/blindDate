import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from 'expo-router';
import api from "../../api/apiCalls";

export default function SignupScreen() {
  const router = useRouter();
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({}); // State for form validation errors

  const formatDate = (date) => {
    if (!date) return "";
    return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Check for empty fields
    if (!name) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!selectedGender) {
      newErrors.gender = "Gender is required";
      isValid = false;
    }

    if (!dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
      isValid = false;
    } else {
      const age = calculateAge(dateOfBirth);
      if (age < 18) {
        newErrors.dateOfBirth = "You must be at least 18 years old";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const calculateAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const isBeforeBirthday =
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());
    if (isBeforeBirthday) {
      age -= 1;
    }
    return age;
  };

  const updateUser = async () => {
    if (!validateForm()) return; // Only proceed if form is valid

    try {
      console.log(name);
      console.log(selectedGender);
      console.log(dateOfBirth);

      const response = await api.post('/user/registration/', {
        name,
        gender: selectedGender,
        dateOfBirth: formatDate(dateOfBirth),
      });

      if (response.status === 200) {
        router.replace('/home/preferences');
      }

      console.log(response.data);
    } catch (error) {
      console.log("this is the error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>BLINDER</Text>
        </View>

        <Text style={styles.labelText}>Enter Your Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Name / Nickname"
          placeholderTextColor="#A0A0A0"
          maxLength={50}
          onChangeText={(event) => setName(event)}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <Text style={styles.labelText}>Select Gender</Text>
        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={[styles.genderButton, selectedGender === "male" ? styles.genderSelected : null]}
            onPress={() => setSelectedGender("male")}
          >
            <Image
              source={{ uri: "https://img.icons8.com/ios-filled/50/ffffff/male.png" }}
              style={styles.genderIcon}
            />
            <Text style={styles.genderText}>Male</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.genderButton, selectedGender === "female" ? styles.genderSelected : null]}
            onPress={() => setSelectedGender("female")}
          >
            <Image
              source={{ uri: "https://img.icons8.com/ios-filled/50/ffffff/female.png" }}
              style={styles.genderIcon}
            />
            <Text style={styles.genderText}>Female</Text>
          </TouchableOpacity>
        </View>
        {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

        <Text style={styles.labelText}>Date of birth</Text>
        <View style={styles.datePickerWrapper}>
          <ReactDatePicker
            selected={dateOfBirth}
            onChange={(date) => setDateOfBirth(date)}
            maxDate={new Date()} // Prevent future dates
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
            placeholderText="Select Date of Birth"
            dateFormat="yyyy-MM-dd"
            customInput={
              <TextInput
                style={styles.input}
                placeholder="Select Date of Birth"
                placeholderTextColor="#A0A0A0"
                value={dateOfBirth ? formatDate(dateOfBirth) : ""}
                editable={false}
              />
            }
          />
        </View>
        {errors.dateOfBirth && <Text style={styles.errorText}>{errors.dateOfBirth}</Text>}

        <TouchableOpacity onPress={updateUser} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E", // Dark mode background
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  logoContainer: {
    marginBottom: 32,
  },
  logoText: {
    fontSize: 48,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#1A1A1A",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  labelText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 24,
  },
  genderButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 8,
    width: 100,
    height: 100,
    backgroundColor: "#1A1A1A",
  },
  genderSelected: {
    backgroundColor: "#b9ffb8", // Green for selected gender
    borderColor: "#fff",
    borderWidth: 2,
  },
  genderIcon: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  genderText: {
    color: "#fff",
    fontSize: 14,
  },
  datePickerWrapper: {
    width: "100%",
    marginBottom: 16,
  },
  nextButton: {
    width: "100%",
    backgroundColor: "#b9ffb8", // Green for the next button
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 16,
    alignSelf: "flex-start",
  },
});




















