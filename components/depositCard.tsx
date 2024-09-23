import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import Colors from "../constants/Colors";
import { showAsCurrency } from "../utils/showAsCurrency";
import { formateId } from "../utils/formateId";
import { Link } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { Deposit } from "../typs";
import { blue, cyan, green, orange, red } from "../utils/colors";

type Props = {
  deposit: Deposit;
  width?: "fill" | "contain";
};

const StatusColors: { [key: string]: string } = {
  Rejected: red[400],
  Pending: orange[100],
  Active: blue[300],
};

const CardColors = {
  BG_RD: green[300],
  BG_FD: cyan[800],
  Text_RD: Colors.light.text,
  Text_FD: "white",
  Secondary_Text_RD: "gray",
  Secondary_Text_FD: Colors.light.accent,
};

const DepositCard = ({ deposit, width = "contain" }: Props) => {
  return (
    <Link
      href={{
        pathname: "/deposits/[id]/",
        params: { id: deposit.id },
      }}
      asChild
    >
      <Pressable
        style={{
          position: "relative",
          width: width === "contain" ? "auto" : "100%",
          height: "auto",
          minWidth: 300,
          maxWidth: "100%",
          backgroundColor: deposit.category === "RD" ? green[200] : cyan[800],
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
              backgroundColor: StatusColors[deposit.deposit_status],
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
              {deposit.deposit_status}
            </Text>
          </View>
          <Entypo name="chevron-right" size={28} style={{ color: "gray" }} />
        </View>

        <View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color:
                deposit.category === "RD"
                  ? CardColors.Secondary_Text_RD
                  : CardColors.Secondary_Text_FD,
              marginBottom: 16,
            }}
          >
            {formateId(deposit.id, deposit.category)}
          </Text>

          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color:
                deposit.category === "RD"
                  ? CardColors.Secondary_Text_RD
                  : CardColors.Secondary_Text_FD,
            }}
          >
            Deposit Amount
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "500",
              color:
                deposit.category === "RD"
                  ? CardColors.Text_RD
                  : CardColors.Text_FD,
            }}
          >
            {showAsCurrency(deposit.amount)}
          </Text>
        </View>

        <View style={styles.separator}></View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          {deposit.category === "RD" ? (
            <View>
              <Text
                style={{ fontSize: 16, color: CardColors.Secondary_Text_RD }}
              >
                Total Deposit
              </Text>
              <Text style={{ fontSize: 16 }}>
                {showAsCurrency(deposit.total_paid || 0)}
              </Text>
            </View>
          ) : (
            <View>
              <Text
                style={{
                  fontSize: 16,
                  color: CardColors.Secondary_Text_FD,
                }}
              >
                interest Rate
              </Text>
              <Text
                style={{ fontSize: 16, color: CardColors.Secondary_Text_FD }}
              >
                {deposit.interest_rate} % {deposit.interest_credit_frequency}
              </Text>
            </View>
          )}
          <View>
            <Text
              style={{
                fontSize: 16,
                color:
                  deposit.category === "RD"
                    ? CardColors.Secondary_Text_RD
                    : CardColors.Secondary_Text_FD,
              }}
            >
              Maturity Date
            </Text>
            <Text
              style={{
                fontSize: 16,
                color:
                  deposit.category === "RD"
                    ? CardColors.Secondary_Text_RD
                    : CardColors.Secondary_Text_FD,
              }}
            >
              {new Date(deposit.maturity_date ?? Date.now()).toDateString()}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

export default DepositCard;

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
