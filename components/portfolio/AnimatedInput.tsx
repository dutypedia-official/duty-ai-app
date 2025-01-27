import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  Text,
  Animated,
  StyleSheet,
  InputModeOptions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// Animated LinearGradient wrapper
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const AnimatedInput = ({
  isDark,
  onChange,
  value,
  onBlur,
  error,
  keyboardType,
  placeholder,
  label,
  errorInputColor,
  inputColor,
  startColorOutRange,
  endColorOutRange,
  inputBorderColor,
  inputShadow,
  inputMode,
}: {
  isDark: boolean;
  onChange: () => void;
  value: any;
  onBlur: () => void;
  error: any;
  keyboardType?: any;
  placeholder: string;
  label: string;
  errorInputColor?: any;
  inputColor: any;
  startColorOutRange: any;
  endColorOutRange: any;
  inputBorderColor?: any;
  inputShadow: any;
  inputMode?: InputModeOptions;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const labelPosition = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(labelPosition, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  // Interpolating colors for the LinearGradient
  const startColor = labelPosition.interpolate({
    inputRange: [0, 1],
    outputRange: startColorOutRange,
  });

  const endColor = labelPosition.interpolate({
    inputRange: [0, 1],
    outputRange: endColorOutRange,
  });

  return (
    <View style={styles.container}>
      <View style={{ position: "relative" }}>
        <Animated.View
          style={[
            {
              position: "absolute" as const,
              left: 12,
              top: labelPosition.interpolate({
                inputRange: [0, 1],
                outputRange: [18, -8],
              }) as unknown as number,
            },
            {
              zIndex: 999,
              pointerEvents: "none",
            },
          ]}>
          <AnimatedLinearGradient
            colors={[startColor, endColor]}
            style={{ paddingHorizontal: 4, borderRadius: 4 }}>
            <Text style={{ color: isDark ? "#6C6C81" : "#6C6C81" }}>
              {label}
            </Text>
          </AnimatedLinearGradient>
        </Animated.View>
        <View style={inputShadow}>
          <LinearGradient
            colors={inputColor}
            style={[
              styles.gradient,
              {
                borderColor: inputBorderColor
                  ? inputBorderColor
                  : isDark
                  ? "#3C3C47"
                  : "#CCCCCC",
              },
              error && { borderColor: "#EC2700" },
            ]}>
            <TextInput
              style={[
                styles.input,
                error && errorInputColor
                  ? { color: errorInputColor }
                  : {
                      color: isDark ? "#fff" : "#000",
                    },
              ]}
              placeholder={!isFocused ? "" : placeholder}
              placeholderTextColor={isDark ? "#3C3C47" : "#CCCCCC"}
              keyboardType={keyboardType}
              onBlur={() => {
                onBlur?.();
                setIsFocused(false);
              }}
              onFocus={() => setIsFocused(true)}
              onChangeText={onChange}
              value={value}
              inputMode={inputMode}
            />
          </LinearGradient>
        </View>
        {error && <Text style={styles.errorText}>{error?.message}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  gradient: {
    borderWidth: 1,
    borderRadius: 10,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    fontSize: 16,
  },
  errorText: {
    color: "#EC2700",
    marginTop: 8,
    fontSize: 14,
  },
});

export default AnimatedInput;
