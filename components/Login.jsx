import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Login() {
  //ek screen se dusri screen par navigate karne ke liye useRootNavigation hook ka istemal karte hain
  const router = useRouter();
  return (
    <View>
      <Image
        source={require("./../assets/images/login.jpg")}
        style={{ width: "100%", height: 520 }}
      />
      <View style={styles.container}>
        <Text
          style={{
            fontSize: 30,
            fontFamily: "outfit-regular",
            textAlign: "center",
            marginTop: 10,
          }}
        >
          AI Travel Planner
        </Text>
        <Text
          style={{
            fontSize: 17,
            fontFamily: "outfit-regular",
            textAlign: "center",
            color: Colors.GRAY,
            marginTop: 20,
          }}
        >
          Discover your next adventure effortlessly. Personalized itineraries at
          your fingertips.Travel smarter with AI-driven insight.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            //ek screen se dusri screen par navigate karne ke liye router.push ka istemal karte hain
            router.push("auth/sign-in")
          }
        >
          <Text
            style={{
              color: Colors.WHITE,
              textAlign: "center",
              fontFamily: "outfit-regular",
              fontSize: 17,
            }}
          >
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    height: "100%",
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 99,
    padding: 15,
    marginTop: "20%",
  },
});
