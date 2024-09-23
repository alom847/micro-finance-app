import React from "react";
import { Stack } from "expo-router";

type Props = {};

function LoanLayout({}: Props) {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* <Stack.Screen name="index" /> */}
      {/* <Stack.Screen
        name="repayments/index"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="repayments/index"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="repayments/[id]/correct"
        options={{
          presentation: "modal",
        }}
      /> */}
    </Stack>
  );
}

export default LoanLayout;
