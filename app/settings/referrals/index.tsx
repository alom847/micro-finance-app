import { GetReferrals } from "@/constants/api";
import { useSession } from "@/context/SessionContext";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View, XStack, YStack } from "tamagui";

type Props = {};

function MyReferrals({}: Props) {
  const { handleApiResponse } = useSession();

  const [referrals, setReferrals] = useState({
    deposits: {
      count: 0,
      amount: 0,
    },
    loans: {
      count: 0,
      amount: 0,
    },
    referrals: [],
  });
  const [loading, setLoading] = useState(false);

  const getReferrals = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await handleApiResponse(GetReferrals);

      if (resp.status) {
        setReferrals(resp.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getReferrals();
  }, [getReferrals]);

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        paddingBottom: 100,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
        }}
      >
        My Referrals
      </Text>
      <YStack style={{ marginTop: 20 }}>
        <YStack gap={20}>
          <XStack
            style={{
              width: "100%",
              justifyContent: "space-evenly",
              alignItems: "center",
              gap: 8,
            }}
          >
            <YStack
              style={{
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#eaeaea",
                flex: 1,
                padding: 16,
                borderRadius: 16,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "semibold" }}>
                Total Loans
              </Text>
              <Text style={{ fontSize: 16, fontWeight: "semibold" }}>
                {referrals?.loans.count}
              </Text>
            </YStack>
            <YStack
              style={{
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#eaeaea",
                flex: 1,
                padding: 16,
                borderRadius: 16,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "semibold" }}>
                Total Amount
              </Text>
              <Text style={{ fontSize: 16, fontWeight: "semibold" }}>
                {referrals?.loans.amount}
              </Text>
            </YStack>
          </XStack>

          <XStack
            style={{
              width: "100%",
              justifyContent: "space-evenly",
              alignItems: "center",
              gap: 8,
            }}
          >
            <YStack
              style={{
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#eaeaea",
                flex: 1,
                padding: 16,
                borderRadius: 16,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "semibold" }}>
                Total Deposits
              </Text>
              <Text style={{ fontSize: 16, fontWeight: "semibold" }}>
                {referrals?.deposits.count}
              </Text>
            </YStack>
            <YStack
              style={{
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#eaeaea",
                flex: 1,
                padding: 16,
                borderRadius: 16,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "semibold" }}>
                Total Amount
              </Text>
              <Text style={{ fontSize: 16, fontWeight: "semibold" }}>
                {referrals?.deposits.amount}
              </Text>
            </YStack>
          </XStack>
        </YStack>
      </YStack>

      <YStack
        style={{
          marginTop: 20,
        }}
      >
        {referrals.referrals.map(
          (referral: { id: number; category: string; amount: string }) => (
            <View
              key={referral.id}
              style={{
                padding: 16,
                backgroundColor: "#eaeaea",
                borderRadius: 16,
                gap: 4,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ gap: 4, justifyContent: "space-between" }}>
                <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                  {referral.id}
                </Text>
                <Text style={{ fontSize: 14, fontWeight: "semibold" }}>
                  Category: {referral.category}
                </Text>
              </View>

              <View style={{ gap: 4, alignItems: "flex-end" }}>
                <Text style={{ fontSize: 14 }}>Amount</Text>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  {referral.amount}
                </Text>
              </View>
            </View>
          )
        )}
      </YStack>
    </ScrollView>
  );
}

export default MyReferrals;
