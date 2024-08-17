import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../../context/ProgressContext";

interface DataType {
  url: string;
  slugTitle: string;
  className: string;
  userName: string;
}

const ImageContainer: React.FC = () => {
  const navigate = useNavigate();
  const { setProgress } = useProgress();
  const [data, setData] = useState<DataType[]>([]);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setProgress(20);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/media/get-images`, {
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
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/media/get-images`, {
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
    <div className="image-container">
      <div className="image-container-grid">
        {data.map(({ url, className, slugTitle }, index) => (
          <div
            onClick={() => handleClick(slugTitle)}
            key={index}
            className={`image-container-grid-item ${className}`}
          >
            <img src={url} alt={slugTitle} />
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

export default ImageContainer;
