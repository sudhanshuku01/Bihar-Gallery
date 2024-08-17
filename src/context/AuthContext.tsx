import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from "react";
import axios from "axios";

export interface UserTypes {
  _id: string;
  userName: string;
  fullName: string;
  address: string | null;
  instagram: string | null;
  about: string | null;
  postLeft: number;
  // totalPost: number;
}

interface AuthContextType {
  user: UserTypes | null;
  token: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<
  | [AuthContextType, React.Dispatch<React.SetStateAction<AuthContextType>>]
  | undefined
>(undefined);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthContextType>({
    user: null,
    token: "",
  });

  axios.defaults.headers.common["authorization"] = auth.token;

  useEffect(() => {
    const data = localStorage.getItem("bihar-gallery-auth");
    if (data) {
      const parseData = JSON.parse(data);
      checkTokenValidation(parseData);
    }
  }, []);
  const checkTokenValidation = async (parseData: any) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/isvalid-token`,
        {
          userId: parseData.user._id,
        },
        {
          headers: {
            authorization: parseData.token,
          },
        }
      );
      if (response && response.data.success) {
        setAuth({
          ...auth,
          user: parseData.user,
          token: parseData.token,
        });
      } else {
        localStorage.removeItem("bihar-gallery-auth");
        setAuth({
          user: null,
          token: "",
        });
      }
    } catch (error) {
      console.error("Token verification failed", error);
      localStorage.removeItem("bihar-gallery-auth");
      setAuth({
        user: null,
        token: "",
      });
    }
  };

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { useAuth, AuthProvider };
