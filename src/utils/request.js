import axios from "axios";
import { hasToken, getToken } from "./token";

const baseUrl = "http://localhost:8080/api/";

const request = axios.create({
  baseUrl,
  timeout: 5000,
});

request.interceptors.request.use(
  (config) => {
    if (hasToken()) {
      config.headers.Authorization = `Bearer: ${getToken()}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default request;
