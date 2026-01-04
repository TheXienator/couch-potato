import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useLogin, useSignup, useLogout, useMe } from '../api/hooks/auth';
import { setAuthToken } from '../api/client';

interface AuthContextType {
  isAuthenticated: boolean;
  user: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  const loginMutation = useLogin();
  const signupMutation = useSignup();
  const logoutMutation = useLogout();

  // Try to restore session on mount (only runs once with enabled: false initially)
  const { data: meData, isLoading: meLoading } = useMe(false);

  useEffect(() => {
    if (meData?.user) {
      setUser(meData.user.email);
      setIsAuthenticated(true);
    }
  }, [meData]);

  const login = async (email: string, password: string) => {
    const data = await loginMutation.mutateAsync({ email, password });
    setAuthToken(data.accessToken);
    setUser(data.user.email);
    setIsAuthenticated(true);
  };

  const signup = async (email: string, password: string) => {
    const data = await signupMutation.mutateAsync({ email, password });
    setAuthToken(data.accessToken);
    setUser(data.user.email);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        signup,
        logout,
        isLoading: meLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
