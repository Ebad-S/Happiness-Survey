import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faBars, faTimes, faSignOutAlt, faChartBar, faTable, faEnvelope, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import '../styles/FloatingMenu.css';

const FloatingMenu: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    // Check login status
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    } else {
      setIsLoggedIn(false);
      setUsername(null);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername(null);
    navigate('/login');
  };

  console.log('User login status:', isLoggedIn ? 'Logged in' : 'Not logged in');
  console.log('Username:', username);

  return (
    <div className="floating-menu" ref={menuRef}>
      <button className={`menu-button ${menuOpen ? 'open' : ''}`} onClick={handleMenuToggle}>
        <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
      </button>
      {menuOpen && (
        <div className="menu-items-container">
          {isLoggedIn && (
            <div className="menu-item user-info">
              <span className="icon">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <span className="text">Welcome, {username || 'User'}</span>
            </div>
          )}
          <Link to="/" className="menu-item">
            <span className="icon">
              <FontAwesomeIcon icon={faHome} />
            </span>
            <span className="text">Home</span>
          </Link>
          <Link to="/about" className="menu-item">
            <span className="icon">
              <FontAwesomeIcon icon={faInfoCircle} />
            </span>
            <span className="text">About</span>
          </Link>
          <Link to="/contact" className="menu-item">
            <span className="icon">
              <FontAwesomeIcon icon={faEnvelope} />
            </span>
            <span className="text">Contact</span>
          </Link>
          {isLoggedIn ? (
            <>
              <Link to="/analysis" className="menu-item">
                <span className="icon">
                  <FontAwesomeIcon icon={faTable} />
                </span>
                <span className="text">Analysis</span>
              </Link>
              <Link to="/charts" className="menu-item">
                <span className="icon">
                  <FontAwesomeIcon icon={faChartBar} />
                </span>
                <span className="text">Charts</span>
              </Link>
              <Link to="/profile" className="menu-item">
                <span className="icon">
                  <FontAwesomeIcon icon={faUser} />
                </span>
                <span className="text">Profile</span>
              </Link>
              <button onClick={handleLogout} className="menu-item logout-button">
                <span className="icon">
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </span>
                <span className="text">Logout</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="menu-item">
              <span className="icon">
                <FontAwesomeIcon icon={faSignOutAlt} />
              </span>
              <span className="text">Login</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default FloatingMenu;
