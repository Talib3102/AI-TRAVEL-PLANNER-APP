import { Colors } from "@/constants/Colors";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import UserTripCard from "./UserTripCard";

export default function UserNewTripList({ userTrips, onDeleteTrip }) {
  const router = useRouter();
  if (!userTrips?.length) return null;

  const LatestTrip =
    typeof userTrips[0].tripData === "string"
      ? JSON.parse(userTrips[0].tripData)
      : userTrips[0].tripData;

  const formatDate = (dateValue) =>
    dateValue?.seconds
      ? dayjs(dateValue.seconds * 1000).format("MMM DD, YYYY")
      : "No date";

  const imageStyle = {
    width: "100%",
    height: 200,
    borderRadius: 10,
    resizeMode: "cover",
  };
  const photoUrl =
    LatestTrip?.locationInfo?.photoReference &&
    process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${LatestTrip.locationInfo.photoReference}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`
      : null;

  return (
    <View>
      <View style={{ marginTop: 20 }}>
        <Image
          source={
            photoUrl
              ? { uri: photoUrl }
              : require("./../../assets/images/placeholder.jpg")
          }
          style={imageStyle}
        />
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>
            {userTrips[0]?.tripPlan?.tripDetails?.destination}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 5,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 17 }}>
              Start: {formatDate(LatestTrip?.startDate)}
            </Text>
            <Text style={{ fontWeight: "bold", fontSize: 17 }}>
              End: {formatDate(LatestTrip?.endDate)}
            </Text>
          </View>
          <Text style={{ fontWeight: "bold", marginTop: 5, fontSize: 17 }}>
            ✈️ {LatestTrip?.travelers?.title || "Solo"}
          </Text>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/trip-details",
                params: { trip: JSON.stringify(userTrips[0]) },
              })
            }
            style={{
              backgroundColor: Colors.PRIMARY,
              padding: 15,
              borderRadius: 15,
              marginTop: 10,
            }}
          >
            <Text
              style={{
                color: Colors.WHITE,
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              See your plan
            </Text>
          </TouchableOpacity>
        </View>
        {userTrips.map((trip, index) => (
          <UserTripCard trip={trip} key={index} onDelete={onDeleteTrip} />
        ))}
      </View>
    </View>
  );
}
