import Toast from "react-native-toast-message";

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
