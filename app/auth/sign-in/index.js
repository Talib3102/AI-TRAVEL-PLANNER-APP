import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "./../../../configs/FirebaseConfig"; // Adjust the import path as necessary
import { Colors } from "./../../../constants/Colors";

export default function SignIn() {
  const navigation = useNavigation();
  const router = useRouter();
  // State variables for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    navigation.setOptions({
      headerShown: false, // Hide the header for this screen
    });
  }, []);

  // signIn function can be implemented here if needed
  // For now, we will just log the email and password
  const onSignIn = () => {
    if (!email && !password) {
      console.error("Please fill in all fields.");
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // You can navigate to the home screen or perform any other action after successful sign-in
        router.replace("/mytrip"); // Navigate to the My Trip screen after sign-in
        console.log("User signed in successfully:", user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error signing in:", errorMessage, errorCode);
        if (errorCode === "auth/invalid-credential") {
          console.error(
            "Invalid credentials. Please check your email and password."
          );
        }
      });
  };
  return (
    <View
      style={{
        padding: 25,
        marginTop: 40,
        backgroundColor: Colors.WHITE,
        height: "100%",
        paddingTop: 80,
      }}
    >
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={{ fontSize: 30, fontFamily: "outfit-bold", marginTop: 30 }}>
        Let's Sign You In
      </Text>
      <Text
        style={{
          fontSize: 30,
          fontFamily: "outfit-regular",
          color: Colors.GRAY,
          marginTop: 20,
        }}
      >
        Welcome Back
      </Text>
      <Text
        style={{
          fontSize: 30,
          fontFamily: "outfit-regular",
          color: Colors.GRAY,
          marginTop: 10,
        }}
      >
        You've been missed!
      </Text>
      {/* Email */}
      <View style={{ marginTop: 50 }}>
        <Text style={{ fontFamily: "outfit-regular" }}>Email</Text>
        <TextInput
          onChangeText={(value) => setEmail(value)}
          style={styles.input}
          placeholder="Enter email"
        />
      </View>
      {/* Password */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontFamily: "outfit-regular" }}>Password</Text>
        <TextInput
          onChangeText={(value) => setPassword(value)}
          secureTextEntry={true}
          style={styles.input}
          placeholder="Enter password"
        />
      </View>

      {/* Sign In Button */}
      <TouchableOpacity
        onPress={onSignIn} // Call the function to sign in
        style={{
          padding: 20,
          backgroundColor: Colors.PRIMARY,
          borderRadius: 15,
          marginTop: 50,
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-regular",
            color: Colors.WHITE,
            textAlign: "center",
            fontSize: 17,
          }}
        >
          Sign In
        </Text>
      </TouchableOpacity>

      {/* Create Account Button */}
      <TouchableOpacity
        onPress={() => router.replace("/auth/sign-up")} // Navigate to Sign Up screen
        style={{
          padding: 20,
          backgroundColor: Colors.WHITE,
          borderRadius: 15,
          marginTop: 20,
          borderWidth: 1,
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-regular",
            color: Colors.PRIMARY,
            textAlign: "center",
            fontSize: 17,
          }}
        >
          Create Account
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    padding: 15,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    borderRadius: 15,
    fontFamily: "outfit-regular",
  },
});
