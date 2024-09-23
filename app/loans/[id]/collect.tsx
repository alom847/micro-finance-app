import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, View, Text, Image } from "react-native";
import { CollectEMI, GetLoanDetails, GetLoanDue } from "../../../constants/api";
import { Loan } from "../../../typs";
import Toast from "react-native-toast-message";
import LoadingOverlay from "../../../components/commons/loadingOverlay";
import { blue, orange, red } from "../../../utils/colors";
import {
  Button,
  Input,
  SizableText,
  TextArea,
  Theme,
  XStack,
  YStack,
} from "tamagui";
import { formateId } from "../../../utils/formateId";
import Colors from "../../../constants/Colors";
import { showAsCurrency } from "../../../utils/showAsCurrency";
import { Controller, FieldValues, useForm } from "react-hook-form";
import DatePicker from "../../../components/commons/datePicker";
import CallButton from "../../../components/commons/callButton";
import { useSession } from "../../../context/SessionContext";

type Props = {};

type due_data = {
  // overdues: due_record[];
  // partiallyPaid: due_record[];
  // dues: due_record[];
  totalOverdue: number;
  totalPartialRemain: number;
  totalDue: number;
  totalLateFee: number;
};

function CollectScreen({}: Props) {
  const { handleApiResponse } = useSession();
  const { id } = useLocalSearchParams();

  const [loan, setLoan] = useState<Loan | null>(null);
  const [dueData, setDueData] = useState<due_data>();

  const [loading, setLoading] = useState(false);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      amount: "",
      fee: "",
      remark: "",
    },
  });

  const [date, setDate] = useState(new Date());

  const fetchLoanDetails = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await handleApiResponse(GetLoanDetails, [
        parseInt(id as string),
      ]);
      if (resp.status) {
        setLoan(resp.data.loan);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchDues = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await handleApiResponse(GetLoanDue, [
        parseInt(id as string),
      ]);
      if (resp.status) {
        setDueData(resp.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLoanDetails();
  }, [fetchLoanDetails]);

  useEffect(() => {
    fetchDues();
  }, [fetchDues]);

  const handleCollect = async (values: FieldValues) => {
    setLoading(true);
    try {
      const emi_data = {
        total_paid: values.amount,
        total_fee_paid: values.fee,
        pay_date: date,
        remark: values.remark,
      };

      const resp = await handleApiResponse(CollectEMI, [
        parseInt(id as string),
        emi_data,
      ]);
      if (resp.status) {
        Toast.show({ type: "success", text1: resp.message });
        router.canGoBack() && router.back();
      } else {
        Toast.show({ type: "error", text1: resp.message });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      reset();
    }
  };

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
            backgroundColor: red[200],
            borderRadius: 10,
            padding: 16,
            gap: 16,
          }}
        >
          <XStack alignItems="center">
            <XStack gap={"$4"} alignItems="center">
              <Image
                source={{
                  uri: loan?.user?.image,
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
                  {formateId(loan?.id ?? 0, "Loan")}
                </Text>
                <Text style={{ fontSize: 16, color: Colors.light.text }}>
                  {loan?.user.name}
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
              EMI Amount:
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: Colors.light.text,
              }}
            >
              {showAsCurrency(loan?.emi_amount ?? 0)}
            </Text>
          </XStack>
          <XStack justifyContent="space-between">
            <Text
              style={{
                fontSize: 16,
                color: "gray",
              }}
            >
              Today Due:
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: Colors.light.text,
              }}
            >
              {showAsCurrency(dueData?.totalDue ?? 0)}
            </Text>
          </XStack>
          <XStack justifyContent="space-between">
            <Text
              style={{
                fontSize: 16,
                color: "gray",
              }}
            >
              Total Late Fee:
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: Colors.light.text,
              }}
            >
              {showAsCurrency(dueData?.totalLateFee ?? 0)}
            </Text>
          </XStack>
          <XStack justifyContent="space-between">
            <Text
              style={{
                fontSize: 16,
                color: "gray",
              }}
            >
              Total Due:
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: Colors.light.text,
              }}
            >
              {showAsCurrency(
                (dueData?.totalDue ?? 0) +
                  (dueData?.totalPartialRemain ?? 0) +
                  (dueData?.totalOverdue ?? 0)
              )}{" "}
              {(dueData?.totalLateFee ?? 0) > 0 &&
                `+ ${showAsCurrency(dueData?.totalLateFee ?? 0)}`}
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
            <XStack gap={4}>
              <YStack flex={1}>
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
              <YStack flex={1}>
                <SizableText color={"gray"}>Late Fee</SizableText>
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
                  name="fee"
                />
                {errors.fee && (
                  <SizableText theme={"red"}>
                    {errors.fee.message?.toString()}
                  </SizableText>
                )}
              </YStack>
            </XStack>

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
      {loan?.user.phone && <CallButton phoneNumber={loan.user.phone} />}
    </View>
  );
}

export default CollectScreen;
