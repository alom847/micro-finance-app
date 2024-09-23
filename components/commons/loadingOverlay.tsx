import React from "react";
import { View } from "react-native";
import LottieView from "lottie-react-native";
import Modal from "react-native-modal";
import { AppLotties } from "../../assets/lotties";
import { YStack } from "tamagui";

type Props = {
  show: boolean;
};

export default function LoadingOverlay({ show }: Props) {
  return (
    <Modal isVisible={show} backdropOpacity={0.8}>
      <View
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        <LottieView
          loop
          autoPlay
          source={AppLotties.loading}
          style={{ width: 200, height: 200 }}
        />
      </View>
    </Modal>
  );
}
