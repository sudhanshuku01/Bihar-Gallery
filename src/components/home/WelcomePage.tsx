import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BlogDataTypes } from "../general/Blog";
import Carousel from "./Carousel";

const WelcomePage = () => {
  const [data, setData] = useState<BlogDataTypes[] | null>(null);
  const [imageCache, setImageCache] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  // Fetch blog posts
  const fetchGetPosts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/blog`
      );
      if (response && response.data.success) {
        setData(response.data.posts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchGetPosts();
  }, []);

  const TruncatedText = (text: string, digit: number) => {
    return text.length > digit ? text.slice(0, digit) + "..." : text;
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
    <div className="welcome">
      <div className="welcome-gallery">
        <h1>Gallery</h1>
        <Carousel />
      </div>
      <div className="welcome-blog">
        <h1>Blog</h1>
        <article className="blog-container">
          {data?.map((item, index) => (
            <div
              onClick={() => navigate(`/blog/${item.slugTitle}`)}
              key={index}
              className="blog-container-item"
            >
              <BlogImage imageKey={item.imageKey} />
              <div>
                <h1>{TruncatedText(item.title, 150)}</h1>
                <p>{TruncatedText(item.description, 400)}</p>
              </div>
            </div>
          ))}
        </article>
      </div>
    </div>
  );
};

export default WelcomePage;
