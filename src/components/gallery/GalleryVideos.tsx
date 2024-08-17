import Layout from "../../layout/Layout";
import GalleryListItem from "./GalleryListItem";
import GallerySearchBar from "./GallerySearchBar";
import VideoContainer from "./VideoContainer";
import flower_icon from "../../images/flower-100263_1280.jpg";

const GalleryVideos = () => {
  return (
    <Layout
      title="Free Stock Videos of Bihar's Culture | Bihar Gallery"
      description="Explore free stock videos showcasing Bihar's vibrant culture and heritage captured by talented videographers. Discover high-quality videos depicting the beauty of Bihar on Bihar Gallery."
      keywords="Bihar videos, Bihar stock videos, Bihar culture, Bihar heritage, Bihar videography, free stock videos Bihar"
      author="Your Name"
      url="https://www.bihargallery.com/gallery/videos"
    >
      <div className="galleryvideos">
        <div className="galleryvideos-header">
          <img className="banner" src={flower_icon} alt="bihar gallery video banner" />
          <h1>
            Free stock videos of Bihar's vibrant culture and heritage by
            talented photographers.
          </h1>
          <GallerySearchBar />
        </div>
        <GalleryListItem />
        <VideoContainer />
      </div>
    </Layout>
  );
};

export default GalleryVideos;
