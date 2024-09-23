import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, View, Text, Pressable, Image } from "react-native";
import Colors from "../../../constants/Colors";
import { useCallback, useEffect, useState } from "react";
import { LoansWithDue } from "../../../typs";
import { GetLoanDetails } from "../../../constants/api";
import { showAsCurrency } from "../../../utils/showAsCurrency";
import { formateId } from "../../../utils/formateId";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { RefreshControl } from "react-native-gesture-handler";
import { useSession } from "../../../context/SessionContext";
import CallButton, {
  handleCallPress,
} from "../../../components/commons/callButton";
import { SizableText, XStack, YStack } from "tamagui";
import { blue, green, red } from "../../../utils/colors";
import { formatIndianPhoneNumber } from "../../../utils/formatPhone";
import LoadingOverlay from "../../../components/commons/loadingOverlay";

type Props = {};

function LoanDetails({}: Props) {
  const { user, handleApiResponse } = useSession();
  const { id } = useLocalSearchParams();
  const [loan, setLoan] = useState<LoansWithDue | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const [loading, setLoading] = useState(false);

  const fetchLoanDetails = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await handleApiResponse(GetLoanDetails, [
        parseInt(id as string),
      ]);
      if (resp.status) {
        setLoan(resp.data.loan);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    await fetchLoanDetails();

    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchLoanDetails();
  }, [fetchLoanDetails]);

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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
                  uri: loan?.user?.image,
                }}
                width={80}
                height={80}
                style={{
                  borderRadius: 50,
                }}
              />

              <YStack justifyContent="center">
                <Text style={{ fontSize: 16, color: Colors.light.text }}>
                  {loan?.user.name}
                </Text>
                <Text style={{ fontSize: 16, color: Colors.light.text }}>
                  {formateId(loan?.user_id ?? 0, "User")}
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
              <Entypo name="credit" size={32} color="gray" />
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    color: "gray",
                  }}
                >
                  Loan ID:
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: Colors.light.text,
                  }}
                >
                  {formateId(loan?.id ?? 0, "Loan")}
                </Text>
              </View>
            </View>
            <View
              style={{
                padding: 8,
                display: "flex",
                justifyContent: "flex-end",
                borderRadius: 20,
                minWidth: 100,
              }}
            >
              <Text style={{ fontSize: 16, color: "gray" }}>Outstanding</Text>
              <Text style={{ fontSize: 16, color: Colors.light.text }}>
                {showAsCurrency(
                  Number(loan?.total_payable) - Number(loan?.total_paid)
                )}
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
              justifyContent: "space-between",
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
              <Text
                style={{
                  fontSize: 16,
                  color: "gray",
                }}
              >
                Loan Amount:
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: Colors.light.text,
                }}
              >
                {showAsCurrency(loan?.amount ?? 0)}
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
              <Text style={{ fontSize: 16, color: "gray" }}>Total Payable</Text>
              <Text style={{ fontSize: 16, color: Colors.light.text }}>
                {showAsCurrency(Number(loan?.total_payable))}
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
                {showAsCurrency(Number(loan?.total_paid))}
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
              <Text style={{ fontSize: 16, color: "gray" }}>EMIs Paid</Text>
              <Text style={{ fontSize: 16, color: Colors.light.text }}>
                {loan?.emi_paid}
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
              <Text style={{ fontSize: 16, color: "gray" }}>EMIs Remain</Text>
              <Text style={{ fontSize: 16, color: Colors.light.text }}>
                {Number(
                  loan?.overrode_installments ?? loan?.prefered_installments
                ) - Number(loan?.emi_paid)}
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
                {Number(loan?.interest_rate)} % {loan?.interest_frequency}
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
              <Text style={{ fontSize: 16, color: "gray" }}>Status</Text>
              <Text style={{ fontSize: 16, color: Colors.light.text }}>
                {loan?.loan_status}
              </Text>
              <Text style={{ fontSize: 16, color: "gray" }}>
                {loan?.remark}
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
              user?.id !== loan?.user_id && (
                <Pressable onPress={() => router.push(`/loans/${id}/collect`)}>
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
                        backgroundColor:
                          loan?.due?.totalDue ||
                          loan?.due?.totalOverdue ||
                          loan?.due?.totalPartialRemain
                            ? red[600]
                            : green[600],
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
                router.push(`/loans/${id}/repayments`);
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
                {loan?.emi_frequency}
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
              <Text style={{ fontSize: 16, color: "gray" }}>
                Number of EMIs
              </Text>
              <Text style={{ fontSize: 16, color: Colors.light.text }}>
                {loan?.overrode_installments ?? loan?.prefered_installments}
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
                {showAsCurrency(Number(loan?.emi_amount))}
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
              <Text style={{ fontSize: 16, color: "gray" }}>
                Disburshed Date
              </Text>
              <Text style={{ fontSize: 16, color: Colors.light.text }}>
                {new Date(loan?.loan_date ?? Date.now()).toDateString()}
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
              <Text style={{ fontSize: 16, color: "gray" }}>End Date</Text>
              <Text style={{ fontSize: 16, color: Colors.light.text }}>
                {new Date(loan?.maturity_date ?? Date.now()).toDateString()}
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
          <Text
            style={{
              fontSize: 16,
              color: "gray",
            }}
          >
            Guarantor Details
          </Text>

          <View
            style={{
              marginVertical: 16,
              height: 1,
              width: "100%",
              backgroundColor: Colors.light.tabIconDefault,
            }}
          ></View>

          <XStack gap={10} alignItems="center">
            <Image
              source={{
                uri: loan?.guarantor?.photo,
              }}
              width={100}
              height={100}
              style={{ borderRadius: 10 }}
            />
            <YStack gap={2} maxWidth={"100%"}>
              <YStack>
                <Text style={{ fontSize: 16, color: "gray" }}>Name</Text>
                <Text
                  style={{ fontSize: 16, color: Colors.light.text }}
                  numberOfLines={2}
                >
                  {loan?.guarantor.name}
                </Text>
              </YStack>
              <YStack>
                <Text style={{ fontSize: 16, color: "gray" }}>Phone</Text>
                <Pressable
                  onPress={() => handleCallPress(loan?.guarantor.phone ?? "")}
                >
                  <Text style={{ fontSize: 16, color: blue[600] }}>
                    {formatIndianPhoneNumber(loan?.guarantor.phone ?? "n/a")}
                  </Text>
                </Pressable>
              </YStack>
            </YStack>
          </XStack>

          <YStack>
            <Text style={{ fontSize: 16, color: "gray" }}>Address</Text>
            <SizableText
              style={{ fontSize: 16, color: Colors.light.text }}
              numberOfLines={5}
            >
              {loan?.guarantor.address}
            </SizableText>
          </YStack>
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

      {loan?.user_id !== user?.id && loan?.user?.phone && (
        <CallButton phoneNumber={loan?.user.phone} />
      )}
    </View>
  );
}

export default LoanDetails;
