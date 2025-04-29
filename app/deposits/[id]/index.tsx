import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, View, Text, Pressable, Image } from "react-native";
import Colors from "../../../constants/Colors";
import { useCallback, useEffect, useState } from "react";
import { DepositWithPlan } from "../../../typs";
import { GetDepositDetails } from "../../../constants/api";
import { showAsCurrency } from "../../../utils/showAsCurrency";
import { calculateTotalReturn } from "../../../utils/calculateEmi";
import { formateId } from "../../../utils/formateId";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { useSession } from "../../../context/SessionContext";
import CallButton from "../../../components/commons/callButton";
import { XStack, YStack } from "tamagui";
import { blue } from "../../../utils/colors";
import LoadingOverlay from "../../../components/commons/loadingOverlay";

type Props = {};

function DepositDetails({}: Props) {
  const { user, handleApiResponse } = useSession();

  const { id } = useLocalSearchParams();
  const [deposit, setDeposit] = useState<DepositWithPlan | null>(null);

  const [loading, setLoading] = useState(false);

  const fetchDepositDetails = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await handleApiResponse(GetDepositDetails, [
        parseInt(id as string),
      ]);
      if (resp.status) {
        setDeposit(resp.data.deposit);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDepositDetails();
  }, [fetchDepositDetails]);

  return (
    <View style={{ flex: 1 }}>
      <LoadingOverlay show={loading} />

      <ScrollView
        style={{
          flex: 1,
          display: "flex",
          padding: 16,
          backgroundColor: Colors.light.background,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View
          style={{
            width: "100%",
            backgroundColor: Colors.light.accent,
            borderRadius: 10,
            padding: 16,
          }}
        >
          <XStack alignItems="center">
            <XStack gap={"$4"} alignItems="center">
              <Image
                source={{
                  uri: deposit?.user?.image,
                }}
                width={80}
                height={80}
                style={{
                  borderRadius: 50,
                }}
              />

              <YStack justifyContent="center">
                <Text style={{ fontSize: 16, color: Colors.light.text }}>
                  {deposit?.user.name}
                </Text>
                <Text style={{ fontSize: 16, color: Colors.light.text }}>
                  {formateId(deposit?.user_id ?? 0, "User")}
                </Text>
              </YStack>
            </XStack>
          </XStack>

          <View
            style={{
              marginVertical: 16,
              height: 1,
              width: "100%",
              backgroundColor: Colors.light.tabIconDefault,
            }}
          ></View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Entypo name="credit" size={32} color={"gray"} />
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    color: "gray",
                  }}
                >
                  Deposit Number:
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: Colors.light.text,
                  }}
                >
                  {formateId(deposit?.id ?? 0, deposit?.category)}
                </Text>
              </View>
            </View>
            <View>
              <Text
                style={{
                  fontSize: 16,
                  color: "gray",
                }}
              >
                Deposit Amount:
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: Colors.light.text,
                }}
              >
                {showAsCurrency(deposit?.amount ?? 0)}
              </Text>
            </View>
          </View>

          <View
            style={{
              marginVertical: 16,
              height: 1,
              width: "100%",
              backgroundColor: Colors.light.tabIconDefault,
            }}
          ></View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: 8,
            }}
          >
            <View
              style={{
                padding: 8,
                display: "flex",
                justifyContent: "center",
                borderRadius: 20,
                minWidth: 100,
              }}
            >
              <Text style={{ fontSize: 16, color: "gray" }}>Deposit Type</Text>
              <Text style={{ fontSize: 16, color: Colors.light.text }}>
                {deposit?.category}
              </Text>
            </View>

            <View
              style={{
                padding: 8,
                display: "flex",
                justifyContent: "center",
                borderRadius: 20,
                minWidth: 100,
              }}
            >
              <Text style={{ fontSize: 16, color: "gray" }}>Interest Rate</Text>
              <Text style={{ fontSize: 16, color: Colors.light.text }}>
                {Number(deposit?.interest_rate)} %{" "}
                {deposit?.interest_credit_frequency}
              </Text>
            </View>

            <View
              style={{
                padding: 8,
                display: "flex",
                justifyContent: "center",
                borderRadius: 20,
                minWidth: 100,
              }}
            >
              <Text style={{ fontSize: 16, color: "gray" }}>Tenure</Text>
              <Text style={{ fontSize: 16, color: Colors.light.text }}>
                {deposit?.prefered_tenure}
              </Text>
            </View>

            <View
              style={{
                padding: 8,
                display: "flex",
                justifyContent: "center",
                borderRadius: 20,
                minWidth: 100,
              }}
            >
              <Text style={{ fontSize: 16, color: "gray" }}>Total Paid</Text>
              <Text style={{ fontSize: 16, color: Colors.light.text }}>
                {showAsCurrency(Number(deposit?.total_paid))}
              </Text>
            </View>

            {deposit?.user_id !== user?.id && (
              <View
                style={{
                  padding: 8,
                  display: "flex",
                  justifyContent: "center",
                  borderRadius: 20,
                  minWidth: 100,
                }}
              >
                <Text style={{ fontSize: 16, color: "gray" }}>
                  Total Return
                </Text>
                <Text style={{ fontSize: 16, color: Colors.light.text }}>
                  {showAsCurrency(
                    calculateTotalReturn(
                      Number(deposit?.total_paid),
                      Number(deposit?.interest_rate),
                      Number(deposit?.prefered_tenure)
                    )
                  )}
                </Text>
              </View>
            )}

            <View
              style={{
                padding: 8,
                display: "flex",
                justifyContent: "center",
                borderRadius: 20,
                minWidth: 100,
              }}
            >
              <Text style={{ fontSize: 16, color: "gray" }}>Status</Text>
              <Text style={{ fontSize: 16, color: Colors.light.text }}>
                {deposit?.deposit_status}
              </Text>
              <Text style={{ fontSize: 16, color: "gray" }}>
                {deposit?.remark}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            marginTop: 8,
            width: "100%",
            backgroundColor: Colors.light.accent,
            borderRadius: 10,
            padding: 16,
          }}
        >
          <Text style={{ fontSize: 16, color: "gray" }}>Things You can do</Text>

          <ScrollView
            horizontal
            style={{
              marginTop: 16,
              width: "100%",
              display: "flex",
              flexDirection: "row",
              gap: 20,
            }}
          >
            {["Admin", "Manager", "Agent"].includes(user?.role ?? "") &&
              user?.id !== deposit?.user_id && (
                <Pressable
                  onPress={() => router.push(`/deposits/${id}/collect`)}
                >
                  <View
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 8,
                      gap: 4,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: blue[600],
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: 50,
                        height: 50,
                        borderRadius: 50,
                      }}
                    >
                      <FontAwesome5
                        name="hand-holding-usd"
                        size={28}
                        color="white"
                      />
                    </View>
                    <Text style={{ textAlign: "center", fontSize: 12 }}>
                      {"Collect \nRepayment"}
                    </Text>
                  </View>
                </Pressable>
              )}

            {["Admin", "Manager"].includes(user?.role ?? "") && (
              <>
                <Pressable onPress={() => {}}>
                  <View
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 8,
                      gap: 4,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#fafafa",
                        padding: 8,
                        borderRadius: 50,
                      }}
                    >
                      <Entypo name="add-user" size={32} color="gray" />
                    </View>
                    <Text style={{ textAlign: "center", fontSize: 12 }}>
                      {"Assign \nAgents"}
                    </Text>
                  </View>
                </Pressable>

                <Pressable onPress={() => {}}>
                  <View
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 8,
                      gap: 4,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#fafafa",
                        padding: 8,
                        borderRadius: 50,
                      }}
                    >
                      <Entypo name="calculator" size={32} color="gray" />
                    </View>
                    <Text style={{ textAlign: "center", fontSize: 12 }}>
                      {"Make \nSettlement"}
                    </Text>
                  </View>
                </Pressable>
              </>
            )}

            <Pressable
              onPress={() => {
                router.push(`/deposits/${id}/repayments`);
              }}
            >
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 8,
                  gap: 4,
                }}
              >
                <View
                  style={{
                    backgroundColor: "gray",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                  }}
                >
                  <Entypo name="archive" size={32} color="white" />
                </View>
                <Text style={{ textAlign: "center", fontSize: 12 }}>
                  {"View \nStatements"}
                </Text>
              </View>
            </Pressable>
          </ScrollView>
        </View>

        <View
          style={{
            marginTop: 8,
            width: "100%",
            backgroundColor: Colors.light.accent,
            borderRadius: 10,
            padding: 16,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "gray",
              }}
            >
              EMI Details
            </Text>
          </View>

          <View
            style={{
              marginVertical: 16,
              height: 1,
              width: "100%",
              backgroundColor: Colors.light.tabIconDefault,
            }}
          ></View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: 8,
            }}
          >
            <View
              style={{
                padding: 8,
                display: "flex",
                justifyContent: "center",
                borderRadius: 20,
                minWidth: 100,
              }}
            >
              <Text style={{ fontSize: 16, color: "gray" }}>EMI Type</Text>
              <Text style={{ fontSize: 16, color: Colors.light.text }}>
                {deposit?.category === "FD"
                  ? "n/a"
                  : deposit?.payment_frequency}
              </Text>
            </View>

            <View
              style={{
                padding: 8,
                display: "flex",
                justifyContent: "center",
                borderRadius: 20,
                minWidth: 100,
              }}
            >
              <Text style={{ fontSize: 16, color: "gray" }}>EMI Amount</Text>
              <Text style={{ fontSize: 16, color: Colors.light.text }}>
                {deposit?.category === "FD" ? "n/a" : deposit?.amount}
              </Text>
            </View>

            <View
              style={{
                padding: 8,
                display: "flex",
                justifyContent: "center",
                borderRadius: 20,
                minWidth: 100,
              }}
            >
              <Text style={{ fontSize: 16, color: "gray" }}>Start Date</Text>
              <Text style={{ fontSize: 16, color: Colors.light.text }}>
                {new Date(deposit?.deposit_date ?? Date.now()).toDateString()}
              </Text>
            </View>

            <View
              style={{
                padding: 8,
                display: "flex",
                justifyContent: "center",
                borderRadius: 20,
                minWidth: 100,
              }}
            >
              <Text style={{ fontSize: 16, color: "gray" }}>Maturity Date</Text>
              <Text style={{ fontSize: 16, color: Colors.light.text }}>
                {new Date(deposit?.maturity_date ?? Date.now()).toDateString()}
              </Text>
            </View>
          </View>
        </View>

        {/*        
          <div className="w-full">
            <h2 className="text-2xl font-semibold">Plan Details</h2>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-2 flex flex-col justify-center bg-primary-light dark:bg-accent-dark space-y-2 rounded-lg border border-gray-300 dark:border-gray-700">
                <span>Plan Name</span>
                <span>{deposit?.deposit_plan?.plan_name}</span>
              </div>
              <div className="p-2 flex flex-col justify-center bg-primary-light dark:bg-accent-dark space-y-2 rounded-lg border border-gray-300 dark:border-gray-700">
                <span>Interest Rate ({deposit?.interest_credit_frequency})</span>
                <span>{Number(deposit?.interest_rate)} %</span>
              </div>
              <div className="p-2 flex flex-col justify-center bg-primary-light dark:bg-accent-dark space-y-2 rounded-lg border border-gray-300 dark:border-gray-700">
                <span>Premature Withdrawal</span>
                <span>
                  {deposit?.deposit_plan?.allow_premature_withdrawal
                    ? "Allowed"
                    : "Not-Allowed"}
                </span>
              </div>
              <div className="p-2 flex flex-col justify-center bg-primary-light dark:bg-accent-dark space-y-2 rounded-lg border border-gray-300 dark:border-gray-700">
                <span>Premature Withdrawal Charge</span>
                <span>
                  {Number(deposit?.deposit_plan?.premature_withdrawal_charge)} %
                </span>
              </div>
            </div>
          </div>
          
          <div className="w-full">
            <h2 className="text-2xl font-semibold">Nominee Details</h2>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-2 flex flex-col justify-center bg-primary-light dark:bg-accent-dark space-y-2 rounded-lg border border-gray-300 dark:border-gray-700">
                <span>Name</span>
                <span>{deposit?.nominee?.name}</span>
              </div>
              <div className="p-2 flex flex-col justify-center bg-primary-light dark:bg-accent-dark space-y-2 rounded-lg border border-gray-300 dark:border-gray-700">
                <span>Phone</span>
                <span>{deposit?.nominee?.phone}</span>
              </div>
              <div className="p-2 flex flex-col justify-center bg-primary-light dark:bg-accent-dark space-y-2 rounded-lg border border-gray-300 dark:border-gray-700">
                <span>Address</span>
                <span>{deposit?.nominee?.address}</span>
              </div>
            </div>
          </div> */}
      </ScrollView>

      {deposit?.user_id !== user?.id && deposit?.user.phone && (
        <CallButton phoneNumber={deposit?.user.phone} />
      )}
    </View>
  );
}

export default DepositDetails;
