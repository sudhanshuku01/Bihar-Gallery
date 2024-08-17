import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../../layout/Layout";
import { CiSearch } from "react-icons/ci";
import axios from "axios";
import { BlogDataTypes } from "../general/Blog";
import toast from "react-hot-toast";

const BlogSearchPage: React.FC = () => {
  const [data, setData] = useState<BlogDataTypes[]>([]);
  const [imageCache, setImageCache] = useState<Record<string, string>>({});
  const [query, setQuery] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };
  const searchQuery = () => {
    const searchQuery = new URLSearchParams(location.search).get("search");
    return searchQuery || "";
  };

  useEffect(() => {
    const searched = searchQuery();
    setQuery(searched);
    searchPosts(searched);
  }, [location.search]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && query.trim()) {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set("search", query.trim());
      navigate({ search: searchParams.toString() });
    }
  };
  const handleSearchpress = () => {
    if (query.trim()) {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set("search", query.trim());
      navigate({ search: searchParams.toString() });
    } else {
      toastMessage("Please enter something!");
    }
  };
  const searchPosts = async (query: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/blog/search?query=${query}`
      );
      if (response && response.data.success) {
        setData(response.data.posts);
      } else {
        setData([]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const TruncatedText = (text: string, digit: number) => {
    const truncatedText =
      text.length > digit ? text.slice(0, digit) + "..." : text;
    return truncatedText;
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
  const getImageUrl = useCallback(
    async (key: string) => {
      if (imageCache[key]) {
        return imageCache[key];
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/blog/getImage?key=${key}`
        );
        const url = response.data;

        setImageCache((prevCache) => ({
          ...prevCache,
          [key]: url,
        }));

        return url;
      } catch (error) {
        console.error("Error fetching image URL:", error);
        return "/path/to/placeholder/image.jpg"; // Placeholder image URL
      }
    },
    [imageCache]
  );

  const BlogImage = React.memo(({ imageKey }: { imageKey: string }) => {
    const [imageUrl, setImageUrl] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
      const fetchImageUrl = async () => {
        const url = await getImageUrl(imageKey);
        setImageUrl(url);
        setLoading(false);
      };

      fetchImageUrl();
    }, [imageKey, getImageUrl]);

    if (loading) {
      return <div>Loading...</div>;
    }

    return <img src={imageUrl} alt={`img-${imageKey}`} />;
  });

  return (
    <Layout>
      <div className="blogsearchpage-search">
        <h1>Search</h1>
        <div>
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Type your search and press Enter"
          />
          <p onClick={handleSearchpress}>
            <CiSearch />
          </p>
        </div>
      </div>
      <div className="blogsearchpage-main">
        <h1>Searched Results</h1>
        <div className="blogsearchpage-main-container">
          {data.map((item, index) => (
            <div
              onClick={() => navigate(`/blog/${item.slugTitle}`)}
              key={index}
              className="blogsearchpage-main-container-item"
            >
              <BlogImage imageKey={item.imageKey} />
              <div>
                <h1>{TruncatedText(item.title, 150)}</h1>
                <p>{TruncatedText(item.description, 400)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default BlogSearchPage;
