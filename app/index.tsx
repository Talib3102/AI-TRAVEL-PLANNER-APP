import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import Login from "./../components/Login";
import { auth } from "./../configs/FirebaseConfig";

export default function Index() {
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {user ? <Redirect href="/mytrip" /> : <Login />}
    </View>
  );
}
