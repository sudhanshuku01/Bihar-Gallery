import { useEffect, useRef, useState } from "react";
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
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [auth] = useAuth();
  const navigate = useNavigate();
  const { slugTitle } = useParams();
  const [data, setData] = useState<BlogDataTypes | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tags, setTags] = useState<string>("");
  const [html, setHtml] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const updateImageSources = async (htmlContent: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const images = doc.querySelectorAll("img");

    await Promise.all(
      Array.from(images).map(async (img) => {
        const originalSrc = img.getAttribute("src");

        if (originalSrc) {
          const urlParts = new URL(originalSrc);
          let path = urlParts.pathname;

          if (path.startsWith("/bihar-gallery/")) {
            path = path.substring("/bihar-gallery/".length);
          }

          try {
            const response = await axios.get(
              `${
                import.meta.env.VITE_API_BASE_URL
              }/api/blog/getImage?key=${path}`
            );
            img.setAttribute("src", response.data); // Update the image source
          } catch (error) {
            console.error("Error fetching signed URL:", error);
          }
        }
      })
    );

    return doc.body.innerHTML; // Return the updated HTML content
  };

  const fetchGetPost = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/blog/${slugTitle}`
      );
      if (response && response.data.success) {
        setData(response.data.post);
      }
    } catch (error) {
      console.error("Error fetching post data:", error);
    }
  };

  // Delete blog post
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

  // Update blog post
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
        setIsEditing(false);
        fetchGetPost();
      } else {
        toastMessage(response.data.message);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Something went wrong!";
      toastMessage(errorMessage);
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
    const fetchAndUpdatePost = async () => {
      if (!data) {
        await fetchGetPost();
      } else {
        setTitle(data.title);
        const updatedHtml = await updateImageSources(data.html);
        setHtml(updatedHtml);
        setDescription(data.description);
        setTags(data.tags);
      }
    };

    fetchAndUpdatePost();
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
      console.error("Error checking admin status:", error);
    }
  };

  useEffect(() => {
    if (auth?.user?._id) {
      checkAdmin(auth.user._id);
    }
  }, [auth]);

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
            <div ref={contentRef} dangerouslySetInnerHTML={{ __html: html }} />
          )}
        </div>
        {auth.user && isAdmin && (
          <>
            {isEditing && (
              <div className="blogpage-editorial">
                <BlogEditor html={html} setHtml={setHtml} />
                <div className="basicinfo">
                  <div>
                    <label htmlFor="title">Title</label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      type="text"
                      id="title"
                    />
                  </div>
                  <div>
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <div>
                    <label htmlFor="tags">Tags</label>
                    <input
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      type="text"
                      id="tags"
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="blogpage-editorialbuttons">
              {isEditing ? (
                <>
                  <button onClick={postUpdate}>Submit</button>
                  <button onClick={() => setIsEditing(false)}>Cancel</button>
                </>
              ) : (
                <>
                  <p onClick={postDelete}>
                    <AiFillDelete />
                  </p>
                  <p onClick={() => setIsEditing(true)}>
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
