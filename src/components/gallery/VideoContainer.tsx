import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../../context/ProgressContext";
interface DataType {
  url: string;
  slugTitle: string;
  className: string;
  userName: string;
  image: string;
}
const VideoContainer: React.FC = () => {
  const { setProgress } = useProgress();

  const [loading, setLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);

  const navigate = useNavigate();
  const [data, setData] = useState<DataType[]>([]);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    setProgress(20);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/media/get-videos`, {
        params: { page: 1 },
      })
      .then((response) => {
        setProgress(70);
        if (response.data.success) {
          if (totalPages === null) {
            setTotalPages(response.data.totalPages);
          }
          setData(response.data.Data);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
        setProgress(100);
      });
  }, []);

  const loadMorePost = () => {
    if (totalPages && page >= totalPages) {
      return;
    }
    setPostLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/media/get-videos`, {
        params: { page: page + 1 },
      })
      .then((response) => {
        if (response.data.success) {
          const newData = response.data.Data;
          setData((prevData) => [...prevData, ...newData]);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setPostLoading(false);
        setPage((prevpage) => prevpage + 1);
      });
  };
  const handleClick = (slugTitle: string) => {
    navigate(`/media/${slugTitle}`);
  };
  return (
    <div className="video-container">
      <div className="video-container-grid">
        {data.map((item, index) => (
          <div
            key={index}
            className={`video-container-grid-item`}
            onClick={() => handleClick(item.slugTitle)}
          >
            <video src={item.url} />
          </div>
        ))}
        {loading && (
          <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        )}
      </div>
      <div className="image-container-button">
        {postLoading ? (
          <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        ) : (
          <button onClick={loadMorePost} disabled={page >= totalPages!}>
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoContainer;
