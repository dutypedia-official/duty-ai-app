import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";

const FormInput = ({
  control,
  name,
  label,
  placeholder,
  keyboardType = "default",
  rules = {},
  secureTextEntry = false,
  inputMode = "text",
}: {
  control: any;
  name: string;
  label?: string;
  placeholder: string;
  keyboardType?: any;
  rules?: object;
  secureTextEntry?: boolean;
  inputMode?: "email" | "none" | "numeric" | "search" | "tel" | "text" | "url";
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const handleChangeText =
    (onChange: (value: string) => void) => (text: string) => {
      // Filter out non-English characters (Bangla, etc.)
      const filteredText = text.replace(
        /[^a-zA-Z0-9\s\.,!?@#$%^&*()_+=-]/g,
        ""
      );
      onChange(filteredText);
    };
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View style={styles.container}>
          {label && (
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 16,
                marginBottom: 8,
              }}>
              {label}
            </Text>
          )}
          <TextInput
            style={[
              styles.input,
              error ? styles.errorInput : null,
              isFocused ? styles.focusedInput : null,
            ]}
            placeholder={placeholder}
            placeholderTextColor="#BDC3C7" // Added placeholder text color
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            onBlur={() => {
              onBlur();
              setIsFocused(false);
            }}
            onFocus={() => setIsFocused(true)}
            onChangeText={handleChangeText(onChange)}
            value={value}
            inputMode={inputMode}
          />
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {},
  input: {
    backgroundColor: "#333333",
    borderRadius: 12,
    color: "#ffffff",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 16,
    fontSize: 16,
    borderColor: "#4F5A5F",
  },
  errorInput: {
    borderColor: "#FA0000",
  },
  errorText: {
    color: "#EC2700",
    marginTop: 8,
  },
  focusedInput: {
    borderColor: "#4E73DF",
  },
});

export default FormInput;
