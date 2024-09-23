import React from "react";
import { Stack } from "expo-router";

type Props = {};

function WalletLayout({}: Props) {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="withdrawals"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}

export default WalletLayout;
