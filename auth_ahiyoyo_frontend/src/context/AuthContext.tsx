"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { login, getProfile, logout, register } from "../lib/api";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface Credentials {
  email: string;
  password: string;
}

interface RegisterData extends Credentials {
  firstName: string;
  lastName: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loginUser: (credentials: Credentials) => Promise<void>;
  registerUser: (userData: RegisterData) => Promise<void>;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getProfile();
        setUser(data);
      } catch {
        logoutUser();
      }
    };

    if (Cookies.get("token")) {
      fetchProfile();
    }
  }, []);

  const loginUser = async (credentials: Credentials) => {
    const { data } = await login(credentials);
    Cookies.set("token", data.token, { expires: 7 });
    setUser(data.user);
  };

  const registerUser = async (userData: RegisterData) => {
    await register(userData);
  };

  const logoutUser = () => {
    logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loginUser, registerUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
