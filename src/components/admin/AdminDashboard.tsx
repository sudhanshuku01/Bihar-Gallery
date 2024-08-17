import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { Outlet } from "react-router-dom";
import ErrorPage from "../general/ErrorPage";
import Layout from "../../layout/Layout";

const AdminDashboard = () => {
  const [auth] = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const checkAdmin = async (userId: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/is-admin/${userId}`
      );
      if (response && response.data.success) {
        setIsAdmin(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth.user) {
      checkAdmin(auth.user._id);
    }
  }, [auth]);

  return (
    <>
      {auth.user !== null && isAdmin ? (
        <Layout>
          <div className="admindashboard">
            <div className="admindashboard-header">
              <h1>Welcome to Admin Dashboard</h1>
            </div>
            <Outlet />
          </div>
        </Layout>
      ) : (
        <ErrorPage />
      )}
    </>
  );
};

export default AdminDashboard;
