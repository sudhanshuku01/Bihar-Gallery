import GallerySearchBar from "../gallery/GallerySearchBar";
import GalleryListItem from "../gallery/GalleryListItem";
import Layout from "../../layout/Layout";
import MediaContainer from "../gallery/MediaContainer";
import flower_icon from "../../images/flower-100263_1280.jpg";

const Gallery = () => {
  return (
    <Layout
      title="Free Stock Images and Videos of Bihar's Culture | Bihar Gallery"
      description="Discover free stock images and videos showcasing Bihar's vibrant culture and heritage. Browse through beautiful photographs and videos captured by talented photographers on Bihar Gallery."
      keywords="Bihar images, Bihar videos, Bihar photography, Bihar culture, Bihar heritage, Bihar stock images, Bihar stock videos"
      author="Bihar Gallery"
      url="https://www.bihargallery.com/gallery"
    >
      <div className="gallery">
        <div className="gallery-header">
          <img className="banner" src={flower_icon} alt="bihar gallery header banner icon" />
          <h1>
            Free stock images and videos of Bihar's vibrant culture and heritage
            by talented photographers.
          </h1>
          <GallerySearchBar />
        </div>
        <GalleryListItem />
        <MediaContainer />
      </div>
    </Layout>
  );
};

export default Gallery;
