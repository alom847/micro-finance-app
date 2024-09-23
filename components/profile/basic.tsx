import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FieldValues, useForm, Controller } from "react-hook-form";
import { ScrollView } from "react-native";
import {
  Input,
  YStack,
  SizableText,
  XStack,
  Button,
  Theme,
  Select,
} from "tamagui";
import { z, string } from "zod";
import { User } from "../../typs";
import { UpdateProfile } from "../../constants/api";
import { useSession } from "../../context/SessionContext";
import Toast from "react-native-toast-message";
import DatePicker from "../commons/datePicker";
import { SelectList } from "react-native-dropdown-select-list";

type Props = {};

// const validationSchema = z.object({
//   name: string().min(1, "name must have atleast 3 characers"),
// });

function Basic({}: Props) {
  const { user, refresh, handleApiResponse } = useSession();
  const {
    formState: { errors },
    control,
    setValue,
    reset,
    handleSubmit,
  } = useForm({
    // resolver: zodResolver(validationSchema),
    defaultValues: {
      name: user?.name,
      father_name: user?.father_name,
      mother_name: user?.mother_name,
      nominee_name: user?.nominee_name,

      gender: user?.gender,
      date_of_birth: new Date(user?.date_of_birth ?? new Date()),
      maritial_status: user?.maritial_status,
      profession: user?.profession,
      annual_turnover: user?.annual_turnover,
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: FieldValues) => {
    const data = {
      name: values.name,
      father_name: values.father_name,
      mother_name: values.mother_name,
      nominee_name: values.nominee_name,

      gender: values.gender,
      date_of_birth: values.date_of_birth,
      maritial_status: values.maritial_status,
      profession: values.profession,
      annual_turnover: values.annual_turnover,
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
        <SizableText color={"gray"}>Name</SizableText>
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
          name="name"
        />
        {errors.name && (
          <SizableText theme={"red"}>
            {errors.name.message?.toString()}
          </SizableText>
        )}
      </YStack>

      <YStack>
        <SizableText color={"gray"}>Date Of Birth</SizableText>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            // <Input
            //   onBlur={onBlur}
            //   onChangeText={(value) => onChange(value)}
            //   value={value}
            //   size="$4"
            //   borderWidth={2}
            // />
            <DatePicker value={value} onValueChange={onChange} />
          )}
          name="date_of_birth"
        />
        {errors.date_of_birth && (
          <SizableText theme={"red"}>
            {errors.date_of_birth.message?.toString()}
          </SizableText>
        )}
      </YStack>

      <YStack>
        <SizableText color={"gray"}>Gender</SizableText>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            // <Input
            //   onBlur={onBlur}
            //   onChangeText={(value) => onChange(value)}
            //   value={value}
            //   size="$4"
            //   borderWidth={2}
            // />

            <SelectList
              save="value"
              setSelected={(val: any) => onChange(val)}
              data={[
                { key: "1", value: "male" },
                { value: "female", key: "2" },
                { value: "other", key: "3" },
              ]}
            />
          )}
          name="gender"
        />
        {errors.gender && (
          <SizableText theme={"red"}>
            {errors.gender.message?.toString()}
          </SizableText>
        )}
      </YStack>

      <YStack>
        <SizableText color={"gray"}>Martial Status</SizableText>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            // <Input
            //   onBlur={onBlur}
            //   onChangeText={(value) => onChange(value)}
            //   value={value}
            //   size="$4"
            //   borderWidth={2}
            // />

            // <Select
            //   value={value}
            //   onValueChange={onChange}
            //   disablePreventBodyScroll
            // >
            //   <Select.Trigger>
            //     <Select.Value placeholder="Search..." />
            //   </Select.Trigger>
            //   <Select.Content zIndex={200000}>
            //     <Select.Viewport>
            //       <Select.Group>
            //         <Select.Label />
            //         <Select.Item index={0} value="married">
            //           <Select.ItemText>Married</Select.ItemText>
            //         </Select.Item>
            //         <Select.Item index={0} value="unmarried">
            //           <Select.ItemText>Unmarried</Select.ItemText>
            //         </Select.Item>
            //       </Select.Group>
            //     </Select.Viewport>
            //   </Select.Content>
            // </Select>

            <SelectList
              save="value"
              setSelected={(val: any) => onChange(val)}
              data={[
                { value: "married", key: "1" },
                { value: "unmarried", key: "2" },
              ]}
            />
          )}
          name="maritial_status"
        />
        {errors.maritial_status && (
          <SizableText theme={"red"}>
            {errors.maritial_status.message?.toString()}
          </SizableText>
        )}
      </YStack>

      <YStack>
        <SizableText color={"gray"}>Profession</SizableText>
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
          name="profession"
        />
        {errors.profession && (
          <SizableText theme={"red"}>
            {errors.profession.message?.toString()}
          </SizableText>
        )}
      </YStack>

      <YStack>
        <SizableText color={"gray"}>Annual Turnover</SizableText>
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
          name="annual_turnover"
        />
        {errors.annual_turnover && (
          <SizableText theme={"red"}>
            {errors.annual_turnover.message?.toString()}
          </SizableText>
        )}
      </YStack>

      <YStack>
        <SizableText color={"gray"}>Father Name</SizableText>
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
          name="father_name"
        />
        {errors.father_name && (
          <SizableText theme={"red"}>
            {errors.father_name.message?.toString()}
          </SizableText>
        )}
      </YStack>

      <YStack>
        <SizableText color={"gray"}>Mother Name</SizableText>
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
          name="mother_name"
        />
        {errors.mother_name && (
          <SizableText theme={"red"}>
            {errors.mother_name.message?.toString()}
          </SizableText>
        )}
      </YStack>

      <YStack>
        <SizableText color={"gray"}>Nominee Name</SizableText>
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
          name="nominee_name"
        />
        {errors.nominee_name && (
          <SizableText theme={"red"}>
            {errors.nominee_name.message?.toString()}
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

export default Basic;
