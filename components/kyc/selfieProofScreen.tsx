import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  Pressable,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { UpdateSelfie } from "../../constants/api";
import { useSession } from "../../context/SessionContext";
import LoadingOverlay from "../commons/loadingOverlay";

const { width: PAGE_WIDTH } = Dimensions.get("window");

const SelfieProofScreen = ({ onSubmit }: { onSubmit: () => void }) => {
  const { handleApiResponse } = useSession();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [status, requestPermissions] = ImagePicker.useCameraPermissions();

  const takeSelfie = async () => {
    try {
      await requestPermissions();
      if (!(status && status.granted)) {
        alert("Sorry, we need camera roll permissions to make this work!");
      }

      console.log("before launch request");

      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        cameraType: ImagePicker.CameraType.front,
      });

      console.log("after launch request");

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onStepSubmit = async () => {
    if (image) {
      let body = new FormData();

      let filename = image.split("/").pop() as string;
      let match = /\.(\w+)$/.exec(image);
      let type = match ? `image/${match[1]}` : `image`;

      body.append("selfie", {
        uri: image,
        name: filename,
        type,
      } as any);

      setLoading(true);
      try {
        const res = await handleApiResponse(UpdateSelfie, [body]);

        if (res.status) {
          onSubmit();
        }
      } catch (e) {
        Toast.show({
          type: "error",
          text1: "Opps!",
          text2: "something went wrong",
        });
      } finally {
        setLoading(false);
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Please take a selfie",
      });
    }
  };

  return (
    <>
      <LoadingOverlay show={loading} />
      <View style={styles.container}>
        <Text style={{ fontSize: 24, marginVertical: 32 }}>
          {`Click a Selfie \nto complete your KYC `}
        </Text>

        {image ? (
          <Image
            source={{ uri: image }}
            style={{ width: "100%", height: 400, borderRadius: 10 }}
          />
        ) : (
          <View
            style={{
              width: "100%",
              height: 400,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#e1e1e1",
              overflow: "hidden",
              borderRadius: 32,
            }}
          >
            <Ionicons
              name="person"
              size={200}
              color={Colors.light.tabIconDefault}
            />
          </View>
        )}

        <Pressable
          style={{
            marginTop: 32,
            padding: 16,
            borderWidth: 2,
            borderColor: Colors.light.tabIconDefault,
            borderRadius: 10,
          }}
          onPress={takeSelfie}
        >
          <Text style={{ color: Colors.light.text, textAlign: "center" }}>
            Take a Selfie
          </Text>
        </Pressable>

        <Pressable
          disabled={loading}
          style={{
            position: "absolute",
            top: 40,
            right: 20,
            width: 62,
            height: 62,
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 32,

            backgroundColor: Colors.light.text,
          }}
          onPress={onStepSubmit}
        >
          <Ionicons name="arrow-forward" size={32} color="#fafafa" />
        </Pressable>
      </View>
    </>
  );
};

export default SelfieProofScreen;

const styles = StyleSheet.create({
  container: {
    width: PAGE_WIDTH,
    padding: 16,
    backgroundColor: Colors.light.background,
  },
});
