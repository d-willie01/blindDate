// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADocXBQ0jSPdVUbH3GW3aYC7iDz2SVWQM",
  authDomain: "connext-1c88c.firebaseapp.com",
  projectId: "connext-1c88c",
  storageBucket: "connext-1c88c.firebasestorage.app",
  messagingSenderId: "863395694618",
  appId: "1:863395694618:web:f7f480e6d61adcd52569a3",
  measurementId: "G-951YPFC1NY"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
//const analytics = getAnalytics(app);