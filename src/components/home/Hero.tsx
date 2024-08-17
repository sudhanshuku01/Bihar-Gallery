import { useNavigate } from "react-router-dom";
import bihar_IMG from "../../images/vikrant-negi-f11IOy8rnkc-unsplash.jpg";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className="home-hero">
      <div className="home-hero-left">
        <div className="home-hero-left-content">
          <h1>
            Discover the <br /> Heritage of Bihar
          </h1>
          <p>
            Unveiling the Rich Tapestry of Culture, History, <br /> and Artistry
            in the Heart of India
          </p>
          <button onClick={() => navigate("/blog")}>Start Exploring</button>
        </div>
      </div>
      <div className="home-hero-right">
        <img src={bihar_IMG} alt="mahabodhi temple" />
      </div>
    </div>
  );
};

export default Hero;
