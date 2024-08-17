import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

interface Media {
  _id: string;
  key: string;
  mediaType: string;
  className: string;
  title: string;
  slugTitle: string;
  description: string;
  tags: string;
  location: string;
  isReviewed: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface MediaItem {
  url: string;
  media: Media;
}

const AdminMediaReview = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState<MediaItem[] | null>(null);

  const fetchAdminMediaReview = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/media/admin-media`
      );
      if (response && response.data.success) {
        setData(response.data.Data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAdminMediaReview();
  }, []);

  const handleClick = (slugTitle: string) => {
    const state = { previousLocation: location };
    navigate(`/media/${slugTitle}`, { state: state });
  };

  if (data === null) {
    return null;
  }

  return (
    <div className="adminmediareview">
      <h1>Please Review and Edit The Media</h1>
      <div className="adminmediareview-container">
        {data.map((item) => (
          <div
            key={item.media._id}
            className={`adminmediareview-container-item ${item.media.className}`}
            onClick={() => handleClick(item.media.slugTitle)}
          >
            {item.media.mediaType.startsWith("image") ? (
              <img src={item.url} alt={`${item.media.title}`} />
            ) : (
              <video src={item.url} controls></video>
            )}
            {!item.media.isReviewed && <p>In Review</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMediaReview;
