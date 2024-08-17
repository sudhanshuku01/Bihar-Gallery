import { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import user_IMG from "../../images/username.png";

import { MdPreview } from "react-icons/md";

import { CiInstagram } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { UserTypes, useAuth } from "../../context/AuthContext";
import UpdateUser from "./UpdateUser";

import { FiEdit } from "react-icons/fi";
import { RiLogoutCircleLine } from "react-icons/ri";

import { useProgress } from "../../context/ProgressContext";
import ErrorPage from "../general/ErrorPage";
import toast from "react-hot-toast";
import LazyLoader from "../general/LazyLoader";

interface MediaObjectType {
  url: string;
  slugTitle: string;
  mediaType: string;
  className: string;
  isReviewed: boolean;
}

const UserProfile = () => {
  const { setProgress } = useProgress();
  const [auth, setAuth] = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<UserTypes | null>(null);
  const { userName } = useParams<{ userName: string }>();
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [data, setData] = useState<MediaObjectType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [postLoading, setPostLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    setProgress(10);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/user/${userName}`)
      .then((response1) => {
        setProgress(30);
        if (response1.data.success) {
          setUser(response1.data.Data);
          axios
            .get(
              `${import.meta.env.VITE_API_BASE_URL}/api/media/user/${
                response1.data.Data.userName
              }`,
              {
                params: { page: 1 },
              }
            )
            .then((response2) => {
              setProgress(50);
              if (response2.data.success) {
                if (totalPages === null) {
                  setTotalPages(response2.data.totalPages);
                }
                setData(response2.data.Data);
              } else {
                console.error(response2.data.message);
                toastMessage(response2.data.message);
              }
            })
            .catch((error) => {
              console.error("Error fetching media:", error);
              toastMessage("Server error");
            });
        } else {
          console.error(response1.data.message);
          toastMessage(response1.data.message);
        }
      })
      .catch((error) => {
        console.error(error);
        toastMessage("server error");
      })
      .finally(() => {
        setProgress(100);
        setLoading(false);
      });
  }, []);

  const loadMorePost = () => {
    if (totalPages && page >= totalPages) {
      return;
    }
    setPostLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/media/user/${userName}`, {
        params: { page: page + 1 },
      })
      .then((response2) => {
        if (response2.data.success) {
          const newData = response2.data.Data;
          setData((prevData) => [...prevData, ...newData]);
        } else {
          console.error(response2.data.message);
          toastMessage(response2.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching media:", error);
        toastMessage("Server error");
      })
      .finally(() => {
        setPage((prevpage) => prevpage + 1);
        setPostLoading(false);
      });
  };

  const handleClick = (slugTitle: string) => {
    const state = { previousLocation: location };
    navigate(`/media/${slugTitle}`, { state: state });
  };

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("bihar-gallery-auth");
    toastMessage("Logout Successfully");
    navigate(`/`);
  };
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
      {user ? (
        <Layout>
          <div className="userprofile">
            {isModalOpen && (
              <UpdateUser
                user={user}
                setUser={setUser}
                setIsModalOpen={setIsModalOpen}
              />
            )}
            <div className="userprofile-header"></div>
            <div className="userprofile-content">
              <div className="userprofile-content-main">
                <div className="userprofile-content-main-general">
                  <img
                    src={
                      `${
                        import.meta.env.VITE_API_BASE_URL
                      }/api/auth/user/getimage/${user._id}`
                        ? `${
                            import.meta.env.VITE_API_BASE_URL
                          }/api/auth/user/getimage/${user._id}`
                        : user_IMG
                    }
                    alt="user image"
                  />
                  <h1>{user.fullName}</h1>
                  <p>{user.userName}</p>
                </div>
                {user.about && (
                  <div className="userprofile-content-main-about">
                    <p>
                      <span>About: </span>
                      {user.about}
                    </p>
                  </div>
                )}
                {user.address && (
                  <div className="userprofile-content-main-location">
                    <p>
                      <IoLocationOutline />
                      {user.address}
                    </p>
                  </div>
                )}
                {user.instagram && (
                  <div className="userprofile-content-main-instagram">
                    <p>
                      <CiInstagram />
                    </p>
                  </div>
                )}
              </div>
              {auth?.user?._id === user._id && (
                <>
                  <div className="userprofile-content-edit">
                    <FiEdit onClick={() => setIsModalOpen(true)} />
                  </div>
                  <div className="userprofile-content-logout">
                    <RiLogoutCircleLine onClick={handleLogout} />
                  </div>
                </>
              )}
            </div>
            <div className="userprofile-post">
              {data?.length > 0 ? (
                <>
                  <h1>Posts</h1>
                  <div className="userprofile-post-container">
                    {data?.map((item, index) => (
                      <div
                        onClick={() => handleClick(item.slugTitle)}
                        key={index}
                        className={`userprofile-post-container-item ${item.className}`}
                      >
                        {item.mediaType.startsWith("image") ? (
                          <img src={item.url} alt={item.slugTitle} />
                        ) : (
                          <video src={item.url}></video>
                        )}
                        {auth &&
                          auth.user?._id === user._id &&
                          !item.isReviewed && (
                            <p>
                              <MdPreview />
                              In Review
                            </p>
                          )}
                      </div>
                    ))}
                  </div>
                  <div className="userprofile-post-button">
                    {postLoading ? (
                      <div className="loading-dots">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                      </div>
                    ) : (
                      <button
                        onClick={loadMorePost}
                        disabled={page >= totalPages!}
                      >
                        Load More
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <h1>No Post Yet</h1>
              )}
            </div>
          </div>
        </Layout>
      ) : loading ? (
        <LazyLoader />
      ) : (
        <ErrorPage />
      )}
    </>
  );
};

export default UserProfile;
