import React, { useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../context/AuthContext";

interface User {
  access_token: string;
}

const GoogleAuth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<User | null>(null);
  const [auth, setAuth] = useAuth();

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse as User),
    onError: (error) => console.log("Login Failed:", error),
  });

  console.log(user);

  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          axios
            .post(
              `${
                import.meta.env.VITE_API_BASE_URL
              }/api/auth/googleloginwithexistingemail`,
              {
                googleId: res.data.id,
                fullName: res.data.name,
                email: res.data.email,
              }
            )
            .then((backendRes) => {
              console.log("backendRes",backendRes.data)
              if (backendRes.data && backendRes.data.success) {
                toastMessage(backendRes.data.message);
                setAuth({
                  ...auth,
                  user: backendRes.data.user,
                  token: backendRes.data.token,
                });
                localStorage.setItem(
                  "bihar-gallery-auth",
                  JSON.stringify(backendRes.data)
                );
                navigate(
                  location.state || `/user/${backendRes.data.user.userName}`
                );
              } else {
                navigate("/user/googleauth", {
                  state: {
                    googleId: res.data.id,
                    fullName: res.data.name,
                    email: res.data.email,
                  },
                });
              }
            })
            .catch((error) => {
              if (
                error.response &&
                error.response.data &&
                error.response.data.message
              ) {
                toastMessage(error.response.data.message);
              } else {
                toastMessage("Something went wrong!");
              }
              console.log(error);
            });
        })
        .catch((err) => {
          console.log(err);
          toastMessage("Something went wrong try after sometime!");
        });
    }
  }, [user]);

  const toastMessage = (msg: string, icon?: string) => {
    toast(msg, {
      icon: icon,
      style: {
        border: "1px solid rgb(113, 50, 0)",
        padding: "8px 16px",
        color: "rgb(34 36 215)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: "300",
        fontSize: "15px",
      },
      iconTheme: {
        primary: "#713200",
        secondary: "#FFFAEE",
      },
    });
  };
  return (
    <div className="googleauth" onClick={() => login()}>
      <p>
        <FcGoogle />
      </p>
      <h2>Sign in with Google</h2>
    </div>
  );
};

export default GoogleAuth;
