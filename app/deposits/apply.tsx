import {
  ScrollView,
  View,
  Text,
  ImageBackground,
  Image,
  Pressable,
} from "react-native";
import { DepositPlan } from "../../typs";
import { useCallback, useEffect, useState } from "react";
import { ApplyForDeposit, GetDepositPlans } from "../../constants/api";
import { AppImages } from "../../assets/images";
import { showAsCurrency } from "../../utils/showAsCurrency";
import Colors from "../../constants/Colors";
import { TextInput } from "react-native-gesture-handler";
import { SelectList } from "react-native-dropdown-select-list";
import Toast from "react-native-toast-message";
import { router, useLocalSearchParams } from "expo-router";
import ActivationAlert from "../../components/activationAlert";
import { useSession } from "../../context/SessionContext";
import LoadingOverlay from "@/components/commons/loadingOverlay";

type Props = {};

const TenureOptions = [
  { key: "1", value: "6", label: "PAN" },
  { key: "2", value: "12", label: "Voter ID" },
  { key: "3", value: "18", label: "Adhaar" },
  { key: "4", value: "24", label: "Driving License" },
  { key: "5", value: "36", label: "Other" },
  { key: "5", value: "48", label: "Other" },
];

function Apply({}: Props) {
  const { handleApiResponse } = useSession();
  const { dt } = useLocalSearchParams();

  const [formData, setFormData] = useState({
    referral_id: "",
    deposit_amount: "0",
    deposit_tenure: "12",
    nominee_name: "",
    nominee_phone: "",
    nominee_address: "",
    nominee_relationship: "",
  });

  const [depositCategory, setDepositCategory] = useState<"FD" | "RD">(
    (dt as "RD" | "FD") ?? "FD"
  );
  const [plans, setPlans] = useState<DepositPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<DepositPlan | null>(null);

  const [loading, setLoading] = useState(false);

  const getDepositPlans = useCallback(async () => {
    try {
      const resp = await handleApiResponse(GetDepositPlans, [depositCategory]);

      if (resp.status) {
        setPlans(resp.message.plans ?? []);
        setSelectedPlan(null);
      }
    } catch (e) {
      console.log(e);
    }
  }, [depositCategory]);

  const onSubmit = async () => {
    if (selectedPlan == null) return;

    setLoading(true);
    try {
      const data = {
        ref_id: formData.referral_id,
        plan_id: selectedPlan.id,
        amount: formData.deposit_amount,
        prefered_tenure: formData.deposit_tenure,
        nominee: {
          name: formData.nominee_name,
          phone: formData.nominee_phone,
          address: formData.nominee_address,
          relationship: formData.nominee_relationship,
        },
      };

      const resp = await handleApiResponse(ApplyForDeposit, [data]);

      if (resp.status) {
        Toast.show({ text1: "Success", text2: resp.message });
        router.replace("/relations");
        return;
      }

      Toast.show({
        type: "error",
        text1: "Opps!",
        text2: resp.message,
      });
      return;
    } catch (e) {
      if (e instanceof Error) {
        return Toast.show({
          type: "error",
          text1: "Opps!",
          text2: e.message,
        });
      }

      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPlan) {
      setFormData((prv) => ({
        ...prv,
        deposit_amount: selectedPlan.min_amount.toString(),
      }));
    }
  }, [selectedPlan]);

  useEffect(() => {
    getDepositPlans();
  }, [getDepositPlans]);

  return (
    <ScrollView
      style={{
        backgroundColor: Colors.light.background,
      }}
    >
      <LoadingOverlay show={loading} />

      <ActivationAlert />

      <View
        style={{
          width: "100%",
          height: 200,
          backgroundColor: "#171717",
        }}
      >
        <ImageBackground
          source={AppImages.deposit}
          resizeMode="cover"
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 32,
              fontWeight: "500",
              color: Colors.light.text,
            }}
          >
            Open New Deposit
          </Text>
        </ImageBackground>
      </View>

      <View
        style={{
          top: -32,
          padding: 8,
        }}
      >
        <View
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            width: "90%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Pressable
            onPress={() => setDepositCategory("FD")}
            style={{
              width: "50%",
              padding: 16,
              borderRadius: 16,
              backgroundColor:
                depositCategory === "FD" ? "#ffff00" : Colors.light.accent,
              borderWidth: depositCategory === "FD" ? 2 : 0,
              borderColor: "#ffff00",
            }}
          >
            <Text
              style={{ fontSize: 16, fontWeight: "600", textAlign: "center" }}
            >
              Fixed Deposit
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setDepositCategory("RD")}
            style={{
              width: "50%",
              padding: 16,
              borderRadius: 16,
              backgroundColor:
                depositCategory === "RD" ? "#ffff00" : Colors.light.accent,
              borderWidth: depositCategory === "RD" ? 2 : 0,
              borderColor: "#ffff00",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                textAlign: "center",
              }}
              numberOfLines={1}
            >
              Recurring Deposit
            </Text>
          </Pressable>
        </View>

        <Text
          style={{
            paddingLeft: 8,
            fontSize: 18,
            color: "gray",
            marginVertical: 16,
          }}
        >
          Select Plan
        </Text>

        <ScrollView horizontal contentContainerStyle={{ gap: 16 }}>
          {plans.map((plan) => (
            <Pressable key={plan.id} onPress={() => setSelectedPlan(plan)}>
              <View
                style={{
                  padding: 16,
                  borderRadius: 20,
                  backgroundColor:
                    selectedPlan?.id === plan.id
                      ? "#ffff00"
                      : Colors.light.accent,
                  minWidth: 300,
                }}
              >
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "500",
                    textAlign: "center",
                  }}
                >
                  {plan.plan_name}
                </Text>

                <View
                  style={{
                    marginVertical: 16,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "800",
                    }}
                  >
                    {plan.interest_rate}%
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                    }}
                  >
                    {plan.allowed_interest_credit_frequency} Interest
                  </Text>
                </View>

                <View
                  style={{
                    display: "flex",
                    gap: 4,
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ color: "gray" }}>Min Amount :</Text>
                    <Text style={{ color: "gray" }}>
                      {showAsCurrency(plan.min_amount)}
                    </Text>
                  </View>

                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ color: "gray" }}>Max Amount :</Text>
                    <Text style={{ color: "gray" }}>
                      {showAsCurrency(plan.max_amount)}
                    </Text>
                  </View>

                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ color: "gray" }}>
                      Premature Withdrawal :
                    </Text>
                    <Text style={{ color: "gray" }}>
                      {plan.allow_premature_withdrawal ? "Yes" : "No"}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {selectedPlan && (
          <View style={{ marginTop: 20, padding: 8 }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              <View style={{ width: "50%" }}>
                <Text style={{ marginBottom: 8 }}>Deposit Amount</Text>
                <TextInput
                  style={{
                    padding: 14,
                    borderWidth: 1,
                    borderColor: Colors.light.tabIconDefault,
                    borderRadius: 10,
                  }}
                  value={formData.deposit_amount}
                  onChangeText={(text) =>
                    setFormData((prv) => ({ ...prv, deposit_amount: text }))
                  }
                />
              </View>

              <View style={{ width: "50%" }}>
                <Text style={{ marginBottom: 8 }}>Tenure (Months)</Text>

                <SelectList
                  setSelected={(val: any) =>
                    setFormData((prv) => ({ ...prv, deposit_tenure: val }))
                  }
                  data={TenureOptions}
                  save="value"
                  defaultOption={{ key: "2", value: "12" }}
                />
              </View>
            </View>

            <Text style={{ marginVertical: 16, fontWeight: "500" }}>
              Nominee Details
            </Text>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              <View style={{ width: "50%" }}>
                <Text style={{ marginBottom: 8 }}>Name</Text>
                <TextInput
                  style={{
                    padding: 14,
                    borderWidth: 1,
                    borderColor: Colors.light.tabIconDefault,
                    borderRadius: 10,
                  }}
                  value={formData.nominee_name}
                  onChangeText={(text) =>
                    setFormData((prv) => ({ ...prv, nominee_name: text }))
                  }
                />
              </View>

              <View style={{ width: "50%" }}>
                <Text style={{ marginBottom: 8 }}>Phone</Text>

                <TextInput
                  style={{
                    padding: 14,
                    borderWidth: 1,
                    borderColor: Colors.light.tabIconDefault,
                    borderRadius: 10,
                  }}
                  value={formData.nominee_phone}
                  onChangeText={(text) =>
                    setFormData((prv) => ({ ...prv, nominee_phone: text }))
                  }
                />
              </View>
            </View>

            <View
              style={{
                marginTop: 16,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              <View style={{ width: "50%" }}>
                <Text style={{ marginBottom: 8 }}>Address</Text>
                <TextInput
                  style={{
                    padding: 14,
                    borderWidth: 1,
                    borderColor: Colors.light.tabIconDefault,
                    borderRadius: 10,
                  }}
                  value={formData.nominee_address}
                  onChangeText={(text) =>
                    setFormData((prv) => ({ ...prv, nominee_address: text }))
                  }
                />
              </View>

              <View style={{ width: "50%" }}>
                <Text style={{ marginBottom: 8 }}>Relationship</Text>

                <TextInput
                  style={{
                    padding: 14,
                    borderWidth: 1,
                    borderColor: Colors.light.tabIconDefault,
                    borderRadius: 10,
                  }}
                  value={formData.nominee_relationship}
                  onChangeText={(text) =>
                    setFormData((prv) => ({
                      ...prv,
                      nominee_relationship: text,
                    }))
                  }
                />
              </View>
            </View>

            <Pressable
              onPress={onSubmit}
              style={{
                marginVertical: 16,
                padding: 16,
                borderRadius: 10,
                backgroundColor: Colors.light.tabIconSelected,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "600",
                  color: Colors.light.background,
                  textAlign: "center",
                }}
              >
                Apply
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

export default Apply;
