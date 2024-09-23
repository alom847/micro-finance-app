import LoadingOverlay from "@/components/commons/loadingOverlay";
import { ChangePwd } from "@/constants/api";
import { Entypo } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import {
  Alert,
  Image,
  ImageBackground,
  Linking,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { Button, Input, XStack } from "tamagui";
import { string, z } from "zod";

type Props = {};

function ChangePassword({}: Props) {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z.object({
        old_pass: string(),
        new_pass: string(),
        confirm: string(),
      })
    ),
    defaultValues: {
      old_pass: "",
      new_pass: "",
      confirm: "",
    },
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FieldValues) => {
    console.log(data);

    setLoading(true);
    try {
      const { data: resp } = await ChangePwd(
        data.old_pass,
        data.new_pass,
        data.confirm
      );

      console.log(resp);

      if (resp.status) {
        Toast.show({
          type: "success",
          text1: resp.message,
        });
        router.back();
        return;
      } else {
        console.log(resp.message);
        return Toast.show({
          type: "error",
          text1: resp.message,
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <LoadingOverlay show={loading} />

      <ScrollView
        style={{
          flex: 1,
          display: "flex",
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View
          style={{
            display: "flex",
            gap: 4,
            padding: 16,
          }}
        >
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <XStack
                justifyContent="center"
                alignItems="center"
                backgroundColor={"rgba(255, 255, 255, .6)"}
                borderColor={"#000"}
                borderRadius={16}
                borderWidth={1}
                marginTop={16}
                paddingVertical={10}
                paddingHorizontal={24}
              >
                <TextInput
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  style={{
                    flex: 1,
                  }}
                  secureTextEntry={!showOldPassword}
                  placeholder="Enter Old Password"
                />
                <Pressable onPress={() => setShowOldPassword((prv) => !prv)}>
                  <Entypo name="eye" size={24} />
                </Pressable>
              </XStack>
            )}
            name="old_pass"
          />

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <XStack
                justifyContent="center"
                alignItems="center"
                backgroundColor={"rgba(255, 255, 255, .6)"}
                borderColor={"#000"}
                borderRadius={16}
                borderWidth={1}
                marginTop={16}
                paddingVertical={10}
                paddingHorizontal={24}
              >
                <TextInput
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  style={{
                    flex: 1,
                  }}
                  secureTextEntry={!showNewPassword}
                  placeholder="Enter New Password"
                />
                <Pressable onPress={() => setShowNewPassword((prv) => !prv)}>
                  <Entypo name="eye" size={24} />
                </Pressable>
              </XStack>
            )}
            name="new_pass"
          />

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <XStack
                justifyContent="center"
                alignItems="center"
                backgroundColor={"rgba(255, 255, 255, .6)"}
                borderColor={"#000"}
                borderRadius={16}
                borderWidth={1}
                marginTop={16}
                paddingVertical={10}
                paddingHorizontal={24}
              >
                <TextInput
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  style={{
                    flex: 1,
                  }}
                  secureTextEntry={!showConfirm}
                  placeholder="Confirm New Password"
                />
                <Pressable onPress={() => setShowConfirm((prv) => !prv)}>
                  <Entypo name="eye" size={24} />
                </Pressable>
              </XStack>
            )}
            name="confirm"
          />

          <View
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 4,
              marginTop: 12,
            }}
          >
            <Button
              backgroundColor={"#673ab7"}
              color={"white"}
              onPress={handleSubmit(onSubmit)}
              fontWeight={"bold"}
              flex={1}
            >
              Submit
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default ChangePassword;
