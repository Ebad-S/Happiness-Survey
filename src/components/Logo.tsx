import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <Link to="/">
      <img 
        src={logo} 
        alt="World Happiness Survey Logo" 
        className={className}
      />
    </Link>
  );
};

export default Logo;
