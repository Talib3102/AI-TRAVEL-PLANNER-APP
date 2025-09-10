import { Colors } from "@/constants/Colors";
import { SelectBudgetList } from "@/constants/options";
import { CreateTripContext } from "@/context/CreateTripContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import OptionCard from "./../../components/CreateTrip/OptionCard";

export default function SelectBudget() {
  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState();
  const { tripData, setTripData } = useContext(CreateTripContext);
  const router = useRouter();

  useEffect(() => {
    selectedOption &&
      setTripData({
        ...tripData,
        budget: selectedOption?.title,
      });
  }, [selectedOption]);

  const onClickContinue = () => {
    if (!selectedOption) {
      // Show an error message or handle the case when no option is selected
      Alert.alert("Error", "Please select a budget option");
      return;
    }
    router.push("/create-trip/review-trip");
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
      {/* Navigation: Back button to return to previous screen */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={{ fontSize: 35, fontWeight: "bold", marginTop: 20 }}>
        Budget
      </Text>
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Choose spending habits for your trip
        </Text>

        <FlatList
          data={SelectBudgetList}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={{ marginVertical: 10 }}
              onPress={() => setSelectedOption(item)}
            >
              <OptionCard option={item} selectedOption={selectedOption} />
            </TouchableOpacity>
          )}
        />
      </View>
      <TouchableOpacity
        onPress={() => onClickContinue()}
        style={{
          backgroundColor: Colors.PRIMARY,
          padding: 20,
          borderRadius: 15,
          marginTop: 20,
          alignItems: "center",
        }}
      >
        <Text
          style={{ color: Colors.WHITE, fontSize: 18, textAlign: "center" }}
        >
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
}
