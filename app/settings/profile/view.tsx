import React, { useCallback, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import Colors from "../../../constants/Colors";
import { SizableText, XStack, YStack } from "tamagui";
import { useSession } from "../../../context/SessionContext";
import { formateId } from "../../../utils/formateId";
import { RefreshControl } from "react-native-gesture-handler";

type Props = {};

function ViewProfile({}: Props) {
  const { user, refresh } = useSession();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    await refresh();

    setRefreshing(false);
  }, []);

  return (
    <ScrollView
      style={{
        padding: 8,
        backgroundColor: Colors.light.background,
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View
        style={{
          padding: 16,
          borderRadius: 10,
          backgroundColor: Colors.light.accent,
        }}
      >
        <SizableText color={"gray"} size={"$6"} fontWeight={"$4"}>
          Basic Details
        </SizableText>

        <XStack justifyContent="space-between">
          <YStack>
            <YStack>
              <SizableText color={"gray"}>User ID</SizableText>
              <SizableText color={Colors.light.text}>
                {formateId(user?.id ?? 0, "User")}
              </SizableText>
            </YStack>
            <YStack>
              <SizableText color={"gray"}>Name</SizableText>
              <SizableText color={Colors.light.text}>{user?.name}</SizableText>
            </YStack>
            <YStack>
              <SizableText color={"gray"}>Email Address</SizableText>
              <SizableText color={Colors.light.text}>
                {user?.email ?? "n/a"}
              </SizableText>
            </YStack>
            <YStack>
              <SizableText color={"gray"}>Alternate Phone</SizableText>
              <SizableText color={Colors.light.text}>
                {user?.alternate_phone ?? "n/a"}
              </SizableText>
            </YStack>
            <YStack>
              <SizableText color={"gray"}>DOB</SizableText>
              <SizableText color={Colors.light.text}>
                {user?.date_of_birth
                  ? new Date(user?.date_of_birth).toDateString()
                  : "n/a"}
              </SizableText>
            </YStack>
            <YStack>
              <SizableText color={"gray"}>Gender</SizableText>
              <SizableText color={Colors.light.text}>
                {user?.gender}
              </SizableText>
            </YStack>
          </YStack>
          <YStack>
            <YStack>
              <SizableText color={"gray"}>Phone</SizableText>
              <SizableText color={Colors.light.text}>{user?.phone}</SizableText>
            </YStack>

            <YStack>
              <SizableText color={"gray"}>Father Name</SizableText>
              <SizableText color={Colors.light.text}>
                {user?.father_name ?? "n/a"}
              </SizableText>
            </YStack>
            <YStack>
              <SizableText color={"gray"}>Mother Name</SizableText>
              <SizableText color={Colors.light.text}>
                {user?.mother_name ?? "n/a"}
              </SizableText>
            </YStack>
            <YStack>
              <SizableText color={"gray"}>Profession</SizableText>
              <SizableText color={Colors.light.text}>
                {user?.profession ?? "n/a"}
              </SizableText>
            </YStack>
            <YStack>
              <SizableText color={"gray"}>Annual Turnover</SizableText>
              <SizableText color={Colors.light.text}>
                {user?.annual_turnover ?? "n/a"}
              </SizableText>
            </YStack>
            <YStack>
              <SizableText color={"gray"}>Nominee</SizableText>
              <SizableText color={Colors.light.text}>
                {user?.nominee_name ?? "n/a"}
              </SizableText>
            </YStack>
          </YStack>
        </XStack>
      </View>

      <View
        style={{
          marginTop: 8,
          padding: 16,
          borderRadius: 10,
          backgroundColor: Colors.light.accent,
        }}
      >
        <SizableText color={"gray"} size={"$6"} fontWeight={"$4"}>
          Address Details
        </SizableText>

        <XStack justifyContent="space-between">
          <YStack maxWidth={"100%"}>
            <YStack>
              <SizableText color={"gray"}>Current Location</SizableText>
              <SizableText color={Colors.light.text}>
                {user?.current_city}
              </SizableText>
            </YStack>
            <YStack>
              <SizableText color={"gray"}>Current Address</SizableText>
              <SizableText color={Colors.light.text}>
                {user?.current_address}
              </SizableText>
            </YStack>
            <YStack>
              <SizableText color={"gray"}>Current State</SizableText>
              <SizableText color={Colors.light.text}>
                {user?.current_state}
              </SizableText>
            </YStack>
            <YStack>
              <SizableText color={"gray"}>Current Zip</SizableText>
              <SizableText color={Colors.light.text}>
                {user?.current_zip}
              </SizableText>
            </YStack>
            <YStack>
              <SizableText color={"gray"}>Country</SizableText>
              <SizableText color={Colors.light.text}>
                {user?.country}
              </SizableText>
            </YStack>
          </YStack>
          <YStack maxWidth={"100%"}>
            <YStack>
              <SizableText color={"gray"}>Parmanent Location</SizableText>
              <SizableText color={Colors.light.text}>
                {user?.city ?? "n/a"}
              </SizableText>
            </YStack>
            <YStack>
              <SizableText color={"gray"}>Parmanent Address</SizableText>
              <SizableText color={Colors.light.text}>
                {user?.address ?? "n/a"}
              </SizableText>
            </YStack>
            <YStack>
              <SizableText color={"gray"}>Parmanent State</SizableText>
              <SizableText color={Colors.light.text}>
                {user?.state ?? "n/a"}
              </SizableText>
            </YStack>
            <YStack>
              <SizableText color={"gray"}>Parmanent Zip</SizableText>
              <SizableText color={Colors.light.text}>
                {user?.zip ?? "n/a"}
              </SizableText>
            </YStack>
          </YStack>
        </XStack>
      </View>
    </ScrollView>
  );
}

export default ViewProfile;
