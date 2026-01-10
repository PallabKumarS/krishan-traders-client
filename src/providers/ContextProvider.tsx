/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Loading from "@/app/loading";
import { getToken } from "@/lib/verifyToken";
import { deleteCookie } from "@/services/AuthService";
import { getMe } from "@/services/UserService";
import { TUser } from "@/types";
import { jwtDecode } from "jwt-decode";
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
	refreshUser: () => Promise<void>;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

const ContextProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<TUser | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const refreshUser = async () => {
		setIsLoading(true);
		try {
			const currentToken = await getToken();

			if (currentToken) {
				setToken(currentToken);

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
				localStorage.removeItem("user");
			}
		} catch (error: any) {
			setUser(null);
			setToken(null);
			localStorage.removeItem("user");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		refreshUser();
	}, []);

	// Listen for storage changes (when user logs in from another tab)
	useEffect(() => {
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === "user") {
				refreshUser();
			}
		};

		window.addEventListener("storage", handleStorageChange);

		return () => {
			window.removeEventListener("storage", handleStorageChange);
		};
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
				refreshUser,
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

export const useUser = () => {
	const { user, setUser } = useAppContext();
	const [isLoading, setIsLoading] = useState(false);

	const fetchUser = async () => {
		try {
			setIsLoading(true);

			// First check if token exists
			const token = await getToken();
			if (!token) {
				return null;
			}

			// If user already exists, return it
			if (user) {
				return user;
			}

			// Check localStorage first
			const storedUser = localStorage.getItem("user");
			if (storedUser) {
				const parsedUser = JSON.parse(storedUser);
				setUser(parsedUser);
				return parsedUser;
			}

			// Fetch user from API
			const res = await getMe();
			if (res?.success) {
				setUser(res.data);
				localStorage.setItem("user", JSON.stringify(res.data));
				return res.data;
			}

			return null;
		} catch (error: any) {
			return null;
		} finally {
			setIsLoading(false);
		}
	};

	return {
		user,
		fetchUser,
		isLoading,
	};
};
