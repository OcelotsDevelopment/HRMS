import { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";

type User = {
  id: number;
  name?: string;
  email: string;
  [key: string]: unknown;
};

type DecodedToken = {
  id: number;
  name?: string;
  email: string;
  exp: number; // ✅ include the expiry timestamp
  iat?: number;
};

export function useAuth() {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("auth_token")
  );
  const [user, setUser] = useState<User | null>(() => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  });

  const isAuthenticated = !!token;

  const decodeToken = (token: string): DecodedToken | null => {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (err) {
      console.error("Invalid token:", err);
      return null;
    }
  };

  const login = useCallback((jwtToken: string, userObj: User) => {
    localStorage.setItem("auth_token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userObj));
    setToken(jwtToken);
    setUser(userObj);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  // Optional: auto-logout if token expires
  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);
      if (decoded?.exp) {
        const exp = decoded.exp * 1000;
        if (Date.now() >= exp) {
          console.warn("Token expired. Logging out.");
          logout();
        }
      }
    }
  }, [token, logout]);

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("auth_token");
      const userStr = localStorage.getItem("user");
      const parsedUser = userStr ? JSON.parse(userStr) : null;
  
      setToken(token);
      setUser(parsedUser);
    };
  
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  

  return { token, user, isAuthenticated, login, logout };
}
