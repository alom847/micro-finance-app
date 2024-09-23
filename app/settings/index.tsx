import { StatusBar } from "expo-status-bar";
import { Platform, Pressable, ScrollView, StyleSheet } from "react-native";

import { Image } from "react-native";
import { Text, View } from "../../components/Themed";
import { useSession } from "../../context/SessionContext";
import { useEffect } from "react";
import { GetProfile } from "../../constants/api";
import Colors from "../../constants/Colors";
import { Link } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { Avatar, Button, Dialog } from "tamagui";
import DisplayProfileChange from "../../components/profile/profile-pic";

export default function ModalScreen() {
  const { user, logout, session } = useSession();

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      {user && (
        <View
          style={{
            width: "100%",
            padding: 8,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 32,
            backgroundColor: Colors.light.accent,
            borderRadius: 20,
          }}
        >
          <DisplayProfileChange />

          {/* <View
            style={{ overflow: "hidden", backgroundColor: "transparent" }}
          >
            <Image
              source={{
                uri: user.image,
              }}
              width={100}
              height={100}
              style={{
                borderRadius: 50,
                borderColor: "gray",
                borderWidth: 2,
              }}
            /> 
          </View>*/}

          <View
            style={{
              display: "flex",
              // alignItems: "center",
              justifyContent: "center",
              backgroundColor: "transparent",
              gap: 4,
            }}
          >
            <Text style={{ fontSize: 16, color: Colors.light.text }}>
              {user.name}
            </Text>
            <Text style={{ fontSize: 14, color: "gray" }}>
              HMU{user.id.toString().padStart(6, "0")}
            </Text>
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 4,
                backgroundColor: "#3B5292",
                borderRadius: 30,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "#fafafa",
                  textAlign: "center",
                }}
              >
                {user.role}
              </Text>
            </View>

            <View
              style={{
                marginTop: 8,
                display: "flex",
                flexDirection: "row",
                backgroundColor: "transparent",
                gap: 10,
              }}
            >
              <Link href={"/settings/profile/view"} asChild>
                <Pressable>
                  <Text style={{ color: "gray", fontSize: 16 }}>
                    View Profile
                  </Text>
                </Pressable>
              </Link>
              <Link href={"/settings/profile/edit"} asChild>
                <Pressable>
                  <Text style={{ color: "red", fontSize: 16 }}>
                    Edit Profile
                  </Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </View>
      )}

      <View
        style={{
          // flex: 1,
          padding: 8,
          marginVertical: 8,
          display: "flex",
          gap: 4,
          borderRadius: 16,
          backgroundColor: Colors.light.background,
        }}
      >
        <Link href={"/(tabs)/relations"} style={{ width: "100%" }} asChild>
          <Pressable
            style={{
              padding: 8,
              borderBottomColor: Colors.light.tabIconDefault,
              borderBottomWidth: 1,
              backgroundColor: "transparent",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: Colors.light.text,
              }}
            >
              My Relations
            </Text>
            <Entypo name="arrow-right" />
          </Pressable>
        </Link>

        <Link href={"/settings/referrals"} style={{ width: "100%" }} asChild>
          <Pressable
            style={{
              padding: 8,
              borderBottomColor: Colors.light.tabIconDefault,
              borderBottomWidth: 1,
              backgroundColor: "transparent",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: Colors.light.text,
              }}
            >
              My Referrals
            </Text>
            <Entypo name="arrow-right" />
          </Pressable>
        </Link>

        {/* <Link href={"/edit"} style={{ width: "100%" }} asChild>
          <Pressable
            style={{
              padding: 8,
              borderBottomColor: Colors.light.tabIconDefault,
              borderBottomWidth: 1,
              backgroundColor: "transparent",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: Colors.light.text,
              }}
            >
              View KYC
            </Text>
            <Entypo name="arrow-right" />
          </Pressable>
        </Link> */}

        <Link href={"/settings/change-pwd"} style={{ width: "100%" }} asChild>
          <Pressable
            style={{
              padding: 8,
              borderBottomColor: Colors.light.tabIconDefault,
              borderBottomWidth: 1,
              backgroundColor: "transparent",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: Colors.light.text,
              }}
            >
              Change Password
            </Text>
            <Entypo name="arrow-right" />
          </Pressable>
        </Link>

        <Link href={"/settings/support"} style={{ width: "100%" }} asChild>
          <Pressable
            style={{
              padding: 8,
              // borderBottomColor: Colors.light.tabIconDefault,
              // borderBottomWidth: 1,
              backgroundColor: "transparent",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: Colors.light.text,
              }}
            >
              Support
            </Text>
            <Entypo name="arrow-right" />
          </Pressable>
        </Link>
      </View>

      <Pressable
        onPress={logout}
        style={{
          width: "100%",
          paddingHorizontal: 24,
          paddingVertical: 10,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 16,
          backgroundColor: "#eaeaea",

          marginVertical: 16,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "600", color: "red" }}>
          Log out
        </Text>
      </Pressable>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
