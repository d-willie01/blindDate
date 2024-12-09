import React, {useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Pressable,
  Image,

} from "react-native";
import { Link, useRouter } from "expo-router";
import goldCoins from '../../assets/images/goldCoins.png';
import Logo from '../../assets/images/logo.png';
import api from "../../api/apiCalls";
import Confetti from 'react-native-simple-confetti';
// Mock user premium status
//const isPremium = false;

const ModalScreen = () => {
  
  const [isPremium, setIsPremium] = useState(false)
  const [confetti, setConfetti] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const router = useRouter();

  const handleClick = () =>{

    if(isPremium)
      {
        return;
      }

    setPurchasing(true)
    
  }

  const handleConfirm = async() =>{

   

    const response = await api.post('/transactions/spendCoins', {
      coinAmount: 250
    })

    if(response.status == 200)
    {
      //setConfetti(true);
      setIsPremium(true);
      setPurchasing(false);

    }



  }

  if(!purchasing)

    {
      return (
        <View style={styles.overlay}>


          {/* Dismiss Modal on Outside Press */}
          <Link href={'/home/connect'} style={styles.overlayBackground}  />
    
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
              <Link href={'/home/connect'}  style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </Link>
            </View>
    
            {/* Scrollable Content */}
            <ScrollView contentContainerStyle={styles.content}>
              {/* Gender Filter */}
              <Text style={styles.sectionTitle}>Gender</Text>
              <View style={styles.filterOptions}>
    
    
    
    
    
                <TouchableOpacity onPress={handleClick} style={[styles.filterButton, isPremium ? styles.activeButton : styles.disabledButton]}>
                  
                  {!isPremium && (
                    <View style={styles.lockOverlay}>
    
                      <View style={styles.lockContainer}>
                      <Image source={{ uri: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678129-lock-512.png' }} style={styles.lockIcon} />
                      <Text style={{
                        fontSize:50
                      }}>👩‍🦰</Text>
                      
                        </View>
    
    
                      <View style={styles.coinText}>
                        <Image source={goldCoins} style={styles.tokenIcon} />
                        <Text style={styles.tokenText}>250</Text>
                        </View>
    
    
                      
                    </View>
                  )}
                </TouchableOpacity>
    
    
    
    
    
    
    
    
    
    
                <TouchableOpacity 
                onPress={handleClick} style={[styles.filterButton, isPremium ? styles.activeButton : styles.disabledButton]}>
                  
                {!isPremium && (
                    <View style={styles.lockOverlay}>
    
                      <View style={styles.lockContainer}>
                      <Image source={{ uri: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678129-lock-512.png' }} style={styles.lockIcon} />
                      <Text style={{
                        fontSize:50
                      }}>👨</Text>
                      
                        </View>
    
    
                      <View style={styles.coinText}>
                        <Image source={goldCoins} style={styles.tokenIcon} />
                        <Text style={styles.tokenText}>250</Text>
                        </View>
    
    
                      
                    </View>
                  )}
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
                <TouchableOpacity 
                onPress={handleClick} style={[styles.filterButton, isPremium ? styles.activeButton : styles.disabledButton]}>
                  
                {!isPremium && (
                    <View style={styles.lockOverlay}>
    
                      <View style={styles.lockContainer}>
                      <Image source={{ uri: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678129-lock-512.png' }} style={styles.lockIcon} />
                      <Image style={{
                          height:50,
                          width: 100,
                          borderRadius:10
                        }} source={{
                          uri:'https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/440px-Flag_of_the_United_States.svg.png'
                        }}/>
                      
                        </View>
    
    
                      <View style={styles.coinText}>
                        <Image source={goldCoins} style={styles.tokenIcon} />
                        <Text style={styles.tokenText}>250</Text>
                        </View>
    
    
                      
                    </View>
                  )}
                </TouchableOpacity>
    
                
               
              </View>
              <TouchableOpacity onPress={()=>{
                router.back();
              }} style={styles.linkingButton}>
                    <Text style={{
                      fontWeight:'bold'
                    }}>START LINKING</Text>
                </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      );
    }

    else{
      return(

        <View style={styles.overlay}>
          
       {confetti && <View style={styles.overlay}>
        <Confetti count={50} type="tumble" />
      </View>}
            <Link href={'/home/connect'} style={styles.overlayBackground} />

          <View style={styles.modalPurchaseContainer}>
          

          <View style={styles.purchaseHeader}>

              <Text style={styles.purchaseHeaderText}>Purchase</Text>


          </View>

          <View style={{
            borderBottomWidth:2,
            borderBottomColor:"white"
          }}>

              <Text style={{
                fontSize:20,
                fontWeight:"bold",
                color:"white"
              }}>Upgrade to Premium:</Text>
          </View>

          <View style={{
            
            flexDirection:"row"
          }}>

            <TouchableOpacity onPress={()=>setPurchasing(false)} style={{backgroundColor: 'grey',
      borderRadius: 8,
      padding: 10,
      justifyContent:"center",
      alignItems: 'center',
      margin: 25,}}><Text style={{
        fontSize:25,
        //fontWeight:'bold'
      }}>
        Cancel</Text></TouchableOpacity>

            <TouchableOpacity onPress={handleConfirm} style={{backgroundColor: '#6FFF6F',
      borderRadius: 8,
      padding: 10,
      alignItems: 'center',
      margin: 20,}}><Text style={{
        fontSize:25,
        //fontWeight:'bold'
      }}>
        Confirm</Text> <Text style={{
          fontWeight:'bold'
        }}>(-250) <Image style={{
          height:25,
          width:25,
          resizeMode:'contain'
        }}source={goldCoins}/></Text></TouchableOpacity>

          </View>

          <View style={{
           
            flexDirection:"row"
          }}>
            <Image source={Logo} style={{
              height:50,
              width:50,
              resizeMode:"contain",
              
            }}/>
            <Text style={{
              color:'gold',
              fontSize:15
            }}>+premium</Text>


          </View>



          </View>

          
          
        </View>
        
        
      )
    }

 
};

const { height } = Dimensions.get("screen");

const styles = StyleSheet.create({

  confettiContainer:{
        flex:1
  },
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
    height: height * 0.5, // Increased height for better view
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalPurchaseContainer: {
    //position: "absolute",
    justifyContent:"center",
    alignItems:'center',
    bottom: 0,
    width: "100%",
    height: height * 0.3, // Increased height for better view
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
  purchaseHeader: {
    position:'absolute',
    top:10,
    width:'100%',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    // borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  purchaseHeaderText: {
    top:10,
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  headerText: {
    top:10,
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
    //borderWidth: 5,
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
    flexWrap: "wrap", // Ensure filters wrap properly on smaller screens
    marginBottom: 20,
  },
  filterButton: {
    
    flexDirection: "row",
    flex: 1,
    padding: 15, // Increased padding for larger buttons
    margin: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    minWidth: 100, // Ensure buttons have a minimum width
  },
  linkingButton: {
    
    flexDirection: "row",
    flex: 1,
    padding: 15, // Increased padding for larger buttons
    margin: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4caf50",
    minWidth: 100, // Ensure buttons have a minimum width
    
  },
  activeButton: {
    backgroundColor: "#f0f0f0",
    borderWidth:5,
    borderColor:"#4caf50"
  },
  disabledButton: {
    backgroundColor: "#ddd",
  },
  filterButtonText: {
    fontSize: 16, // Increased font size for better readability
    color: "#333",
    fontWeight:'bold'
    
    
  },
  disabledText: {
    color: "#999",
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
  tokenPrice: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  tokenIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  tokenText: {
    fontSize: 14,
    color: "#333",
  },
  lockContainer:{
     
      flexDirection: "row",
      alignItems: "center",
  },
  coinText:{
    marginLeft:5,
     
  }
});

export default ModalScreen;

// {confetti &&
      
//   <View style={{
//     flex: 1,

// backgroundColor: 'white',
//   }}>
//   {/* Full-screen confetti overlay */}
//   <View style={{...StyleSheet.absoluteFillObject, // Makes the View full-screen
// zIndex: 1, }}>
//     <Confetti
//       start={1500}
//       itemSize={50}
//       images={[goldCoins]}
//       count={75}
//       type="tumble"
//     />
//   </View>

//   {/* Congratulations message */}
//   <View style={{flex: 1,
// justifyContent: 'center',
// alignItems: 'center',
// zIndex: 2, }}>
//     <Text style={{fontSize: 32,
// fontWeight: 'bold',
// textAlign: 'center',
// color: 'gold',}}>🎉 Congratulations! 🎉</Text>
//     <Text style={{ fontSize: 18,
// textAlign: 'center',
// color: 'gray',
// marginTop: 10,}}> You've achieved a milestone!</Text>
//   </View>
// </View>
//       }