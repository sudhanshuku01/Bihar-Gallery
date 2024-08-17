import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-title">
        <Link to="/">Bihar Gallery</Link>
      </div>
      <ul className="footer-ul">
        <li>
          <Link to="/aboutus">About Us</Link>
        </li>
        <li>
          <Link to="/contactus">Contact Us</Link>
        </li>
      </ul>
      <div className="footer-policy">
        <Link to="/privacy-policy">© 2024 Bihar Gallery. Privacy Policy</Link>
      </div>
    </div>
  );
};

export default Footer;
