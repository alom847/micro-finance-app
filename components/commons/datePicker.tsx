import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import DateTimePicker from "react-native-ui-datepicker";
import { Dialog } from "tamagui";

type Props = {
  value: Date;
  onValueChange: (value: Date) => void;
};

function DatePicker({ value, onValueChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open}>
      <Dialog.Trigger asChild>
        <Pressable
          onPress={() => setOpen(true)}
          style={{
            padding: 12,
            borderRadius: 8,
            borderColor: "#d7d7d7",
            borderWidth: 2,
            backgroundColor: "#fafafa",
          }}
        >
          <Text>{value.toLocaleDateString()}</Text>
        </Pressable>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <View style={{ padding: 16, width: "100%" }}>
            <DateTimePicker
              mode="single"
              date={value}
              onChange={(params) => {
                onValueChange(new Date(params.date as Date));
                setOpen(false);
              }}
            />
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

export default DatePicker;
