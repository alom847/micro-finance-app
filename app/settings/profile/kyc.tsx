import React from "react";
import { Image, ScrollView, Text } from "react-native";
import { XStack, YStack } from "tamagui";

type Props = {};

export default function Viewkyc({}: Props) {
  return (
    <ScrollView>
      <YStack>
        <YStack>
          <Text></Text>
          {/* <Image
            source={{
              uri: 
            }}
          /> */}
        </YStack>

        <YStack>
          <Text></Text>
          <XStack>
            {/* <Image
              source={{
                uri: 
              }}
            /> */}
          </XStack>
        </YStack>
      </YStack>
    </ScrollView>
  );
}
