import { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { BlogDataTypes } from "../general/Blog";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import "react-quill/dist/quill.snow.css";

import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import BlogEditor from "../admin/BlogEditor";

const BlogPage = () => {
  const [auth] = useAuth();
  const navigate = useNavigate();
  const { slugTitle } = useParams();
  const [data, setData] = useState<BlogDataTypes | null>(null);
  const [isediting, setIsediting] = useState<boolean>(false);
  const [tags, setTags] = useState<string>("");
  const [html, setHtml] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const fetchGetPost = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/blog/${slugTitle}`
      );
      if (response && response.data.success) {
        setData(response.data.post);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const postDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (confirmed) {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/api/blog/${data?._id}`
        );
        if (response && response.data.success) {
          toastMessage(response.data.message);
          navigate("/blog");
        } else {
          toastMessage(response.data.message);
        }
      } catch (error) {
        toastMessage("Failed to delete the post.");
      }
    }
  };

  const postUpdate = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/blog/${data?._id}`,
        {
          html,
          title,
          description,
          tags,
        }
      );
      if (response && response.data.success) {
        toastMessage(response.data.message);
        setIsediting(false);
        fetchGetPost();
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
    }
  };
  const toastMessage = (msg: string, icon?: string) => {
    toast(msg, {
      icon: icon,
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  };

  useEffect(() => {
    if (data === null) {
      fetchGetPost();
    } else {
      setTitle(data.title);
      setHtml(data.html);
      setDescription(data.description);
      setTags(data.tags);
    }
  }, [data]);

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

  // const getImageUrl = async (key: string) => {
  //   const response = await axios.get(
  //     `${import.meta.env.VITE_API_BASE_URL}/api/blog/getImage?key=${key}`
  //   );
  //   return response.data;
  // };

  return (
    <Layout
      title={`Explore ${data ? data.title : "blog"} - Bihar Gallery`}
      description={`Explore the rich blog of ${
        data ? data.description : "Bihar"
      } with detailed insights, images, and articles on Bihar Gallery.`}
      keywords={`Bihar blog, ${
        data ? data.tags : "blog"
      }, historical places in Bihar, Bihar Gallery`}
      author="Bihar Gallery"
      type="article"
      url={`https://www.bihargallery.com/blog/${slugTitle}`}
    >
      <div className="blogpage">
        <div className="blogpage-content">
          {data && (
            <>
              <div dangerouslySetInnerHTML={{ __html: data.html }} />
            </>
          )}
        </div>
        {auth.user && isAdmin && (
          <>
            {isediting && (
              <div className="blogpage-editorial">
                <BlogEditor html={html} setHtml={setHtml} />
                <div className="basicinfo">
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
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <div>
                    <label htmlFor="">Tags</label>
                    <input
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      type="text"
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="blogpage-editorialbuttons">
              {isediting ? (
                <>
                  <button onClick={postUpdate}>Submit</button>
                  <button onClick={() => setIsediting(false)}>Cancel</button>
                </>
              ) : (
                <>
                  <p onClick={postDelete}>
                    <AiFillDelete />
                  </p>
                  <p onClick={() => setIsediting(true)}>
                    <FaEdit />
                  </p>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default BlogPage;
