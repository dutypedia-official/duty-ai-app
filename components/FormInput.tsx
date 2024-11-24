import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
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
  icon,
  type,
  focus,
  onFocus,
}: {
  control: any;
  name: string;
  label?: string;
  placeholder: string;
  keyboardType?: any;
  rules?: object;
  secureTextEntry?: boolean;
  inputMode?: "email" | "none" | "numeric" | "search" | "tel" | "text" | "url";
  icon?: ReactNode;
  type?: string;
  focus?: boolean;
  onFocus?: () => void;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Automatically focus the input field if the `focus` prop is passed as true
  useEffect(() => {
    if (focus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focus]);

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
          <View
            style={{
              position: "relative",
              backgroundColor: "transparent",
            }}>
            <TextInput
              ref={inputRef} // Attach the ref to the TextInput
              style={[
                styles.input,
                { paddingRight: icon ? 44 : 12 },
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
              onFocus={() => {
                setIsFocused(true);
                if (onFocus) {
                  onFocus(); // Trigger the onFocus callback if provided
                }
              }}
              onChangeText={onChange}
              value={value}
              inputMode={inputMode}
            />

            {icon && icon}
          </View>

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
    paddingLeft: 12,
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
