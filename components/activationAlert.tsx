import React from "react";
import { AlertDialog, Button, YStack } from "tamagui";
import { useSession } from "../context/SessionContext";
import { router } from "expo-router";

type Props = {};

function ActivationAlert({}: Props) {
  const { user } = useSession();

  return (
    <AlertDialog open={!user?.ac_status}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <AlertDialog.Content
          bordered
          elevate
          key="content"
          animation={[
            "quick",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          y={0}
          backgroundColor={"yellow"}
        >
          <YStack space>
            <AlertDialog.Title>Account not active</AlertDialog.Title>
            <AlertDialog.Description>
              Please contact Himalayan Microfinance Office.
            </AlertDialog.Description>
          </YStack>

          <Button
            onPress={() => router.canGoBack() && router.back()}
            variant={"outlined"}
            color={"blue"}
          >
            Go Back
          </Button>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}

export default ActivationAlert;
