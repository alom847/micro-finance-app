import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import Colors from "../constants/Colors";
import { Bar } from "react-native-progress";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useSession } from "../context/SessionContext";
import ProfilePicScreen from "../components/basicDetails/profilePicScreen";
import AgeScreen from "../components/basicDetails/ageScreen";
import GenderScreen from "../components/basicDetails/genderScreen";
import AddressScreen from "../components/basicDetails/addressScreen";
import { UpdateProfile, UpdateProileImage } from "../constants/api";
import { router } from "expo-router";
import LoadingOverlay from "@/components/commons/loadingOverlay";

const { width: PAGE_WIDTH } = Dimensions.get("window");

const Scenes = ["age", "gender", "address", "image"];

const BasicDetailsScreen = () => {
  const { refresh, handleApiResponse } = useSession();
  const translateX = useSharedValue(0);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState<{
    image: string;
    age: string;
    gender: string;
    address: string;
    city: string;
    country: string;
    zip: string;
    state: string;
  }>({
    image: "",
    age: "",
    gender: "",
    address: "",
    city: "",
    country: "",
    zip: "",
    state: "",
  });

  const [loading, setLoading] = useState(false);

  const handleStepSubmit = (data: {}) => {
    setFormData((prevData) => ({
      ...prevData,
      ...data,
    }));

    handleNext();
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      translateX.value = e.contentOffset.x;
    },
  });

  const activeScene = useDerivedValue(() => {
    runOnJS(setProgress)(
      Math.round(translateX.value / PAGE_WIDTH) / (Scenes.length + 1) +
        1 / Scenes.length
    );
    return Math.round(translateX.value / PAGE_WIDTH);
  });

  const handleNext = useCallback(() => {
    scrollRef.current?.scrollTo({
      x: PAGE_WIDTH * (activeScene.value + 1),
    });
  }, []);

  const UpdateBasicData = useCallback(async () => {
    //call update profile
    let filename = formData.image.split("/").pop() as string;

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(formData.image);
    let type = match ? `image/${match[1]}` : `image`;

    let body = new FormData();
    body.append("profile_img", {
      uri: formData.image,
      name: filename,
      type,
    } as any);

    setLoading(true);

    try {
      const updateProfilePic = handleApiResponse(UpdateProileImage, [body]);

      const updateProfile = handleApiResponse(UpdateProfile, [
        {
          date_of_birth: formData.age,
          gender: formData.gender,
          current_address: formData.address,
          current_city: formData.city,
          current_zip: formData.zip,
          current_state: formData.state,
          country: formData.country,
        },
      ]);

      await Promise.all([updateProfilePic, updateProfile]);

      await refresh();
      router.replace("/(tabs)/");
    } catch (e) {
      console.log(e);
      Toast.show({
        type: "error",
        text1: "Opps!",
        text2: "something went wrong",
      });
    } finally {
      setLoading(false);
    }
  }, [formData]);

  useEffect(() => {
    console.log(activeScene.value);

    if (activeScene.value === Scenes.length - 1) {
      UpdateBasicData();
    }
  }, [formData]);

  return (
    <SafeAreaView style={styles.container}>
      <LoadingOverlay show={loading} />
      <Animated.ScrollView
        scrollEnabled={false}
        ref={scrollRef}
        style={{ flex: 1 }}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
      >
        <AgeScreen onSubmit={handleStepSubmit} />
        <GenderScreen onSubmit={handleStepSubmit} />
        <AddressScreen onSubmit={handleStepSubmit} />
        <ProfilePicScreen onSubmit={handleStepSubmit} />
      </Animated.ScrollView>

      <View
        style={{
          position: "absolute",
          top: 60,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Bar
          progress={progress}
          width={PAGE_WIDTH - 30}
          height={4}
          color={Colors.light.tabIconSelected}
          unfilledColor={Colors.light.tabIconDefault}
          borderWidth={0}
        />
      </View>
    </SafeAreaView>
  );
};

export default BasicDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    justifyContent: "center",
    alignItems: "center",
  },
});
