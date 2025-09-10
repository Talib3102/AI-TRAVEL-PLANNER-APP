import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../../constants/Colors";
import { auth } from "./../../../configs/FirebaseConfig"; // Adjust the import path as necessary

export default function SignUp() {
  const navigation = useNavigation();
  const router = useRouter();

  // State variables for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  // Hide the header for this screen
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const OnCreateAccount = () => {
    if (!email && !password && !fullName) {
      // Call the function to create a user with email and password
      console.error("Please fill in all fields.");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        // You can navigate to the home screen or perform any other action after successful sign-up
        router.replace("/mytrip"); // Navigate to the My Trip screen after sign-up
        console.log("User created successfully:", user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error creating user:", errorMessage, errorCode);
        // ..
      });
  };
  return (
    <View
      style={{
        padding: 25,
        marginTop: 60,
        backgroundColor: Colors.WHITE,
        height: "100%",
      }}
    >
      {/* Arrow Back Button */}
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={{ fontSize: 35, fontFamily: "outfit-bold", marginTop: 30 }}>
        Create New Account
      </Text>

      {/* Email */}
      <View style={{ marginTop: 50 }}>
        <Text style={{ fontFamily: "outfit-regular" }}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          onChangeText={(value) => setEmail(value)}
        />
      </View>

      {/* Full Name */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontFamily: "outfit-regular" }}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Full Name"
          onChangeText={(value) => setFullName(value)}
        />
      </View>
      {/* Password */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontFamily: "outfit-regular" }}>Password</Text>
        <TextInput
          secureTextEntry={true}
          style={styles.input}
          placeholder="Enter password"
          onChangeText={(value) => setPassword(value)}
        />
      </View>

      {/* Create Account Button */}
      <TouchableOpacity
        onPress={OnCreateAccount} // Call the function to create account
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
          Create Account
        </Text>
      </TouchableOpacity>

      {/* Sign In Button */}
      <TouchableOpacity
        onPress={() => router.replace("/auth/sign-in")} // Navigate to Sign In screen
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
          Sign In
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
