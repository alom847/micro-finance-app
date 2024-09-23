import { FlatList, Pressable, RefreshControl } from "react-native";

import { Text, View } from "../../../components/Themed";
import Colors from "../../../constants/Colors";
import { useCallback, useEffect, useState } from "react";
import { GetTransactions, GetWallet } from "../../../constants/api";
import { showAsCurrency } from "../../../utils/showAsCurrency";
import { Entypo } from "@expo/vector-icons";
import WithdrawalCard from "../../../components/wallet/withdrawalCard";
import { usePagination } from "../../../hooks/usePagination";
import { blue } from "../../../utils/colors";
import LoadingOverlay from "../../../components/commons/loadingOverlay";
import { router } from "expo-router";
import { useSession } from "../../../context/SessionContext";

type wallet = {
  balance: number;
};

type transaction = {
  id: number;
  wallet_id: number;
  amount: number;
  fee: number;
  balance: number;
  txn_type: string;
  created_at: string;
  txn_note: string;
};

// type walletWithOwner = wallets & {
//   owner: user;
//   company_balance: number | null;
// };

const LIMIT = 10;

export default function TabTwoScreen() {
  const { user, handleApiResponse } = useSession();
  const [wallet, setWallet] = useState<wallet>();

  const [txns, setTxns] = useState<transaction[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  const { currentPage, paginateFront, goTo } = usePagination(totalItems, LIMIT);

  const [hasMoreData, setHasMoreData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchWallet = async () => {
    setLoading(true);
    try {
      const resp = await handleApiResponse(GetWallet);

      if (resp.status) {
        setWallet(resp.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await handleApiResponse(GetTransactions, [
        (currentPage - 1) * LIMIT,
        LIMIT,
      ]);

      if (resp.status) {
        if (resp.data.txns.length < LIMIT) setHasMoreData(false);

        setTxns((prv) => [...prv, ...resp.data.txns]);
        setTotalItems(resp.data.total);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  const onEndReached = () => {
    if (!loading && hasMoreData) {
      paginateFront();
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setHasMoreData(true);
    setTxns([]);
    if (currentPage === 1) {
      fetchTransactions();
    } else {
      goTo(1);
    }
    fetchWallet();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <View style={{ padding: 8, backgroundColor: "#fff" }}>
      <LoadingOverlay show={loading} />

      <View
        style={{
          padding: 16,
          backgroundColor: Colors.light.accent,
          borderRadius: 10,
        }}
      >
        <Text style={{ fontSize: 24, color: "gray" }}>Balance</Text>
        <Text
          style={{ fontSize: 42, color: Colors.light.text, fontWeight: "500" }}
        >
          {showAsCurrency(Number(wallet?.balance))}
        </Text>

        {!["Admin", "Manager"].includes(user?.role ?? "") && (
          <View
            style={{
              marginTop: 16,
              display: "flex",
              flexDirection: "row",
              backgroundColor: "transparent",
              gap: 8,
            }}
          >
            <WithdrawalCard balance={wallet?.balance ?? 0} />

            <Pressable
              onPress={() => {
                router.push("/(tabs)/wallet/withdrawals");
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 8,
                  gap: 8,
                  backgroundColor: "indigo",
                  borderRadius: 10,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#fafafa",
                    padding: 4,
                    borderRadius: 50,
                  }}
                >
                  <Entypo name="archive" size={20} color="gray" />
                </View>
                <Text
                  style={{
                    // textAlign: "center",
                    fontSize: 12,
                    color: "white",
                  }}
                >
                  {"Withdrawal \nStatements"}
                </Text>
              </View>
            </Pressable>
          </View>
        )}
      </View>

      <Text
        style={{
          marginVertical: 16,
          paddingHorizontal: 8,
          fontSize: 24,
          fontWeight: "500",
          color: Colors.light.text,
        }}
      >
        Transactions
      </Text>

      <FlatList
        keyExtractor={(txn) => txn.id.toString()}
        data={txns}
        renderItem={({ item: txn }) => {
          return (
            <View
              key={txn.id}
              style={{
                padding: 8,
                display: "flex",
                borderBottomColor: blue[200],
                borderBottomWidth: 1,
                backgroundColor: Colors.light.background,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 2,
                  borderRadius: 10,
                  backgroundColor: Colors.light.background,
                }}
              >
                <Text
                  style={{ fontSize: 18, fontWeight: "600", color: "gray" }}
                >
                  #{txn.id}
                </Text>
                <Text style={{ fontSize: 16, color: Colors.light.text }}>
                  {new Date(txn.created_at).toDateString()}
                </Text>
              </View>

              <View
                style={{
                  borderRadius: 10,
                  backgroundColor: Colors.light.background,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    backgroundColor: "transparent",
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      backgroundColor: "transparent",
                    }}
                  >
                    <Text style={{ fontSize: 16, color: "gray" }}>Amount</Text>
                    <Text
                      style={{
                        fontSize: 16,
                        color: txn.txn_type === "Credit" ? "green" : "red",
                        fontWeight: "500",
                      }}
                    >
                      {txn.txn_type === "Credit" ? "+" : "-"}
                      {showAsCurrency(txn.amount)}
                    </Text>
                  </View>

                  <View
                    style={{
                      marginTop: 2,
                      display: "flex",
                      alignItems: "flex-end",
                      backgroundColor: "transparent",
                    }}
                  >
                    <Text style={{ fontSize: 16, color: "gray" }}>Balance</Text>
                    <Text
                      style={{
                        fontSize: 16,
                        color: Colors.light.text,
                        fontWeight: "500",
                      }}
                    >
                      {showAsCurrency(txn.balance)}
                    </Text>
                  </View>
                </View>

                <View style={{ backgroundColor: "transparent" }}>
                  <Text style={{ fontSize: 16, color: "gray" }}>
                    Description
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: Colors.light.text,
                    }}
                    numberOfLines={2}
                  >
                    {txn.txn_note ?? "n/a"}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
        contentContainerStyle={{ paddingBottom: 400 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}
