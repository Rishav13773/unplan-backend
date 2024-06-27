// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyB2ahz87V2kKAEx4U0MriEHG4SzEIAi0DY",
  authDomain: "unplan-app-9d816.firebaseapp.com",
  databaseURL:
    "https://unplan-app-9d816-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "unplan-app-9d816",
  storageBucket: "unplan-app-9d816.appspot.com",
  messagingSenderId: "1031738212038",
  appId: "1:1031738212038:web:f23470a0ac0c8f74c3a1c7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storage = getStorage(app);
