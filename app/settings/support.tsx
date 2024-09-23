import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  Linking,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { Button, SizableText, XStack, YStack } from "tamagui";
import { handleCallPress } from "../../components/commons/callButton";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { blue } from "../../utils/colors";
import { AppImages } from "../../assets/images";
import { GetCompanyUPIAddress } from "@/constants/api";
import QRCode from "react-native-qrcode-svg";

type Props = {};

function Support({}: Props) {
  const [vpas, setVPAs] = useState([]);

  const getCompanyVPAs = useCallback(async () => {
    const { data } = await GetCompanyUPIAddress();

    console.log(data);

    if (data.status) {
      const addresses = data.data.value.split(",");
      console.log(addresses);
      setVPAs(addresses);
    }
  }, []);

  useEffect(() => {
    getCompanyVPAs();
  }, [getCompanyVPAs]);

  const handlePayPress = (vpa: string) => {
    const url = `upi://pay?pa=${vpa}&pn=Himalayan Microfinance`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert(`Failed to open UPI, Please scan to pay!`);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error("Error opening UPI:", err));
  };

  return (
    <ImageBackground
      source={AppImages.Loan}
      resizeMode="cover"
      style={{
        flex: 1,
      }}
    >
      <ScrollView
        style={{
          flex: 1,
          display: "flex",
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={AppImages.Logo_new}
            width={1563}
            height={1563}
            style={{ width: 150, height: 150 }}
          />

          <YStack marginTop={40}>
            {/* <SizableText textAlign="center" fontSize={24}>
            Pay Here
          </SizableText> */}
            <XStack gap={16}>
              {vpas.map((vpa) => (
                <YStack>
                  <QRCode
                    value={`upi://pay?pa=${vpa}&pn=Himalayan Microfinance`}
                    size={200}
                    backgroundColor="transparent"
                  />
                  <Button
                    textAlign="center"
                    fontSize={20}
                    onPress={() => handlePayPress(vpa)}
                    fontWeight={"bold"}
                    color={"#673ab7"}
                    transparent
                  >
                    PAY HERE
                  </Button>
                </YStack>
              ))}
            </XStack>
          </YStack>

          <Pressable
            onPress={() => handleCallPress("9864561236")}
            style={{ marginVertical: 16, marginTop: 40 }}
          >
            <XStack gap={"$2"} alignItems="center">
              <Ionicons name="phone-portrait" size={32} />
              <SizableText fontSize={24} color={"#673ab7"}>
                +91-9864-5612-36
              </SizableText>
            </XStack>
          </Pressable>

          <YStack justifyContent="center" alignItems="center">
            <SizableText>Email</SizableText>
            <SizableText fontSize={16}>
              himalayanmicrofinance@gmail.com
            </SizableText>
          </YStack>
          <YStack justifyContent="center" alignItems="center">
            <SizableText>Address</SizableText>
            <SizableText
              fontSize={14}
              style={{ maxWidth: "80%" }}
              textAlign="center"
            >
              Nasatra, Piradhara, Abhayapuri, Bongaigaon(Assam) Pin-783384
            </SizableText>
          </YStack>

          <YStack marginTop={40}>
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
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

export default Support;
