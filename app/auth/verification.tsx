import { View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";

import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "tamagui";

type Props = {};

const { height } = Dimensions.get("screen");

function VerificationPending({}: Props) {
  const router = useRouter();

  return (
    <SafeAreaView
      // behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, padding: 16, backgroundColor: Colors.light.background }}
    >
      {router.canGoBack() && (
        <Pressable onPress={() => router.back()}>
          <Ionicons name="return-up-back" size={32} color="black" />
        </Pressable>
      )}

      <View
        style={{
          height: height * 0.8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 8,
        }}
      >
        <AntDesign name="idcard" size={34} color="black" />
        <Text style={{ fontSize: 24 }}>Registration has been done.</Text>
        <Text style={{ textAlign: "center" }}>
          Waiting For Verification, Please contact Himalayan Microfinance Team
          for faster processing.
        </Text>

        <Button
          onPress={() => router.replace("/auth")}
          variant="outlined"
          backgroundColor={"indigo"}
          color={"white"}
          marginTop={8}
        >
          Sign in
        </Button>
      </View>
    </SafeAreaView>
  );
}

export default VerificationPending;
