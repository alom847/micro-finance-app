import { FlatList, Pressable, RefreshControl } from "react-native";

import { Text, View } from "../../../components/Themed";
import Colors from "../../../constants/Colors";
import { useCallback, useEffect, useState } from "react";
import { GetWithdrawals } from "../../../constants/api";
import { showAsCurrency } from "../../../utils/showAsCurrency";
import { usePagination } from "../../../hooks/usePagination";
import { blue, gray, orange, red } from "../../../utils/colors";
import LoadingOverlay from "../../../components/commons/loadingOverlay";
import { withdrawal } from "../../../typs";
import { formateId } from "../../../utils/formateId";
import { XStack, YStack } from "tamagui";
import { useSession } from "../../../context/SessionContext";

const LIMIT = 10;

const StatusColors: { [key: string]: string } = {
  Pending: orange[400],
  Completed: gray[400],
  Rejected: red[400],
};

export default function TabTwoScreen() {
  const { handleApiResponse } = useSession();
  const [withdrawals, setWithdrawals] = useState<withdrawal[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  const { currentPage, paginateFront, goTo } = usePagination(totalItems, LIMIT);

  const [hasMoreData, setHasMoreData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const getWithdrawals = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await handleApiResponse(GetWithdrawals, [
        (currentPage - 1) * LIMIT,
        LIMIT,
      ]);

      if (resp.status) {
        if (resp.data.withdrawals.length < LIMIT) setHasMoreData(false);

        setWithdrawals((prv) => [...prv, ...resp.data.withdrawals]);
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
    setWithdrawals([]);
    if (currentPage === 1) {
      getWithdrawals();
    } else {
      goTo(1);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    getWithdrawals();
  }, [getWithdrawals]);

  return (
    <View style={{ padding: 8, backgroundColor: "#fff" }}>
      <LoadingOverlay show={loading} />

      <Text
        style={{
          fontSize: 16,
          fontWeight: "500",
          paddingHorizontal: 16,
        }}
      >
        Withdrawals List
      </Text>

      <FlatList
        style={{
          marginVertical: 16,
          width: "100%",
          minHeight: 200,
          borderRadius: 16,
        }}
        keyExtractor={(withdrawal) => withdrawal.id.toString()}
        data={withdrawals}
        renderItem={({ item: withdrawal }) => {
          return (
            <View
              key={withdrawal.id}
              style={{
                padding: 8,
                display: "flex",
                borderBottomColor: blue[200],
                borderBottomWidth: 1,
                backgroundColor: Colors.light.background,
              }}
            >
              <XStack justifyContent="space-between">
                <Text
                  style={{ fontSize: 18, fontWeight: "500", color: "gray" }}
                >
                  #{formateId(withdrawal.id, "WITHDRAWAL")}
                </Text>
                <Text style={{ fontSize: 16, color: Colors.light.text }}>
                  {new Date(withdrawal.created_at).toDateString()}
                </Text>
              </XStack>

              <YStack>
                <XStack justifyContent="space-between">
                  <YStack>
                    <Text style={{ fontSize: 16, color: "gray" }}>Amount</Text>
                    <Text
                      style={{
                        fontSize: 16,
                        color: Colors.light.text,
                        fontWeight: "500",
                      }}
                    >
                      {showAsCurrency(withdrawal.amount)}
                    </Text>
                  </YStack>

                  <YStack alignItems="flex-end">
                    <Text style={{ fontSize: 16, color: "gray" }}>Status</Text>
                    <Text
                      style={{
                        fontSize: 16,
                        color: StatusColors[withdrawal.status],
                        fontWeight: "500",
                      }}
                    >
                      {withdrawal.status}
                    </Text>
                  </YStack>
                </XStack>

                <YStack>
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
                    {withdrawal.note ?? "n/a"}
                  </Text>
                </YStack>
              </YStack>
            </View>
          );
        }}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
        contentContainerStyle={{
          paddingBottom: 400,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}
