import { Entypo, Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppImages } from "../../assets/images";
import { useState } from "react";
import { useForm, Controller, Control, FieldValues } from "react-hook-form";
import z, { string } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "react-native-toast-message";
import Colors from "../../constants/Colors";
import { useSession } from "../../context/SessionContext";
import { SizableText, XStack, YStack } from "tamagui";

const SigninScreen = () => {
  const router = useRouter();
  const { signin } = useSession();

  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z.object({
        email: string(),
        password: string().min(6, {
          message: "password must be atleast 6 characeters.",
        }),
      })
    ),
  });

  const [loading, setLoading] = useState(false);

  const handleSignIn = async (data: FieldValues) => {
    setLoading(true);
    try {
      await signin(data.email, data.password);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={AppImages.AnimatedBg}
      style={{ flex: 1, padding: 16 }}
    >
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        {loading && <ActivityIndicator />}

        {router.canGoBack() && (
          <Pressable onPress={() => router.back()}>
            <Ionicons name="return-up-back" size={32} color="black" />
          </Pressable>
        )}

        <View style={{ flex: 1, marginTop: 16 }}>
          {/* <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 28, marginTop: 4 }}>Welcome back,</Text>
          <Text style={{ fontSize: 48, fontWeight: "500" }}>
            Let's sign you in.
          </Text>
        </View> */}

          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 16,
            }}
          >
            <Image
              source={AppImages.Logo_new}
              width={100}
              height={100}
              style={{ width: 150, height: 150, marginBottom: 24 }}
            />
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
                    backgroundColor: "rgba(255, 255, 255, .6)",
                    borderColor: "#000",
                    borderWidth: 1,
                    borderRadius: 16,
                  }}
                  placeholder="Enter Phone Or Email"
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
                    secureTextEntry={!showPassword}
                    placeholder="Enter Password"
                  />
                  <Pressable onPress={() => setShowPassword((prv) => !prv)}>
                    <Entypo name="eye" size={24} />
                  </Pressable>
                </XStack>
              )}
              name="password"
            />
            {errors.email && (
              <Text
                style={{
                  fontSize: 10,
                  alignSelf: "flex-start",
                  paddingLeft: 16,
                }}
              >
                {errors.password?.message?.toString()}
              </Text>
            )}
            <Link
              href={"/auth/forgot"}
              style={{ alignSelf: "flex-end", marginVertical: 16 }}
            >
              <Text style={{ fontWeight: "600" }}>forgot password?</Text>
            </Link>
            {/* <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Image
              source={AppImages.positive_girl}
              style={{ width: 256, height: 212 }}
            />
          </View> */}
            <Pressable
              disabled={loading}
              onPress={handleSubmit(handleSignIn)}
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
              <Text style={{ fontSize: 24, fontWeight: "600", color: "#fff" }}>
                Sign in
              </Text>
            </Pressable>
            <Text>
              Don't have an account?{" "}
              <Link href={"/auth/register"}>
                <Text style={{ fontWeight: "600" }}>Register</Text>
              </Link>
            </Text>
          </View>
        </View>

        <YStack>
          <YStack justifyContent="center" alignItems="center">
            <SizableText>www.himalayanmicrofin.in</SizableText>
          </YStack>
          <YStack justifyContent="center" alignItems="center">
            <SizableText>CIN: U64990AS2023PTC025427</SizableText>
          </YStack>
          <YStack justifyContent="center" alignItems="center">
            <SizableText fontSize={16}>
              HIMALAYAN MICROFINANCE PVT. LTD.
            </SizableText>
          </YStack>
        </YStack>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default SigninScreen;

// Colors.light.background
