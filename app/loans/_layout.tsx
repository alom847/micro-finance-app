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
      <Stack.Screen name="[id]" />
      <Stack.Screen name="apply" />
    </Stack>
  );
}

export default LoanLayout;
