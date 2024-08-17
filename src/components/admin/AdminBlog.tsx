import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useProgress } from "../../context/ProgressContext";
import default_IMG from "../../images/image-gallery.png";
import BlogEditor from "./BlogEditor";

const AdminBlog: React.FC = () => {
  const { setProgress } = useProgress();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [html, setHtml] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [imageKey, setImageKey] = useState("");
  const [blogImage, setBlogImage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !html || !description || !tags || !imageKey) {
      toastMessage("All fields are required");
      return;
    }
    const value = {
      title: title.trim(),
      html: html.trim(),
      description: description.trim(),
      tags: tags.trim(),
      imageKey: imageKey,
    };
    try {
      setLoading(true);
      setProgress(30);
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/blog`,
        value
      );
      setProgress(60);
      if (response && response.data.success) {
        console.log(response);
        toastMessage("Post created successfully", "🚀");
        setTitle("");
        setHtml("");
        setDescription("");
        setTags("");
        setImageKey("");
        setBlogImage("");
      } else {
        toastMessage(response.data.message);
      }
    } catch (error) {
      console.error("There was an error!", error);
    } finally {
      setProgress(100);
      setLoading(false);
    }
  };
  console.log(html);
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

  const pickImage = async () => {
    const imageUrlKey = prompt("Please enter the image URL Key:");
    if (imageUrlKey) {
      setImageKey(imageUrlKey);
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/blog/getImage?key=${imageUrlKey}`
      );
      setBlogImage(response.data);
    } else {
      console.log("No URL entered.");
    }
  };

  return (
    <div className="adminblog">
      <h1>Blog Panel</h1>
      <div className="adminblog-createpost">
        <h2>Create a New Post</h2>

        <BlogEditor html={html} setHtml={setHtml} />

        <div className="imagepick">
          <p>Image</p>
          <img src={blogImage ? blogImage : default_IMG} alt="" />
          <button onClick={pickImage}>Pick</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              required
            />
          </div>
          <button disabled={loading} type="submit">
            {loading ? "submitting..." : "submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminBlog;
