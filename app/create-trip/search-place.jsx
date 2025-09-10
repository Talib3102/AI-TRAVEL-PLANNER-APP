// Importing the back icon from Expo Vector Icons
import Ionicons from "@expo/vector-icons/Ionicons";

// Hook for navigation control in Expo Router
import { useNavigation, useRouter } from "expo-router";

// React core hooks
import { useContext, useEffect, useState } from "react";

// Core React Native UI components
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Your color constants (assumed to define Colors.WHITE etc.)
import { Colors } from "../../constants/Colors";

// Context to share trip data across the app
import { CreateTripContext } from "../../context/CreateTripContext";

// Reading the API key from environment variables
const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function SearchPlace() {
  const navigation = useNavigation(); // Hook to handle screen navigation
  const { setTripData } = useContext(CreateTripContext); // Trip data updater from global context
  const router = useRouter(); // Router for navigation control

  // Input text from the user
  const [query, setQuery] = useState("");

  // List of place suggestions returned by Google Places API
  const [suggestions, setSuggestions] = useState([]);

  // This useEffect hides the header when the screen loads
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  // Whenever the user types something new, trigger the Places Autocomplete API
  useEffect(() => {
    if (!query) {
      setSuggestions([]); // If input is empty, clear suggestions
      return;
    }

    // Debounce input (wait 300ms after last keystroke before making API call)
    const id = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${API_KEY}&input=${encodeURIComponent(
            query
          )}`
        );
        const { predictions } = await res.json();
        setSuggestions(predictions || []); // Store suggestions
      } catch (error) {
        console.error("Autocomplete fetch failed:", error);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(id); // Clear the timeout if input changes again
  }, [query]);

  // When a suggestion is tapped, fetch full details of that place
  async function selectPlace(item) {
    try {
      const resp = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&key=${API_KEY}`
      );
      const { result } = await resp.json();

      // Store selected location info into context
      setTripData({
        locationInfo: {
          name: result.name,
          coordinates: result.geometry.location,
          photoReference: result.photos?.[0]?.photo_reference || null,
          url: result.url,
        },
      });
      router.push("/create-trip/select-traveler"); // Navigate to the next screen

      setQuery(result.name); // Update search bar with selected place name
      setSuggestions([]); // Clear the suggestion list
    } catch (err) {
      console.warn("Failed to fetch place details:", err);
    }
  }

  return (
    <View style={{ flex: 1, paddingTop: 75, backgroundColor: Colors.WHITE }}>
      {/* Header row with back button and search input */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 15,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={32} color="black" />
        </TouchableOpacity>

        {/* Search Text Input */}
        <TextInput
          placeholder="Search place"
          placeholderTextColor="#999" // ✅ FIX: Make placeholder visible on white background
          value={query}
          onChangeText={setQuery}
          style={{
            flex: 1,
            marginLeft: 10,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 20,
            paddingHorizontal: 15,
            height: 45,
            color: "black", // ✅ FIX: Ensure user text is visible
            backgroundColor: "white", // Optional: to ensure full white box
          }}
        />
      </View>

      {/* List of autocomplete suggestions */}
      <FlatList
        data={suggestions}
        keyExtractor={(i) => i.place_id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 15,
              borderBottomColor: "#eee",
              borderBottomWidth: 1,
            }}
            onPress={() => selectPlace(item)}
          >
            <Text style={{ color: "#000" }}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
