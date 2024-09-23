import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import Colors from "../constants/Colors";
import { showAsCurrency } from "../utils/showAsCurrency";
import { formateId } from "../utils/formateId";
import { Entypo } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Loan } from "../typs";
import { blue, orange, red } from "../utils/colors";

type Props = {
  loan: Loan;
  width?: "fill" | "contain";
};

const StatusColors: { [key: string]: string } = {
  Rejected: red[400],
  Pending: orange[100],
  Active: blue[200],
};

const LoanCard = ({ loan, width = "contain" }: Props) => {
  return (
    <Link
      href={{
        pathname: "/loans/[id]/",
        params: { id: loan.id },
      }}
      asChild
    >
      <Pressable
        style={{
          position: "relative",
          width: width === "contain" ? "auto" : "100%",
          height: "auto",
          minWidth: 300,
          backgroundColor: red[200],
          borderRadius: 10,
          paddingVertical: 16,
          paddingHorizontal: 24,
        }}
      >
        <View
          style={{
            position: "absolute",
            right: 10,
            top: 20,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: StatusColors[loan.loan_status],
              borderColor: Colors.light.text,
              borderWidth: 1,
              borderRadius: 50,
              paddingVertical: 4,
              paddingHorizontal: 8,
            }}
          >
            <Text
              style={{
                color: Colors.light.text,
              }}
            >
              {loan.loan_status}
            </Text>
          </View>
          <Entypo name="chevron-right" size={28} style={{ color: "gray" }} />
        </View>

        <View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: "gray",
              marginBottom: 16,
            }}
          >
            {formateId(loan.id, "Loan")}
          </Text>

          {loan.loan_status === "Active" ? (
            <>
              <Text style={{ fontSize: 16, color: "gray" }}>
                Outstanding Amount
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "500",
                  color: Colors.light.text,
                }}
              >
                {showAsCurrency(
                  Number(loan?.total_payable) - Number(loan?.total_paid)
                )}
              </Text>
            </>
          ) : (
            <>
              <Text style={{ fontSize: 16, color: "gray" }}>Loan Amount</Text>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "500",
                  color: Colors.light.text,
                }}
              >
                {showAsCurrency(loan.amount)}
              </Text>
            </>
          )}
        </View>

        <View style={styles.separator}></View>

        {loan.loan_status === "Pending" ? (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 40,
            }}
          >
            <View>
              <Text style={{ fontSize: 16, color: "gray" }}>Interest Rate</Text>
              <Text style={{ fontSize: 16 }}>
                {loan.interest_rate} % {loan.interest_frequency}
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 16, color: "gray" }}>
                Number of EMIs
              </Text>
              <Text style={{ fontSize: 16 }}>
                {loan.overrode_installments ?? loan.prefered_installments}
              </Text>
            </View>
          </View>
        ) : (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 40,
            }}
          >
            <View>
              <Text style={{ fontSize: 16, color: "gray" }}>
                Repayment Paid
              </Text>
              <Text style={{ fontSize: 16 }}>
                {showAsCurrency(loan.total_paid)}
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 16, color: "gray" }}>Emi Amount</Text>
              <Text style={{ fontSize: 16 }}>
                {showAsCurrency(loan.emi_amount)}
              </Text>
            </View>
          </View>
        )}
      </Pressable>
    </Link>
  );
};

export default LoanCard;

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
    marginVertical: 16,
    height: 1,
    marginHorizontal: "auto",
    width: "100%",
    backgroundColor: Colors.light.text,
  },
});
