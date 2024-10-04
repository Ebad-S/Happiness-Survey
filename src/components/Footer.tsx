import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaXTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa6';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>Exploring global happiness trends and factors to promote well-being worldwide.</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/analysis">Analysis</Link></li>
            <li><Link to="/charts">Charts</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: info@worldhappiness.com</p>
          <p>Phone: +1 (123) 456-7890</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} World Happiness Report. All rights reserved.</p>
        <div className="social-icons">
          <a href="https://github.com/Ebad-S" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
          <a href="#" target="_blank" rel="noopener noreferrer"><FaXTwitter /></a>
          <a href="#" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          <a href="https://www.linkedin.com/in/ebad-salehi/" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;