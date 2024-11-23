import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from 'expo-router';

export default function SignupScreen() {
  const [dateOfBirth, setDateOfBirth] = useState(null); // State to hold selected date
  const [selectedGender, setSelectedGender] = useState(null); // State to hold selected gender

  const formatDate = (date) => {
    if (!date) return "";
    return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* App Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>BLINDER</Text>
        </View>

        {/* Name Input */}
        <TextInput
          style={styles.input}
          placeholder="Name / Nickname"
          placeholderTextColor="#A0A0A0"
          maxLength={50}
        />

        {/* Gender Selection */}
        <Text style={styles.labelText}>Select Gender</Text>
        <View style={styles.genderContainer}>
          {/* Male Icon */}
          <TouchableOpacity
            style={[
              styles.genderButton,
              selectedGender === "male" ? styles.genderSelected : null,
            ]}
            onPress={() => setSelectedGender("male")}
          >
            <Image
              source={{ uri: "https://img.icons8.com/ios-filled/50/ffffff/male.png" }}
              style={styles.genderIcon}
            />
            <Text style={styles.genderText}>Male</Text>
          </TouchableOpacity>

          {/* Female Icon */}
          <TouchableOpacity
            style={[
              styles.genderButton,
              selectedGender === "female" ? styles.genderSelected : null,
            ]}
            onPress={() => setSelectedGender("female")}
          >
            <Image
              source={{ uri: "https://img.icons8.com/ios-filled/50/ffffff/female.png" }}
              style={styles.genderIcon}
            />
            <Text style={styles.genderText}>Female</Text>
          </TouchableOpacity>
        </View>

        {/* Date of Birth */}
        <Text style={styles.labelText}>Date of birth</Text>
        <View style={styles.datePickerWrapper}>
          <ReactDatePicker
            selected={dateOfBirth}
            onChange={(date) => setDateOfBirth(date)}
            maxDate={new Date()} // Prevent future dates
            showYearDropdown // Enable year dropdown
            showMonthDropdown // Enable month dropdown
            dropdownMode="select" // Use dropdowns instead of scroll
            placeholderText="Select Date of Birth"
            dateFormat="yyyy-MM-dd"
            customInput={
              <TextInput
                style={styles.input}
                placeholder="Select Date of Birth"
                placeholderTextColor="#A0A0A0"
                value={dateOfBirth ? formatDate(dateOfBirth) : ""}
                editable={false} // Prevent manual editing
              />
            }
          />
        </View>

        {/* Next Button */}
        
        <Link style={styles.nextButton}href={'/home/preferences'}>
        <TouchableOpacity style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
        </Link>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
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
    justifyContent: "center",
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
    backgroundColor: "#1A1A1A", // Default background
  },
  genderSelected: {
    backgroundColor: "#1DA1F2", // Highlight selected gender
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
    backgroundColor: "#4A4A4A",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});


// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import ReactDatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// export default function SignupScreen() {
//   const [dateOfBirth, setDateOfBirth] = useState(null); // State to hold selected date
//   const [isDatePickerVisible, setIsDatePickerVisible] = useState(false); // State to control the modal

//   const formatDate = (date) => {
//     if (!date) return "";
//     return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         {/* X Logo */}
//         <View style={styles.logoContainer}>
//           <Text style={styles.logoText}>BLINDER</Text>
//         </View>

//         {/* Name Input */}
//         <TextInput
//           style={styles.input}
//           placeholder="Name / Nickname"
//           placeholderTextColor="#A0A0A0"
//           maxLength={50}
//         />

//         {/* Phone Input */}
//         <TextInput
//           style={styles.input}
//           placeholder="Phone"
//           placeholderTextColor="#A0A0A0"
//           keyboardType="phone-pad"
//         />
//         <TouchableOpacity>
//           <Text style={styles.linkText}>Use email instead</Text>
//         </TouchableOpacity>

//         {/* Date of Birth */}
//         <Text style={styles.labelText}>Date of birth</Text>
//         <View style={styles.datePickerWrapper}>
//           <ReactDatePicker
//   selected={dateOfBirth}
//   onChange={(date) => setDateOfBirth(date)}
//   maxDate={new Date()} // Prevent future dates
//   showYearDropdown // Enable year dropdown
//   showMonthDropdown // Enable month dropdown
//   dropdownMode="select" // Use dropdowns instead of scroll
//   placeholderText="Select Date of Birth"
//   dateFormat="yyyy-MM-dd"
//   customInput={
//     <TextInput
//       style={styles.input}
//       placeholder="Select Date of Birth"
//       placeholderTextColor="#A0A0A0"
//       value={dateOfBirth ? formatDate(dateOfBirth) : ""}
//       editable={false} // Prevent manual editing
//     />
//   }
// />

          
//         </View>

//         {/* Next Button */}
//         <TouchableOpacity style={styles.nextButton}>
//           <Text style={styles.nextButtonText}>Next</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000",
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: "flex-start",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 24,
//   },
//   logoContainer: {
//     marginBottom: 32,
//   },
//   logoText: {
//     fontSize: 48,
//     color: "#fff",
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   input: {
//     width: "100%",
//     backgroundColor: "#1A1A1A",
//     color: "#fff",
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 16,
//     fontSize: 16,
//     justifyContent: "center",
//   },
//   linkText: {
//     color: "#1DA1F2",
//     fontSize: 14,
//     textAlign: "left",
//     alignSelf: "flex-start",
//     marginBottom: 24,
//   },
//   labelText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//     alignSelf: "flex-start",
//     marginBottom: 8,
//   },
//   datePickerWrapper: {
//     width: "100%",
//     marginBottom: 16,
//   },
//   nextButton: {
//     width: "100%",
//     backgroundColor: "#4A4A4A",
//     paddingVertical: 16,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   nextButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });



