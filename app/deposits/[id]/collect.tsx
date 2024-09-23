import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { ScrollView, View, Text, Image, Pressable } from "react-native";
import {
  Button,
  Input,
  SizableText,
  TextArea,
  Theme,
  XStack,
  YStack,
} from "tamagui";
import LoadingOverlay from "../../../components/commons/loadingOverlay";
import { CollectDepositEMI, GetDepositDetails } from "../../../constants/api";
import Toast from "react-native-toast-message";
import DatePicker from "../../../components/commons/datePicker";
import { blue, transparent } from "../../../utils/colors";
import { Deposit } from "../../../typs";
import Colors from "../../../constants/Colors";
import { Entypo } from "@expo/vector-icons";
import { showAsCurrency } from "../../../utils/showAsCurrency";
import { formateId } from "../../../utils/formateId";
import { calculateTotalReturn } from "../../../utils/calculateEmi";
import CallButton from "../../../components/commons/callButton";
import { useSession } from "../../../context/SessionContext";

type Props = {};

function DepositCollectionScreen({}: Props) {
  const { handleApiResponse } = useSession();
  const { id } = useLocalSearchParams();

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      amount: "",
      remark: "",
    },
  });

  const [deposit, setDeposit] = useState<Deposit | null>(null);
  const [date, setDate] = useState(new Date());

  const [loading, setLoading] = useState(false);

  const fetchDepositDetails = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await handleApiResponse(GetDepositDetails, [
        parseInt(id as string),
      ]);
      if (resp.status) {
        setDeposit(resp.data.deposit);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleCollect = useCallback(
    async (values: FieldValues) => {
      setLoading(true);
      try {
        console.log(date);

        const emi_data = {
          total_paid: values.amount,
          // total_fee_paid: lateFeeAmountRef.current?.value,
          pay_date: date,
          remark: values.remark,
        };

        const resp = await handleApiResponse(CollectDepositEMI, [
          Number(id),
          emi_data,
        ]);
        if (resp.status) {
          Toast.show({
            type: "success",
            text1: "success",
            text2: resp.message,
          });

          router.canGoBack() && router.back();
        } else {
          Toast.show({ type: "error", text1: "failed", text2: resp.message });
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
        reset();
      }
    },
    [id, date]
  );

  useEffect(() => {
    fetchDepositDetails();
  }, [fetchDepositDetails]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{
          padding: 8,
        }}
      >
        <LoadingOverlay show={loading} />

        <View
          style={{
            backgroundColor: blue[100],
            borderRadius: 10,
            padding: 16,
            gap: 16,
          }}
        >
          <XStack alignItems="center">
            <XStack gap={"$4"} alignItems="center">
              <Image
                source={{
                  uri: deposit?.user?.image,
                }}
                width={80}
                height={80}
                style={{
                  borderRadius: 50,
                  borderColor: blue[200],
                  borderWidth: 2,
                }}
              />

              <YStack justifyContent="center">
                <Text style={{ fontSize: 16, color: Colors.light.text }}>
                  {formateId(deposit?.id ?? 0, "RD")}
                </Text>
                <Text style={{ fontSize: 16, color: Colors.light.text }}>
                  {deposit?.user.name}
                </Text>
              </YStack>
            </XStack>
          </XStack>

          <XStack justifyContent="space-between">
            <Text
              style={{
                fontSize: 16,
                color: "gray",
              }}
            >
              Deposit Amount:
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: Colors.light.text,
              }}
            >
              {showAsCurrency(deposit?.amount ?? 0)}
            </Text>
          </XStack>

          <View
            style={{
              height: 1,
              width: "100%",
              backgroundColor: Colors.light.tabIconDefault,
            }}
          ></View>

          <View
            style={{
              display: "flex",
              gap: 8,
            }}
          >
            <YStack>
              <SizableText color={"gray"}>Amount</SizableText>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    onBlur={onBlur}
                    onChangeText={(value) =>
                      !isNaN(Number(value)) && onChange(value)
                    }
                    value={value}
                    size={"$4"}
                    fontSize={"$8"}
                    borderWidth={2}
                  />
                )}
                name="amount"
              />
              {errors.amount && (
                <SizableText theme={"red"}>
                  {errors.amount.message?.toString()}
                </SizableText>
              )}
            </YStack>

            <YStack>
              <SizableText color={"gray"}>Remark</SizableText>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextArea
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    size="$2"
                    borderWidth={2}
                    rows={2}
                  />
                )}
                name="remark"
              />
              {errors.remark && (
                <SizableText theme={"red"}>
                  {errors.remark.message?.toString()}
                </SizableText>
              )}
            </YStack>

            <YStack>
              <SizableText color={"gray"}>Date</SizableText>
              <DatePicker value={date} onValueChange={setDate} />
            </YStack>

            <XStack justifyContent="flex-end">
              <Button
                variant={"outlined"}
                onPress={() => router.canGoBack() && router.back()}
              >
                Cancel
              </Button>
              <Theme name={"blue"}>
                <Button
                  onPress={handleSubmit(handleCollect)}
                  theme="active"
                  color={"white"}
                >
                  Collect
                </Button>
              </Theme>
            </XStack>
          </View>
        </View>
      </ScrollView>
      {deposit?.user.phone && <CallButton phoneNumber={deposit.user.phone} />}
    </View>
  );
}

export default DepositCollectionScreen;
