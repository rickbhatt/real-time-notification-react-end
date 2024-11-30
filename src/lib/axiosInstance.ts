import axios from "axios";

export const baseURL = "http://127.0.0.1:8000/api/v2";

export const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 60 * 10000,
  withCredentials: true,
});
