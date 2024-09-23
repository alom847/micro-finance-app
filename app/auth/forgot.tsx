import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { AppImages } from "../../assets/images";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { string, z } from "zod";
import Colors from "../../constants/Colors";
import { useState } from "react";
import { RequestPwdReset, ResendOTP, ResetPassword } from "@/constants/api";
import LoadingOverlay from "@/components/commons/loadingOverlay";
import { Button, Dialog, Input, XStack } from "tamagui";
import Toast from "react-native-toast-message";

const ForgotScreen = () => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z.object({
        phone: string(),
      })
    ),
    defaultValues: {
      phone: "",
    },
  });

  const [step, setStep] = useState<"REQ" | "RESET">("REQ");
  const [phone, setPhone] = useState("");

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const [showPassword, setShowassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FieldValues) => {
    console.log(data);

    setLoading(true);
    try {
      const { data: resp } = await RequestPwdReset(data.phone);

      console.log(resp);

      if (resp.status) {
        setPhone(resp.data.phone);
        setStep("RESET");
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

  const handleVerify = async () => {
    if (!(phone && otp)) {
      return Toast.show({
        type: "error",
        text1: "Invalid Phone or OTP!",
      });
    }

    if (!(password && password.length >= 6)) {
      return Toast.show({
        type: "error",
        text1: "Invalid password, try another one!",
      });
    }

    if (password !== confirmPwd) {
      return Toast.show({
        type: "error",
        text1: "Password miss match, try again!",
      });
    }

    setLoading(true);

    try {
      const { data: resp } = await ResetPassword(
        phone,
        otp,
        password,
        confirmPwd
      );

      console.log(resp);

      if (resp.status) {
        setPhone("");
        setStep("REQ");
        Toast.show({
          type: "success",
          text1: "Password Reset Successfully.",
        });
        return router.push("/auth/");
      } else {
        Toast.show({
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

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      await ResendOTP(phone, "ResetPassword");
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, padding: 16, backgroundColor: Colors.light.background }}
    >
      <LoadingOverlay show={loading} />

      <Pressable onPress={() => router.back()}>
        <Ionicons name="return-up-back" size={32} color="black" />
      </Pressable>

      <View style={{ width: "100%", marginTop: 48 }}>
        <View style={{ alignItems: "center" }}>
          <Image
            source={AppImages.Logo_new}
            width={100}
            height={100}
            style={{ width: 150, height: 150, marginBottom: 24 }}
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 32, fontWeight: "600", marginBottom: 16 }}>
            Forgot Password?
          </Text>
          {/* <Text style={{ fontSize: 48, fontWeight: "600" }}></Text> */}
          <Text style={{ fontSize: 14, maxWidth: 340 }}>
            Don't worry! it happens. Please enter the phone associated with your
            account.
          </Text>
        </View>

        {step === "REQ" && (
          <>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  style={{
                    width: "100%",
                    height: 48,
                    paddingVertical: 10,
                    paddingHorizontal: 24,
                    backgroundColor: "transparent",
                    borderColor: "#000",
                    borderWidth: 1,
                    borderRadius: 16,

                    marginTop: 16,
                  }}
                  placeholder="Enter Phone Number"
                />
              )}
              name="phone"
            />
            {errors.phone && (
              <Text
                style={{
                  fontSize: 10,
                  alignSelf: "flex-start",
                  paddingLeft: 16,
                }}
              >
                {errors.phone.message?.toString()}
              </Text>
            )}

            {/* <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Image
            source={AppImages.thinking_man}
            style={{ width: 256, height: 212 }}
          />
        </View> */}
            <Pressable
              onPress={handleSubmit(onSubmit)}
              style={{
                width: "100%",
                paddingHorizontal: 24,
                paddingVertical: 10,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 16,
                backgroundColor: "#673ab7",

                marginTop: 16,
              }}
            >
              <Text style={{ fontSize: 24, fontWeight: "600", color: "#fff" }}>
                Submit
              </Text>
            </Pressable>
          </>
        )}

        {step === "RESET" && (
          <>
            <KeyboardAvoidingView
              behavior="padding"
              keyboardVerticalOffset={40}
              style={{
                display: "flex",
                gap: 4,
              }}
            >
              <Input
                style={{
                  width: "100%",
                  height: 48,
                  paddingVertical: 10,
                  paddingHorizontal: 24,
                  backgroundColor: "transparent",
                  borderColor: "#000",
                  borderWidth: 1,
                  borderRadius: 16,
                }}
                secureTextEntry
                value={password}
                onChangeText={(value) => setPassword(value)}
                placeholder="New Password"
              />
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: 48,
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  backgroundColor: "transparent",
                  borderColor: "#000",
                  borderWidth: 1,
                  borderRadius: 12,
                }}
              >
                <TextInput
                  value={confirmPwd}
                  onChangeText={(value) => setConfirmPwd(value)}
                  style={{
                    flex: 1,
                    height: 48,
                    paddingVertical: 10,
                  }}
                  secureTextEntry={!showPassword}
                  placeholder="Confirm New Password"
                />
                <Pressable onPress={() => setShowassword((prv) => !prv)}>
                  <Entypo name="eye" size={24} />
                </Pressable>
              </View>
              <Input
                style={{
                  width: "100%",
                  height: 48,
                  paddingVertical: 10,
                  paddingHorizontal: 24,
                  backgroundColor: "transparent",
                  borderColor: "#000",
                  borderWidth: 1,
                  borderRadius: 16,
                }}
                value={otp}
                onChangeText={(value) => setOtp(value)}
                placeholder="Enter 6-Digit OTP"
              />
            </KeyboardAvoidingView>

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
                color={"gray"}
                onPress={handleResendOTP}
                fontWeight={"bold"}
                borderColor={"#171717"}
              >
                Resend OTP
              </Button>
              <Button
                backgroundColor={"#673ab7"}
                color={"white"}
                onPress={handleVerify}
                fontWeight={"bold"}
                flex={1}
              >
                Submit
              </Button>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ForgotScreen;
