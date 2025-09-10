import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwlbFy8sKBGqVrBddIp2kKWvSh-lXZa90",
  authDomain: "ai-travel-planner-app-a67c2.firebaseapp.com",
  projectId: "ai-travel-planner-app-a67c2",
  storageBucket: "ai-travel-planner-app-a67c2.appspot.com",
  messagingSenderId: "85377720315",
  appId: "1:85377720315:web:36c60bc8ccb2a1363cf55e",
  measurementId: "G-9FXTXP3G0X",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Use persistent auth for React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
