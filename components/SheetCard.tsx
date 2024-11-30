import {
  View,
  Text,
  Keyboard,
  useColorScheme,
  Animated,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Easing,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useUi from "@/lib/hooks/useUi";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import MagicIcon from "./svgs/magic";
import MagicInactiveDark from "./svgs/magicInactiveDark";
import MagicInactiveLight from "./svgs/magicInactiveLight";
import { router, usePathname } from "expo-router";
import { Portal } from "react-native-paper";

export default function SheetCard({
  bottomSheetRef,
  currentAlarm,
  setActiveTab,
  activeTab,
  textColor,
  targetPrice,
  setTargetPrice,
  inputText,
  currentAiAlerm,
  setInputText,
  error,
  handelSetAlerm,
  loading,
  loadingDeleteAlarm,
  loadingAiAlarm,
  loadingDeleteAiAlarm,
  handelDeleteAlerm,
  handelSetAiAlerm,
  handelDeleteAiAlerm,
}: {
  bottomSheetRef: any;
  currentAlarm: any;
  setActiveTab: any;
  activeTab: any;
  textColor: any;
  targetPrice: any;
  setTargetPrice: any;
  inputText: any;
  currentAiAlerm: any;
  setInputText: any;
  error: any;
  handelSetAlerm: () => void;
  loading: any;
  loadingDeleteAlarm: any;
  loadingAiAlarm: any;
  loadingDeleteAiAlarm: any;
  handelDeleteAlerm: () => void;
  handelSetAiAlerm: () => void;
  handelDeleteAiAlerm: () => void;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { setHideTabNav } = useUi();
  const insets = useSafeAreaInsets();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false); // Track keyboard visibility
  const buttonOpacity = useRef(new Animated.Value(1)).current; // Animated value for opacity

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardVisible(true);
        // Fade out the button when keyboard is visible
        Animated.timing(buttonOpacity, {
          toValue: 0,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start();
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardVisible(false);
        // Fade in the button when keyboard is hidden
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Snap points for the bottom sheet
  const snapPoints = useMemo(() => ["70%"], []);

  const renderBackdrop = (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1} // Disappears when fully collapsed
      appearsOnIndex={0} // Appears when opened
      opacity={isDark ? 0.6 : 0.3} // Set the backdrop opacity
    />
  );

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log(index);

    if (index === -1) {
      // Dismiss the keyboard
      Keyboard.dismiss();
      // Update the tab navigation visibility
      // setHideTabNav(false);
    } else if (index === 0) {
      // setHideTabNav(true);
    }
  }, []);

  // useEffect(() => {
  //   setHideTabNav(false);
  //   console.log(router);
  // }, [router]);

  return (
    <Portal>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        onChange={handleSheetChanges}
        keyboardBehavior="interactive"
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: "transparent" }}
        backdropComponent={renderBackdrop}
        handleComponent={(props) => <View style={{ display: "none" }}></View>}
        // onClose={Keyboard.dismiss}
        style={{
          backgroundColor: "transparent",
        }}
        android_keyboardInputMode="adjustResize"
        animateOnMount={true}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              flex: 1,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              backgroundColor: isDark ? "#3A3A3C" : "#4197E5",
              paddingTop: 1,
            }}>
            <LinearGradient
              colors={isDark ? ["#1C1C1E", "#2A2A2D"] : ["#FFFFFF", "#F3F4F6"]}
              style={{
                flex: 1,
                borderTopLeftRadius: 28,
                borderTopRightRadius: 28,
                paddingTop: 1,
                borderTopWidth: 1,
                borderTopColor: isDark ? "#3A3A3C" : "#CFCFCF",
              }}>
              {/* close button */}
              <View
                style={{
                  backgroundColor: "transparent",
                  paddingHorizontal: 14,
                  paddingVertical: 14,
                }}>
                <TouchableOpacity
                  onPress={() => bottomSheetRef.current?.close()}
                  style={{
                    position: "relative",
                    alignSelf: "flex-end",
                    backgroundColor: "transparent",
                  }}>
                  <AntDesign
                    name="close"
                    size={20}
                    color={isDark ? "white" : "black"}
                  />
                </TouchableOpacity>
              </View>

              {/* tabs */}
              <View
                style={{
                  backgroundColor: "transparent",
                  paddingHorizontal: 14,
                }}>
                <View
                  style={{
                    backgroundColor: "transparent",
                    flexDirection: "row",
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setActiveTab("priceAlarm");
                    }}
                    style={{
                      backgroundColor: isDark
                        ? activeTab === "priceAlarm"
                          ? "#245254"
                          : "#2A2A2D"
                        : activeTab === "priceAlarm"
                        ? "#D6F7F9"
                        : "#E0E0E0",
                      padding: 12,
                      borderTopLeftRadius: 12,
                      borderBottomLeftRadius: 12,
                      width: "50%",
                    }}>
                    <Text
                      style={{
                        color: isDark
                          ? activeTab === "priceAlarm"
                            ? "#FFFFFF"
                            : "#D1D1D1"
                          : activeTab === "priceAlarm"
                          ? "#00796B"
                          : "#757575",
                        fontWeight: "bold",
                        fontSize: 16,
                        textAlign: "center",
                      }}>
                      Price alarm
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setActiveTab("aiAlarm");
                    }}
                    style={{
                      backgroundColor: isDark
                        ? activeTab === "aiAlarm"
                          ? "#245254"
                          : "#2A2A2D"
                        : activeTab === "aiAlarm"
                        ? "#D6F7F9"
                        : "#E0E0E0",
                      padding: 12,
                      borderTopRightRadius: 12,
                      borderBottomRightRadius: 12,
                      width: "50%",
                      alignItems: "center",
                      justifyContent: "center",
                      alignContent: "center",
                    }}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "transparent",
                        justifyContent: "center",
                        alignContent: "center",
                      }}>
                      <View
                        style={{
                          backgroundColor: "transparent",
                          width: 20,
                          height: 20,
                          justifyContent: "center",
                          alignContent: "center",
                          marginRight: 5,
                        }}>
                        {activeTab === "aiAlarm" ? (
                          <MagicIcon />
                        ) : isDark ? (
                          <MagicInactiveDark />
                        ) : (
                          <MagicInactiveLight />
                        )}
                      </View>
                      <View
                        style={{
                          backgroundColor: "transparent",
                          justifyContent: "center",
                          alignContent: "center",
                          marginTop: -1,
                        }}>
                        <Text
                          style={{
                            color: isDark
                              ? activeTab === "aiAlarm"
                                ? "#FFFFFF"
                                : "#D1D1D1"
                              : activeTab === "aiAlarm"
                              ? "#00796B"
                              : "#757575",
                            fontWeight: "bold",
                            fontSize: 16,
                            textAlign: "center",
                            justifyContent: "center",
                            alignContent: "center",
                          }}>
                          Ai alarm
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {/* content */}
              <View
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  flex: 1,
                  backgroundColor: "transparent",
                  marginTop: 28, //40 top to tabs
                }}>
                <BottomSheetScrollView
                  contentContainerStyle={{
                    backgroundColor: "transparent",
                  }}>
                  <View
                    style={{
                      backgroundColor: "transparent",
                    }}>
                    {activeTab === "priceAlarm" && (
                      <View
                        style={{
                          backgroundColor: "transparent",
                          gap: 12,
                        }}>
                        <Text
                          style={{
                            color: isDark ? "#F5F5F5" : "#424242",
                            fontSize: 16,
                            fontWeight: "600",
                          }}>
                          Enter Price
                          {currentAlarm?.price}
                        </Text>
                        <View
                          style={{
                            borderWidth: 1,
                            backgroundColor: isDark ? "#2C2C2E" : "#FFFFFF",
                            borderRadius: 8,
                            borderColor: isDark ? "#3A3A3C" : "#D1D1D1",
                          }}>
                          <TextInput
                            maxLength={8}
                            style={{
                              paddingVertical: 12,
                              paddingHorizontal: 12,
                              textAlign: "center",
                              color: textColor,
                              fontSize: 16,
                            }}
                            placeholder="00:00"
                            placeholderTextColor="#888"
                            value={
                              targetPrice || `${currentAlarm?.price || ""}`
                            }
                            onChangeText={(text) =>
                              setTargetPrice(text.replace(/[^0-9.]/g, ""))
                            }
                            keyboardType="numeric"
                            editable={currentAlarm ? false : true}
                          />
                        </View>
                      </View>
                    )}

                    {activeTab === "aiAlarm" && (
                      <View
                        style={{
                          backgroundColor: "transparent",
                          gap: 12,
                        }}>
                        <Text
                          style={{
                            color: isDark ? "#F5F5F5" : "#424242",
                            fontSize: 16,
                            fontWeight: "600",
                          }}>
                          Type your Instruction
                        </Text>
                        <View
                          style={{
                            borderWidth: 1,
                            backgroundColor: isDark ? "#2C2C2E" : "#FFFFFF",
                            borderRadius: 8,
                            borderColor: isDark ? "#3A3A3C" : "#D1D1D1",
                          }}>
                          <TextInput
                            multiline
                            maxLength={120}
                            style={{
                              paddingVertical: 12,
                              paddingHorizontal: 12,
                              textAlignVertical: "top",
                              textAlign: "left",
                              color: textColor,
                              minHeight: 80,
                              maxHeight: 100,
                              fontSize: 16,
                            }}
                            placeholder="If market go 50% above the moving avarage give em signal also if this stock perform so goodthen  give em signal"
                            placeholderTextColor="#888"
                            value={
                              inputText || `${currentAiAlerm?.prompt || ""}`
                            }
                            onChangeText={setInputText}
                            editable={currentAiAlerm ? false : true}
                            returnKeyType="send"
                          />
                        </View>

                        {error && (
                          <Text
                            style={{
                              color: "#CE1300",
                              fontSize: 14,
                            }}>
                            {error}
                          </Text>
                        )}

                        <Text
                          style={{
                            fontSize: 14,
                            color: isDark ? "#D1D1D1" : "#595959",
                          }}>
                          Kindly provide clear, stock-related instructions{" "}
                          <Text
                            style={{
                              color:
                                inputText.length === 120
                                  ? "#CE1300"
                                  : isDark
                                  ? "#D1D1D1"
                                  : "#595959",
                            }}>
                            within 120 characters
                          </Text>
                          . The AI will monitor your stock continuously and
                          notify you once your specified condition is met.
                          Ensure your instructions focus exclusively on
                          stock-related events to receive accurate and timely
                          alerts.
                        </Text>
                      </View>
                    )}
                  </View>
                </BottomSheetScrollView>
              </View>

              {/* bottom actions */}
              {activeTab === "priceAlarm" && (
                <View
                  style={{
                    paddingHorizontal: 14,
                    paddingBottom: insets.bottom + 14,
                    backgroundColor: "transparent",
                  }}>
                  <Animated.View
                    style={{
                      opacity: buttonOpacity,
                      display: isKeyboardVisible ? "none" : "flex", // Hide when keyboard is visible
                      backgroundColor: "transparent",
                      gap: 12,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        handelSetAlerm();
                      }}
                      disabled={targetPrice.trim() === "" || currentAlarm}
                      style={{
                        opacity:
                          targetPrice.trim() !== "" && !currentAlarm ? 1 : 0.5,
                      }}>
                      <LinearGradient
                        colors={
                          isDark
                            ? ["#6C63FF", "#3D4DB7"]
                            : ["#64B5F6", "#1976D2"]
                        }
                        style={{
                          paddingHorizontal: 4,
                          paddingVertical: 16,
                          borderRadius: 12,
                        }}>
                        {loading && (
                          <ActivityIndicator
                            size="small"
                            color="#FFFFFF"
                            style={{ marginRight: 5 }}
                          />
                        )}
                        {!loading && (
                          <Text
                            style={{
                              color: "#FFFFFF",
                              fontWeight: "bold",
                              fontSize: 16,
                              textAlign: "center",
                              height: 19,
                            }}>
                            Set alarm
                          </Text>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                    {currentAlarm && (
                      <TouchableOpacity
                        onPress={() => {
                          handelDeleteAlerm();
                        }}>
                        <LinearGradient
                          colors={
                            isDark
                              ? ["#D64B4B", "#8F2B2B"]
                              : ["#EF9A9A", "#D32F2F"]
                          }
                          style={{
                            paddingHorizontal: 4,
                            paddingVertical: 16,
                            borderRadius: 12,
                          }}>
                          {loadingDeleteAlarm && (
                            <ActivityIndicator
                              size="small"
                              color="#FFFFFF"
                              style={{ marginRight: 5 }}
                            />
                          )}
                          {!loadingDeleteAlarm && (
                            <Text
                              style={{
                                color: "#FFFFFF",
                                fontWeight: "bold",
                                fontSize: 16,
                                textAlign: "center",
                                height: 19,
                              }}>
                              Delete alarm
                            </Text>
                          )}
                        </LinearGradient>
                      </TouchableOpacity>
                    )}
                  </Animated.View>
                  {/* )} */}
                </View>
              )}
              {activeTab === "aiAlarm" && (
                <View
                  style={{
                    paddingHorizontal: 14,
                    paddingBottom: insets.bottom + 14,
                    backgroundColor: "transparent",
                  }}>
                  <Animated.View
                    style={{
                      opacity: buttonOpacity,
                      display: isKeyboardVisible ? "none" : "flex", // Hide when keyboard is visible
                      backgroundColor: "transparent",
                      gap: 12,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        handelSetAiAlerm();
                      }}
                      disabled={
                        inputText?.length === 0 || currentAiAlerm ? true : false
                      }
                      style={{
                        opacity:
                          inputText?.length > 0 && !currentAiAlerm ? 1 : 0.5,
                      }}>
                      <LinearGradient
                        colors={
                          isDark
                            ? ["#6C63FF", "#3D4DB7"]
                            : ["#64B5F6", "#1976D2"]
                        }
                        style={{
                          paddingHorizontal: 4,
                          paddingVertical: 16,
                          borderRadius: 12,
                        }}>
                        {loadingAiAlarm && (
                          <ActivityIndicator
                            size="small"
                            color="#FFFFFF"
                            style={{ marginRight: 5 }}
                          />
                        )}
                        {!loadingAiAlarm && (
                          <Text
                            style={{
                              color: "#FFFFFF",
                              fontWeight: "bold",
                              fontSize: 16,
                              textAlign: "center",
                              height: 19,
                            }}>
                            Set alarm
                          </Text>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>

                    {currentAiAlerm && (
                      <TouchableOpacity
                        onPress={() => {
                          handelDeleteAiAlerm();
                        }}>
                        <LinearGradient
                          colors={
                            isDark
                              ? ["#D64B4B", "#8F2B2B"]
                              : ["#EF9A9A", "#D32F2F"]
                          }
                          style={{
                            paddingHorizontal: 4,
                            paddingVertical: 16,
                            borderRadius: 12,
                          }}>
                          {loadingDeleteAiAlarm && (
                            <ActivityIndicator
                              size="small"
                              color="#FFFFFF"
                              style={{ marginRight: 5 }}
                            />
                          )}
                          {!loadingDeleteAiAlarm && (
                            <Text
                              style={{
                                color: "#FFFFFF",
                                fontWeight: "bold",
                                fontSize: 16,
                                textAlign: "center",
                                height: 19,
                              }}>
                              Delete alarm
                            </Text>
                          )}
                        </LinearGradient>
                      </TouchableOpacity>
                    )}
                  </Animated.View>
                </View>
              )}
            </LinearGradient>
          </View>
        </TouchableWithoutFeedback>
      </BottomSheet>
    </Portal>
  );
}
