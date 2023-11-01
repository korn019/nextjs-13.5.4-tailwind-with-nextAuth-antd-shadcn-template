import axios from "axios";
import { getSession } from "next-auth/react";

const BaseUrl = process.env.NEXT_PUBLIC_API_BaseUrl;

export const httpClient = axios.create({
  baseURL: BaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "x-auth-secret": process.env.NEXTAUTH_SECRET || "",
  },
});

httpClient.interceptors.request.use(
  async (config) => {
    // const { data: session, status } = useSession();
    const session = await getSession();
    if (session?.accessToken) {
      config.headers["Authorization"] = `Bearer ${session?.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const setApiToken = (token: string) => {
  httpClient.defaults.headers.common["authorization"] = `Bearer ${token}`;
};

export const getData = async <T>(url: string, token?: string) => {
  const res = await httpClient
    .get(`${BaseUrl}/${url}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return res;
};

export const postData = async (url: string, post: any, token?: string) => {
  const res = await httpClient
    .post(`${BaseUrl}/${url}`, post, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });

  return res;
};

export const putData = async (url: string, put: any, token?: string) => {
  const res = await httpClient
    .put(`${BaseUrl}/${url}`, put, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return res;
};

export const patchData = async (url: string, patch: any, token?: string) => {
  const res = await httpClient
    .patch(`${BaseUrl}/${url}`, patch, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return res;
};
export const deleteData = async (url: string, token?: string) => {
  const res = await httpClient
    .delete(`${BaseUrl}/${url}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
  return res;
};
