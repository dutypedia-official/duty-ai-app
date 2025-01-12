import axios from "axios";
import Constants from "expo-constants";

export const isServerAvailable = async (url: string) => {
  try {
    await axios.get(`${url}/health`);
    return true; // Server is up
  } catch (error) {
    console.log(url, "Server is down");

    return false; // Server is down
  }
};

export const MAIN_SERVER_URL = "https://api.dutyai.app";
export const BACKUP_SERVER_URL = "https://api-backup.dutyai.app";

export const apiClient = () => {
  const isRunningInExpoGo = Constants.appOwnership === "expo";
  const BASE_URL = isRunningInExpoGo
    ? "http://192.168.0.101:8000"
    : `https://api.dutyai.app`;
  const addBaseUrl = (url: string, mainServer: boolean) =>
    mainServer ? `${BASE_URL}${url}` : `${BACKUP_SERVER_URL}${url}`;

  console.log("BASE_URL-------", BASE_URL);
  return {
    get: (
      url: string,
      token: any = null,
      options = {},
      mainServer: boolean = true
    ) =>
      axios.get(addBaseUrl(url, mainServer), {
        ...{
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
        ...options,
      }),
    post: (
      url: string,
      data: any,
      token: any = null,
      options = {},
      mainServer: boolean = true
    ) =>
      axios.post(addBaseUrl(url, mainServer), data, {
        ...{
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
        ...options,
      }),
    put: (
      url: string,
      data: any,
      token: any = null,
      options = {},
      mainServer: boolean = true
    ) =>
      axios.put(addBaseUrl(url, mainServer), data, {
        ...{
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
        ...options,
      }),
    delete: (
      url: string,
      token: any = null,
      options = {},
      mainServer: boolean = true
    ) =>
      axios.delete(addBaseUrl(url, mainServer), {
        ...{
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
        ...options,
      }),
  };
};
