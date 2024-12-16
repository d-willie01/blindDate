
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Pressable,
  Image,
  Alert
} from "react-native";
import { Link, useRouter } from "expo-router";
import goldCoins from '../../../assets/images/goldCoins.png';
import api from "../../../api/apiCalls";

const ModalScreen = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setPurchasing(true); // Show loading state while processing
    try {
      // Displaying a prompt for gender preference with a 250 coin charge
      const result = window.confirm("Gender preference for 24 hours? (-250 coins)");
      if (result) {
        console.log("User pressed Yes");

        // Deduct coins from the user's account
        const response = await api.post('/transactions/spendCoins', {
          coinAmount: 250
        });

        if (response.status === 200) {
          // Activate premium features for 24 hours
          const premiumResponse = await api.post('/user/setPremium');

          if (premiumResponse.status === 200) {
            console.log(premiumResponse);
            alert("Success! Premium for 24 hours starting NOW!");
            setIsPremium(true); // Update state to reflect the premium status
            router.replace('/home/connect');
          }
        }
      } else {
        console.log("User pressed No");
      }
    } catch (error) {
      console.error(error);
      if (error.response?.data?.error === "Not Enough Tokens") {
        alert("Not Enough Tokens");
        router.replace('/home/coins');
      } else {
        alert("An error occurred. Please try again.");
      }
    } finally {
      setPurchasing(false); // Hide loading state
    }
  };

  return (
    <View style={styles.overlay}>
      {/* Dismiss Modal on Outside Press */}
      <Link href={'/home/connect'} style={styles.overlayBackground} />

      {/* Modal Content */}
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Filter Preferences:</Text>
          <View style={styles.premiumStatus}>
            <Text style={[styles.premiumBadge, isPremium ? styles.premiumActive : styles.premiumLocked]}>
              {isPremium ? "Premium" : "Premium Locked"}
            </Text>
          </View>
          <Link href={'/home/connect'} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </Link>
        </View>

        {/* Scrollable Content */}
        <ScrollView contentContainerStyle={styles.content}>
          {/* Gender Filter */}
          <Text style={styles.sectionTitle}>Gender</Text>
          <View style={styles.filterOptions}>
            {/* Gender Preference Button 1 */}
            <TouchableOpacity
              onPress={handleClick}
              style={[styles.filterButton, isPremium ? styles.activeButton : styles.disabledButton]}>
              {!isPremium && (
                <View style={styles.lockOverlay}>
                  <View style={styles.lockContainer}>
                    <Image
                      source={{ uri: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678129-lock-512.png' }}
                      style={styles.lockIcon}
                    />
                    <Text style={{ fontSize: 50 }}>👩‍🦰</Text>
                  </View>

                  <View style={styles.coinText}>
                    <Image source={goldCoins} style={styles.tokenIcon} />
                    <Text style={styles.tokenText}>250</Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>

            {/* Gender Preference Button 2 */}
            <TouchableOpacity
              onPress={handleClick}
              style={[styles.filterButton, isPremium ? styles.activeButton : styles.disabledButton]}>
              {!isPremium && (
                <View style={styles.lockOverlay}>
                  <View style={styles.lockContainer}>
                    <Image
                      source={{ uri: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678129-lock-512.png' }}
                      style={styles.lockIcon}
                    />
                    <Text style={{ fontSize: 50 }}>👨</Text>
                  </View>

                  <View style={styles.coinText}>
                    <Image source={goldCoins} style={styles.tokenIcon} />
                    <Text style={styles.tokenText}>250</Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>

            {/* Gender Preference Button 3 (Both) */}
            <TouchableOpacity style={[styles.filterButton, styles.activeButton]}>
              <Text style={styles.filterButtonText}>Both</Text>
            </TouchableOpacity>
          </View>

          {/* Start Linking Button */}
          <TouchableOpacity onPress={() => { router.back(); }} style={styles.linkingButton}>
            <Text style={{ fontWeight: 'bold' }}>START LINKING</Text>
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
    height: height * 0.3,
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    color: "white",
  },
  premiumStatus: {
    flex: 1,
    alignItems: "center",
  },
  premiumBadge: {
    fontSize: 14,
    fontWeight: "bold",
    padding: 5,
    borderRadius: 5,
    overflow: "hidden",
  },
  premiumActive: {
    color: "#fff",
    backgroundColor: "#4caf50",
  },
  premiumLocked: {
    color: "#999",
    backgroundColor: "#ddd",
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
    flexWrap: "wrap",
    marginBottom: 20,
  },
  filterButton: {
    flexDirection: "row",
    flex: 1,
    padding: 15,
    margin: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    minWidth: 100,
  },
  linkingButton: {
    flexDirection: "row",
    flex: 1,
    padding: 15,
    margin: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4caf50",
    minWidth: 100,
  },
  activeButton: {
    backgroundColor: "#f0f0f0",
    borderWidth: 5,
    borderColor: "#4caf50",
  },
  disabledButton: {
    backgroundColor: "#ddd",
  },
  filterButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: 'bold',
  },
  lockOverlay: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  lockIcon: {
    width: 30,
    height: 30,
    marginBottom: 10,
  },
  tokenText: {
    fontSize: 14,
    color: "#333",
  },
  lockContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  coinText: {
    marginLeft: 5,
  },
  tokenIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
});

export default ModalScreen;


// import React, {useState} from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Dimensions,
//   Pressable,
//   Image,
//   Alert

// } from "react-native";
// import { Link, useRouter } from "expo-router";
// import goldCoins from '../../../assets/images/goldCoins.png';
// import Logo from '../../../assets/images/logo.png';
// import api from "../../../api/apiCalls";
// import Confetti from 'react-native-simple-confetti';


// const ModalScreen = () => {
  
//   const [isPremium, setIsPremium] = useState(false)
//   const [confetti, setConfetti] = useState(true)
//   const [purchasing, setPurchasing] = useState(false)
//   const router = useRouter();

//   const handleClick = async() =>{
//     console.log('Hoe boi')
//     const result = window.confirm("Gender preference for 24 hours? (-250 coins)");
//     if (result) {




//       console.log("User pressed Yes");
//       try {
//         const response = await api.post('/transactions/spendCoins', {
//           coinAmount: 250
//         })
    
//         if(response.status == 200)
//         {
          
//          const response = await api.post('/user/setPremium')

//          if(response.status === 200)
//          {

//           console.log(response);
//           alert("Success! Premium for 24 hours starting NOW!")
//           router.replace('/home/connect')

//          }
         

          
//         }
//       } catch (error) {
//         console.log(error)
  
//         if(error.response.data.error = "Not Enough Tokens")
//         {
//           alert(error.response.data.error);
//           router.replace('/home/coins')
//         }
        
  
//       }


//     } else {




//       console.log("User pressed No");
//     }
    
//   }
//       return (
//         <View style={styles.overlay}>


//           {/* Dismiss Modal on Outside Press */}
//           <Link href={'/home/connect'} style={styles.overlayBackground}  />
    
//           {/* Modal Content */}
//           <View style={styles.modalContainer}>
//             {/* Header */}
//             <View style={styles.header}>
//               <Text style={styles.headerText}>Filter Preferences:</Text>
//               <View style={styles.premiumStatus}>
//                 <Text style={[styles.premiumBadge, isPremium ? styles.premiumActive : styles.premiumLocked]}>
//                   {isPremium ? "Premium" : "Premium Locked"}
//                 </Text>
//               </View>
//               <Link href={'/home/connect'}  style={styles.closeButton}>
//                 <Text style={styles.closeButtonText}>✕</Text>
//               </Link>
//             </View>
    
//             {/* Scrollable Content */}
//             <ScrollView contentContainerStyle={styles.content}>
//               {/* Gender Filter */}
//               <Text style={styles.sectionTitle}>Gender</Text>
//               <View style={styles.filterOptions}>
    
    
    
    
    
//                 <TouchableOpacity onPress={handleClick} style={[styles.filterButton, isPremium ? styles.activeButton : styles.disabledButton]}>
                  
//                   {!isPremium && (
//                     <View style={styles.lockOverlay}>
    
//                       <View style={styles.lockContainer}>
//                       <Image source={{ uri: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678129-lock-512.png' }} style={styles.lockIcon} />
//                       <Text style={{
//                         fontSize:50
//                       }}>👩‍🦰</Text>
                      
//                         </View>
    
    
//                       <View style={styles.coinText}>
//                         <Image source={goldCoins} style={styles.tokenIcon} />
//                         <Text style={styles.tokenText}>250</Text>
//                         </View>
    
    
                      
//                     </View>
//                   )}
//                 </TouchableOpacity>
    
    
//                 <TouchableOpacity 
//                 onPress={handleClick} style={[styles.filterButton, isPremium ? styles.activeButton : styles.disabledButton]}>
                  
//                 {!isPremium && (
//                     <View style={styles.lockOverlay}>
    
//                       <View style={styles.lockContainer}>
//                       <Image source={{ uri: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678129-lock-512.png' }} style={styles.lockIcon} />
//                       <Text style={{
//                         fontSize:50
//                       }}>👨</Text>
                      
//                         </View>
    
    
//                       <View style={styles.coinText}>
//                         <Image source={goldCoins} style={styles.tokenIcon} />
//                         <Text style={styles.tokenText}>250</Text>
//                         </View>
    
    
                      
//                     </View>
//                   )}
//                 </TouchableOpacity>
//                 <TouchableOpacity style={[styles.filterButton, styles.activeButton]}>
//                   <Text style={styles.filterButtonText}>Both</Text>
//                 </TouchableOpacity>
//               </View>
    
             
//               <TouchableOpacity onPress={()=>{
//                 router.back();
//               }} style={styles.linkingButton}>
//                     <Text style={{
//                       fontWeight:'bold'
//                     }}>START LINKING</Text>
//                 </TouchableOpacity>
//             </ScrollView>
//           </View>
//         </View>
//       );    


 
// };

// const { height } = Dimensions.get("screen");

// const styles = StyleSheet.create({

//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.6)", // Dimmed background
//   },
//   overlayBackground: {
//     flex: 1,
//   },
//   modalContainer: {
//     position: "absolute",
//     bottom: 0,
//     width: "100%",
//     height: height * 0.3, // Increased height for better view
//     backgroundColor: '#1E1E1E',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//   },
//   modalPurchaseContainer: {
//     //position: "absolute",
//     justifyContent:"center",
//     alignItems:'center',
//     bottom: 0,
//     width: "100%",
//     height: height * 0.3, // Increased height for better view
//     backgroundColor: '#1E1E1E',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ddd",
//   },
//   purchaseHeader: {
//     position:'absolute',
//     top:10,
//     width:'100%',
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 15,
//     // borderBottomWidth: 1,
//     borderBottomColor: "#ddd",
//   },
//   purchaseHeaderText: {
//     top:10,
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "white",
//   },
//   headerText: {
//     top:10,
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "white",
//   },
//   premiumStatus: {
//     flex: 1,
//     alignItems: "center",
//   },
//   premiumBadge: {
//     fontSize: 14,
//     fontWeight: "bold",
//     padding: 5,
//     borderRadius: 5,
//     overflow: "hidden",
//   },
//   premiumActive: {
//     color: "#fff",
//     backgroundColor: "#4caf50",
//   },
//   premiumLocked: {
//     color: "#999",
//     backgroundColor: "#ddd",
//   },
//   closeButton: {
//     padding: 8,
//   },
//   closeButtonText: {
//     fontSize: 20,
//     color: "#999",
//   },
//   content: {
//     //borderWidth: 5,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//   },
//   sectionTitle: {
    
//     fontSize: 16,
//     fontWeight: "600",
//     color: "white",
//     marginBottom: 10,
//   },
//   filterOptions: {
   
//     flexDirection: "row",
//     flexWrap: "wrap", // Ensure filters wrap properly on smaller screens
//     marginBottom: 20,
//   },
//   filterButton: {
    
//     flexDirection: "row",
//     flex: 1,
//     padding: 15, // Increased padding for larger buttons
//     margin: 5,
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#f0f0f0",
//     minWidth: 100, // Ensure buttons have a minimum width
//   },
//   linkingButton: {
    
//     flexDirection: "row",
//     flex: 1,
//     padding: 15, // Increased padding for larger buttons
//     margin: 5,
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#4caf50",
//     minWidth: 100, // Ensure buttons have a minimum width
    
//   },
//   activeButton: {
//     backgroundColor: "#f0f0f0",
//     borderWidth:5,
//     borderColor:"#4caf50"
//   },
//   disabledButton: {
//     backgroundColor: "#ddd",
//   },
//   filterButtonText: {
//     fontSize: 16, // Increased font size for better readability
//     color: "#333",
//     fontWeight:'bold'
    
    
//   },
//   disabledText: {
//     color: "#999",
//   },
//   lockOverlay: {
    
//     position: "absolute",
    
//     flexDirection: "row",
    
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   lockIcon: {
//     width: 30,
//     height: 30,
//     marginBottom: 10,
//   },
//   tokenPrice: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   tokenIcon: {
//     width: 20,
//     height: 20,
//     marginRight: 5,
//   },
//   tokenText: {
//     fontSize: 14,
//     color: "#333",
//   },
//   lockContainer:{
     
//       flexDirection: "row",
//       alignItems: "center",
//   },
//   coinText:{
//     marginLeft:5,
     
//   }
// });

// export default ModalScreen;

