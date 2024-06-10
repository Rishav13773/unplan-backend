// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyDVjfpyf7KleqmLF4UKRQDn-VN0V013ZYo",
  authDomain: "spotify-clone-development.firebaseapp.com",
  databaseURL:
    "https://spotify-clone-development-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "spotify-clone-development",
  storageBucket: "spotify-clone-development.appspot.com",
  messagingSenderId: "317876986408",
  appId: "1:317876986408:web:27b1f53dac80e4dd8e4b1d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storage = getStorage(app);
