import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  useColorScheme,
  Image,
} from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SvgXml } from "react-native-svg";
import { lowBg, lowBgLight } from "./svgs/lowBg";
import { BlurView } from "expo-blur";

export default function LowBalance({ open, setOpen }: any) {
  const colorscheme = useColorScheme();
  const isDark = colorscheme === "dark";
  return (
    <Modal
      visible={open}
      animationType="fade"
      transparent={true}
      statusBarTranslucent={true}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignContent: "center",
          // backgroundColor: isDark
          //   ? "rgba(26,26,26,0.6)"
          //   : "rgba(255,255,255,0.6)",
        }}>
        <BlurView
          intensity={16}
          style={{
            pointerEvents: "none",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
        {/* <SvgXml
          xml={isDark ? lowBg : lowBgLight}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
          }}
        /> */}
        <View
          style={{
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 12,
            borderWidth: 1,
            borderColor: isDark ? "transparent" : "#EDEDED",
            marginHorizontal: 12,
            borderRadius: 24,
          }}>
          <LinearGradient
            colors={isDark ? ["#1A1A1A", "#2A2A2A"] : ["#FFFFFF", "#FFFFFF"]}
            style={{
              padding: 32,
              alignItems: "center",
              gap: 32,
              borderRadius: 24,
            }}>
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 19,
                right: 19,
              }}
              onPress={() => {
                setOpen(false);
              }}>
              <AntDesign
                name="close"
                size={24}
                color={isDark ? "white" : "#ccc"}
              />
            </TouchableOpacity>
            <View style={{}}>
              <Image
                source={
                  isDark
                    ? require("@/assets/images/error_dark.png")
                    : require("@/assets/images/error_light.png")
                }
              />
            </View>
            <View
              style={{
                gap: 13,
              }}>
              <Text
                style={{
                  color: isDark ? "#fff" : "#333333",
                  fontSize: 24,
                  fontWeight: "bold",
                  textAlign: "center",
                }}>
                Low Balance
              </Text>
              <Text
                style={{
                  color: isDark ? "#fff" : "#666666",
                  fontSize: 16,
                  textAlign: "center",
                }}>
                Please recharge to continue seamlessly.
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setOpen(true)}
              style={{
                width: "100%",
                borderRadius: 12,
              }}>
              <LinearGradient
                colors={["#FF8C00", "#FFD700"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  paddingVertical: 16,
                  width: "100%",
                  borderRadius: 12,
                  alignItems: "center",
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: isDark ? "#FFFFFF" : "#FFFFFF",
                  }}>
                  Recharge Now
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}
