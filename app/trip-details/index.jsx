import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View, ScrollView } from "react-native";

import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import dayjs from "dayjs";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import FlightInfo from "@/components/TripDetails/FlightInfo";
import HotelList from "@/components/TripDetails/HotelList";
import PlannedTrip from "@/components/TripDetails/PlannedTrip";

export default function TripDetails() {
  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [tripDetails, setTripDetails] = useState(null);

  const formatDate = (dateValue) =>
    dateValue?.seconds
      ? dayjs(dateValue.seconds * 1000).format("MMM DD, YYYY")
      : "No date";

  useEffect(() => {
    if (params.trip && !tripDetails) {
      try {
        const tripData =
          typeof params.trip === "string"
            ? JSON.parse(params.trip)
            : params.trip;
        setTripDetails(tripData);
      } catch (error) {
        console.error("Error parsing trip data:", error);
      }
    }
  }, [params.trip]);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.WHITE,
      }}
    >
      {/* Navigation: Back button to return to previous screen */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: "absolute",
          top: 50,
          left: 25,
          zIndex: 10,
          backgroundColor: "rgba(255,255,255,0.7)", // makes it visible on any image
          padding: 8,
          borderRadius: 50,
        }}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      {tripDetails?.tripData?.locationInfo?.photoReference &&
        process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY && (
          <Image
            source={{
              uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${tripDetails.tripData.locationInfo.photoReference}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`,
            }}
            style={{
              width: "100%",
              height: 300,
              resizeMode: "cover", // full bleed like first screenshot
            }}
            onError={(error) => {
              console.log(
                "Google Maps image load error:",
                error.nativeEvent?.error
              );
            }}
          />
        )}
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: Colors.WHITE,
          marginTop: -30,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}
        contentContainerStyle={{
          padding: 25,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>
          {tripDetails?.tripData?.locationInfo?.name || "Unknown"}
        </Text>
        <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
          <Text style={{ fontWeight: "bold", fontSize: 17 }}>
            Start: {formatDate(tripDetails?.tripData?.startDate)}
          </Text>
          <Text style={{ fontWeight: "bold", fontSize: 17 }}>
            - End: {formatDate(tripDetails?.tripData?.endDate)}
          </Text>
        </View>
        <Text style={{ fontWeight: "bold", marginTop: 5, fontSize: 17 }}>
          ✈️ {tripDetails?.tripData?.travelers?.title || "Solo"}
        </Text>
        {/* flight detail */}
        <FlightInfo flightData={tripDetails?.tripPlan?.flights} />

        {/* hotel detail */}
        <HotelList hotelList={tripDetails?.tripPlan?.hotels} />
        {/* Trip Plan details */}
        <PlannedTrip details={tripDetails?.tripPlan?.itinerary || {}} />
        
        {/* Save Trip Button */}
        <TouchableOpacity
          onPress={() => router.push("/mytrip")}
          style={{
            backgroundColor: Colors.PRIMARY,
            padding: 15,
            borderRadius: 15,
            marginTop: 20,
            marginBottom: 30,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: Colors.WHITE,
              fontSize: 17,
              fontWeight: 'bold',
            }}
          >
            Save Trip
          </Text>
        </TouchableOpacity>
      </ScrollView>
      
    </View>
  );
}
