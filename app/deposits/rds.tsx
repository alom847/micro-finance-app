import { StyleSheet, View, Text, ScrollView } from "react-native";
import Colors from "../../constants/Colors";
import DepositCard from "../../components/depositCard";
import { useCallback, useEffect, useState } from "react";
import { GetDeposits } from "../../constants/api";
import { Deposit } from "../../typs";
import { Link } from "expo-router";
import { RefreshControl } from "react-native-gesture-handler";
import { useSession } from "../../context/SessionContext";

export default function Loans() {
  const { handleApiResponse } = useSession();
  const [rds, setRds] = useState<Deposit[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const getRds = useCallback(async () => {
    try {
      const resp = await handleApiResponse(GetDeposits, ["RD"]);

      if (resp.status) {
        setRds(resp.message.deposits ?? []);
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    await getRds();

    setRefreshing(false);
  }, []);

  useEffect(() => {
    getRds();
  }, []);

  return (
    <ScrollView
      style={{
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
      }}
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
          My Recurring Deposits
        </Text>

        <Link href={"/deposits/apply?dt=RD"} style={{}}>
          <Text style={{ fontSize: 18, color: Colors.light.tabIconSelected }}>
            Apply New
          </Text>
        </Link>
      </View>

      <ScrollView
        style={{
          marginVertical: 16,
          minHeight: 200,
        }}
        contentContainerStyle={{
          gap: 10,
        }}
      >
        {rds.length > 0 ? (
          rds.map((deposit) => (
            <DepositCard key={deposit.id} deposit={deposit} width="fill" />
          ))
        ) : (
          <View
            style={{
              position: "relative",
              height: 200,
              minWidth: "100%",
              backgroundColor: Colors.light.accent,
              borderRadius: 10,
              paddingVertical: 16,
              paddingHorizontal: 24,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 16 }}>No Results</Text>
          </View>
        )}
      </ScrollView>

      <View style={{ height: 60 }}></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 16,
    height: 1,
    marginHorizontal: "auto",
    width: "100%",
    backgroundColor: Colors.light.text,
  },
});
