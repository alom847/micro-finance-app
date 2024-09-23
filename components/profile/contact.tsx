import { ScrollView } from "react-native";
import { Input, YStack, SizableText, XStack, Button, Theme } from "tamagui";
import { useSession } from "../../context/SessionContext";
import { useForm, Controller, FieldValues } from "react-hook-form";
import { UpdateProfile } from "../../constants/api";
import Toast from "react-native-toast-message";
import { useState } from "react";

type Props = {};

function Contact({}: Props) {
  const { user, refresh, handleApiResponse } = useSession();

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      email: user?.email,
      phone: user?.phone,
      alternate_phone: user?.alternate_phone,
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: FieldValues) => {
    const data = {
      email: values.email,
      phone: values.phone,
      alternate_phone: values.alternate_phone,
    };

    setLoading(true);

    const resp = await handleApiResponse(UpdateProfile, [data]);

    setLoading(false);

    if (resp.status) {
      await refresh();
      return Toast.show({
        type: "success",
        text1: "Saved Changes Successfully!",
      });
    }

    Toast.show({
      type: "error",
      text1: "Something went wrong!",
      text2: resp.message,
    });
  };

  return (
    <ScrollView
      style={{ padding: 8 }}
      contentContainerStyle={{ gap: 8, paddingBottom: 400 }}
    >
      <YStack>
        <SizableText color={"gray"}>Phone</SizableText>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              size="$4"
              borderWidth={2}
            />
          )}
          name="phone"
        />
        {errors.phone && (
          <SizableText theme={"red"}>
            {errors.phone.message?.toString()}
          </SizableText>
        )}
      </YStack>

      <YStack>
        <SizableText color={"gray"}>Alternate Phone</SizableText>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              size="$4"
              borderWidth={2}
            />
          )}
          name="alternate_phone"
        />
        {errors.alternate_phone && (
          <SizableText theme={"red"}>
            {errors.alternate_phone.message?.toString()}
          </SizableText>
        )}
      </YStack>

      <YStack>
        <SizableText color={"gray"}>Email</SizableText>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              size="$4"
              borderWidth={2}
            />
          )}
          name="email"
        />
        {errors.email && (
          <SizableText theme={"red"}>
            {errors.email.message?.toString()}
          </SizableText>
        )}
      </YStack>

      <XStack
        marginTop={"$4"}
        alignItems="center"
        justifyContent="flex-end"
        space={"$2"}
      >
        <Button variant={"outlined"}>Cancel</Button>
        <Theme name={"blue"}>
          <Button
            disabled={loading}
            onPress={handleSubmit(onSubmit)}
            theme={"active"}
            color={"white"}
          >
            Save Changes
          </Button>
        </Theme>
      </XStack>
    </ScrollView>
  );
}

export default Contact;
