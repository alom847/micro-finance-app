import { StyleSheet, View, Text, ScrollView } from "react-native";
import Colors from "../../constants/Colors";
import LoanCard from "../../components/loanCard";
import DepositCard from "../../components/depositCard";
import { useCallback, useEffect, useState } from "react";
import { GetDeposits, GetLoans } from "../../constants/api";
import { Deposit, Loan } from "../../typs";
import { Link } from "expo-router";
import { RefreshControl } from "react-native-gesture-handler";
import { XStack } from "tamagui";
import { useSession } from "../../context/SessionContext";

export default function Loans() {
  const { handleApiResponse } = useSession();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [fds, setFDs] = useState<Deposit[]>([]);
  const [rds, setRDs] = useState<Deposit[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const getLoans = useCallback(async () => {
    try {
      const resp = await handleApiResponse(GetLoans);

      if (resp.status) {
        setLoans(resp.message.loans ?? []);
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  const getRDs = useCallback(async () => {
    try {
      const resp = await handleApiResponse(GetDeposits, ["RD"]);

      if (resp.status) {
        setRDs(resp.message.deposits ?? []);
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  const getFDs = useCallback(async () => {
    try {
      const resp = await handleApiResponse(GetDeposits, ["FD"]);

      if (resp.status) {
        setFDs(resp.message.deposits ?? []);
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    await getLoans();
    await getRDs();
    await getFDs();

    setRefreshing(false);
  }, []);

  useEffect(() => {
    getLoans();
    getRDs();
    getFDs();
  }, []);

  return (
    <ScrollView
      style={{
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
      }}
      contentContainerStyle={{ paddingBottom: 50 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "500",
            paddingHorizontal: 16,
          }}
        >
          My Loans
        </Text>

        <Link href={"/loans"} style={{}}>
          <Text style={{ fontSize: 16, color: Colors.light.tabIconSelected }}>
            View all
          </Text>
        </Link>
      </View>

      <ScrollView
        horizontal
        style={{ marginVertical: 16, minHeight: 200 }}
        contentContainerStyle={{ gap: 10 }}
      >
        {loans.length > 0 ? (
          loans.map((loan) => <LoanCard key={loan.id} loan={loan} />)
        ) : (
          <XStack
            width={600}
            maxWidth={"100%"}
            alignItems="center"
            justifyContent="center"
            backgroundColor={Colors.light.accent}
            borderRadius={10}
          >
            <Text style={{ fontSize: 16 }}>No Results</Text>
          </XStack>
        )}
      </ScrollView>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "500",
            paddingHorizontal: 16,
          }}
        >
          My Recurring Deposits
        </Text>

        <Link href={"/deposits/rds"} style={{}}>
          <Text style={{ fontSize: 16, color: Colors.light.tabIconSelected }}>
            View all
          </Text>
        </Link>
      </View>

      <ScrollView
        horizontal
        style={{ marginVertical: 16, minHeight: 200 }}
        contentContainerStyle={{ gap: 10 }}
      >
        {rds.length > 0 ? (
          rds.map((deposit) => (
            <DepositCard key={deposit.id} deposit={deposit} />
          ))
        ) : (
          <XStack
            width={600}
            maxWidth={"100%"}
            alignItems="center"
            justifyContent="center"
            backgroundColor={Colors.light.accent}
            borderRadius={10}
          >
            <Text style={{ fontSize: 16 }}>No Results</Text>
          </XStack>
        )}
      </ScrollView>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "500",
            paddingHorizontal: 16,
          }}
        >
          My Fixed Deposits
        </Text>

        <Link href={"/deposits/fds"} style={{}}>
          <Text style={{ fontSize: 16, color: Colors.light.tabIconSelected }}>
            View all
          </Text>
        </Link>
      </View>

      <ScrollView
        horizontal
        style={{ marginVertical: 16, minHeight: 200 }}
        contentContainerStyle={{ gap: 10 }}
      >
        {fds.length > 0 ? (
          fds.map((deposit) => (
            <DepositCard key={deposit.id} deposit={deposit} />
          ))
        ) : (
          <XStack
            width={600}
            maxWidth={"100%"}
            alignItems="center"
            justifyContent="center"
            backgroundColor={Colors.light.accent}
            borderRadius={10}
          >
            <Text style={{ fontSize: 16 }}>No Results</Text>
          </XStack>
        )}
      </ScrollView>
    </ScrollView>
  );
}
