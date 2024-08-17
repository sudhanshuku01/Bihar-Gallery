import React, { FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import { FaCheck } from "react-icons/fa6";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import ErrorPage from "../general/ErrorPage";
import { useAuth } from "../../context/AuthContext";
import { useProgress } from "../../context/ProgressContext";

const GoogleAuthComplete: React.FC = () => {
  const [auth, setAuth] = useAuth();
  const { setProgress } = useProgress();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { googleId, fullName, email } =
    (location.state as {
      googleId: string;
      fullName: string;
      email: string;
    }) || {};

  const [userName, setuserName] = useState<string>("");

  console.log(googleId, fullName, email);

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();

    if (
      googleId.trim().length <= 0 ||
      fullName.trim().length <= 0 ||
      email.trim().length <= 0 ||
      userName.trim().length <= 0
    ) {
      return toastMessage("Please fill all", "🙋‍♂️");
    }
    if (!isValiduserName) {
      return toast("userName is not valid!", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }

    try {
      setLoading(true);
      setProgress(30);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/googlelogin`,
        {
          googleId,
          email,
          fullName,
          userName,
        }
      );
      setProgress(70);
      if (res && res.data.success) {
        toastMessage(res.data.message);
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem("bihar-gallery-auth", JSON.stringify(res.data));

        navigate(`/user/${res.data.user.userName}`);
      } else {
        toastMessage(res.data.message);
      }
    } catch (error: any) {
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
    } finally {
      setProgress(100);
      setLoading(false);
    }
  };

  const [isValiduserName, setIsValiduserName] = useState<boolean>(false);

  const checkuserName = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/check-userName`,
        {
          userName: userName.trim(),
        }
      );
      if (response && response.data.success) {
        setIsValiduserName(true);
      } else {
        setIsValiduserName(false);
      }
    } catch (error: any) {
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
      console.log(error);
      setIsValiduserName(false);
    }
  };

  useEffect(() => {
    if (userName.trim().length > 0) {
      checkuserName();
    }
  }, [userName]);

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
    <>
      {!googleId ? (
        <ErrorPage />
      ) : (
        <div className="googleauthcomplete">
          <div className="content">
            <h2>Set Your userName</h2>
            <div>
              <input
                required
                value={userName}
                onChange={(e) => setuserName(e.target.value)}
                type="text"
                placeholder="User Name"
              />
              {userName.trim().length > 0 && (
                <p>
                  {isValiduserName ? (
                    <FaCheck />
                  ) : (
                    <AiOutlineLoading3Quarters />
                  )}
                </p>
              )}
            </div>
            <button disabled={loading} onClick={handleSignup}>
              Submit
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GoogleAuthComplete;
