import * as Font from "expo-font";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import {CreateTripContext} from "../context/CreateTripContext";
export default function Layout() {
  useFonts({
    outfit: require("./../assets/fonts/Outfit-Bold.ttf"),
    "outfit-medium": require("./../assets/fonts/Outfit-Medium.ttf"),
    "outfit-regular": require("./../assets/fonts/Outfit-Regular.ttf"),
  });
  const [tripData, setTripData] = useState([]);

  return (
    <CreateTripContext.Provider value={{ tripData, setTripData }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false, // ✅ This is the key line
        }}
      />
    </Stack>
    </CreateTripContext.Provider>
  );
}
function useFonts(fontMap) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync(fontMap).then(() => setLoaded(true));
  }, [fontMap]);

  return loaded;
}
