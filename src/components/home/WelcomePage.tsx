import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BlogDataTypes } from "../general/Blog";

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
      <div className="welcome-intro">
        <div className="intro">
          <h2>
            Welcome to Bihar Gallery: Celebrating the Cultural Heritage of Bihar
          </h2>
          <p>
            Thank you for visiting Bihar Gallery! We are excited to share the
            rich cultural heritage of Bihar with you. Our platform offers a
            curated collection of images, videos, and blogs that highlight the
            vibrant history, festivals, and traditions of this remarkable
            region.
          </p>
          <p>
            Explore Bihar's architectural wonders, immerse yourself in its
            colorful festivals, and discover the timeless traditions that define
            this unique state. Whether you're reconnecting with your roots or
            learning about Bihar for the first time, our gallery provides a
            comprehensive view of its cultural richness.
          </p>
          <p>
            Bihar Gallery is a community-driven platform. We invite you to
            contribute by sharing your own stories, images, and videos. Your
            participation helps us collectively appreciate and preserve Bihar’s
            cultural legacy.
          </p>
          <p>
            Join us in celebrating Bihar's heritage. Together, we can ensure
            that the culture of this incredible state continues to inspire
            future generations. Welcome to Bihar Gallery—where every story is a
            celebration of Bihar.
          </p>
        </div>
        <div className="welcome-blog">
          <div className="intro">
            <h2>
              Insights and Stories: Dive Into the Cultural Narratives of Bihar
            </h2>
            <p>
              Our blog section offers a rich array of articles that delve deep
              into the history, culture, and traditions of Bihar. Here, you can
              read about the significance of various festivals, the stories
              behind iconic landmarks, and the lives of notable personalities
              who have shaped the cultural landscape of Bihar. Whether you're
              interested in historical accounts, personal narratives, or
              contemporary cultural analysis, our blog is the perfect place to
              explore and understand the essence of Bihar.
            </p>
            <p>
              Stay updated with our latest posts, and don't miss out on the
              opportunity to contribute your own stories and perspectives.
              Together, we can build a comprehensive narrative that celebrates
              the diversity and richness of Bihar’s culture.
            </p>
          </div>
          <div className="content">
            <h1>Checkout Trending Blogs</h1>
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
        <div>
          <h1></h1>
        </div>
      </div>

      <div className="welcome-gallery">
        <div className="intro">
          <h2>Visual Journey: Explore Bihar Through Images and Videos</h2>
          <p>
            Our gallery is a visual feast, offering a stunning collection of
            images and videos that capture the true essence of Bihar. From the
            grandeur of ancient monuments to the vibrant hues of local
            festivals, every image tells a story of its own. Whether it's the
            serene landscapes of Bodh Gaya or the bustling streets of Patna, our
            gallery invites you to experience Bihar like never before.
          </p>
          <p>
            We also encourage you to add your own visual stories to our
            collection. By sharing your photos and videos, you can help showcase
            the beauty and cultural richness of Bihar to a wider audience.
            Together, we can create a living archive that celebrates Bihar in
            all its glory.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
