import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import GoogleAuth from "./GoogleAuth";
import { useAuth } from "../../context/AuthContext";
import Layout from "../../layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { useProgress } from "../../context/ProgressContext";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";

const Login = () => {
  const { setProgress } = useProgress();
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [auth, setAuth] = useAuth();
  const [passwordShown, setpasswordShown] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (email.trim().length <= 0 || password.trim().length <= 0) {
      return toastMessage("Please fill all!", "🙋‍♂️");
    }
    try {
      setLoading(true);
      setProgress(30);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        {
          email,
          password,
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

        navigate(location.state || `/user/${res.data.user.userName}`);
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

  useEffect(() => {
    if (auth.user !== null) {
      navigate(`/user/${auth.user.userName}`);
    }
  });

  // const loginwithgoogle = () => {
  //   window.open(`${import.meta.env.VITE_API_BASE_URL}/auth/google/callback`, "_self");
  // };
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
    <Layout>
      <div className="login">
        <div className="login-container">
          <h1>Login</h1>
          <div className="login-container-googlelogin">
            <GoogleAuth />
          </div>
          <form onSubmit={handleLogin} className="login-container-form">
            <div className="normalinput">
              <label htmlFor="email">Email</label>
              <input
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
              />
            </div>
            <div className="eyeinput">
              <label htmlFor="password">Password</label>
              <div>
                <input
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                  type={passwordShown ? "text" : "password"}
                />
                <p onClick={() => setpasswordShown(!passwordShown)}>
                  {passwordShown ? <FaEyeSlash /> : <FaEye />}
                </p>
              </div>
            </div>
            <button disabled={loading} type="submit" onSubmit={handleLogin}>
              {loading ? "Loging...." : "Login"}
            </button>
          </form>
          <div className="login-container-signuplink">
            <p>Don't have an account ? </p>
            <Link to="/user/signup">Sign Up</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
