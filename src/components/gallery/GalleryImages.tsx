import Layout from "../../layout/Layout";
import ImageContainer from "./ImageContainer";
import GallerySearchBar from "./GallerySearchBar";
import GalleryListItem from "./GalleryListItem";
import flower_icon from "../../images/flower-100263_1280.jpg";

const GalleryImages = () => {
  return (
    <Layout
      title="Free Stock Images of Bihar's Culture | Bihar Gallery"
      description="Explore free stock images of Bihar's vibrant culture and heritage captured by talented photographers. Discover high-quality photographs depicting the beauty of Bihar on Bihar Gallery."
      keywords="Bihar images, Bihar stock images, Bihar culture, Bihar heritage, Bihar photography, free stock images Bihar"
      author="Your Name"
      url="https://www.bihargallery.com/gallery/images"
    >
      <div className="galleryimages">
        <div className="galleryimages-header">
          <img className="banner" src={flower_icon} alt="bihar gallery image flower icon" />
          <h1>
            Free stock images of Bihar's vibrant culture and heritage by
            talented photographers.
          </h1>
          <GallerySearchBar />
        </div>
        <GalleryListItem />
        <ImageContainer />
      </div>
    </Layout>
  );
};

export default GalleryImages;
