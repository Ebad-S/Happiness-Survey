import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, getFactors } from '../services/api';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import AlertMessage from '../components/AlertMessage';
import '../styles/LoginForm.css';

interface LoginPageProps {
  updateAuthState: (status: boolean) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ updateAuthState }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'error' | 'success'>('error');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = await login(username, email, password);
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      updateAuthState(true);
      
      // Fetch factors data for the available years
      const currentYear = new Date().getFullYear();
      const startYear = Math.max(2015, currentYear - 5);
      const endYear = Math.min(2020, currentYear);
      
      for (let year = startYear; year <= endYear; year++) {
        try {
          await getFactors(year);
        } catch (error) {
          console.error(`Error fetching factors for year ${year}:`, error);
          
        }
      }
      
      setAlertMessage('Login successful');
      setAlertSeverity('success');
      setAlertOpen(true);
      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        setAlertMessage(error.message);
      } else {
        setAlertMessage('Login failed. Please check your credentials and try again.');
      }
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  return (
    <div className="login-container">
      <form className="form" onSubmit={handleSubmit} aria-labelledby="login-title">
        <h1 id="login-title" className="title">Login</h1>
        <p className="message">Login now and get full access to our app.</p>        
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            required
            type="text"
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            id="username"
            name="username"
            aria-required="true"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            required
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            name="email"
            aria-required="true"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-input">
            <input
              required
              type={showPassword ? "text" : "password"}
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              name="password"
              aria-required="true"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <button className="submit" type="submit">Login</button>
        <p className="signin">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
      {alertOpen && (
        <AlertMessage
          open={alertOpen}
          message={alertMessage}
          severity={alertSeverity}
          onClose={handleAlertClose}
        />
      )}
    </div>
  );
};

export default LoginPage;