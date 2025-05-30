"use client";

import Loading from "@/app/loading";
import { getToken } from "@/lib/verifyToken";
import { deleteCookie } from "@/services/AuthService";
import { getMe } from "@/services/UserService";
import { TUser } from "@/types";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type AppContextType = {
  user: TUser | null;
  setUser: (user: TUser | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  logout: () => void;
  setToken: Dispatch<SetStateAction<string | null>>;
};


export const AppContext = createContext<AppContextType | undefined>(undefined);

const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<TUser | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      const token = await getToken();
      if (token) {
        setToken(token);

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          const res = await getMe();
          if (res?.success) {
            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
          }
        }
      } else {
        setUser(null);
        setToken(null);
      }

      setIsLoading(false);
    };

    initialize();
  }, []);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    deleteCookie();
  };

  if (isLoading) return <Loading />;

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        setIsLoading,
        logout,
        setToken,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default ContextProvider;

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within ContextProvider");
  return context;
};
