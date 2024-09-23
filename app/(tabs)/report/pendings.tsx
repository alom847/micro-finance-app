import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, FlatList, RefreshControl, Pressable } from "react-native";
import { usePagination } from "../../../hooks/usePagination";
import { GetPendingReport, GetReport } from "../../../constants/api";
import Toast from "react-native-toast-message";
import LoadingOverlay from "../../../components/commons/loadingOverlay";
import { Button, Dialog, SizableText, XStack, YStack } from "tamagui";
import { EmiRecord, User, groupReport, report } from "../../../typs";
import { blue } from "../../../utils/colors";
import { showAsCurrency } from "../../../utils/showAsCurrency";
import { formateId } from "../../../utils/formateId";
import { Link, router } from "expo-router";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useSession } from "../../../context/SessionContext";
import DatePicker from "@/components/commons/datePicker";

type Props = {};

const LIMIT = 10;

function Report({}: Props) {
  const { user, handleApiResponse } = useSession();
  const [report, setReport] = useState<groupReport>();
  const [reports, setReports] = useState<
    {
      id: string;
      collected_by: string;
      _sum: {
        amount: number;
        late_fee: number;
      };
      user: User;
    }[]
  >([]);

  const [totalItems, setTotalItems] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);

  const { currentPage, paginateFront, goTo } = usePagination(totalItems, LIMIT);

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const filterReport = useCallback(async () => {
    setLoading(true);

    goTo(1);

    try {
      const resp = await handleApiResponse(GetPendingReport, [
        LIMIT,
        0,
        // filterFrom.current ?? undefined,
        // filterTo.current ?? undefined,
        // collectorRef.current ? collectorRef.current.value : undefined,
        // planTypeRef.current
        //   ? (planTypeRef.current.value as "Deposit" | "Loan" | "All")
        //   : "All"
      ]);
      console.log(resp);

      if (resp.status) {
        setReport(resp.data);
        // setReports(resp.data.reports);
        // console.log(resp.data.reports);
      } else {
        Toast.show({ type: "error", text1: resp.message });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await handleApiResponse(GetPendingReport, [
        LIMIT,
        (currentPage - 1) * LIMIT,
        // filterFrom.current ?? undefined,
        // filterTo.current ?? undefined,
        // collectorRef.current ? collectorRef.current.value : undefined,
        // planTypeRef.current
        //   ? (planTypeRef.current.value as "Deposit" | "Loan" | "All")
        //   : "All"
      ]);

      if (resp.status) {
        if (resp.data.txns.length < LIMIT) setHasMoreData(false);

        setReports((prv) => [...prv, ...resp.data.txns]);
        setTotalItems(resp.data.txns.length);
      } else {
        Toast.show({ type: "error", text1: resp.message });
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

  const handleRefresh = () => {
    setRefreshing(true);
    setHasMoreData(true);
    setReports([]);
    filterReport();
    if (currentPage === 1) {
      fetchReports();
    } else {
      goTo(1);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    filterReport();
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <View style={{ padding: 8 }}>
      <LoadingOverlay show={loading} />

      <YStack
        backgroundColor={blue[100]}
        padding={"$3"}
        borderRadius={10}
        gap={10}
      >
        <XStack justifyContent="space-between" alignItems="center">
          <YStack>
            <SizableText fontSize={18}>Pending</SizableText>
            <Text style={{ fontSize: 28, color: blue[600] }}>
              {showAsCurrency(report?.pending ?? 0)}
            </Text>
          </YStack>
        </XStack>
      </YStack>

      <FlatList
        keyExtractor={(report_data) => report_data.collected_by.toString()}
        data={reports}
        renderItem={({ item: report_data }) => {
          return (
            <View
              style={{
                padding: 8,
                borderBottomColor: "gray",
                borderBottomWidth: 1,
              }}
            >
              {["Admin", "Manager"].includes(user?.role ?? "") && (
                // <Pressable
                //   onPress={() => router.push(`/user/${report_data.user.id}`)}
                // >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: blue[600],
                  }}
                >
                  Collected By: {report_data.user?.name} (
                  {report_data.user?.role})
                </Text>
                // </Pressable>
              )}

              <View
                style={{
                  marginTop: 2,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ display: "flex", gap: 4 }}>
                  <View>
                    <Text style={{ fontSize: 12, color: "gray" }}>Amount</Text>
                    <Text style={{ fontSize: 16 }}>
                      {showAsCurrency(Number(report_data?._sum?.amount))}
                    </Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 12, color: "gray" }}>
                      Late Fee
                    </Text>
                    <Text style={{ fontSize: 16 }}>
                      {showAsCurrency(Number(report_data?._sum?.late_fee))}
                    </Text>
                  </View>
                </View>

                <View style={{ display: "flex", gap: 4 }}>
                  <Pressable
                    onPress={() =>
                      router.push(`/report/${report_data.collected_by}`)
                    }
                    style={{
                      backgroundColor: blue[600],
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ color: "#fff" }}>View Payments</Text>
                  </Pressable>
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
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
}

export default Report;
