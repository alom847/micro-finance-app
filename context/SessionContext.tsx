import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  PropsWithChildren,
} from "react";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { API, GetProfile } from "../constants/api";
import Toast from "react-native-toast-message";
import { User } from "../typs";
import { AxiosResponse } from "axios";

const AuthContext = createContext<{
  isLoading: boolean;
  session: null | string;
  user: null | User;
  refresh: () => Promise<void>;
  signup: (
    phone: string,
    email: string,
    password: string,
    confirm: string,
    name: string
  ) => Promise<boolean>;
  verifySignup: (phone: string, otp: string) => Promise<void>;
  signin: (email: string, password: string) => Promise<void>;
  logout: () => void;
  handleApiResponse: (
    apiCall: (...args: any[]) => Promise<AxiosResponse<any, any>>,
    args?: any[]
  ) => Promise<any>;
}>({
  isLoading: false,
  session: null,
  user: null,
  refresh: async () => {},
  signup: async () => false,
  verifySignup: async () => {},
  signin: async () => {},
  logout: () => {},
  handleApiResponse: async () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setLoading] = useState(true);
  const [session, setSession] = useState<string | null>(null);
  const [user, setUser] = useState(null);
  const { setItem, getItem } = useAsyncStorage("session_token");

  const signup = async (
    phone: string,
    email: string,
    password: string,
    confirm: string,
    name: string
  ) => {
    try {
      const { data: res } = await API.post("/auth/signup", {
        phone,
        email,
        password,
        confirm,
        name,
      });

      if (res.status) {
        return true;
        // setItem(res.data.token);
        // setSession(res.data.token);
        // setUser(res.data.user);
        // API.defaults.headers.common["Authorization"] = res.data.token;
        // Toast.show({
        //   type: "success",
        //   text1: "Signed Up Successfully.",
        // });
      } else {
        Toast.show({
          type: "error",
          text1: "failed to Sign Up!",
          text2: res.message,
        });
        return false;
      }
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const verifySignup = async (phone: string, otp: string) => {
    try {
      const { data: res } = await API.post("/auth/verify-signup", {
        phone,
        otp,
      });

      if (res.status) {
        setLoading(true);
        setItem(res.data.token);
        setSession(res.data.token);
        setUser(res.data.user);

        API.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.token}`;

        Toast.show({
          type: "success",
          text1: "Signed Up Successfully.",
        });
        setLoading(false);
      } else {
        Toast.show({
          type: "error",
          text1: "failed to Sign Up!",
          text2: res.message,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const signin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data: res } = await API.post("/auth/signin", {
        email,
        password,
      });

      if (res.status) {
        setItem(res.data.token);
        setSession(res.data.token);
        setUser(res.data.user);

        API.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.token}`;

        Toast.show({
          type: "success",
          text1: "Signed In.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "failed to Sign in!",
          text2: res.message,
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      setItem("");
      setSession(null);

      API.defaults.headers.common["Authorization"] = "";
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    try {
      const res = await handleApiResponse(GetProfile);

      console.log(res);

      if (res.status) {
        setUser(res.data);
      } else {
        setSession(null);
        setItem("");
      }
    } catch (e) {
      setSession(null);
      console.log(e);
    }
  };

  const handleApiResponse = async (
    apiCall: (...args: any[]) => Promise<AxiosResponse<any, any>>,
    args: any[] = []
  ) => {
    try {
      const { data } = await apiCall(...args);

      if (data.status === false && data.message === "unauthenticated") {
        console.log("User session is null. Logging out...");
        logout();
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      // Handle other errors as needed
      // throw error; // Rethrow the error so that it can be handled elsewhere if necessary
    }
  };

  useEffect(() => {
    getItem(async (err, token) => {
      if (err) console.log(err);

      setSession(token as string);
      API.defaults.headers.common["Authorization"] = token;

      try {
        const res = await handleApiResponse(GetProfile);

        if (res.status) {
          setUser(res.message);
        } else {
          setSession(null);
          setItem("");
        }
      } catch (e) {
        setSession(null);
        console.log(e);
      }
    });
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        session,
        user,
        refresh,
        signup,
        verifySignup,
        signin,
        logout,
        handleApiResponse,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useSession = () => {
  return useContext(AuthContext);
};
