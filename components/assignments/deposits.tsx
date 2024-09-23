import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
  Image,
  FlatList,
  RefreshControl,
  Modal,
} from "react-native";
import { GetAssignments, GetSearchResult } from "../../constants/api";
import { Deposit, Loan } from "../../typs";
import { formateId } from "../../utils/formateId";
import { Entypo, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { blue, gray, green, indigo, transparent } from "../../utils/colors";
import Colors from "../../constants/Colors";
import { Button, Input, SizableText, Theme, XStack } from "tamagui";
import LoadingOverlay from "../commons/loadingOverlay";
import { usePagination } from "../../hooks/usePagination";
import Toast from "react-native-toast-message";
import { useSession } from "../../context/SessionContext";

type Props = {};

const LIMIT = 10;

function DepositAssignments({}: Props) {
  const { handleApiResponse } = useSession();
  const [searchTerm, setSearchTerm] = useState("");

  const [largeImage, setLargeImage] = useState<string | null>(null);

  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  const { currentPage, paginateFront, goTo } = usePagination(totalItems, LIMIT);

  const [hasMoreData, setHasMoreData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const getDeposits = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await handleApiResponse(GetAssignments, [
        "Deposit",
        (currentPage - 1) * LIMIT,
        LIMIT,
      ]);

      if (resp.status) {
        if (resp.message.deposits.length < LIMIT) setHasMoreData(false);

        setDeposits((prv) => [...prv, ...resp.message.deposits]);
        setTotalItems(resp.message.total);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  const searchQuery = async () => {
    setLoading(true);
    try {
      const resp = await handleApiResponse(GetSearchResult, [
        searchTerm ?? "",
        "Deposits",
      ]);
      if (resp.status) {
        if (resp.data.deposits.length < LIMIT) setHasMoreData(false);
        setDeposits(resp.data.deposits);
      } else {
        Toast.show({ type: "error", text1: resp.message });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const onEndReached = () => {
    if (!loading && hasMoreData) {
      paginateFront();
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setSearchTerm("");
    setHasMoreData(true);
    setDeposits([]);
    if (currentPage === 1) {
      getDeposits();
    } else {
      goTo(1);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    getDeposits();
  }, [getDeposits]);

  return (
    <View>
      <LoadingOverlay show={loading} />

      <Modal
        visible={!!largeImage}
        presentationStyle="overFullScreen"
        transparent
      >
        <Pressable
          onPress={() => setLargeImage(null)}
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Image
            source={{
              uri: largeImage ?? "",
            }}
            width={250}
            height={250}
            style={{
              borderRadius: 50,
              borderColor: blue[200],
              borderWidth: 2,
            }}
          />
        </Pressable>
      </Modal>

      <XStack alignItems="center" backgroundColor={blue[200]}>
        <Input
          flex={1}
          placeholder={`Search...`}
          borderRadius={0}
          value={searchTerm}
          onChangeText={(value) => setSearchTerm(value)}
        />
        <Theme name={"blue"}>
          <Button
            onPress={searchQuery}
            theme="active"
            color={"white"}
            borderRadius={0}
          >
            Search
          </Button>
        </Theme>
      </XStack>

      <FlatList
        style={{
          marginVertical: 16,
          width: "100%",
          minHeight: 200,
          borderRadius: 16,
        }}
        keyExtractor={(deposit) => deposit.id.toString()}
        data={deposits}
        renderItem={({ item: deposit }) => {
          return (
            <View
              key={deposit.id}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 4,
                borderBottomWidth: 1,
                borderBottomColor: gray[200],
              }}
            >
              <View
                style={{
                  padding: 2,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: transparent,
                  borderRadius: 20,
                  gap: 8,
                }}
              >
                <Pressable onPress={() => setLargeImage(deposit.user.image)}>
                  <Image
                    source={{
                      uri: deposit?.user?.image,
                    }}
                    width={50}
                    height={50}
                    style={{
                      borderRadius: 50,
                      borderColor: blue[200],
                      borderWidth: 2,
                    }}
                  />
                </Pressable>

                <View
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "transparent",
                    gap: 1,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "transparent",
                    }}
                  >
                    <SizableText style={{ fontSize: 16 }}>
                      {deposit.user.name}
                    </SizableText>
                    <SizableText style={{ fontSize: 16 }}>
                      {formateId(deposit.id, "RD")}
                    </SizableText>
                  </View>
                </View>

                <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
                  <Pressable
                    onPress={() =>
                      router.push(`/deposits/${deposit.id}/collect`)
                    }
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 2,
                      gap: 4,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: blue[600],
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: 40,
                        height: 40,
                        borderRadius: 50,
                      }}
                    >
                      <FontAwesome5
                        name="hand-holding-usd"
                        size={28}
                        color="white"
                      />
                    </View>
                    <SizableText style={{ textAlign: "center", fontSize: 12 }}>
                      {"Collect"}
                    </SizableText>
                  </Pressable>

                  <Pressable
                    onPress={() => router.push(`/deposits/${deposit.id}`)}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 2,
                      gap: 4,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "gray",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: 40,
                        height: 40,
                        borderRadius: 50,
                      }}
                    >
                      <Ionicons
                        name="document-text-outline"
                        size={28}
                        color={blue[100]}
                      />
                    </View>
                    <SizableText style={{ textAlign: "center", fontSize: 12 }}>
                      {"View Details"}
                    </SizableText>
                  </Pressable>
                </View>
              </View>
            </View>
          );
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

export default DepositAssignments;
