import React from "react";
import { WebView } from "react-native-webview";
import { View, StyleSheet, Text } from "react-native";

export const DSEChart = () => {
  const injectedJavaScript = `
    document.body.innerHTML = document.getElementById('graphdiv2').outerHTML;
    document.getElementById('graphdiv2').style.width = '100%';
    document.getElementById('graphdiv2').style.height = '100vh';
    true; 
  `;

  return (
    <View style={styles.container}>
      <Text>Chart</Text>
      <WebView
        source={{ uri: "https://dsebd.org" }}
        injectedJavaScript={injectedJavaScript}
        style={styles.webview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
