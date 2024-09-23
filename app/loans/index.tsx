import { StyleSheet, View, Text, ScrollView } from "react-native";
import Colors from "../../constants/Colors";
import LoanCard from "../../components/loanCard";
import { useCallback, useEffect, useState } from "react";
import { GetLoans } from "../../constants/api";
import { Loan } from "../../typs";
import { Link } from "expo-router";
import { RefreshControl } from "react-native-gesture-handler";
import { useSession } from "../../context/SessionContext";

export default function Loans() {
  const { handleApiResponse } = useSession();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [loading, setLoading] = useState(false);

  const getLoans = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await handleApiResponse(GetLoans);

      if (resp.status) {
        setLoans(resp.message.loans ?? []);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    await getLoans();

    setRefreshing(false);
  }, []);

  useEffect(() => {
    getLoans();
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
          My Loans
        </Text>

        <Link href={"/loans/apply"} style={{}}>
          <Text style={{ fontSize: 18, color: Colors.light.tabIconSelected }}>
            Apply New
          </Text>
        </Link>
      </View>

      <ScrollView
        style={{ marginVertical: 16, width: "100%", minHeight: 200 }}
        contentContainerStyle={{ gap: 10 }}
      >
        {loans.length > 0 ? (
          loans.map((loan) => (
            <LoanCard key={loan.id} loan={loan} width="fill" />
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
