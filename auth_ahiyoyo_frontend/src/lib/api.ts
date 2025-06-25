import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = "https://appi.auth.ahiyoyo.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface Credentials {
  email: string;
  password: string;
}

interface RegisterData extends Credentials {
  firstName: string;
  lastName: string;
  phone: string;
}

interface EmailConfirmationData {
  email: string;
  code: string;
}

interface PhoneConfirmationData {
  phone: string;
  code: string;
}

export const register = async (userData: RegisterData) =>
  api.post("/auth/register", userData);

export const login = async (credentials: Credentials) =>
  api.post("/auth/login", credentials);

export const getProfile = async () => api.get("/profile/me");

export const logout = () => Cookies.remove("token");

export const verifyEmail = async (email: string) =>
  api.post("/email/verify", { email });

export const confirmEmail = async (data: EmailConfirmationData) =>
  api.post("/email/confirm", data);

export const verifyPhone = async (phone: string) =>
  api.post("/phone/verify", { phone });

export const confirmPhone = async (data: PhoneConfirmationData) =>
  api.post("/phone/confirm", data);

export const uploadIdentity = async (formData: FormData) =>
  api.post("/upload/identity", formData);
