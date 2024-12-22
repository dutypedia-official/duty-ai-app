import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useThemeColor } from "../Themed";

const TypingAnimation = () => {
  const dot1Opacity = useRef(new Animated.Value(0)).current;
  const dot2Opacity = useRef(new Animated.Value(0)).current;
  const dot3Opacity = useRef(new Animated.Value(0)).current;
  const textColor = useThemeColor({}, "text");

  useEffect(() => {
    const animateDots = () => {
      Animated.sequence([
        Animated.timing(dot1Opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(dot2Opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(dot3Opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(dot1Opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(dot2Opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(dot3Opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => animateDots()); // Loop the animation
    };

    animateDots();
  }, [dot1Opacity, dot2Opacity, dot3Opacity]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          {
            marginHorizontal: 2,
            backgroundColor: textColor,
            width: 8,
            height: 8,
            borderRadius: 50,
          },
          { opacity: dot1Opacity },
        ]}
      ></Animated.View>
      <Animated.View
        style={[
          {
            marginHorizontal: 2,
            backgroundColor: textColor,
            width: 8,
            height: 8,
            borderRadius: 50,
          },
          { opacity: dot2Opacity },
        ]}
      ></Animated.View>
      <Animated.View
        style={[
          {
            marginHorizontal: 2,
            backgroundColor: textColor,
            width: 8,
            height: 8,
            borderRadius: 50,
          },
          { opacity: dot3Opacity },
        ]}
      ></Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
});

export default TypingAnimation;
