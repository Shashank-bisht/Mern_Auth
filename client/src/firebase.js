// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "mernauth-33b49.firebaseapp.com",
  projectId: "mernauth-33b49",
  storageBucket: "mernauth-33b49.appspot.com",
  messagingSenderId: "836239807174",
  appId: "1:836239807174:web:3c9ae67eb96047d0c2bdc7",
  measurementId: "G-20HP72BE65"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
