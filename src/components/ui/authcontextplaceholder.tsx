// components/AuthContextPlaceholder.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "user";
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data untuk testing
const MOCK_USERS: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@example.com",
    role: "admin",
  },
  {
    id: "2",
    username: "user",
    email: "user@example.com",
    role: "user",
  },
];

export function AuthProviderPlaceholder({
  children,
  initialAuth = false,
  simulateLoading = true,
}: {
  children: ReactNode;
  initialAuth?: boolean;
  simulateLoading?: boolean;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth);
  const [user, setUser] = useState<User | null>(
    initialAuth ? MOCK_USERS[0] : null
  );
  const [isLoading, setIsLoading] = useState(simulateLoading);

  // Simulate initial loading
  useEffect(() => {
    if (simulateLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [simulateLoading]);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    console.log("🔐 AuthContext Placeholder: Attempting login...", {
      username,
      password: "***",
    });

    // Simulate API delay
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simple mock validation
    const foundUser = MOCK_USERS.find((u) => u.username === username);

    if (foundUser && (password === "password" || password === "123456")) {
      setIsAuthenticated(true);
      setUser(foundUser);
      setIsLoading(false);
      console.log("✅ Login successful:", foundUser);
      return true;
    } else {
      setIsLoading(false);
      console.log("❌ Login failed: Invalid credentials");
      return false;
    }
  };

  const logout = () => {
    console.log("🚪 AuthContext Placeholder: Logging out...");
    setIsAuthenticated(false);
    setUser(null);
    console.log("✅ Logout successful");
  };

  const register = async (
    username: string,
    email: string
  ): Promise<boolean> => {
    console.log("📝 AuthContext Placeholder: Attempting registration...", {
      username,
      email,
      password: "***",
    });

    // Simulate API delay
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Check if user already exists
    const existingUser = MOCK_USERS.find(
      (u) => u.username === username || u.email === email
    );

    if (existingUser) {
      setIsLoading(false);
      console.log("❌ Registration failed: User already exists");
      return false;
    }

    // Create new user
    const newUser: User = {
      id: String(MOCK_USERS.length + 1),
      username,
      email,
      role: "user",
    };

    MOCK_USERS.push(newUser);
    setIsAuthenticated(true);
    setUser(newUser);
    setIsLoading(false);
    console.log("✅ Registration successful:", newUser);
    return true;
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuth must be used within an AuthProvider or AuthProviderPlaceholder"
    );
  }
  return context;
}

// Hook khusus untuk checking role
export function useAuthRole() {
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";

  return { isAdmin, isUser, role: user?.role };
}

// Komponen helper untuk conditional rendering
export function RequireAuth({
  children,
  fallback = <div>Please log in to access this content</div>,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <>{fallback}</>;
}

export function RequireRole({
  role,
  children,
  fallback = <div>You dont have permission to access this content</div>,
}: {
  role: "admin" | "user";
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return user?.role === role ? <>{children}</> : <>{fallback}</>;
}
