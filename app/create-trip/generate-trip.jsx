import { generateTripPlan } from "@/configs/AiModel";
import { auth, db } from "@/configs/FirebaseConfig";
import { AI_PROMPT } from "@/constants/options";
import { CreateTripContext } from "@/context/CreateTripContext";
import { useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { Image, Text, View } from "react-native";

export default function GenerateTrip() {
  const { tripData, setTripData } = useContext(CreateTripContext);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const user = auth.currentUser;
  useEffect(() => {
    generateAiTrip();
  }, []);
  const generateAiTrip = async () => {
    setLoading(true);
    // Debug: Check what's in tripData
    console.log("Trip Data:", tripData);

    const FINAL_PROMPT = AI_PROMPT.replace(
      "{location}",
      tripData?.locationInfo?.name ||
        tripData?.destination ||
        tripData?.location ||
        "Unknown"
    )
      .replace("{totalDays}", tripData.days)
      .replace("{totalNight}", tripData.days - 1)
      .replace("{travelers}", tripData.travelers?.title)
      .replace("{budget}", tripData.budget)
      .replace("{totalDays}", tripData.days)
      .replace("{totalNight}", tripData.days - 1);

    console.log("FINAL_PROMPT:", FINAL_PROMPT);

    try {
      const result = await generateTripPlan(tripData);
      console.log("AI Response:", result);

      // Check if result has error
      if (result.error) {
        console.error("AI Error:", result.message);
        setLoading(false);
        return;
      }

      // Save to Firebase
      const docId = Date.now().toString();
      await setDoc(doc(db, "UserTrip", docId), {
        userEmail: user.email,
        tripPlan: result, // result is already parsed JSON ai data
        docId: docId,
        createdAt: new Date(),
        tripData: tripData, // user selected data
      });

      console.log("Trip saved to Firebase successfully");
      setLoading(false);
      router.push("(tabs)/mytrip");
    } catch (error) {
      console.error("Error generating trip:", error);
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        padding: 25,
        paddingTop: 75,
        backgroundColor: "white",
        height: "100%",
      }}
    >
      <Text style={{ fontSize: 35, fontWeight: "bold", textAlign: "center" }}>
        Please Wait...
      </Text>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          textAlign: "center",
          marginTop: 40,
        }}
      >
        We are working to generate your dream trip
      </Text>
      <View style={{ alignItems: "center", marginTop: 40 }}>
        <Image
          source={require("./../../assets/images/plane.gif")}
          style={{
            width: 200,
            height: 200,
            borderRadius: 100,
            resizeMode: "cover",
          }}
        />
        <Text
          style={{
            fontSize: 20,
            marginTop: 20,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Do not Go Back
        </Text>
      </View>
    </View>
  );
}
