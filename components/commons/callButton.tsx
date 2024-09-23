import React from "react";
import { View, Text, Linking, Pressable, Alert } from "react-native";
import { green } from "../../utils/colors";
import { FontAwesome } from "@expo/vector-icons";
import { formatIndianPhoneNumber } from "../../utils/formatPhone";

type Props = {
  phoneNumber: string;
};

export const handleCallPress = (number: string) => {
  const url = `tel:${formatIndianPhoneNumber(number, false)}`;
  Linking.canOpenURL(url)
    .then((supported) => {
      if (!supported) {
        Alert.alert(`Phone number ${url} is not supported`);
      } else {
        return Linking.openURL(url);
      }
    })
    .catch((err) => console.error("Error opening phone app:", err));
};

const CallButton = ({ phoneNumber }: Props) => {
  return (
    <View
      style={{
        width: 40,
        height: 40,
        position: "absolute",
        top: 10,
        left: 10,

        zIndex: 50,
        backgroundColor: green[400],
        borderRadius: 50,

        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Pressable onPress={() => handleCallPress(phoneNumber)} style={{}}>
        <FontAwesome name="phone" size={24} />
      </Pressable>
    </View>
  );
};

export default CallButton;
