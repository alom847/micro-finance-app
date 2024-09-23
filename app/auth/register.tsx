import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppImages } from "../../assets/images";
import { useCallback, useState } from "react";
import { useForm, Controller, Control, FieldValues } from "react-hook-form";
import z, { string } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "react-native-toast-message";
import Colors from "../../constants/Colors";
import { useSession } from "../../context/SessionContext";
import { Button, Dialog, Input, XStack } from "tamagui";
import { ResendOTP } from "@/constants/api";

const validationSchema = z
  .object({
    name: string().min(1, "name must have atleast 3 characers"),
    phone: string().regex(/^[0-9]+$/),
    email: z.optional(z.string()),
    password: string().min(6, "Password must have atleast 6 characters."),
    confirm: string().min(6, "Password must have atleast 6 characters."),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Password don't match.",
    path: ["confirm"],
  });

const RegisterScreen = () => {
  const router = useRouter();
  const { signup, verifySignup } = useSession();

  const [step, setStep] = useState<"REQ" | "VALIDATE" | "WAITING">("REQ");

  const {
    control,
    // handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      phone: "",
      confirm: "",
    },
  });

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const data = getValues();

      console.log(data);

      const success = await signup(
        data.phone,
        data.email,
        data.password,
        data.confirm,
        data.name
      );

      console.log("success", success);

      if (success) {
        setPhone(data.phone);
        setStep("VALIDATE");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      await verifySignup(phone, otp);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      await ResendOTP(phone, "Register");
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      // behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, padding: 16, backgroundColor: Colors.light.background }}
    >
      {loading && <ActivityIndicator />}

      {router.canGoBack() && (
        <Pressable onPress={() => router.back()}>
          <Ionicons name="return-up-back" size={32} color="black" />
        </Pressable>
      )}

      <View
        style={{
          flex: 1,
          marginTop: 16,
        }}
      >
        {/* <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 32, fontWeight: "500" }}>
            Create New Account
          </Text>
        </View> */}

        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            // marginTop: 16,
          }}
        >
          <Image
            source={AppImages.Logo_new}
            width={100}
            height={100}
            style={{ width: 150, height: 150, marginBottom: 24 }}
          />

          {step === "REQ" && (
            <>
              <View
                style={{
                  width: "100%",
                  alignItems: "flex-start",
                  paddingHorizontal: 8,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "500" }}>
                  Create New Account
                </Text>
              </View>

              <KeyboardAvoidingView
                behavior="padding"
                keyboardVerticalOffset={40}
              >
                <View
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
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
                        placeholder="Full Name"
                      />
                    )}
                    name="name"
                  />
                  {errors.name && (
                    <Text
                      style={{
                        fontSize: 10,
                        alignSelf: "flex-start",
                        paddingLeft: 16,
                      }}
                    >
                      {errors.name.message?.toString()}
                    </Text>
                  )}
                </View>

                <View
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
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
                </View>

                <View
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
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
                        placeholder="your@email.com"
                      />
                    )}
                    name="email"
                  />
                  {errors.email && (
                    <Text
                      style={{
                        fontSize: 10,
                        alignSelf: "flex-start",
                        paddingLeft: 16,
                      }}
                    >
                      {errors.email.message?.toString()}
                    </Text>
                  )}
                </View>

                <View
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
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
                        secureTextEntry={true}
                        placeholder="Password"
                      />
                    )}
                    name="password"
                  />
                  {errors.password && (
                    <Text>{errors.password.message?.toString()}</Text>
                  )}
                </View>
                <View
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
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
                        secureTextEntry={true}
                        placeholder="Confirm Password"
                      />
                    )}
                    name="confirm"
                  />
                  {errors.confirm && (
                    <Text>{errors.confirm.message?.toString()}</Text>
                  )}
                </View>
                {/* <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Image
            source={AppImages.positive_girl}
            style={{ width: 256, height: 212 }}
          />
        </View> */}

                <View
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Pressable
                    onPress={(e) => {
                      e.preventDefault();
                      handleSignUp();
                    }}
                    style={{
                      width: "100%",
                      paddingHorizontal: 24,
                      paddingVertical: 10,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 16,
                      backgroundColor: "#673ab7",

                      marginVertical: 16,
                    }}
                  >
                    <Text
                      style={{ fontSize: 24, fontWeight: "600", color: "#fff" }}
                    >
                      Sign up
                    </Text>
                  </Pressable>
                </View>
              </KeyboardAvoidingView>

              <Text>
                already have an account?{" "}
                <Link href={"/auth"}>
                  <Text style={{ fontWeight: "600" }}>Sign in</Text>
                </Link>
              </Text>
            </>
          )}

          {step === "VALIDATE" && (
            <>
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                  paddingHorizontal: 8,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "500" }}>
                  Verify OTP To Complete Registration
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "bold",
                    color: "#171717",
                  }}
                >
                  OTP has been sent to {phone}
                </Text>
              </View>
              <KeyboardAvoidingView style={{ width: "100%", maxWidth: "80%" }}>
                <View
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 10,
                  }}
                >
                  <Input
                    style={{
                      width: "100%",
                    }}
                    onChangeText={(value) => setOtp(value)}
                    placeholder="Enter 6-Digit OTP"
                  />
                  <View
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      gap: 4,
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
                </View>
              </KeyboardAvoidingView>
            </>
          )}

          {/* {step === "WAITING" && (
            
          )} */}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;
