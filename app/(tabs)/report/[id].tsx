import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Pressable,
  TextInput,
} from "react-native";
import { usePagination } from "../../../hooks/usePagination";
import { GetReport, MarkAsPaid } from "../../../constants/api";
import Toast from "react-native-toast-message";
import LoadingOverlay from "../../../components/commons/loadingOverlay";
import { Button, Dialog, Input, SizableText, XStack, YStack } from "tamagui";
import { EmiRecord, User, report } from "../../../typs";
import { blue } from "../../../utils/colors";
import { showAsCurrency } from "../../../utils/showAsCurrency";
import { formateId } from "../../../utils/formateId";
import { Link, router, useLocalSearchParams } from "expo-router";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useSession } from "../../../context/SessionContext";
import DatePicker from "@/components/commons/datePicker";

type Props = {};

const LIMIT = 10;

function Report({}: Props) {
  const { handleApiResponse } = useSession();

  const { id } = useLocalSearchParams();

  const [report, setReport] = useState<report>();
  const [reports, setReports] = useState<
    (EmiRecord & { collector: User | null })[]
  >([]);
  const [totalItems, setTotalItems] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);

  const { currentPage, paginateFront, goTo } = usePagination(totalItems, LIMIT);

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  // const planTypeRef = useRef<HTMLSelectElement>(null);
  // const collectorRef = useRef<HTMLInputElement>(null);

  const [filter_from, setFilterFrom] = useState<Date | null>(null);
  const filterFrom = useRef<Date | null>(null);
  const [filter_to, setFilterTo] = useState<Date | null>(null);
  const filterTo = useRef<Date | null>(null);
  const [showFilter, setShowFilter] = useState(false);

  const [showPaidAlert, setShowPaidAlert] = useState(false);
  const pwdRef = useRef("");

  const filterReport = useCallback(async () => {
    setLoading(true);

    goTo(1);

    try {
      const resp = await handleApiResponse(GetReport, [
        0,
        LIMIT,
        filterFrom.current ?? undefined,
        filterTo.current ?? undefined,
        id,
      ]);

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
      const resp = await handleApiResponse(GetReport, [
        (currentPage - 1) * LIMIT,
        LIMIT,
        filterFrom.current ?? undefined,
        filterTo.current ?? undefined,
        id,
        // collectorRef.current ? collectorRef.current.value : undefined,
        // planTypeRef.current
        //   ? (planTypeRef.current.value as "Deposit" | "Loan" | "All")
        //   : "All"
      ]);

      if (resp.status) {
        if (resp.data.reports.length < LIMIT) setHasMoreData(false);

        setReports((prv) => [...prv, ...resp.data.reports]);
        setTotalItems(resp.data.total);
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

  const handleMarkPaid = async () => {
    setLoading(true);
    try {
      const resp = await handleApiResponse(MarkAsPaid, [
        parseInt(id as string),
        pwdRef.current,
      ]);

      if (resp.status) {
        Toast.show({
          type: "success",
          text1: resp.message,
        });
        filterReport();

        setShowPaidAlert(false);
      } else {
        Toast.show({
          type: "error",
          text1: resp.message,
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
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

      <Dialog open={showFilter}>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content>
            <Dialog.Title> Filter </Dialog.Title>

            <XStack gap={8} marginVertical={20}>
              <YStack>
                <Text>From</Text>
                <DatePicker
                  value={filter_from ?? new Date()}
                  onValueChange={(value) => {
                    setFilterFrom(value);
                    filterFrom.current = value;
                  }}
                />
              </YStack>
              <YStack>
                <Text>To</Text>
                <DatePicker
                  value={filter_to ?? new Date()}
                  onValueChange={(value) => {
                    setFilterTo(value);
                    filterTo.current = value;
                  }}
                />
              </YStack>
            </XStack>

            <XStack gap={8}>
              <Button variant="outlined" onPress={() => setShowFilter(false)}>
                Cancel
              </Button>
              <Button
                onPress={() => {
                  handleRefresh();
                  setShowFilter(false);
                }}
              >
                Submit
              </Button>
            </XStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>

      <Dialog open={showPaidAlert}>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content width={"80%"}>
            <Dialog.Title> Are you sure? </Dialog.Title>

            <YStack gap={8}>
              <Text>This will set pending amount to 0.</Text>
              <Input
                secureTextEntry
                onChangeText={(value) => (pwdRef.current = value)}
                placeholder="enter password to confirm"
              />
            </YStack>

            <XStack gap={8} mt={8}>
              <Button
                variant="outlined"
                onPress={() => setShowPaidAlert(false)}
              >
                Cancel
              </Button>
              <Button onPress={handleMarkPaid}>Confirm</Button>
            </XStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>

      <YStack
        backgroundColor={blue[100]}
        padding={"$3"}
        borderRadius={10}
        gap={10}
      >
        <XStack justifyContent="space-between" alignItems="center">
          <YStack>
            <SizableText marginBottom={10} fontSize={20} color={blue[600]}>
              {`${report?.reports[0]?.collector?.name}'s Collection Report`}
            </SizableText>

            <SizableText fontSize={18}>Pending</SizableText>
            <Text style={{ fontSize: 28, color: blue[600] }}>
              {showAsCurrency(report?.pending ?? 0)}
            </Text>

            <Pressable onPress={() => setShowPaidAlert(true)}>
              <View
                style={{
                  width: "40%",
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
                <Text
                  style={{
                    // textAlign: "center",
                    fontSize: 12,
                    color: "white",
                  }}
                >
                  {"Mark Paid"}
                </Text>
              </View>
            </Pressable>
          </YStack>

          <XStack
            style={{
              justifyContent: "center",
              alignItems: "center",
              gap: 16,
            }}
          >
            {(!!filter_from || !!filter_to) && (
              <Button
                variant="outlined"
                onPress={() => {
                  setFilterFrom(null);
                  filterFrom.current = null;

                  setFilterTo(null);
                  filterTo.current = null;

                  handleRefresh();
                }}
              >
                Reset Filter
              </Button>
            )}
            <Pressable onPress={() => setShowFilter(true)}>
              <Ionicons name="filter-outline" size={24} color="black" />
            </Pressable>
          </XStack>
        </XStack>

        <XStack justifyContent="space-between" gap={10}>
          <YStack
            flexGrow={1}
            backgroundColor={blue[200]}
            borderRadius={10}
            padding={8}
            justifyContent="center"
            alignItems="center"
          >
            <SizableText>Loan</SizableText>
            <SizableText fontSize={18}>
              {showAsCurrency(report?.loan ?? 0)}
            </SizableText>
          </YStack>
          <YStack
            flexGrow={1}
            backgroundColor={blue[200]}
            borderRadius={10}
            padding={8}
            justifyContent="center"
            alignItems="center"
          >
            <SizableText>Deposit</SizableText>
            <SizableText fontSize={18}>
              {showAsCurrency(report?.deposit ?? 0)}
            </SizableText>
          </YStack>
        </XStack>
        <XStack justifyContent="space-between" gap={10}>
          <YStack
            flexGrow={1}
            backgroundColor={blue[200]}
            borderRadius={10}
            padding={8}
            justifyContent="center"
            alignItems="center"
          >
            <SizableText>Late Fee</SizableText>
            <SizableText fontSize={18}>
              {showAsCurrency(report?.late_fee ?? 0)}
            </SizableText>
          </YStack>
          <YStack
            flexGrow={1}
            backgroundColor={blue[200]}
            borderRadius={10}
            padding={8}
            justifyContent="center"
            alignItems="center"
          >
            <SizableText>Total Amount</SizableText>
            <SizableText fontSize={18}>
              {showAsCurrency(
                Number(report?.loan ?? 0) + Number(report?.deposit ?? 0)
              )}
            </SizableText>
          </YStack>
        </XStack>
      </YStack>

      <FlatList
        keyExtractor={(report_data) => report_data.id.toString()}
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
              <Pressable
                onPress={() =>
                  router.push(
                    `/${report_data.category.toLowerCase()}s/${
                      report_data.plan_id
                    }`
                  )
                }
              >
                <Text
                  style={{ fontSize: 16, fontWeight: "600", color: blue[600] }}
                >
                  {formateId(
                    report_data.plan_id,
                    report_data.category === "Deposit" ? "RD" : "Loan"
                  )}
                </Text>
              </Pressable>

              <View
                style={{
                  marginTop: 2,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ display: "flex", gap: 4 }}>
                  <View>
                    <Text style={{ fontSize: 12, color: "gray" }}>Amount</Text>
                    <Text style={{ fontSize: 16 }}>
                      {showAsCurrency(report_data.amount)}
                    </Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 12, color: "gray" }}>
                      Late Fee
                    </Text>
                    <Text style={{ fontSize: 16 }}>
                      {showAsCurrency(report_data.late_fee)}
                    </Text>
                  </View>
                </View>

                <View style={{ display: "flex", gap: 4 }}>
                  <View>
                    <Text style={{ fontSize: 12, color: "gray" }}>Status</Text>
                    <Text style={{ fontSize: 16 }}>
                      {report_data.status === "Hold"
                        ? "Paid"
                        : report_data.status}
                    </Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 12, color: "gray" }}>Date</Text>
                    <Text style={{ fontSize: 16 }}>
                      {new Date(report_data.pay_date).toDateString()}
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
        contentContainerStyle={{ paddingBottom: 400 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
}

export default Report;
