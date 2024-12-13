// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8Ov5xsD_qDZUjV6gcfBs0IG9d5d8TCBE",
  authDomain: "livelinkme-app.firebaseapp.com",
  projectId: "livelinkme-app",
  storageBucket: "livelinkme-app.firebasestorage.app",
  messagingSenderId: "848262898852",
  appId: "1:848262898852:web:013e764310578d0603b231",
  measurementId: "G-7NQ8SM558E"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
//const analytics = getAnalytics(app);