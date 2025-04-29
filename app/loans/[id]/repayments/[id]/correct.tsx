import { router, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, View, Text, Image, Pressable } from "react-native";
import Toast from "react-native-toast-message";
import {
  Button,
  Input,
  SizableText,
  TextArea,
  Theme,
  XStack,
  YStack,
} from "tamagui";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { GetRepayment, MakeCorrection } from "../../../../../constants/api";
import { useSession } from "../../../../../context/SessionContext";
import DatePicker from "../../../../../components/commons/datePicker";
import LoadingOverlay from "../../../../../components/commons/loadingOverlay";
import { showAsCurrency } from "../../../../../utils/showAsCurrency";
import { Repayment } from "../../../../../typs";

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
  const router = useRouter();
  const { handleApiResponse } = useSession();
  const { id } = useLocalSearchParams();

  const [repayment, setRepayment] = useState<Repayment | null>(null);

  const [loading, setLoading] = useState(false);

  const {
    formState: { errors },
    control,
    setValue,
    reset,
    handleSubmit,
  } = useForm({
    // resolver: zodResolver(validationSchema),
    defaultValues: {
      amount: "",
      late_fee: "",
      date: new Date(),
      remark: "",
    },
  });

  const fetchRepaymentDetails = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await handleApiResponse(GetRepayment, [
        parseInt(id as string),
      ]);

      console.log(resp);

      if (resp.status) {
        setRepayment(resp.data);
        setValue("date", new Date(resp.data.pay_date));
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const onSubmit = async (values: FieldValues) => {
    const data = {
      corrected_amount: values.amount,
      corrected_fee: values.late_fee,
      corrected_pay_date: values.date,
      corrected_remark: values.remark,
    };

    setLoading(true);

    const resp = await handleApiResponse(MakeCorrection, [id, data]);

    console.log(resp);

    setLoading(false);

    if (resp.status) {
      setValue("amount", "");
      setValue("late_fee", "");
      setValue("remark", "");
      setValue("date", new Date(resp.data.pay_date));

      setRepayment(resp.data);

      return Toast.show({
        type: "success",
        text1: "Correction has been made successfully!",
      });
    }

    Toast.show({
      type: "error",
      text1: "Something went wrong!",
      text2: resp.message,
    });
  };

  useEffect(() => {
    fetchRepaymentDetails();
  }, [fetchRepaymentDetails]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{
          padding: 8,
        }}
      >
        <LoadingOverlay show={loading} />

        <View style={{ flex: 1, marginTop: 60, padding: 16 }}>
          <Text
            style={{
              paddingHorizontal: 8,
              fontWeight: "600",
              fontSize: 22,
              marginVertical: 16,
            }}
          >
            Repayment Correction
          </Text>
          <YStack gap={16}>
            <View
              style={{
                backgroundColor: "lightgray",
                padding: 16,
                borderRadius: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                }}
              >
                Total Paid Amount: {showAsCurrency(Number(repayment?.amount))}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "lightgray",
                padding: 16,
                borderRadius: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                }}
              >
                Total Paid Late Fee:{" "}
                {showAsCurrency(Number(repayment?.late_fee))}
              </Text>
            </View>
          </YStack>

          <YStack gap={16} marginTop={20}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  size="$4"
                  borderWidth={2}
                  placeholder="Enter Correction Amount"
                  keyboardType="numeric"
                />
              )}
              name="amount"
            />
            {errors.amount && (
              <SizableText theme={"red"}>
                {errors.amount.message?.toString()}
              </SizableText>
            )}
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  size="$4"
                  borderWidth={2}
                  placeholder="Enter Correction Late Fee"
                  keyboardType="numeric"
                />
              )}
              name="late_fee"
            />
            {errors.late_fee && (
              <SizableText theme={"red"}>
                {errors.late_fee.message?.toString()}
              </SizableText>
            )}
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <DatePicker value={value} onValueChange={onChange} />
              )}
              name="date"
            />
            {errors.date && (
              <SizableText theme={"red"}>
                {errors.date.message?.toString()}
              </SizableText>
            )}
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  size="$4"
                  borderWidth={2}
                  placeholder="Enter Correction Remark"
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

          <XStack gap={16} marginTop={20} justifyContent="flex-end">
            <Pressable
              onPress={() => router.back()}
              style={{ padding: 16, borderRadius: 16 }}
            >
              <Text>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleSubmit(onSubmit)}
              style={{
                padding: 16,
                borderRadius: 16,
                backgroundColor: "lightgreen",
              }}
            >
              <Text style={{ fontWeight: "600" }}>Confirm</Text>
            </Pressable>
          </XStack>
        </View>
      </ScrollView>
    </View>
  );
}

export default CollectScreen;
