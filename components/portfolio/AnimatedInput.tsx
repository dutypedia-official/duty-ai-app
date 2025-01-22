import React, { useState, useEffect, useRef } from "react";
import { View, TextInput, Text, Animated, StyleSheet } from "react-native";
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
}: any) => {
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
    outputRange: isDark ? ["#292A36", "#252531"] : ["#FCFCFC", "#EDEDED"],
  });

  const endColor = labelPosition.interpolate({
    inputRange: [0, 1],
    outputRange: isDark ? ["#292A36", "#292A36"] : ["#FCFCFC", "#FCFCFC"],
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
        <LinearGradient
          colors={isDark ? ["#292A36", "#292A36"] : ["#FFFFFF", "#F7F7F7"]}
          style={[
            styles.gradient,
            { borderColor: isDark ? "#3C3C47" : "#CCCCCC" },
            error && { borderColor: "#EC2700" },
          ]}>
          <TextInput
            style={[styles.input, { color: isDark ? "#fff" : "#000" }]}
            placeholder={!isFocused ? "" : placeholder}
            keyboardType={keyboardType}
            onBlur={() => {
              onBlur?.();
              setIsFocused(false);
            }}
            onFocus={() => setIsFocused(true)}
            onChangeText={onChange}
            value={value}
          />
        </LinearGradient>
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
