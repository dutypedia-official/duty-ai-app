import he from "he";

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
      return he.decode(match[1]);
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
};
