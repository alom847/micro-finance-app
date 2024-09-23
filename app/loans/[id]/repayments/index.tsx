import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  FlatList,
  RefreshControl,
  Pressable,
  Modal,
  TextInput,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { Link, useLocalSearchParams } from "expo-router";
import { Repayment } from "../../../../typs";
import {
  GetLoanRepayments,
  MakeCorrection,
  UpdateProfile,
} from "../../../../constants/api";
import Colors from "../../../../constants/Colors";
import { showAsCurrency } from "../../../../utils/showAsCurrency";
import { gray } from "../../../../utils/colors";
import { usePagination } from "../../../../hooks/usePagination";
import LoadingOverlay from "../../../../components/commons/loadingOverlay";
import { useSession } from "../../../../context/SessionContext";
import { Entypo } from "@expo/vector-icons";
import { Input, SizableText, XStack, YStack } from "tamagui";
import { Controller, FieldValues, useForm } from "react-hook-form";
import DatePicker from "../../../../components/commons/datePicker";
import Toast from "react-native-toast-message";

const LIMIT = 10;

export default function Loans() {
  const { user } = useSession();
  const { handleApiResponse } = useSession();
  const { id } = useLocalSearchParams();

  const [repayments, setRepayments] = useState<Repayment[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  const { currentPage, paginateFront, goTo } = usePagination(totalItems, LIMIT);

  const [hasMoreData, setHasMoreData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [loading, setLoading] = useState(false);

  const fetchLoanRepayments = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await handleApiResponse(GetLoanRepayments, [
        parseInt(id as string),
        (currentPage - 1) * LIMIT,
        LIMIT,
      ]);
      if (resp.status) {
        if (resp.data.repayments.length < LIMIT) setHasMoreData(false);

        setRepayments((prv) => [...prv, ...resp.data.repayments]);
        setTotalItems(resp.data.total);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [id, currentPage]);

  const onEndReached = () => {
    if (!loading && hasMoreData) {
      paginateFront();
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setHasMoreData(true);
    setRepayments([]);
    if (currentPage === 1) {
      fetchLoanRepayments();
    } else {
      goTo(1);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    fetchLoanRepayments();
  }, [fetchLoanRepayments]);

  return (
    <View>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "500",
          paddingHorizontal: 16,
        }}
      >
        Repayments List
      </Text>

      <LoadingOverlay show={loading} />

      <FlatList
        style={{
          marginVertical: 16,
          width: "100%",
          minHeight: 200,
          borderRadius: 16,
        }}
        ListEmptyComponent={() => (
          <View
            style={{
              position: "relative",
              height: 200,
              minWidth: 300,
              backgroundColor: Colors.light.accent,
              borderRadius: 10,
              paddingVertical: 16,
              paddingHorizontal: 24,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 16 }}>No Results</Text>
          </View>
        )}
        keyExtractor={(repayment) => repayment.id.toString()}
        data={repayments}
        renderItem={({ item: repayment }) => {
          return (
            <View
              key={repayment.id}
              style={{
                position: "relative",
                paddingVertical: 4,
                paddingHorizontal: 16,
                borderRadius: 10,
                borderBottomWidth: 1,
                borderBottomColor: gray[300],
              }}
            >
              {["Admin"].includes(user?.role ?? "") && (
                <Link
                  href={`/loans/${id}/repayments/${repayment.id}/correct`}
                  asChild
                >
                  <Pressable
                    style={{
                      position: "absolute",
                      right: 16,
                      padding: 16,
                      zIndex: 10,
                    }}
                  >
                    <Entypo name="edit" size={24} />
                  </Pressable>
                </Link>
              )}
              {["Manager"].includes(user?.role ?? "") &&
                user?.id === repayment.collected_by && (
                  <Link
                    href={`/loans/${id}/repayments/${repayment.id}/correct`}
                    asChild
                  >
                    <Pressable
                      style={{
                        position: "absolute",
                        right: 16,
                        padding: 16,
                        zIndex: 10,
                      }}
                    >
                      <Entypo name="edit" size={24} />
                    </Pressable>
                  </Link>
                )}
              {["Agent"].includes(user?.role ?? "") &&
                repayment.status === "Collected" &&
                user?.id === repayment.collected_by && (
                  <Link
                    href={`/loans/${id}/repayments/${repayment.id}/correct`}
                    asChild
                  >
                    <Pressable
                      style={{
                        position: "absolute",
                        right: 16,
                        padding: 16,
                        zIndex: 10,
                      }}
                    >
                      <Entypo name="edit" size={24} />
                    </Pressable>
                  </Link>
                )}

              <Text style={{ fontSize: 20, fontWeight: "600", color: "gray" }}>
                #{repayment.id}
              </Text>

              <View
                style={{
                  marginTop: 4,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ display: "flex", gap: 4 }}>
                  <View>
                    <Text style={{ fontSize: 16, color: "gray" }}>Amount</Text>
                    <Text style={{ fontSize: 16 }}>
                      {showAsCurrency(repayment.amount)}
                    </Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 16, color: "gray" }}>
                      Total Paid
                    </Text>
                    <Text style={{ fontSize: 16 }}>
                      {showAsCurrency(repayment.total_paid)}
                    </Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 16, color: "gray" }}>
                      Late Fee
                    </Text>
                    <Text style={{ fontSize: 16 }}>
                      {showAsCurrency(repayment.late_fee)}
                    </Text>
                  </View>
                </View>

                <View style={{ display: "flex", gap: 4 }}>
                  <View>
                    <Text style={{ fontSize: 16, color: "gray" }}>Status</Text>
                    <Text style={{ fontSize: 16 }}>
                      {repayment.status === "Hold" ? "Paid" : repayment.status}
                    </Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 16, color: "gray" }}>Date</Text>
                    <Text style={{ fontSize: 16 }}>
                      {new Date(
                        repayment.pay_date ?? Date.now()
                      ).toDateString()}
                    </Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 16, color: "gray" }}>
                      Collected By
                    </Text>
                    <Text style={{ fontSize: 16 }}>
                      {repayment.collector.name}
                    </Text>
                  </View>
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
