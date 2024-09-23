import { Image, ImageBackground, ScrollView, StyleSheet } from "react-native";

import { Text, View } from "../../components/Themed";
import { useSession } from "../../context/SessionContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../constants/Colors";
import { formateId } from "../../utils/formateId";
import { formatIndianPhoneNumber } from "../../utils/formatPhone";
import { useCallback, useEffect, useState } from "react";
import { GetDashData } from "../../constants/api";
import { showAsCurrency } from "../../utils/showAsCurrency";
import { RefreshControl } from "react-native-gesture-handler";
import CallButton from "../../components/commons/callButton";
import LoadingOverlay from "../../components/commons/loadingOverlay";
import { AppImages } from "@/assets/images";

type dashData = {
  deposits: {
    count: number;
    amount: number;
    today: {
      paid: number | null;
      due: number | null;
    };
  };
  loans: {
    count: number;
    amount: number;
    today: {
      paid: number | null;
      due: number | null;
    };
  };
  emi: {
    due_date: Date;
    amount: number;
  } | null;
  collection: number | null;
  today_disburshed: number | null;
  wallet_balance: number;
};

export default function Dashboard() {
  const { user, refresh, handleApiResponse } = useSession();

  const [dash, setDash] = useState<dashData>();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const getDashData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await handleApiResponse(GetDashData);
      console.log(res);

      if (res.status) {
        setDash(res.message);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    await getDashData();
    await refresh();

    setRefreshing(false);
  }, []);

  useEffect(() => {
    getDashData();
  }, []);

  return (
    <ScrollView
      style={{
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: "#fff",
      }}
      contentContainerStyle={{
        paddingBottom: 200,
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <LoadingOverlay show={loading} />

      {user && (
        <>
          <View
            style={{
              padding: 24,
              marginBottom: 16,
              backgroundColor: "transparent",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: Colors.light.text,
                fontFamily: "Hedvig",
              }}
            >
              Hello, {user.name} 👋
            </Text>
            <Text
              style={{
                marginTop: 4,
                fontSize: 32,
                fontWeight: "500",
                fontFamily: "Courgette",
                color: Colors.light.text,
              }}
            >
              Welcome Back !
            </Text>
          </View>

          <View
            style={{
              width: "100%",
              padding: 16,
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              backgroundColor: Colors.light.accent,
              borderRadius: 20,
              gap: 32,
            }}
          >
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                overflow: "hidden",
              }}
            >
              <Image
                source={{
                  uri: user.image,
                }}
                width={100}
                height={100}
              />
            </View>
            <View
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                backgroundColor: "transparent",
                gap: 4,
              }}
            >
              {/* <View
                style={{ height: 1, backgroundColor: "gray", width: "100%" }}
              ></View> */}

              <View
                style={{
                  backgroundColor: "transparent",
                  display: "flex",
                  gap: 4,
                }}
              >
                <View
                  style={{
                    backgroundColor: "transparent",
                  }}
                >
                  <Text style={{ fontSize: 16, color: "gray" }}>User ID:</Text>
                  <Text style={{ fontSize: 16, color: Colors.light.text }}>
                    HMU{user.id.toString().padStart(6, "0")}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: "transparent",
                  }}
                >
                  <Text style={{ fontSize: 16, color: "gray" }}>Phone:</Text>
                  <Text style={{ fontSize: 16, color: Colors.light.text }}>
                    {formatIndianPhoneNumber(user.phone)}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  paddingHorizontal: 4,
                  paddingVertical: 8,
                  backgroundColor: "#3B5292",
                  borderRadius: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                    color: "#fafafa",
                    textAlign: "center",
                  }}
                >
                  {user.role}
                </Text>
              </View>
            </View>
          </View>
        </>
      )}

      {["Admin", "Manager"].includes(user?.role ?? "") && (
        <>
          {dash && (
            <View
              style={{
                display: "flex",
                gap: 10,
                marginTop: 10,
                backgroundColor: "transparent",
              }}
            >
              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: 16,
                  borderRadius: 20,
                  backgroundColor: Colors.light.accent,
                  gap: 12,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    borderRadius: 50,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderColor: "#D2DE32",
                    borderWidth: 8,
                    backgroundColor: "transparent",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: "500",
                      color: Colors.light.text,
                    }}
                  >
                    {showAsCurrency(dash?.deposits?.today?.paid ?? 0)}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: Colors.light.text,
                    }}
                  >
                    Today Deposit Collection
                  </Text>
                </View>

                <View
                  style={{
                    width: "100%",
                    borderRadius: 50,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderColor: "#FF6C22",
                    borderWidth: 8,
                    backgroundColor: "transparent",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: "500",
                      color: Colors.light.text,
                    }}
                  >
                    {showAsCurrency(dash?.loans?.today?.paid ?? 0)}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: Colors.light.text,
                    }}
                  >
                    Today Loan Collection
                  </Text>
                </View>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 16,
                  borderRadius: 20,
                  backgroundColor: Colors.light.accent,
                  gap: 12,
                }}
              >
                <View
                  style={{
                    width: "40%",
                    aspectRatio: 1,
                    borderRadius: 50,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderColor: "#D2DE32",
                    borderWidth: 8,
                    backgroundColor: "transparent",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: "500",
                      color: Colors.light.text,
                    }}
                  >
                    {dash?.deposits?.count ?? 0}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: Colors.light.text,
                    }}
                  >
                    Active Deposit
                  </Text>
                </View>

                <View
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "transparent",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                      color: Colors.light.text,
                    }}
                  >
                    Deposit Amount
                  </Text>
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: "500",
                      color: Colors.light.text,
                    }}
                  >
                    {showAsCurrency(dash?.deposits?.amount ?? 0)}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 16,
                  borderRadius: 20,
                  backgroundColor: Colors.light.accent,
                  gap: 12,
                }}
              >
                <View
                  style={{
                    width: "40%",
                    aspectRatio: 1,
                    borderRadius: 50,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderColor: "#FF6C22",
                    borderWidth: 8,
                    backgroundColor: "transparent",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: "500",
                      color: Colors.light.text,
                    }}
                  >
                    {dash?.loans?.count ?? 0}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: Colors.light.text,
                    }}
                  >
                    Active Loan
                  </Text>
                </View>

                <View
                  style={{
                    display: "flex",
                    justifyContent: "center",

                    backgroundColor: "transparent",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                      color: Colors.light.text,
                    }}
                  >
                    Total Due Amount
                  </Text>
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: "500",
                      color: Colors.light.text,
                    }}
                  >
                    {showAsCurrency(dash?.loans?.amount ?? 0)}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 16,
                  borderRadius: 20,
                  backgroundColor: Colors.light.accent,
                  gap: 12,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    borderRadius: 50,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderColor: "#D2DE32",
                    borderWidth: 8,
                    backgroundColor: "transparent",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: "500",
                      color: Colors.light.text,
                    }}
                  >
                    {showAsCurrency(dash?.collection ?? 0)}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: Colors.light.text,
                    }}
                  >
                    Today Total Collection
                  </Text>
                </View>

                <View
                  style={{
                    width: "100%",
                    borderRadius: 50,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderColor: "#FF6C22",
                    borderWidth: 8,
                    backgroundColor: "transparent",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: "500",
                      color: Colors.light.text,
                    }}
                  >
                    {showAsCurrency(dash?.today_disburshed ?? 0)}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: Colors.light.text,
                    }}
                  >
                    Today Total Disburshed
                  </Text>
                </View>
              </View>

              <ImageBackground
                source={AppImages.BG}
                borderRadius={20}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: 16,
                  backgroundColor: Colors.light.accent,
                  gap: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                    color: Colors.dark.text,
                  }}
                >
                  Company Wallet
                </Text>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "500",
                    color: Colors.dark.text,
                  }}
                >
                  {showAsCurrency(dash?.wallet_balance ?? 0)}
                </Text>
              </ImageBackground>
            </View>
          )}
        </>
      )}

      {!["Admin", "Manager"].includes(user?.role ?? "") && (
        <>
          {dash && (
            <View
              style={{
                display: "flex",
                gap: 10,
                marginTop: 10,
                backgroundColor: "transparent",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 16,
                  borderRadius: 20,
                  backgroundColor: Colors.light.accent,
                  gap: 12,
                }}
              >
                <View
                  style={{
                    width: "40%",
                    aspectRatio: 1,
                    borderRadius: 50,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderColor: "#FF6C22",
                    borderWidth: 8,
                    backgroundColor: "transparent",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: "500",
                      color: Colors.light.text,
                    }}
                  >
                    {dash?.loans?.count ?? 0}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: Colors.light.text,
                    }}
                  >
                    Active Loans
                  </Text>
                </View>

                <View
                  style={{
                    display: "flex",
                    justifyContent: "center",

                    backgroundColor: "transparent",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                      color: Colors.light.text,
                    }}
                  >
                    Total Due
                  </Text>
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: "500",
                      color: Colors.light.text,
                    }}
                  >
                    {showAsCurrency(dash?.loans?.amount ?? 0)}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 16,
                  borderRadius: 20,
                  backgroundColor: Colors.light.accent,
                  gap: 12,
                }}
              >
                <View
                  style={{
                    width: "40%",
                    aspectRatio: 1,
                    borderRadius: 50,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderColor: "#D2DE32",
                    borderWidth: 8,
                    backgroundColor: "transparent",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: "500",
                      color: Colors.light.text,
                    }}
                  >
                    {dash?.deposits?.count ?? 0}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: Colors.light.text,
                    }}
                  >
                    Active Deposit
                  </Text>
                </View>

                <View
                  style={{
                    display: "flex",
                    justifyContent: "center",

                    backgroundColor: "transparent",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                      color: Colors.light.text,
                    }}
                  >
                    Total Deposit
                  </Text>
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: "500",
                      color: Colors.light.text,
                    }}
                  >
                    {showAsCurrency(dash?.deposits?.amount ?? 0)}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </>
      )}
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
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
