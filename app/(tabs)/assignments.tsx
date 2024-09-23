import React, { useCallback, useState } from "react";
import { View, Text } from "react-native";
import { Separator, SizableText, Tabs, Theme } from "tamagui";
import LoansAssignments from "../../components/assignments/loans";
import DepositAssignments from "../../components/assignments/deposits";

type Props = {};

function Assignments({}: Props) {
  return (
    <Tabs
      defaultValue="tab1"
      orientation="horizontal"
      flexDirection="column"
      borderRadius="$4"
      borderWidth="$0.25"
      overflow="hidden"
      borderColor="$borderColor"
    >
      <Theme name={"blue"}>
        <Tabs.List
          separator={<Separator vertical />}
          disablePassBorderRadius="bottom"
          aria-label="Manage your account"
        >
          <Tabs.Tab flex={1} value="tab1">
            <SizableText>Loans</SizableText>
          </Tabs.Tab>
          <Tabs.Tab flex={1} value="tab2">
            <SizableText>Deposits</SizableText>
          </Tabs.Tab>
        </Tabs.List>
      </Theme>

      <Separator />

      <Tabs.Content value="tab1">
        <LoansAssignments />
      </Tabs.Content>

      <Tabs.Content value="tab2">
        <DepositAssignments />
      </Tabs.Content>
    </Tabs>
  );
}

export default Assignments;
