import Toast from "react-native-toast-message";
import useLang from "./hooks/useLang";
import { Audio } from "expo-av";

export async function fetchWithTimeout(url: string, options: any = {}) {
  const { timeout = 5000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(url, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);

  return response;
}

export function containsNonEnglish(text: string) {
  if (!text) return false;
  for (let i = 0; i < text.length; i++) {
    if (text.charCodeAt(i) > 127) {
      return true;
    }
  }
  return false;
}

export async function getClassify(query: string) {
  try {
    if (query.length > 100) {
      return "general";
    }

    const url = "http://158.220.101.235/sp/classify";
    const payload = JSON.stringify({
      text: query,
    });

    const headers = {
      "Content-Type": "application/json",
    };

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: payload,
    });

    const json_data = await response.json();
    const tag = json_data.tag;
    return tag;
  } catch (error) {
    console.error(error);
    return "general";
  }
}

export const translate = async (text: string, targetLang: string = "bn") => {
  const sourceLanguage = "auto";
  const timeout = 5000;

  try {
    const escapedText = encodeURIComponent(text);
    const url = `https://translate.google.com/m?tl=${targetLang}&sl=${sourceLanguage}&q=${escapedText}`;
    const response = await fetch(url);
    const result = await response.text();
    const pattern = /class="(?:t0|result-container)">(.*?)</s;
    const match = result.match(pattern);
    if (match && match[1]) {
      return null;
      // return he.decode(match[1]);
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const duckSearch = async (query: string) => {
  try {
    const apiUrl = "https://html.duckduckgo.com/html";
    const params: any = {
      q: `${query}`,
      kl: "us-en",
      ex: "-2",
    };

    const queryString = Object.keys(params)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      )
      .join("&");

    const urlWithParams = `${apiUrl}?${queryString}`;

    const headers = new Headers({
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
    });

    const res = await fetchWithTimeout(urlWithParams, {
      method: "GET",
      headers: headers,
    });
    const html = await res.text();

    return html;
  } catch (error) {
    console.log(error);
    Toast.show({
      type: "info",
      text1: "Warning",
      text2: "Can't connect to internet!",
    });
    return "";
  }
};

export const slugify = (title: string): string => {
  return title
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading and trailing whitespace
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with a single hyphen
};

export const calcBroFeeAmount = (
  brokerFeePercentage: string | number,
  total: string | number
): string => {
  const percentage = parseFloat(brokerFeePercentage?.toString());
  const totalAmount = parseFloat(total?.toString());

  if (isNaN(percentage) || isNaN(totalAmount)) return "0.00"; // Handle invalid inputs

  const feeAmount = totalAmount * (percentage / 100);
  const truncatedNum = Math.floor(feeAmount * 100) / 100;

  return truncatedNum?.toFixed(2); // Format to 2 decimal places
};

export const calcTotalWithFee = (
  buyAmount: string | number,
  brokerFeePercentage: string | number
): string => {
  const amount = parseFloat(buyAmount?.toString());
  const percentage = parseFloat(brokerFeePercentage?.toString());

  if (isNaN(amount) || isNaN(percentage)) return "0.00"; // Handle invalid inputs

  const feeAmount = amount * (percentage / 100); // Calculate fee
  const totalWithFee = amount + feeAmount; // Total cost including fee
  const truncatedNum = Math.floor(totalWithFee * 100) / 100;

  return truncatedNum.toFixed(2); // Return formatted value
};

export const formatFloat = (
  num: string | number,
  decimalPlaces: number = 2,
  locale: string = "en-US"
): string => {
  const parsedNum = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(parsedNum)) return "0.00";
  const truncatedNum = Math.floor(parsedNum * 100) / 100;

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(truncatedNum);
};

export const getRiskLevel = (risk: string): string => {
  const riskValue = parseFloat(risk);

  if (isNaN(riskValue)) return "NAN"; // Handle non-numeric values

  if (riskValue >= 20) return "⚠️⚠️ super high";
  if (riskValue >= 10) return "⚠️ high";
  if (riskValue >= 5) return "🟡Medium";
  return "🟢 Good";
};
export const isHighRisk = (risk: string): string => {
  const riskValue = parseFloat(risk);

  if (isNaN(riskValue)) return "false"; // Handle non-numeric values

  switch (true) {
    case riskValue >= 20:
    case riskValue >= 10:
      return "true";
    default:
      return "false";
  }
};

export const getProfitOrLoss = (total: string | number): string => {
  const { language } = useLang();
  const isBn = language === "bn";

  const totalStr = total?.toString(); // Ensure it's a string
  return totalStr?.startsWith("-")
    ? isBn
      ? "লস"
      : "Loss"
    : isBn
    ? "লাভ"
    : "Profit";
};

export const isLossItem = (total: string | number): boolean => {
  const totalStr = total?.toString();
  return totalStr?.startsWith("-") ? true : false;
};

export const isLossFn = (stockDetail?: {
  profit?: string;
  loss?: string;
}): string => {
  if (!stockDetail) return "Invalid"; // Handle undefined or null stockDetail

  const profit = parseFloat(stockDetail.profit || "0");
  const loss = parseFloat(stockDetail.loss || "0");

  if (profit === 0 && loss === 0) return "profit";
  if (profit > 0) return "profit";
  if (loss > 0) return "loss";

  return "Unknown"; // Default case
};

export const playButtonSound = async (soundFile: any) => {
  try {
    const { sound } = await Audio.Sound.createAsync(soundFile);
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (error) {
    console.log("Error playing sound:", error);
  }
};

// Function to format the length of the string
export const formatLength = (str: string) => {
  const length = str.length;

  if (length >= 1_000_000_000) {
    return `${(length / 1_000_000_000).toFixed(1)}b`; // Billions
  } else if (length >= 1_000_000) {
    return `${(length / 1_000_000).toFixed(1)}m`; // Millions
  } else if (length >= 1_000) {
    return `${(length / 1_000).toFixed(1)}k`; // Thousands
  } else {
    return length.toString(); // Less than 1000
  }
};
