import React from "react";
import { Stack } from "expo-router";

type Props = {};

function DepositLayout({}: Props) {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* <Stack.Screen name="index" />
      <Stack.Screen
        name="repayments"
        options={{
          presentation: "modal",
        }}
      /> */}
    </Stack>
  );
}

export default DepositLayout;
