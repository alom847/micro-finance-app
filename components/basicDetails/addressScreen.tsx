import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Dimensions,
  Pressable,
} from "react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Colors from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const { width: PAGE_WIDTH } = Dimensions.get("window");

const AddressScreen = ({
  onSubmit,
}: {
  onSubmit: (data: {
    address: string;
    zip: string;
    city: string;
    state: string;
    country: string;
  }) => void;
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z.object({
        address: z.string().min(3, "username must be atleast 3 characters."),
        zip: z.string().min(3, "username must be atleast 3 characters."),
        city: z.string().min(3, "username must be atleast 3 characters."),
        state: z.string().min(3, "username must be atleast 3 characters."),
        country: z.string().min(3, "username must be atleast 3 characters."),
      })
    ),
    defaultValues: {
      address: "",
      zip: "",
      city: "",
      state: "Assam",
      country: "India",
    },
  });

  const onStepSubmit = (data: {
    address: string;
    zip: string;
    city: string;
    state: string;
    country: string;
  }) => {
    onSubmit(data);
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          // fontFamily: "cherry",
          fontSize: 32,
          marginVertical: 32,
        }}
      >
        {`What's your \ncurrent Address?`}
      </Text>

      <View
        style={{
          marginTop: 32,
        }}
      >
        <Text style={{ color: Colors.light.text, fontSize: 8, margin: 8 }}>
          {errors.address?.message}
        </Text>

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              style={{
                width: "100%",
                height: 48,
                paddingVertical: 10,
                paddingHorizontal: 24,
                backgroundColor: "#fafafa",
                borderColor: "#000",
                borderWidth: 1,
                borderRadius: 16,
              }}
              placeholder="Current Address"
            />
          )}
          name="address"
        />

        <Text style={{ color: Colors.light.text, fontSize: 8, margin: 8 }}>
          {errors.city?.message}
        </Text>

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              style={{
                width: "100%",
                height: 48,
                paddingVertical: 10,
                paddingHorizontal: 24,
                backgroundColor: "#fafafa",
                borderColor: "#000",
                borderWidth: 1,
                borderRadius: 16,
              }}
              placeholder="City"
            />
          )}
          name="city"
        />

        <Text style={{ color: Colors.light.text, fontSize: 8, margin: 8 }}>
          {errors.zip?.message}
        </Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              style={{
                width: "100%",
                height: 48,
                paddingVertical: 10,
                paddingHorizontal: 24,
                backgroundColor: "#fafafa",
                borderColor: "#000",
                borderWidth: 1,
                borderRadius: 16,
              }}
              placeholder="Zip"
            />
          )}
          name="zip"
        />

        <Text style={{ color: Colors.light.text, fontSize: 8, margin: 8 }}>
          {errors.state?.message}
        </Text>

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              style={{
                width: "100%",
                height: 48,
                paddingVertical: 10,
                paddingHorizontal: 24,
                backgroundColor: "#fafafa",
                borderColor: "#000",
                borderWidth: 1,
                borderRadius: 16,
              }}
              placeholder="State"
            />
          )}
          name="state"
        />

        <Text style={{ color: Colors.light.text, fontSize: 8, margin: 8 }}>
          {errors.country?.message}
        </Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              style={{
                width: "100%",
                height: 48,
                paddingVertical: 10,
                paddingHorizontal: 24,
                backgroundColor: "#fafafa",
                borderColor: "#000",
                borderWidth: 1,
                borderRadius: 16,
              }}
              placeholder="Country"
            />
          )}
          name="country"
        />
      </View>

      <Pressable
        style={{
          position: "absolute",
          bottom: 80,
          width: 62,
          height: 62,
          alignSelf: "center",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.light.text,

          borderRadius: 32,
        }}
        onPress={handleSubmit(onStepSubmit)}
      >
        <Ionicons name="arrow-forward" size={32} color="#fafafa" />
      </Pressable>
    </View>
  );
};

export default AddressScreen;

const styles = StyleSheet.create({
  container: {
    width: PAGE_WIDTH,
    padding: 16,
    backgroundColor: Colors.light.background,
  },
});
