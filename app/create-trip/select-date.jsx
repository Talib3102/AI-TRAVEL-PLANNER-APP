import { Colors } from "@/constants/Colors";
import { CreateTripContext } from "@/context/CreateTripContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { useNavigation, useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

export default function SelectDate() {
  // Navigation hook - provides methods to navigate between screens
  const navigation = useNavigation();

  // Global context - manages trip data across the entire app
  const { tripData, setTripData } = useContext(CreateTripContext);

  // Local state for selected dates - initially null (no dates selected)
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Controls which date picker is visible: 'start', 'end', or null (hidden)
  const [showPicker, setShowPicker] = useState(null);
  const router = useRouter();

  /**
   * Handles date selection from the DateTimePicker component
   * @param {Object} event - Event object containing type ('set' or 'dismiss')
   * @param {Date} selectedDate - The date selected by user
   */
  const handleDateChange = (event, selectedDate) => {
    try {
      // Hide picker first to prevent multiple triggers
      setShowPicker(null);
      
      // Only process if user confirmed selection and date is valid
      if (event?.type === "set" && selectedDate && selectedDate instanceof Date) {
        // Determine which date to update based on active picker
        if (showPicker === "start") {
          setStartDate(selectedDate);
        } else if (showPicker === "end") {
          setEndDate(selectedDate);
        }
      }
    } catch (error) {
      console.error("Error handling date change:", error);
      setShowPicker(null); // Ensure picker is hidden on error
    }
  };

  /**
   * Validates dates, calculates trip duration, and saves to global context
   * Performs multiple validations before proceeding
   */
  const handleContinue = () => {
    try {
      // Validation 1: Check if both dates are selected and valid
      if (!startDate || !endDate || !(startDate instanceof Date) || !(endDate instanceof Date)) {
        Alert.alert("Error", "Please select both start and end dates");
        return;
      }

      // Validation 2: Check if end date is after start date
      if (endDate <= startDate) {
        Alert.alert("Error", "End date must be after start date");
        return;
      }

      // Calculate total days using dayjs library (includes both start and end dates)
      const days = dayjs(endDate).diff(dayjs(startDate), "day") + 1;

      // Validation 3: Check 20-day limit
      if (days > 20 || days < 1) {
        Alert.alert("Error", "Trip duration must be between 1 and 20 days");
        return;
      }

      // Log for debugging purposes
      console.log(`Total days: ${days}`);

      // Save selected dates and duration to global trip context
      setTripData({
        ...tripData, // Preserve existing trip data
        startDate: startDate,
        endDate: endDate,
        days: days, // Store calculated days (already includes +1)
      });

      router.push("/create-trip/select-budget");
    } catch (error) {
      console.error("Error in handleContinue:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  // Reusable style object for date selection buttons
  const dateStyle = {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f0f0f0", // Light gray background
    borderRadius: 8, // Rounded corners
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 25,
        paddingTop: 75,
        backgroundColor: Colors.WHITE,
      }}
    >
      {/* Navigation: Back button to return to previous screen */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* UI: Main page title */}
      <Text style={{ fontSize: 35, fontWeight: "bold", marginTop: 20 }}>
        Select Travel Dates
      </Text>

      {/* UI: Start date selector button - shows picker when tapped */}
      <TouchableOpacity
        onPress={() => setShowPicker("start")} // Show start date picker
        style={dateStyle}
      >
        <Text>
          Start Date:{" "}
          {startDate ? startDate.toDateString() : "Select start date"}
        </Text>
      </TouchableOpacity>

      {/* UI: End date selector button - shows picker when tapped */}
      <TouchableOpacity
        onPress={() => setShowPicker("end")} // Show end date picker
        style={{ ...dateStyle, marginTop: 10 }}
      >
        <Text>
          End Date: {endDate ? endDate.toDateString() : "Select end date"}
        </Text>
      </TouchableOpacity>

      {/* Conditional Render: Date picker modal (only visible when showPicker has value) */}
      {showPicker && (
        <DateTimePicker
          // Current value: Use selected date or fallback to today
          value={
            showPicker === "start"
              ? startDate || new Date()
              : endDate || new Date()
          }
          mode="date" // Date selection mode (not time)
          // Minimum date restrictions:
          // - Start date: Today or future only
          // - End date: Must be after start date
          minimumDate={showPicker === "start" ? new Date() : startDate}
          // Maximum date restriction for end date: 19 days after start (20 days total)
          maximumDate={
            showPicker === "end" && startDate && startDate instanceof Date
              ? dayjs(startDate).add(19, "day").toDate()
              : undefined
          }
          onChange={handleDateChange} // Handle date selection
        />
      )}

      {/* Action: Continue button - validates and saves selected dates */}
      <TouchableOpacity
        style={{
          marginTop: 30,
          padding: 15,
          backgroundColor: Colors.PRIMARY || "#007AFF", // Primary color or blue fallback
          borderRadius: 8,
        }}
        onPress={handleContinue} // Trigger validation and save
      >
        <Text
          style={{ color: "white", textAlign: "center", fontWeight: "bold" }}
        >
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
}
