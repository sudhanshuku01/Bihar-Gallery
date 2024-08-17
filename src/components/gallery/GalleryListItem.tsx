import React from "react";
import { NavLink } from "react-router-dom";

import { FaChevronRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa";

import { IoMdHome } from "react-icons/io";
import { MdOutlinePhotoCamera } from "react-icons/md";
import { FaVideo } from "react-icons/fa";
import { MdLeaderboard } from "react-icons/md";

const GalleryListItem: React.FC = () => {
  const scrollAmount = 100; // Amount to scroll on arrow click

  const scrollLeft = (): void => {
    const ulElement = document.querySelector(".gallerylistitem ul");
    if (ulElement) {
      ulElement.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = (): void => {
    const ulElement = document.querySelector(".gallerylistitem ul");
    if (ulElement) {
      ulElement.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="gallerylistitem">
      <p>
        <FaChevronLeft onClick={scrollLeft} />
      </p>
      <ul>
        <li>
          <NavLink to="/gallery" end>
            <IoMdHome />
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/gallery/images">
            <MdOutlinePhotoCamera />
            Images
          </NavLink>
        </li>
        <li>
          <NavLink to="/gallery/videos">
            <FaVideo />
            Videos
          </NavLink>
        </li>
        <li>
          <NavLink to="/gallery/leaderboard">
            <MdLeaderboard />
            LeaderBoard
          </NavLink>
        </li>
      </ul>
      <p>
        <FaChevronRight onClick={scrollRight} />
      </p>
    </div>
  );
};

export default GalleryListItem;
