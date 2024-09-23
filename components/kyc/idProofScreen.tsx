import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import Colors from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { UpdateIDProof } from "../../constants/api";
import { SelectList } from "react-native-dropdown-select-list";
import { useSession } from "../../context/SessionContext";
import LoadingOverlay from "../commons/loadingOverlay";

const { width: PAGE_WIDTH } = Dimensions.get("window");

const DocTypes = [
  { key: "1", value: "PAN" },
  { key: "2", value: "Voter ID" },
  { key: "3", value: "Adhaar" },
  { key: "4", value: "Driving License" },
  { key: "5", value: "Other" },
];

const IDProofScreen = ({ onSubmit }: { onSubmit: () => void }) => {
  const { handleApiResponse } = useSession();
  const [docType, setDocType] = useState<string>("");
  const [docValue, setDocValue] = useState<string>("");
  const [front, setFront] = useState<string | null>(null);
  const [back, setBack] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const pickImage = async (
    setImage: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onStepSubmit = async () => {
    if (!docType || !docValue)
      return Toast.show({
        type: "error",
        text1: "invalid Doc type/number",
      });

    if (!front || !back)
      return Toast.show({
        type: "error",
        text1: "please pick an photo.",
      });

    let body = new FormData();
    body.append("id_proof_type", docType);
    body.append("id_proof_value", docValue);

    let filename = front.split("/").pop() as string;
    let match = /\.(\w+)$/.exec(front);
    let type = match ? `image/${match[1]}` : `image`;

    body.append("id_proof_front", {
      uri: front,
      name: filename,
      type,
    } as any);

    filename = back.split("/").pop() as string;
    match = /\.(\w+)$/.exec(back);
    type = match ? `image/${match[1]}` : `image`;

    body.append("id_proof_back", {
      uri: back,
      name: filename,
      type,
    } as any);

    setLoading(true);
    try {
      const res = await handleApiResponse(UpdateIDProof, [body]);

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
  };

  return (
    <>
      <LoadingOverlay show={loading} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 200 }}
      >
        <Text style={{ fontSize: 24, marginVertical: 32 }}>
          {`Your ID Proof.`}
        </Text>

        <Text
          style={{
            paddingHorizontal: 16,
            marginVertical: 16,
            fontSize: 16,
            fontWeight: "500",
          }}
        >
          Document Type
        </Text>
        <SelectList
          save="value"
          setSelected={(val: any) => setDocType(val)}
          data={DocTypes}
        />

        <Text
          style={{
            paddingHorizontal: 16,
            marginVertical: 16,
            fontSize: 16,
            fontWeight: "500",
          }}
        >
          Document Number
        </Text>
        <TextInput
          placeholder="Enter Doc Number"
          style={{
            padding: 10,
            borderWidth: 1,
            borderColor: Colors.light.tabIconDefault,
            borderRadius: 10,
          }}
          onChangeText={(text) => setDocValue(text)}
          value={docValue}
        />

        <Text
          style={{
            paddingHorizontal: 16,
            marginTop: 16,
            fontSize: 16,
            fontWeight: "500",
          }}
        >
          Front Side
        </Text>
        <Pressable
          onPress={() => pickImage(setFront)}
          style={{
            marginTop: 16,
            width: "100%",
            height: 200,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#e1e1e1",
            overflow: "hidden",
            borderRadius: 32,
          }}
        >
          {front ? (
            <Image
              source={{ uri: front }}
              style={{ width: "100%", height: 200 }}
            />
          ) : (
            <Ionicons name="add" size={32} color={Colors.light.text} />
          )}
        </Pressable>

        <Text
          style={{
            paddingHorizontal: 16,
            marginTop: 16,
            fontSize: 16,
            fontWeight: "500",
          }}
        >
          Back Side
        </Text>
        <Pressable
          onPress={() => pickImage(setBack)}
          style={{
            marginTop: 16,
            width: "100%",
            height: 200,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#e1e1e1",
            overflow: "hidden",
            borderRadius: 32,
          }}
        >
          {back ? (
            <Image
              source={{ uri: back }}
              style={{ width: "100%", height: 200 }}
            />
          ) : (
            <Ionicons name="add" size={32} color={Colors.light.text} />
          )}
        </Pressable>

        <Pressable
          disabled={loading}
          style={{
            position: "absolute",
            top: 30,
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
      </ScrollView>
    </>
  );
};

export default IDProofScreen;

const styles = StyleSheet.create({
  container: {
    width: PAGE_WIDTH,
    height: "100%",
    padding: 16,
    backgroundColor: Colors.light.background,
  },
});
