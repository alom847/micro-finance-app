import { SplashScreen, Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useSession } from "../../context/SessionContext";

const AuthLayout = () => {
  const router = useRouter();
  const { isLoading, session } = useSession();

  useEffect(() => {
    if (isLoading) return;

    if (session) {
      router.replace("/(tabs)/");
    }
  }, [session, isLoading]);

  if (isLoading) SplashScreen.preventAutoHideAsync();

  return (
    <>
      {!isLoading && (
        <Stack
          screenOptions={{ headerShown: false, animation: "slide_from_right" }}
        />
      )}
    </>
  );
};

export default AuthLayout;
