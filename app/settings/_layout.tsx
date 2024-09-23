import { Stack } from "expo-router";
import React from "react";

type Props = {};

function Layout({}: Props) {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    ></Stack>
  );
}

export default Layout;
