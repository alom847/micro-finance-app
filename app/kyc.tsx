import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  Text,
  ScrollView,
  RefreshControl,
} from "react-native";
import Colors from "../constants/Colors";
import { Bar } from "react-native-progress";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useSession } from "../context/SessionContext";
import { GetKyc, ResetKYC } from "../constants/api";
import IDProofScreen from "../components/kyc/idProofScreen";
import AddressProofScreen from "../components/kyc/addressProofScreen";
import SelfieProofScreen from "../components/kyc/selfieProofScreen";
import LottieView from "lottie-react-native";
import { AppLotties } from "../assets/lotties";
import { Button, Theme } from "tamagui";
import { router } from "expo-router";
import LoadingOverlay from "../components/commons/loadingOverlay";

type kyc = { status: "Verified" | "Pending" | "Rejected" | "NotFilled" };

const { width: PAGE_WIDTH } = Dimensions.get("window");

const Steps = [
  {
    label: "",
    component: ({ onSubmit }: { onSubmit: () => void }) => (
      <View
        style={{
          flex: 1,
          padding: 16,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: "500",
          }}
        >
          KYC Verification
        </Text>
        <LottieView
          loop
          autoPlay
          source={AppLotties.kyc}
          style={{ width: 300, height: 300 }}
        />
        <Text
          style={{
            textAlign: "center",
            fontSize: 16,
          }}
        >
          Please upload proper information, to get Verified.
        </Text>
        <Pressable
          onPress={() => onSubmit()}
          style={{
            marginTop: 32,
            padding: 16,
            backgroundColor: Colors.light.tabIconSelected,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: Colors.light.background }}>
            Click here for verification
          </Text>
        </Pressable>
      </View>
    ),
  },
  {
    label: "ID Proof",
    component: ({ onSubmit }: { onSubmit: () => void }) => (
      <IDProofScreen onSubmit={onSubmit} />
    ),
  },
  {
    label: "Address Proof",
    component: ({ onSubmit }: { onSubmit: () => void }) => (
      <AddressProofScreen onSubmit={onSubmit} />
    ),
  },
  {
    label: "Slefie",
    component: ({ onSubmit }: { onSubmit: () => void }) => (
      <SelfieProofScreen onSubmit={onSubmit} />
    ),
  },
  {
    label: "Verified",
    component: ({
      kyc,
      onReVerify,
      refreshing,
      onRefresh,
    }: {
      kyc: kyc | null;
      refreshing: boolean;
      onRefresh: () => void;
      onReVerify: () => void;
    }) => {
      const { refresh } = useSession();

      if (kyc?.status === "Verified")
        return (
          <View
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LottieView
              loop
              autoPlay
              source={AppLotties.confettie}
              style={{ width: 300, height: 300 }}
            />
            <Text
              style={{
                fontSize: 24,
                textAlign: "center",
                fontWeight: "500",
                marginVertical: 16,
              }}
            >
              Verification Completed
            </Text>
            <Theme name={"blue"}>
              <Button
                onPress={async () => {
                  await refresh();
                  router.replace("/(tabs)/");
                }}
                theme={"active"}
                color={"white"}
              >
                Go To Home
              </Button>
            </Theme>
          </View>
        );

      if (kyc?.status === "Pending")
        return (
          <ScrollView
            style={{
              flex: 1,
            }}
            contentContainerStyle={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <LottieView
              autoPlay
              loop
              source={AppLotties.review}
              style={{ width: 300, height: 300 }}
            />
            <Text
              style={{
                fontSize: 24,
                textAlign: "center",
                fontWeight: "500",
              }}
            >
              KYC Completed, Waiting for Verification.
            </Text>
          </ScrollView>
        );

      if (kyc?.status === "Rejected")
        return (
          <View
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LottieView
              loop
              autoPlay
              source={AppLotties.invalid}
              style={{ width: 300, height: 300 }}
            />
            <Text
              style={{
                fontSize: 24,
                textAlign: "center",
                fontWeight: "500",
                marginVertical: 16,
              }}
            >
              KYC Verification Failed
            </Text>
            <Theme name={"blue"}>
              <Button
                onPress={() => onReVerify()}
                theme={"active"}
                color={"white"}
              >
                Re-Verify
              </Button>
            </Theme>
          </View>
        );

      return <></>;
    },
  },
];

const KYCScreen = () => {
  const { handleApiResponse } = useSession();
  const [kyc, setKyc] = useState<kyc | null>(null);

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const [refreshing, setRefreshing] = useState(false);

  const getKyc = useCallback(async () => {
    setLoading(true);
    const resp = await handleApiResponse(GetKyc);

    console.log("GET KYC", resp);

    setLoading(false);
    if (resp.status) {
      setKyc(resp.data);
      if (resp.data.selfie) {
        setCurrentStep(4);
      } else if (resp.data.address_proof_type) {
        setCurrentStep(3);
      } else if (resp.data.id_proof_type) {
        setCurrentStep(2);
      } else {
        setCurrentStep(0);
      }
    } else {
      setKyc(null);
    }
  }, []);

  const onReVerify = async () => {
    setLoading(true);
    const resp = await ResetKYC();
    setLoading(false);
    if (resp.status) {
      await getKyc();
      return;
    }
    Toast.show({
      type: "error",
      text1: "Oops!",
      text2: "Something went wrong.",
    });
  };

  const onStepSubmit = () => {
    setCurrentStep((prv) => prv + 1);

    if (currentStep > 0) {
      getKyc();
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await getKyc();
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getKyc();
  }, [getKyc]);

  return (
    <>
      <LoadingOverlay show={loading} />
      <SafeAreaView style={styles.container}>
        {/* {loading && <ActivityIndicator />} */}

        <View
          style={{
            flex: 1,
            height: "100%",
          }}
        >
          {Steps[currentStep].component({
            onSubmit: onStepSubmit,
            kyc: kyc,
            refreshing,
            onReVerify: onReVerify,
            onRefresh: onRefresh,
          })}
        </View>

        {currentStep < 3 && (
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
              progress={currentStep / (Steps.length + 1) + 1 / Steps.length}
              width={PAGE_WIDTH - 30}
              height={4}
              color={Colors.light.tabIconSelected}
              unfilledColor={Colors.light.tabIconDefault}
              borderWidth={0}
            />
          </View>
        )}
      </SafeAreaView>
    </>
  );
};

export default KYCScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    justifyContent: "center",
    alignItems: "center",
  },
});
