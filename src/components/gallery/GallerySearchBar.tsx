import { useState } from "react";

import { FaAngleUp } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { FaImages } from "react-icons/fa6";
import { MdVideoLibrary } from "react-icons/md";

interface mediaObjectTypes {
  name: string;
  icon: React.ReactElement;
}
const mediaObject: mediaObjectTypes[] = [
  {
    name: "Image",
    icon: <FaImages />,
  },
  {
    name: "Video",
    icon: <MdVideoLibrary />,
  },
];
const GallerySearchBar = () => {
  // const [selectedMedia, setselectedMedia] = useState<string>();
  // const [inputValue, setinputValue] = useState<string>();
  const [mediaIndex, setmediaIndex] = useState<number>(0);
  return (
    <article className="gallerysearchbar">
      <div className="mediaselect">
        <div className="main">
          <p>{mediaObject[mediaIndex].icon}</p>
          <h1>{mediaObject[mediaIndex].name}</h1>
          <p>{<FaAngleUp />}</p>
        </div>
        <div className="dropdown">
          {mediaObject.map((item, index) => (
            <div onClick={() => setmediaIndex(index)} key={index}>
              <p>{item.icon}</p>
              <h1>{item.name}</h1>
            </div>
          ))}
        </div>
      </div>
      <input placeholder="Search here" required type="text" />
      <p>{<CiSearch />}</p>
    </article>
  );
};

export default GallerySearchBar;
