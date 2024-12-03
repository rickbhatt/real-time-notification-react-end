import {
  checkLoggedinStatusApi,
  handleLoginApi,
  handleLogoutApi,
} from "@/apis/auth";
import { createContext, ReactNode, useContext, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface LoginSuccessResponse {
  message: string;
  user: {
    id: string;
    isAdmin: boolean;
    isStaff: boolean;
    lastLoggedIn: string;
  };
}

interface LogoutSuccessResponse {
  message: string;
}

type ErrorResponseType = {
  detail: string;
};

// Union type for all possible responses
type LoginResponse = LoginSuccessResponse | ErrorResponseType;

type LogoutResponse = LogoutSuccessResponse | ErrorResponseType;

type User = {
  isAdmin: boolean;
  isStaff: boolean;
  id: string;
};

interface AuthContextType {
  isLoggedIn?: boolean | undefined;
  isLoading: boolean;
  error: Error | null;
  user: User | undefined;
  refetchAuthStatus: () => void;
  login: (
    email: string,
    password: string
  ) => Promise<AxiosResponse<LoginResponse>>;
  logout: () => Promise<AxiosResponse<LogoutSuccessResponse>>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | undefined>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const { isLoading, error, refetch } = useQuery({
    queryKey: ["loggedInStatus"],
    queryFn: async () => {
      try {
        // check logged in status

        let response = await checkLoggedinStatusApi();

        setUser(response.data.user);

        setIsLoggedIn(response.data.isLoggedIn);
        return response.data;
      } catch (error: any) {
        console.log("🚀 ~ loggedInStatus: ~ error:", error.response);
      }
    },
    refetchOnWindowFocus: true,
    retry: 4,
  });

  const refetchAuthStatus = async () => {
    await refetch();
  };

  const login = async (email: string, password: string) => {
    try {
      let response = await handleLoginApi(email, password);
      setUser(response.data.user);
      setIsLoggedIn(true);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      let response = await handleLogoutApi();

      setUser(undefined);
      setIsLoggedIn(false);
      queryClient.clear();
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        isLoading,
        error,
        refetchAuthStatus,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default AuthProvider;
