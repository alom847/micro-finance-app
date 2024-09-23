import { useState } from "react";
import { ScrollView, View } from "react-native";
import {
  Input,
  YStack,
  SizableText,
  XStack,
  Label,
  Switch,
  Button,
  Theme,
} from "tamagui";
import { useSession } from "../../context/SessionContext";
import { FieldValues, useForm, Controller } from "react-hook-form";
import Toast from "react-native-toast-message";
import { UpdateProfile } from "../../constants/api";

type Props = {};

function Address({}: Props) {
  const { user, refresh, handleApiResponse } = useSession();
  const {
    control,
    formState: { errors, defaultValues },
    getValues,
    setValue,
    handleSubmit,
  } = useForm({
    defaultValues: {
      current_address: user?.current_address,
      current_district: user?.current_district,
      current_city: user?.current_city,
      current_state: user?.current_state,
      current_zip: user?.current_zip,

      address: user?.address,
      district: user?.district,
      city: user?.city,
      state: user?.state,
      zip: user?.zip,

      country: user?.country,
    },
  });

  const [loading, setLoading] = useState(false);
  const [sameAsCurrent, setSameAsCurrent] = useState(false);

  const onSubmit = async (values: FieldValues) => {
    const data = {
      current_address: values.current_address,
      current_district: values.current_district,
      current_city: values.current_city,
      current_state: values.current_state,
      current_zip: values.current_zip,

      address: values.address,
      district: values.district,
      city: values.city,
      state: values.state,
      zip: values.zip,

      country: values.country,
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
      <SizableText color="gray">Current Address</SizableText>

      <YStack>
        <SizableText color="gray">Address Line</SizableText>
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
          name="current_address"
        />
        {errors.current_address && (
          <SizableText theme={"red"}>
            {errors.current_address.message?.toString()}
          </SizableText>
        )}
      </YStack>

      <YStack>
        <SizableText color="gray">Location</SizableText>
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
          name="current_city"
        />
        {errors.current_city && (
          <SizableText theme={"red"}>
            {errors.current_city.message?.toString()}
          </SizableText>
        )}
      </YStack>

      <YStack>
        <SizableText color="gray">District</SizableText>
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
          name="current_district"
        />
        {errors.current_district && (
          <SizableText theme={"red"}>
            {errors.current_district.message?.toString()}
          </SizableText>
        )}
      </YStack>

      <YStack>
        <SizableText color="gray">State</SizableText>
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
          name="current_state"
        />
        {errors.current_state && (
          <SizableText theme={"red"}>
            {errors.current_state.message?.toString()}
          </SizableText>
        )}
      </YStack>

      <YStack>
        <SizableText color="gray">Pin Code</SizableText>
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
          name="current_zip"
        />
        {errors.current_zip && (
          <SizableText theme={"red"}>
            {errors.current_zip.message?.toString()}
          </SizableText>
        )}
      </YStack>

      <YStack>
        <SizableText color="gray">Country</SizableText>
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
          name="country"
        />
        {errors.country && (
          <SizableText theme={"red"}>
            {errors.country.message?.toString()}
          </SizableText>
        )}
      </YStack>

      <XStack alignItems="center" justifyContent="space-between" space="$4">
        <SizableText color="gray">Parmanent Address</SizableText>

        <XStack alignItems="center" space="$4">
          <Label
            paddingRight="$0"
            minWidth={90}
            justifyContent="flex-end"
            size={"$2"}
            htmlFor={"same"}
          >
            Same as current
          </Label>
          <View
            style={{
              borderColor: "#d7d7d7",
              borderRadius: 12,
              borderWidth: 1,
            }}
          >
            <Theme name={"blue"}>
              <Switch
                id={"same"}
                size={"$2"}
                checked={sameAsCurrent}
                onCheckedChange={(checked: boolean) => {
                  if (checked) {
                    setValue("address", getValues("current_address"));
                    setValue("city", getValues("current_city"));
                    setValue("district", getValues("current_district"));
                    setValue("state", getValues("current_state"));
                    setValue("zip", getValues("current_zip"));
                  } else {
                    setValue("address", defaultValues?.address);
                    setValue("city", defaultValues?.city);
                    setValue("district", defaultValues?.district);
                    setValue("state", defaultValues?.state);
                    setValue("zip", defaultValues?.zip);
                  }
                  setSameAsCurrent(checked);
                }}
              >
                <Switch.Thumb />
              </Switch>
            </Theme>
          </View>
        </XStack>
      </XStack>

      <YStack>
        <SizableText color="gray">Address Line</SizableText>
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
          name="address"
        />
        {errors.address && (
          <SizableText theme={"red"}>
            {errors.address.message?.toString()}
          </SizableText>
        )}
      </YStack>

      <YStack>
        <SizableText color="gray">Location</SizableText>
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
          name="city"
        />
        {errors.city && (
          <SizableText theme={"red"}>
            {errors.city.message?.toString()}
          </SizableText>
        )}
      </YStack>

      <YStack>
        <SizableText color="gray">District</SizableText>
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
          name="district"
        />
        {errors.district && (
          <SizableText theme={"red"}>
            {errors.district.message?.toString()}
          </SizableText>
        )}
      </YStack>

      <YStack>
        <SizableText color="gray">State</SizableText>
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
          name="state"
        />
        {errors.state && (
          <SizableText theme={"red"}>
            {errors.state.message?.toString()}
          </SizableText>
        )}
      </YStack>

      <YStack>
        <SizableText color="gray">Pin Code</SizableText>
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
          name="zip"
        />
        {errors.zip && (
          <SizableText theme={"red"}>
            {errors.zip.message?.toString()}
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

export default Address;
