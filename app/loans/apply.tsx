import {
  ScrollView,
  View,
  Text,
  ImageBackground,
  Image,
  Pressable,
} from "react-native";
import { LoanPlan } from "../../typs";
import { useCallback, useEffect, useState } from "react";
import { ApplyForLoan, GetLoanPlans } from "../../constants/api";
import { AppImages } from "../../assets/images";
import { showAsCurrency } from "../../utils/showAsCurrency";
import Colors from "../../constants/Colors";
import { TextInput } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  calculateEmi,
  getTotalInterest,
  getTotalPayable,
} from "../../utils/calculateEmi";
import ActivationAlert from "../../components/activationAlert";
import { useSession } from "../../context/SessionContext";
import LoadingOverlay from "@/components/commons/loadingOverlay";

type Props = {};

function Apply({}: Props) {
  const { handleApiResponse } = useSession();
  const [formData, setFormData] = useState({
    referral_id: "",
    principal_amount: "0",
    prefered_installments: "0",
    guarantor_name: "",
    guarantor_phone: "",
    guarantor_address: "",
    guarantor_relationship: "",
  });

  const [plans, setPlans] = useState<LoanPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<LoanPlan | null>(null);
  const [guarantorPhoto, setGuarantorPhoto] = useState<string | null>(null);
  const [standardForm, setStandardForm] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const pickImage = async (
    setImage: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onSubmit = async () => {
    if (selectedPlan == null) return;

    // if (!guarantorPhoto || !standardForm)
    //   return Toast.show({
    //     type: "error",
    //     text1: "Please fill the form.",
    //   });

    setLoading(true);
    try {
      const body = new FormData();

      if (guarantorPhoto) {
        let filename = guarantorPhoto.split("/").pop() as string;
        let match = /\.(\w+)$/.exec(guarantorPhoto);
        let type = match ? `image/${match[1]}` : `image`;

        body.append("guarantor_photo", {
          uri: guarantorPhoto,
          name: filename,
          type,
        } as any);
      }

      if (standardForm) {
        let filename = standardForm.split("/").pop() as string;
        let match = /\.(\w+)$/.exec(standardForm);
        let type = match ? `image/${match[1]}` : `image`;

        body.append("standard_form", {
          uri: standardForm,
          name: filename,
          type,
        } as any);
      }

      body.append("plan_id", selectedPlan.id.toString());
      body.append("referral_id", formData.referral_id);
      body.append("principal_amount", formData.principal_amount);
      body.append("prefered_installments", formData.prefered_installments);
      body.append("guarantor_name", formData.guarantor_name);
      body.append("guarantor_phone", formData.guarantor_phone);
      body.append("guarantor_address", formData.guarantor_address);
      body.append("guarantor_relationship", formData.guarantor_relationship);

      var resp = await handleApiResponse(ApplyForLoan, [body]);

      if (resp.status == true) {
        Toast.show({ text1: "Success", text2: resp.message });
        return router.replace("/loans/");
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

  const getLoanPlans = useCallback(async () => {
    try {
      const resp = await handleApiResponse(GetLoanPlans);

      if (resp.status) {
        setPlans(resp.message.plans ?? []);
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    if (selectedPlan) {
      setFormData((prv) => ({
        ...prv,
        principal_amount: selectedPlan.min_amount.toString(),
        prefered_installments: selectedPlan.max_installments.toString(),
      }));
    }
  }, [selectedPlan]);

  useEffect(() => {
    getLoanPlans();
  }, [getLoanPlans]);

  return (
    <ScrollView
      style={{
        backgroundColor: Colors.light.background,
      }}
    >
      <ActivationAlert />

      <LoadingOverlay show={loading} />

      <View
        style={{
          width: "100%",
          height: 200,
          backgroundColor: "#171717",
        }}
      >
        <ImageBackground
          source={AppImages.Loan}
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
            Apply For New Loan
          </Text>
        </ImageBackground>
      </View>

      <View
        style={{
          top: -32,
          padding: 8,
        }}
      >
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
                    {plan.interest_frequency} Interest
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
                    <Text style={{ color: "gray" }}>EMI Type :</Text>
                    <Text style={{ color: "gray" }}>
                      {plan.allowed_emi_frequency}
                    </Text>
                  </View>

                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ color: "gray" }}>Max Installments :</Text>
                    <Text style={{ color: "gray" }}>
                      {plan.max_installments}
                    </Text>
                  </View>

                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ color: "gray" }}>Premature Closing :</Text>
                    <Text style={{ color: "gray" }}>
                      {plan.allow_premature_closing ? "Yes" : "No"}
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
                <Text style={{ marginBottom: 8 }}>Principal Amount</Text>
                <TextInput
                  style={{
                    padding: 14,
                    borderWidth: 1,
                    borderColor: Colors.light.tabIconDefault,
                    borderRadius: 10,
                  }}
                  value={formData.principal_amount}
                  onChangeText={(text) =>
                    setFormData((prv) => ({ ...prv, principal_amount: text }))
                  }
                />
              </View>

              <View style={{ width: "50%" }}>
                <Text style={{ marginBottom: 8 }}>Installments</Text>

                <TextInput
                  style={{
                    padding: 14,
                    borderWidth: 1,
                    borderColor: Colors.light.tabIconDefault,
                    borderRadius: 10,
                  }}
                  value={formData.prefered_installments}
                  onChangeText={(text) =>
                    setFormData((prv) => ({
                      ...prv,
                      prefered_installments: text,
                    }))
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
              <View
                style={{
                  width: "50%",
                  padding: 8,
                  backgroundColor: Colors.light.accent,
                  borderRadius: 10,
                }}
              >
                <Text style={{ textAlign: "center", marginBottom: 8 }}>
                  Principal Amount
                </Text>

                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 18,
                    fontWeight: "600",
                  }}
                >
                  {formData.principal_amount}
                </Text>
              </View>

              <View
                style={{
                  width: "50%",
                  padding: 8,
                  backgroundColor: Colors.light.accent,
                  borderRadius: 10,
                }}
              >
                <Text style={{ textAlign: "center", marginBottom: 8 }}>
                  EMI Amount
                </Text>

                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 18,
                    fontWeight: "600",
                  }}
                >
                  {showAsCurrency(
                    calculateEmi(
                      Number(formData.principal_amount),
                      Number(selectedPlan.interest_rate),
                      Number(formData.prefered_installments),
                      selectedPlan.interest_frequency,
                      selectedPlan.allowed_emi_frequency
                    )
                  )}
                </Text>
              </View>
            </View>

            <View
              style={{
                marginTop: 8,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              <View
                style={{
                  width: "50%",
                  padding: 8,
                  backgroundColor: Colors.light.accent,
                  borderRadius: 10,
                }}
              >
                <Text style={{ textAlign: "center", marginBottom: 8 }}>
                  Interest Payable
                </Text>

                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 18,
                    fontWeight: "600",
                  }}
                >
                  {showAsCurrency(
                    getTotalInterest(
                      Number(formData.principal_amount),
                      Number(selectedPlan.interest_rate),
                      Number(formData.prefered_installments),
                      selectedPlan.interest_frequency,
                      selectedPlan.allowed_emi_frequency
                    )
                  )}
                </Text>
              </View>

              <View
                style={{
                  width: "50%",
                  padding: 8,
                  backgroundColor: Colors.light.accent,
                  borderRadius: 10,
                }}
              >
                <Text style={{ textAlign: "center", marginBottom: 8 }}>
                  Interest Payable
                </Text>

                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 18,
                    fontWeight: "600",
                  }}
                >
                  {showAsCurrency(
                    getTotalPayable(
                      Number(formData.principal_amount),
                      Number(selectedPlan.interest_rate),
                      Number(formData.prefered_installments),
                      selectedPlan.interest_frequency,
                      selectedPlan.allowed_emi_frequency
                    )
                  )}
                </Text>
              </View>
            </View>

            <Text style={{ marginVertical: 16, fontWeight: "500" }}>
              Guarantor Details
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
                  value={formData.guarantor_name}
                  onChangeText={(text) =>
                    setFormData((prv) => ({ ...prv, guarantor_name: text }))
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
                  value={formData.guarantor_phone}
                  onChangeText={(text) =>
                    setFormData((prv) => ({ ...prv, guarantor_phone: text }))
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
                  value={formData.guarantor_address}
                  onChangeText={(text) =>
                    setFormData((prv) => ({ ...prv, guarantor_address: text }))
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
                  value={formData.guarantor_relationship}
                  onChangeText={(text) =>
                    setFormData((prv) => ({
                      ...prv,
                      guarantor_relationship: text,
                    }))
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
                <Text style={{ marginBottom: 8 }}>Guarantor Photo</Text>

                <Pressable
                  onPress={() => pickImage(setGuarantorPhoto)}
                  style={{
                    marginTop: 16,
                    width: "100%",
                    height: 150,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#e1e1e1",
                    overflow: "hidden",
                    borderRadius: 10,
                  }}
                >
                  {guarantorPhoto ? (
                    <Image
                      source={{ uri: guarantorPhoto }}
                      style={{ width: "100%", height: 200 }}
                    />
                  ) : (
                    <Ionicons name="add" size={32} color={Colors.light.text} />
                  )}
                </Pressable>
              </View>

              <View style={{ width: "50%" }}>
                <Text style={{ marginBottom: 8 }}>Loan Form</Text>

                <Pressable
                  onPress={() => pickImage(setStandardForm)}
                  style={{
                    marginTop: 16,
                    width: "100%",
                    height: 150,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#e1e1e1",
                    overflow: "hidden",
                    borderRadius: 10,
                  }}
                >
                  {standardForm ? (
                    <Image
                      source={{ uri: standardForm }}
                      style={{ width: "100%", height: 200 }}
                    />
                  ) : (
                    <Ionicons name="add" size={32} color={Colors.light.text} />
                  )}
                </Pressable>
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
