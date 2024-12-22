import { Text, View } from "@/components/Themed";
import { useLocalSearchParams } from "expo-router";
import WebView from "react-native-webview";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { Alert, Dimensions, useColorScheme } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const Chart = () => {
  const { symbol } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const webViewRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hideButtonDivs = `
    document.querySelectorAll('div.layout__area--topleft').forEach(function(el) {
      el.style.display = 'none';
    });
    true; 
  `;

  // JavaScript code to remove all div elements with data-role="button"
  const removeButtonDivs = `
    document.querySelectorAll('div.layout__area--topleft').forEach(function(el) {
      el.remove();
    });
    true; 
  `;

  const hideOverlapManagerRoot = `
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.id === 'overlap-manager-root') {
            node.style.display = 'none';
            observer.disconnect();
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial check in case the element is already in the DOM
    const existingElement = document.getElementById('overlap-manager-root');
    if (existingElement) {
      existingElement.style.display = 'none';
      observer.disconnect();
    }

    true; 
  `;

  const hideOverlapManagerRootCSS = `
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = \`
      #overlap-manager-root {
        display: none !important;
      }
    \`;
    document.head.appendChild(style);
    true; 
  `;

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          width: "100%",
          height: 3,
          backgroundColor: colorScheme == "dark" ? "#2a2e39" : "#e0e3ea",
        }}
      />
      <StatusBar hidden={true} />
      {isLoading && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator />
        </View>
      )}
      <WebView
        containerStyle={{ display: isLoading ? "none" : "flex" }}
        ref={webViewRef}
        userAgent="random"
        javaScriptCanOpenWindowsAutomatically={true}
        javaScriptEnabled={true}
        useShouldOverrideUrlLoading={true}
        useOnLoadResource={true}
        cacheEnabled={true}
        sharedCookiesEnabled={true}
        onLoadEnd={() => {
          setIsLoading(false);
          // webViewRef.current?.injectJavaScript(removeButtonDivs);
          // webViewRef.current?.injectJavaScript(hideOverlapManagerRoot);
          // webViewRef.current?.injectJavaScript(hideOverlapManagerRootCSS);
        }}
        source={{
          uri: `https://www.tradingview.com/chart/?symbol=DSEBD:${symbol}&utm_source=www.tradingview.com&utm_medium=widget&utm_campaign=chart&utm_term=DSEBD:${symbol}&theme=${colorScheme}`,
        }}
      />
    </View>
  );
};

export default Chart;
