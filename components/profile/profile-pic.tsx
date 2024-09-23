import React, { useState } from "react";
import { Avatar, Button, Dialog, Theme, XStack } from "tamagui";
import { useSession } from "../../context/SessionContext";
import Toast from "react-native-toast-message";
import { UpdateProileImage } from "../../constants/api";
import { Image, Pressable } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import LoadingOverlay from "../commons/loadingOverlay";

type Props = {};

function DisplayProfileChange({}: Props) {
  const { handleApiResponse } = useSession();
  const [open, setOpen] = useState(false);
  const { user, refresh } = useSession();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleChangeDp = async () => {
    if (!image)
      return Toast.show({ type: "error", text1: "Please choose an image!" });

    let filename = image.split("/").pop() as string;

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(image);
    let type = match ? `image/${match[1]}` : `image`;

    let body = new FormData();
    body.append("profile_img", {
      uri: image,
      name: filename,
      type,
    } as any);

    setLoading(true);

    const resp = await handleApiResponse(UpdateProileImage, [body]);

    setLoading(false);
    if (resp.status) {
      await refresh();
      setOpen(false);
      return Toast.show({ type: "success", text1: "Uploaded Successfully" });
    }

    return Toast.show({
      type: "success",
      text1: "Failed to upload",
      text2: resp.message,
    });
  };

  return (
    <>
      <LoadingOverlay show={loading} />
      <Dialog open={open}>
        <Dialog.Trigger asChild>
          <Avatar onPress={() => setOpen(true)} circular size="$10">
            <Avatar.Image src={user?.image} />
            <Avatar.Fallback bc="red" />
          </Avatar>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content
            bordered
            elevate
            key="content"
            animateOnly={["transform", "opacity"]}
            animation={[
              "quick",
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            gap="$4"
          >
            <Dialog.Title>Change Profile Pic</Dialog.Title>
            <Dialog.Description>
              Choose a new picture and Click save when you're done.
            </Dialog.Description>

            <Pressable
              onPress={pickImage}
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                width: 200,
                height: 200,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#e1e1e1",
                overflow: "hidden",
                borderRadius: 32,
              }}
            >
              {image ? (
                <Image
                  source={{ uri: image }}
                  style={{ width: 200, height: 200 }}
                />
              ) : (
                <Ionicons name="person" size={32} color={Colors.light.text} />
              )}
            </Pressable>

            <XStack justifyContent="space-between" alignItems="center">
              <Button onPress={() => setOpen(false)} variant={"outlined"}>
                Cancel
              </Button>
              <Theme name={"blue"}>
                <Button
                  disabled={loading}
                  onPress={handleChangeDp}
                  theme={"active"}
                  color={"white"}
                >
                  Save
                </Button>
              </Theme>
            </XStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </>
  );
}

export default DisplayProfileChange;
