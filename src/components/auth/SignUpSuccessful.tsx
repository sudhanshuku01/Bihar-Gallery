import React from "react";
import { useLocation, Link } from "react-router-dom";
import ErrorPage from "../general/ErrorPage";
import Layout from "../../layout/Layout";

const SignUpSuccessful: React.FC = () => {
  const location = useLocation();
  const name = location.state?.name || "";

  if (!name) {
    return <ErrorPage />;
  }

  const openEmailInbox = () => {
    window.open(`https://mail.google.com/mail/u/0/?ogbl#inbox`, "_blank");
  };
  return (
    <Layout>
      <div className="signup-successful">
        <h1>Thank you for signing up on Bihar Gallery</h1>
        <p> {` "${name}" `} You're welcome!</p>
        <p>Please verify your email before logging in.</p>
        <p>Open your email and see the latest message from Bihar Gallery.</p>
        <p onClick={openEmailInbox} className="email-link">
          Open Email
        </p>
        <p className="login-link">
          <Link to="/user/login">Go to Login</Link>
        </p>
      </div>
    </Layout>
  );
};

export default SignUpSuccessful;
