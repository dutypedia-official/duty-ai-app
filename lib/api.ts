import axios from "axios";

const BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}`;

export const apiClient = () => {
  const addBaseUrl = (url: string) => `${BASE_URL}${url}`;

  return {
    get: (url: string, token: any = null, options = {}) =>
      axios.get(addBaseUrl(url), {
        ...{
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
        ...options,
      }),
    post: (url: string, data: any, token: any = null, options = {}) =>
      axios.post(addBaseUrl(url), data, {
        ...{
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
        ...options,
      }),
    put: (url: string, data: any, token: any = null, options = {}) =>
      axios.put(addBaseUrl(url), data, {
        ...{
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
        ...options,
      }),
    delete: (url: string, token: any = null, options = {}) =>
      axios.delete(addBaseUrl(url), {
        ...{
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
        ...options,
      }),
  };
};
