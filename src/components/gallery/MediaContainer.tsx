import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../../context/ProgressContext";

interface DataType {
  url: string;
  slugTitle: string;
  mediaType: string;
  className: string;
  userName: string;
  image: string;
}

const MediaContainer: React.FC = () => {
  const navigate = useNavigate();
  const { setProgress } = useProgress();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataType[]>([]);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [postLoading, setPostLoading] = useState(false);

  useEffect(() => {
    setProgress(20);
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/media/get-media`, {
        params: { page: 1 },
      })
      .then((response) => {
        setProgress(50);
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
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/media/get-media`, {
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

  return data ? (
    <div className="media-container">
      <div className="media-container-grid">
        {data.map((item, index) => (
          <div
            key={index}
            className={`media-container-grid-item ${item.className}`}
            onClick={() => handleClick(item.slugTitle)}
          >
            {item.mediaType.startsWith("image") ? (
              <img src={item.url} alt={item.slugTitle} />
            ) : (
              <video src={item.url} />
            )}
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
      <div className="media-container-button">
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
  ) : (
    <div>Loading...</div>
  );
};

export default MediaContainer;
