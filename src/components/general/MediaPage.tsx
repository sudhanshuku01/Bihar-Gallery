import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import user_IMG from "../../images/username.png";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { MdPreview } from "react-icons/md";

import Layout from "../../layout/Layout";
import leftarrow_IMG from "../../images/left-arrow_152351.png";
import ErrorPage from "./ErrorPage";
import { useProgress } from "../../context/ProgressContext";
import toast from "react-hot-toast";

export interface Creator {
  _id: string;
  userName: string;
  instagram: string;
}

export interface Media {
  _id: string;
  key: string;
  mediaType: string;
  className: string;
  title: string;
  slugTitle: string;
  description: string;
  tags: string;
  location: string;
  creator: Creator;
  isReviewed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MediaResponse {
  url: string;
  media: Media;
}

const MediaPage = () => {
  const { setProgress } = useProgress();
  const [auth] = useAuth();
  const navigate = useNavigate();
  const { slugTitle } = useParams();
  const [data, setData] = useState<MediaResponse | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isediting, setIsediting] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [tags, setTags] = useState<string>("");

  const [isCheckedBox, setIsCheckedBox] = useState<string>("default");

  const fetchMediaOnSlugTitle = async () => {
    try {
      setProgress(30);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/media/get-media/${slugTitle}`
      );
      setProgress(50);
      if (response && response.data.success) {
        setData(response.data.Data);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setProgress(100);
    }
  };

  const checkAdmin = async (userId: string) => {
    try {
      setProgress(30);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/is-admin/${userId}`
      );
      setProgress(50);
      if (response && response.data.success) {
        setIsAdmin(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setProgress(100);
    }
  };

  const deleteMedia = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmed) {
      return;
    }
    try {
      setProgress(30);
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/media/delete-media/${
          data?.media._id
        }`
      );
      setProgress(50);
      if (response && response.data.success) {
        toastMessage("Media deleted successfully");
        navigate(-1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setProgress(100);
    }
  };

  const editMedia = async () => {
    try {
      setProgress(30);
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/media/update-media/${
          data?.media._id
        }`,
        {
          title: title.trim(),
          description: description.trim(),
          location: location.trim(),
          tags: tags.trim(),
          ReviewedString: isCheckedBox,
        }
      );
      setProgress(50);
      if (response && response.data.success) {
        setIsediting(false);
        toastMessage("Media updated successfully");
        fetchMediaOnSlugTitle();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setProgress(100);
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setIsCheckedBox("yes");
    } else {
      setIsCheckedBox("no");
    }
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
  useEffect(() => {
    fetchMediaOnSlugTitle();
  }, []);

  useEffect(() => {
    if (auth.user !== null) {
      checkAdmin(auth.user._id);
    }
  }, [auth]);

  useEffect(() => {
    if (data) {
      setTitle(data.media.title || "");
      setDescription(data.media.description || "");
      setLocation(data.media.location || "");
      setTags(data.media.tags || "");
    }
  }, [data]);

  return data ? (
    <Layout
      title={`Media - ${data?.media.title || "Media Details"}`}
      description={
        data?.media.description || "Explore media details on Bihar Gallery"
      }
      keywords={data?.media.tags || "Bihar, Media, Images, Videos"}
      author={"Bihar Gallery"}
      url={`https://www.bihargallery.com/media/${slugTitle}`}
    >
      <div className="mediapage">
        <div className="mediapage-main">
          <div className="mediapage-main-creator">
            <div>
              <img
                src={
                  `${
                    import.meta.env.VITE_API_BASE_URL
                  }/api/auth/user/getimage/${data.media.creator._id}` ||
                  user_IMG
                }
                alt="user image"
              />
              <Link to={`/${data.media.creator.userName}`}>
                {data.media.creator.userName}
              </Link>
            </div>
            <Link to={data.media.creator.instagram}>Say Thanks</Link>
          </div>
          <div className="mediapage-main-download">
            <a target="_blank" href={data.url} download={data.media.title}>
              Free Download
            </a>
          </div>
          <div className="mediapage-main-media">
            {data.media.mediaType.startsWith("image") ? (
              <img src={data.url} alt={`img-${data.media.title}`} />
            ) : (
              <video src={data.url} />
            )}
            {!data.media.isReviewed && (
              <p>
                <MdPreview />
                In Review
              </p>
            )}
          </div>
          <div className="mediapage-main-content">
            {data.media.title && (
              <p>
                <span>Title: </span>
                {data.media.title}
              </p>
            )}
            {data.media.description && (
              <p>
                <span>Description: </span>
                {data.media.description}
              </p>
            )}
            {data.media.location && (
              <p>
                <span>Location: </span>
                {data.media.location}
              </p>
            )}
          </div>
          {isediting && (
            <div className="mediapage-main-editing">
              <div>
                <label htmlFor="">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                />
              </div>
              <div>
                <label htmlFor="">Description</label>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  type="text"
                />
              </div>
              <div>
                <label htmlFor="">Location</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  type="text"
                />
              </div>
              <div>
                <label htmlFor="">Tags</label>
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  type="text"
                />
              </div>
              {!data.media.isReviewed && (
                <div>
                  <label htmlFor="">Reviewed ?</label>
                  <input
                    type="checkbox"
                    checked={isCheckedBox === "yes"}
                    onChange={handleCheckboxChange}
                  />
                </div>
              )}
            </div>
          )}
          {isAdmin && (
            <div className="mediapage-main-delete-update">
              {isediting ? (
                <>
                  <button onClick={editMedia}>Submit</button>
                  <button onClick={() => setIsediting(false)}>cancel</button>
                </>
              ) : (
                <>
                  <p onClick={deleteMedia}>
                    <MdDelete />
                  </p>
                  <p onClick={() => setIsediting(true)}>
                    <FiEdit />
                  </p>
                </>
              )}
            </div>
          )}
          <div className="mediapage-main-close" onClick={() => navigate(-1)}>
            <img src={leftarrow_IMG} alt="img-go-back" />
          </div>
        </div>
      </div>
    </Layout>
  ) : (
    <ErrorPage />
  );
};

export default MediaPage;
