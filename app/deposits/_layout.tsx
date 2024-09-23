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
      <Stack.Screen name="[id]" />
      <Stack.Screen name="apply" />
      <Stack.Screen name="rds" />
      <Stack.Screen name="fds" />
    </Stack>
  );
}

export default DepositLayout;
