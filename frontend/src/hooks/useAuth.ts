import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  // Add more fields based on your user schema
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (err) {
        console.error("Failed to parse user from localStorage", err);
      }
    }
  }, []);

  const login = (user: User, token: string) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    setUser(user);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return { user, token, login, logout, isAuthenticated: !!user && !!token };
}
