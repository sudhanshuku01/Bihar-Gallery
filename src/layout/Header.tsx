import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const Header = () => {
  const [auth] = useAuth();
  const navigate = useNavigate();
  const [isScreenSmall, setIsScreenSmall] = useState(window.innerWidth < 800);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsScreenSmall(window.innerWidth < 800);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="header">
      <div className="header-title">
        <h1 onClick={() => navigate("/")}>Bihar Gallery</h1>
      </div>
      {isScreenSmall ? (
        <>
          <div
            className={`header-ul-menubar ${isMenuOpen ? "open" : ""}`}
            onClick={handleMenuClick}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
          {isMenuOpen && (
            <ul className="header-ul-smallscreen">
              <li>
                <Link to="/blog">Blog</Link>
              </li>
              <li>
                <Link to="/gallery">Gallery</Link>
              </li>
              {auth.user === null ? (
                <li>
                  <Link to="/user/login">Login</Link>
                </li>
              ) : (
                <li>
                  <Link to={`/user/${auth.user.userName}`}>
                    {auth.user.userName}
                  </Link>
                </li>
              )}
              <li>
                <Link to="/media-upload">Upload</Link>
              </li>
            </ul>
          )}
        </>
      ) : (
        <ul className="header-ul">
          <li>
            <Link to="/blog">Blog</Link>
          </li>
          <li>
            <Link to="/gallery">Gallery</Link>
          </li>
          {auth.user === null ? (
            <li>
              <Link to="/user/login">Login</Link>
            </li>
          ) : (
            <li>
              <Link to={`/user/${auth.user.userName}`}>
                {auth.user.userName}
              </Link>
            </li>
          )}
          <li>
            <Link to="/media-upload">Upload</Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Header;
