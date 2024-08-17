import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
} from "react";
import imageGalleryImg from "../../images/image-gallery.png";

import axios from "axios";
import toast from "react-hot-toast";
import { determineSize } from "../../utils/MediaUtils";
import Layout from "../../layout/Layout";
import { useAuth } from "../../context/AuthContext";
import { useProgress } from "../../context/ProgressContext";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const MediaUpload: React.FC = () => {
  const { progress, setProgress } = useProgress();
  const [auth, setAuth] = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [draggingOver, setDraggingOver] = useState(false);
  const [mediaType, setMediaType] = useState<string | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const divRef = useRef<HTMLDivElement>(null);

  const scrollToDiv = () => {
    if (divRef.current) {
      divRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (auth.user === null) {
    }
  }, [auth]);

  const resetAllFields = () => {
    setFile(null);
    setTitle("");
    setDescription("");
    setLocation("");
    setTags("");
    setMediaType(null);
    setMediaPreview(null);
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDraggingOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDraggingOver(false);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDraggingOver(false);

    if (!auth.user) {
      toastMessage("Login to share images and videos");
      scrollToDiv();
      return;
    }

    if (auth.user && auth.user?.postLeft <= 0) {
      return toastMessage(
        "You uploaded the maximum no of post for today please upload tomorrow"
      );
    }

    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const droppedFile = droppedFiles[0];
      const maxSizeInBytes = 100 * 1024 * 1024;

      if (droppedFile.size > maxSizeInBytes) {
        return toastMessage("File size should be less than 100 MB.");
      }

      if (
        droppedFile.type.startsWith("image/") ||
        droppedFile.type.startsWith("video/")
      ) {
        setFile(droppedFile);
        setMediaType(droppedFile.type);
        previewFile(droppedFile);
      } else {
        alert("Only image and video files are allowed.");
      }
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!auth.user) {
      toastMessage("Login first to share");
      scrollToDiv();
      return;
    }
    if (auth.user && auth.user?.postLeft <= 0) {
      return toastMessage(
        "You uploaded the maximum no of post for today please upload tomorrow"
      );
    }

    if (event.target.files) {
      const selectedFile = event.target.files[0];
      const maxSizeInBytes = 100 * 1024 * 1024;

      if (selectedFile.size > maxSizeInBytes) {
        return toastMessage("File size should be less than 100 MB.");
      }

      if (
        selectedFile.type.startsWith("image/") ||
        selectedFile.type.startsWith("video/")
      ) {
        setFile(selectedFile);
        setMediaType(selectedFile.type);
        previewFile(selectedFile);
      } else {
        alert("Only image and video files are allowed.");
      }
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!file) {
      toastMessage("No file selected");
      return;
    }
    if (!mediaType) {
      toastMessage("MediaType is not given");
      return;
    }
    if (!title) {
      toastMessage("Title can't be blank");
    }
    try {
      setLoading(true);
      setProgress(30);
      const className = await determineSize(file);
      console.log(`File size: ${className}`);
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/media/upload`,
        {
          key: generateFileName(mediaType),
          mediaType,
          title,
          description,
          location,
          tags,
          className,
        }
      );
      setProgress(60);
      if (response && response.data.success) {
        const preSignedUrl = await response.data.url;
        console.log("presignedurl: " + preSignedUrl);

        const blobData = new Blob([file], { type: file.type });

        await fetch(preSignedUrl, {
          method: "PUT",
          body: blobData,
          headers: {
            "Content-Type": file.type,
          },
        });

        decrementPostLeft();
        toastMessage("File uploaded successfully", "🚀");
        resetAllFields();
      } else {
        console.error("Error uploading file: ", response.data.message);
        toast(response.data.message, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  const decrementPostLeft = () => {
    setAuth((prevAuth) => {
      if (prevAuth.user) {
        const updatedUser = {
          ...prevAuth.user,
          postLeft: prevAuth.user.postLeft - 1,
        };
        localStorage.setItem(
          "bihar-gallery-auth",
          JSON.stringify({ user: updatedUser, token: prevAuth.token })
        );
        return { ...prevAuth, user: updatedUser };
      }
      return prevAuth;
    });
  };

  const previewFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setMediaPreview(reader.result as string);
        setIsVideo(file.type.startsWith("video/"));
      }
    };
    reader.readAsDataURL(file);
  };

  function generateFileName(mediaType: string): string {
    const prefix = mediaType.startsWith("video/") ? "videos" : "images";
    const timestamp = Date.now();
    const extension = mediaType.substring(mediaType.lastIndexOf("/") + 1);
    return `${prefix}/${timestamp}.${extension}`;
  }

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
    <Layout
      title="Upload Photos and Videos | Bihar Gallery"
      description="Share your beautiful photos and videos on Bihar Gallery. Upload and showcase your work to millions of users."
      keywords="upload photos, upload videos, Bihar Gallery uploads, media uploads, share photos online, share videos online"
      author="Bihar Gallery"
      type="website"
      url="https://www.bihargallery.com/media-upload"
    >
      <div className="mediaupload">
        <div className="mediaupload-title">
          <h1>
            Share your photos and videos, and let the world <br /> love them
          </h1>
          <p>
            Share your photos to introduce yourself to <br />
            millions of users
          </p>
        </div>
        <div className="mediaupload-handle">
          {!file ? (
            <div className="mediaupload-handle-content">
              <div
                className="mediaupload-handle-content-top"
                style={{
                  backgroundColor: draggingOver ? "#F7F7F7" : "#ffffff",
                }}
                onDrop={handleDrop}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
              >
                <img src={imageGalleryImg} alt="" />
                <h1>Drag and drop to upload, or</h1>
                <label htmlFor="file-upload" className="file-upload">
                  Browse
                </label>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,video/*"
                />
                {auth.user && (
                  <p>
                    You have <span>{auth.user.postLeft} uploads</span> left for
                    the day
                  </p>
                )}
              </div>
              <ul className="mediaupload-handle-content-rule">
                <li>
                  <FaCheckCircle />
                  <span>Mindful of the rights of others</span>
                </li>
                <li>
                  <FaCheckCircle />
                  <span>High quality photos and videos</span>
                </li>
                <li>
                  <FaCheckCircle />
                  <span>Excludes graphic nudity, violence, or hate</span>
                </li>
                <li>
                  <FaCheckCircle />
                  <span>To be downloaded and used for free</span>
                </li>
                <li>
                  <FaCheckCircle />
                  <span>Read the Pexels Terms</span>
                </li>
              </ul>
            </div>
          ) : (
            <div className="mediaupload-handle-preview">
              <div className="mediaupload-handle-preview-img-video">
                {isVideo ? (
                  <video src={mediaPreview ? mediaPreview : ""} controls />
                ) : (
                  <img src={mediaPreview ? mediaPreview : ""} alt="" />
                )}
              </div>
              <div className="mediaupload-handle-preview-caption">
                <p>Title</p>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter Title "
                  type="text"
                />
                <p>
                  Location <span>(Optional)</span>
                </p>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter the Location "
                  type="text"
                />
                <p>
                  Tags <span>(Optional)</span>
                </p>
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Enter Tags "
                  type="text"
                />
                <p>
                  Description <span>(Optional)</span>
                </p>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter Description"
                  id=""
                ></textarea>
              </div>
            </div>
          )}
        </div>
        {!auth.user && (
          <div ref={divRef} className="mediaupload-not-loggedin">
            <p>
              Start sharing your creativity with Bihar Gallery! Please
              <Link to="/user/login">login</Link> to upload your stunning photos
              and captivating videos. Join our community of artists and
              enthusiasts showcasing the beauty of Bihar to the world.
            </p>
            <p>
              Don't miss out on the opportunity to inspire and connect with
              millions of viewers. Log in now and let your art shine!
            </p>
          </div>
        )}
        {file && (
          <div className="mediaupload-submission">
            {loading ? (
              <>
                <button>{progress}</button>
                <button>Uploading..</button>
              </>
            ) : (
              <>
                <label htmlFor="file-upload" className="file-upload">
                  Change
                </label>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,video/*"
                />
                <button onClick={handleSubmit}>Upload</button>
              </>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MediaUpload;
