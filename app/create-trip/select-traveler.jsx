import OptionCard from "@/components/CreateTrip/OptionCard";
import { Colors } from "@/constants/Colors";
import { CreateTripContext } from "@/context/CreateTripContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, useNavigation } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SelectTravelesList } from "./../../constants/options";
export default function SelectTraveler() {
  const navigation = useNavigation(); // Hook to handle screen navigation
  const [selectedTravelers, setSelectedTravelers] = useState([]);
  const { tripData, setTripData } = useContext(CreateTripContext); // Trip data updater from global context

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    setTripData({ ...tripData, travelers: selectedTravelers });
  }, [selectedTravelers]);

  useEffect(() => {
    console.log(tripData);
  }, [tripData]);

  return (
    <View
      style={{
        padding: 25,
        paddingTop: 75,
        backgroundColor: Colors.WHITE,
        height: "100%",
      }}
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={{ fontSize: 35, fontWeight: "bold", marginTop: 20 }}>
        Who is Traveling
      </Text>
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 23, fontWeight: "bold" }}>
          Choose your Traveles
        </Text>
        <FlatList
          data={SelectTravelesList}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => setSelectedTravelers(item)}
              style={{ marginVertical: 10 }}
            >
              <OptionCard option={item} selectedOption={selectedTravelers} />
            </TouchableOpacity>
          )}
        />
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: Colors.PRIMARY,
          padding: 20,
          borderRadius: 15,
          marginTop: 20,
          alignItems: "center",
        }}
      >
        <Link
          href="/create-trip/select-date"
          style={{ width: "100%", textAlign: "center" }}
        >
          <Text
            style={{ color: Colors.WHITE, fontSize: 18, textAlign: "center" }}
          >
            Continue
          </Text>
        </Link>
      </TouchableOpacity>
    </View>
  );
}
