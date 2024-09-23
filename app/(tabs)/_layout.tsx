import Entypo from "@expo/vector-icons/Entypo";
import { Link, Tabs, useRouter } from "expo-router";
import { Pressable, View, Image, useColorScheme } from "react-native";

import Colors from "../../constants/Colors";
import { useSession } from "../../context/SessionContext";
import { useEffect } from "react";
import { AppImages } from "../../assets/images";
import { FontAwesome5 } from "@expo/vector-icons";

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Entypo>["name"];
  color: string;
}) {
  return <Entypo size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const { isLoading, session, user } = useSession();

  useEffect(() => {
    if (isLoading) return;

    if (!session) {
      router.replace("/auth/");
    } else if (user) {
      if (!user.ac_status) {
        console.log("AC INACTIVE");

        if (!user.image) {
          console.log("NO IMAGE");
          router.replace("/basicDetails");
        } else if (!user.kyc_verified) {
          console.log("NO KYC, PUSHING TO KYC");
          router.replace("/kyc");
        }
      }
    }
  }, [user, session, isLoading]);

  return (
    <Tabs
      screenOptions={{
        headerLeftContainerStyle: {
          padding: 16,
        },
        headerRightContainerStyle: {
          flex: 1,
          padding: 16,
        },
        tabBarActiveTintColor: Colors.light.tint,
        headerBackground: () => (
          <View
            style={{
              flex: 1,
              backgroundColor: "skyblue",
            }}
          ></View>
        ),
        headerLeft: () => (
          <Image
            width={50}
            height={50}
            source={AppImages.Logo_new}
            style={{
              width: 50,
              height: 50,
              objectFit: "contain",
              borderRadius: 50,
            }}
          />
        ),
        headerRight: () => (
          <Link href="/settings" asChild>
            <Pressable>
              {({ pressed }) => (
                <View
                  style={{
                    borderRadius: 50,
                    overflow: "hidden",
                    padding: 4,
                    backgroundColor: "#fff",
                  }}
                >
                  <Image
                    source={{
                      uri: user?.image,
                    }}
                    width={42}
                    height={42}
                    style={{ borderRadius: 50 }}
                  />
                </View>
              )}
            </Pressable>
          </Link>
        ),
        headerTitle: () => <View></View>,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <TabBarIcon name="grid" color={color} />,
        }}
      />

      <Tabs.Screen
        name="assignments"
        options={{
          href: !["Agent"].includes(user?.role ?? "")
            ? null
            : "/(tabs)/assignments",
          title: "Collections",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="hand-holding-usd" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="report"
        options={{
          href: !["Admin", "Manager", "Agent"].includes(user?.role ?? "")
            ? null
            : "/(tabs)/report",
          title: "Report",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="pie-chart" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="relations"
        options={{
          href: !["User"].includes(user?.role ?? "")
            ? null
            : "/(tabs)/relations",
          title: "My Loans & Deposits",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="archive" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
          tabBarIcon: ({ color }) => <TabBarIcon name="wallet" color={color} />,
        }}
      />
    </Tabs>
  );
}
