import React, { useEffect, useRef } from "react";
import LordBuddhaIMG from "../../images/lordbuddha.jpg";
import NalandaIMG from "../../images/nalanaduniversity.jpg";
import VikramshilaIMG from "../../images/vikramshila.jpg";
import PawaPuriIMG from "../../images/pawapuri.jpg";
import ShershahIMG from "../../images/shershahmakbara.jpg";

const images = [
  LordBuddhaIMG,
  NalandaIMG,
  VikramshilaIMG,
  PawaPuriIMG,
  ShershahIMG,
];

const Carousel: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slider = sliderRef.current!;
    let currentIndex = 0;

    const nextSlide = () => {
      currentIndex++;
      if (currentIndex >= images.length) {
        currentIndex = 0;
        slider.style.transition = "none";
        slider.style.transform = `translateX(0)`;
      } else {
        slider.style.transition = "transform 0.5s ease-in-out";
        slider.style.transform = `translateX(-${currentIndex * 300}px)`;
      }
    };

    const intervalId = setInterval(nextSlide, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="carousel-container">
      <div className="carousel-slider" ref={sliderRef}>
        {images.concat(images).map((image, index) => (
          <div
            key={index}
            className="carousel-image"
            style={{ backgroundImage: `url(${image})` }}
          ></div>
        ))}
      </div>
    </div>
  );
};
export default Carousel;
