import dayjs from "dayjs";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View, Alert } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function UserTripCard({ trip, onDelete }) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  
  const handleTripPress = () => {
    router.push({
      pathname: '/trip-details',
      params: { trip: JSON.stringify(trip) }
    });
  };

  // Helper function to format date safely
  const formatDate = (dateValue) => {
    if (!dateValue) return "No date";

    // Handle Firebase Timestamp
    if (dateValue.seconds) {
      return dayjs(dateValue.seconds * 1000).format("MMM DD, YYYY");
    }

    // Handle Date object or string
    const date = dayjs(dateValue);
    if (date.isValid()) {
      return date.format("MMM DD, YYYY");
    }

    // If all else fails, show raw value
    return `Invalid date: ${dateValue}`;
  };

  // Get trip data (might be string or object)
  let tripData;
  try {
    tripData =
      typeof trip.tripData === "string"
        ? JSON.parse(trip.tripData)
        : trip.tripData;
  } catch (error) {
    tripData = trip.tripData || {};
  }
  


  return (
    <TouchableOpacity onPress={handleTripPress}>
      <View
        style={{ marginTop: 10, display: "flex", flexDirection: "row", gap: 10 , alignItems: "center"}}
      >
      {tripData?.locationInfo?.photoReference && process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ? (
        <Image 
          source={{ 
            uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${tripData.locationInfo.photoReference}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`
          }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 15,
            resizeMode: "cover",
            marginTop: 20,
          }}
          onError={(error) => {
            console.log('Image load error:', error.nativeEvent?.error);
          }}
        />
      ) : (
        <Image
          source={require("./../../assets/images/travel.jpg")}
          style={{
            width: 100,
            height: 100,
            borderRadius: 15,
            resizeMode: "cover",
            marginTop: 20,
          }}
        />
      )}
      
      <View style={{ flex: 1, padding: 10 }}>
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>
          Trip to {trip.tripPlan?.tripDetails?.destination || "Unknown"}
        </Text>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
          Start: {formatDate(tripData?.startDate || trip.tripPlan?.startDate)}
        </Text>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
          End: {formatDate(tripData?.endDate || trip.tripPlan?.endDate)}
        </Text>
        <Text style={{ fontWeight: "bold", marginTop: 5, fontSize: 17 }}>
          ✈️{" "}
          {tripData?.travelers?.title ||
            tripData?.travelerType?.title ||
            trip.tripPlan?.tripDetails?.travelerType ||
            "Traveler info not available"}
        </Text>
      </View>
      
      {/* Three Dot Menu */}
      <TouchableOpacity 
        onPress={() => {
          Alert.alert(
            "Delete Trip",
            "Are you sure you want to delete this trip?",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Delete", style: "destructive", onPress: () => onDelete(trip.docId) }
            ]
          );
        }}
        style={{ padding: 10 }}
      >
        <Ionicons name="ellipsis-vertical" size={20} color="gray" />
      </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

{
  /* <View key={index} style={{ marginTop: 20 }}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              Trip {index + 1}:{" "}
              {trip.tripPlan?.tripDetails?.destination || "Unknown"}
            </Text>
            <Text>
              Start: {formatDate(trip.tripPlan?.startDate)}
            </Text>
            <Text>
              End: {formatDate(trip.tripPlan?.endDate)}
            </Text>
          </View> */
}
