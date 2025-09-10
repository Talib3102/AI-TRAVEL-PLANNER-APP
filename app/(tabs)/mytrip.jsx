import UserNewTripList from "@/components/MyTrips/UserNewTripList";
import { auth, db } from "@/configs/FirebaseConfig";
import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { collection, getDocs, query, where, doc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import StartNewTripCard from "../../components/MyTrips/StartNewTripCard";

export default function MyTrip() {
  const [userTrips, setUserTrips] = useState([]);
  const user = auth.currentUser;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    user && GetMyTrip();
  }, [user]);

  const GetMyTrip = async () => {
    setLoading(true);
    setUserTrips([]);
    const q = query(
      collection(db, "UserTrip"),
      where("userEmail", "==", user?.email)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      setUserTrips((prev) => [...prev, doc.data()]);
    });
    setLoading(false);
  };

  const handleDeleteTrip = async (tripId) => {
    try {
      await deleteDoc(doc(db, "UserTrip", tripId));
      // Remove from local state
      setUserTrips(prev => prev.filter(trip => trip.docId !== tripId));
      Alert.alert("Success", "Trip deleted successfully!");
    } catch (error) {
      console.error("Error deleting trip:", error);
      Alert.alert("Error", "Failed to delete trip. Please try again.");
    }
  };
  return (
    <ScrollView
      style={{
        padding: 25,
        paddingTop: 55,
        backgroundColor: Colors.WHITE,
        height: "100%",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignContent: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 35,
          }}
        >
          My Trip
        </Text>
        <TouchableOpacity onPress={() => router.push("/create-trip/search-place")}>
          <Ionicons name="add-circle" size={50} color="black" />
        </TouchableOpacity>
      </View>
      {loading && <ActivityIndicator size="large" color={Colors.PRIMARY} />}
      {userTrips?.length == 0 ? <StartNewTripCard /> : <UserNewTripList userTrips={userTrips} onDeleteTrip={handleDeleteTrip} />}
    </ScrollView>
  );
}
