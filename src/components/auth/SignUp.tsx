import { FormEvent, useEffect, useState } from "react";

import { FaCheck } from "react-icons/fa6";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { Link, useNavigate } from "react-router-dom";
import GoogleAuth from "./GoogleAuth";
import Layout from "../../layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useProgress } from "../../context/ProgressContext";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const SingUp = () => {
  const [auth] = useAuth();
  const navigate = useNavigate();
  const { setProgress } = useProgress();
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordShown, setpasswordShown] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [isValidUserName, setIsValidUserName] = useState<boolean>(false);

  const checkUsername = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/check-username`,
        {
          userName: userName.trim(),
        }
      );
      if (response && response.data.success) {
        setIsValidUserName(true);
      } else {
        setIsValidUserName(false);
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
      setIsValidUserName(false);
    }
  };
  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();

    if (
      email.trim().length <= 0 ||
      password.trim().length <= 0 ||
      userName.trim().length <= 0 ||
      fullName.trim().length <= 0
    ) {
      return toastMessage("Please fill all", "🙋‍♂️");
    }
    if (password !== confirmPassword) {
      return toastMessage("password and confirmPassword not matched");
    }
    if (!isValidUserName) {
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
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`,
        {
          email,
          password,
          userName,
          fullName,
        }
      );
      setProgress(70);
      if (response && response.data.success) {
        toastMessage(response.data.message);
        navigate("/user/signup/successful", { state: { name: fullName } });
      } else {
        toastMessage(response.data.message);
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

  useEffect(() => {
    if (userName.trim().length > 0) {
      checkUsername();
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
  useEffect(() => {
    if (auth.user !== null) {
      navigate(`/${auth.user.userName}`);
    }
  });
  return (
    <Layout>
      <div className="signup">
        <div className="signup-container">
          <h1>SignUp</h1>
          <div className="signup-container-googlelogin">
            <GoogleAuth />
          </div>
          <form onSubmit={handleSignup} className="signup-container-form">
            <div className="username">
              <label htmlFor="User Name">Username</label>
              <div>
                <input
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  type="text"
                  placeholder="User Name"
                />
                {userName.trim().length > 0 && (
                  <p>
                    {isValidUserName ? (
                      <FaCheck />
                    ) : (
                      <AiOutlineLoading3Quarters />
                    )}
                  </p>
                )}
              </div>
            </div>
            <div className="normal">
              <label htmlFor="email">Email</label>
              <input
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
              />
            </div>
            <div className="normal">
              <label htmlFor="full Name">Full Name</label>
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                type="text"
                placeholder="Full Name"
              />
            </div>
            <div className="normal">
              <label htmlFor="Password">Password</label>
              <input
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
              />
            </div>
            <div className="eye">
              <label htmlFor="Confirm Password">Confirm Password</label>
              <div>
                <input
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  type={passwordShown ? "text" : "password"}
                />
                <p onClick={() => setpasswordShown(!passwordShown)}>
                  {passwordShown ? <FaEyeSlash /> : <FaEye />}
                </p>
              </div>
            </div>

            <button type="submit" disabled={loading} onSubmit={handleSignup}>
              {loading ? "Signing Up.." : "Sign Up"}
            </button>
          </form>
          <div className="signup-container-loginlink">
            <p>Already have an account ? </p>
            <Link to="/user/login">Login</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SingUp;
