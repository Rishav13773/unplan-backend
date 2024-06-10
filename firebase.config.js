// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJEp_DtzR9hod3mVMwz6b83uycBGOh5ZQ",
  authDomain: "unplan-app-9dbf9.firebaseapp.com",
  databaseURL:
    "https://unplan-app-9dbf9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "unplan-app-9dbf9",
  storageBucket: "unplan-app-9dbf9.appspot.com",
  messagingSenderId: "625806273584",
  appId: "1:625806273584:web:9cbeab00b02583426691f5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storage = getStorage(app);
