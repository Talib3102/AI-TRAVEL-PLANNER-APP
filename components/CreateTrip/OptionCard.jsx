import { Colors } from "@/constants/Colors";
import React from "react";
import { Text, View } from "react-native";

export default function OptionCard({ option, selectedOption }) {
  return (
    <View
      style={[
        {
          padding: 25,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: Colors.GRAY,
          borderRadius: 15,
        },
        selectedOption?.id == option?.id && {
          borderWidth: 3,
        },
      ]}
    >
      <View>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 20,
          }}
        >
          {option?.title}
        </Text>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 15,
            color: "gray",
          }}
        >
          {option?.desc}
        </Text>
      </View>
      <Text
        style={{
          fontSize: 30,
        }}
      >
        {option?.icon}
      </Text>
    </View>
  );
}
