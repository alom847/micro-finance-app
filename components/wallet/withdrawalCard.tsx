import React, { useState } from "react";
import {
  Button,
  Dialog,
  Input,
  SizableText,
  Theme,
  XStack,
  YStack,
} from "tamagui";
import { InitiateWithdrawalRequest } from "../../constants/api";
import Toast from "react-native-toast-message";
import { Pressable, Text } from "react-native";
import LoadingOverlay from "../commons/loadingOverlay";
import { useSession } from "../../context/SessionContext";

type Props = {
  balance: number;
};

export default function WithdrawalCard({ balance }: Props) {
  const { handleApiResponse } = useSession();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestWithdrawal = async () => {
    setLoading(true);
    try {
      const resp = await handleApiResponse(InitiateWithdrawalRequest, [
        Number(amount),
      ]);

      if (resp.status) {
        Toast.show({ type: "success", text1: resp.message });
      } else {
        Toast.show({ type: "error", text1: resp.message });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <LoadingOverlay show={loading} />
      <Dialog open={open}>
        <Dialog.Trigger asChild>
          <Pressable
            style={{
              padding: 12,
              backgroundColor: "indigo",
              borderRadius: 10,
            }}
            onPress={() => setOpen(true)}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: "white",
              }}
            >
              Withdrawal
            </Text>
          </Pressable>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content>
            <YStack padding={8} gap={10}>
              <SizableText size={"$8"}>Initiate Withdrawal</SizableText>

              <YStack gap={10}>
                <YStack>
                  <SizableText>Withdrawal Amount</SizableText>
                  <Input
                    value={amount}
                    onChangeText={(value) =>
                      setAmount((prv) => (isNaN(Number(value)) ? prv : value))
                    }
                  />
                </YStack>

                <XStack>
                  <Button onPress={() => setOpen(false)} variant={"outlined"}>
                    Cancel
                  </Button>

                  <Theme name={"green"}>
                    <Button
                      theme={"active"}
                      onPress={handleRequestWithdrawal}
                      color={"white"}
                    >
                      Confirm Withdrawal
                    </Button>
                  </Theme>
                </XStack>
              </YStack>
            </YStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </>
  );
}
