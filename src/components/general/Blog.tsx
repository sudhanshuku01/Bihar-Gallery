import React, { useEffect, useState, useCallback } from "react";
import Layout from "../../layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";

export interface BlogDataTypes {
  _id: string;
  imageKey: string;
  title: string;
  html: string;
  slugTitle: string;
  description: string;
  tags: string;
}

const Blog = () => {
  const [query, setQuery] = useState("");
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

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      navigate(`/blog/search?search=${query}`);
    }
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
    <Layout
      title="Explore Articles - Bihar Gallery"
      description="Discover a collection of blog articles on Bihar Gallery. Explore historical events, places, and more."
      keywords="Bihar blog, historical articles, historical events, Bihar Gallery"
      author="Bihar Gallery"
      type="article"
      url="https://www.bihargallery.com/blog"
    >
      <section className="blog">
        <article className="blog-search">
          <h1>Search</h1>
          <p>Search your favorite article</p>
          <div>
            <input
              onKeyDown={handleKeyPress}
              type="text"
              placeholder="Search here..."
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
            <p onClick={() => navigate(`/blog/search?search=${query}`)}>
              <CiSearch />
            </p>
          </div>
        </article>
        <article className="blog-title">
          <h1>Top Blog Articles</h1>
        </article>
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
      </section>
    </Layout>
  );
};

export default Blog;
