import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { Suspense, useEffect } from "react";
import { AuthProvider } from "../context/SessionContext";
import Toast from "react-native-toast-message";
import { TamaguiProvider, Text, Theme } from "tamagui";
import config from "../tamagui.config";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
    Courgette: require("../assets/fonts/Courgette-Regular.ttf"),
    Hedvig: require("../assets/fonts/HedvigLettersSerif_18pt-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  // const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView>
      <TamaguiProvider config={config}>
        <Suspense fallback={<Text>Loading...</Text>}>
          <Theme name={"light"}>
            <ThemeProvider value={DefaultTheme}>
              <AuthProvider>
                <Stack
                  screenOptions={{
                    headerShown: false,
                    headerBackTitleVisible: false,
                  }}
                >
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="basicDetails"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="kyc" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="loans"
                    options={{ headerShown: true, headerTitle: "" }}
                  />
                  <Stack.Screen
                    name="deposits"
                    options={{ headerShown: true, headerTitle: "" }}
                  />
                  <Stack.Screen
                    name="settings"
                    options={{
                      headerShown: true,
                    }}
                  />
                </Stack>
                <Toast />
              </AuthProvider>
            </ThemeProvider>
          </Theme>
        </Suspense>
      </TamaguiProvider>
    </GestureHandlerRootView>
  );
}
