import { Colors } from "@/constants/Colors";
import { CreateTripContext } from "@/context/CreateTripContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import dayjs from "dayjs";
import { useNavigation, useRouter } from "expo-router";
import React, { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function ReviewTrip() {
  const navigation = useNavigation();
  const { tripData, setTripData } = useContext(CreateTripContext);
  const router = useRouter();

  // Debug: Check what's in tripData
  // console.log("Trip Data:", tripData);

  return (
    <View
      style={{
        padding: 25,
        paddingTop: 75,
        backgroundColor: "white",
        height: "100%",
      }}
    >
      {/* Navigation: Back button to return to previous screen */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={{ fontSize: 35, fontWeight: "bold", marginTop: 20 }}>
        Review your trip
      </Text>
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 16, marginTop: 10, fontWeight: "bold" }}>
          Before generating your trip, please review the details below:
        </Text>
        {/* Destination information */}
        <View
          style={{
            marginTop: 40,
            display: "flex",
            flexDirection: "row",
            gap: 20,
          }}
        >
          <Ionicons name="location-sharp" size={34} color="black" />
          <View>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 20,
                color: Colors.LIGHT_GRAY,
              }}
            >
              Destination
            </Text>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {/* Logical OR chain to find destination name from different possible properties */}
              {tripData?.destination || // Try: direct destination property
                tripData?.locationInfo?.name || // Try: nested locationInfo.name property
                tripData?.location || // Try: simple location property
                "No destination selected"}{" "}
              {/* Fallback: default message if none found */}
            </Text>
          </View>
        </View>
        {/* Date selecting info*/}
        <View
          style={{
            marginTop: 25,
            display: "flex",
            flexDirection: "row",
            gap: 20,
          }}
        >
          <Ionicons name="calendar-number-outline" size={30} color="black" />
          <View>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 20,
                color: Colors.LIGHT_GRAY,
              }}
            >
              Date
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              {/* Logical OR chain to find date from different possible properties */}
              {tripData?.startDate
                ? dayjs(tripData.startDate).format("MMM DD, YYYY") +
                  " To " +
                  (tripData?.endDate
                    ? dayjs(tripData.endDate).format("MMM DD, YYYY")
                    : "No end date selected")
                : "No start date selected" + "   "}
              ({tripData?.days} days)
            </Text>
          </View>
        </View>

        {/* Traveler Information */}
        <View
          style={{
            marginTop: 25,
            display: "flex",
            flexDirection: "row",
            gap: 20,
          }}
        >
          <Ionicons name="people" size={30} color="black" />
          <View>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 20,
                color: Colors.LIGHT_GRAY,
              }}
            >
              Who is traveling
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              {tripData?.travelers?.title}
            </Text>
          </View>
        </View>

        {/* Budget Information */}
        <View
          style={{
            marginTop: 25,
            display: "flex",
            flexDirection: "row",
            gap: 20,
          }}
        >
          <Ionicons name="wallet" size={30} color="black" />
          <View>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 20,
                color: Colors.LIGHT_GRAY,
              }}
            >
              Budget
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              {tripData?.budget}
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => router.replace("/create-trip/generate-trip")}
        style={{
          backgroundColor: Colors.PRIMARY,
          padding: 20,
          borderRadius: 15,
          marginTop: 80,
          alignItems: "center",
        }}
      >
        <Text
          style={{ color: Colors.WHITE, fontSize: 18, textAlign: "center" }}
        >
          Build My trip
        </Text>
      </TouchableOpacity>
    </View>
  );
}
