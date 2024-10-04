import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import AlertMessage from '../components/AlertMessage';
import '../styles/LoginForm.css';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'error' | 'success'>('error');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertMessage('');

    if (password !== retypePassword) {
      setAlertMessage('Passwords do not match');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }

    try {
      await register(username, email, password);
      setAlertMessage('Registration successful. Please log in.');
      setAlertSeverity('success');
      setAlertOpen(true);
      navigate('/login');
    } catch (error) {
      if (error instanceof Error) {
        setAlertMessage(error.message);
      } else {
        setAlertMessage('Registration failed. Please try again.');
      }
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleRetypePasswordVisibility = () => {
    setShowRetypePassword(!showRetypePassword);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  return (    
    <div className="register-container">
      <form className="form" onSubmit={handleRegister} aria-labelledby="register-title">
        <h1 id="register-title" className="title">Register</h1>
        <p className="message">Create an account to get started.</p>
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
        <div className="form-group">
          <label htmlFor="retype-password">Retype Password</label>
          <div className="password-input">
            <input
              required
              type={showRetypePassword ? "text" : "password"}
              className="input"
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
              id="retype-password"
              name="retype-password"
              aria-required="true"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={toggleRetypePasswordVisibility}
              aria-label={showRetypePassword ? "Hide retyped password" : "Show retyped password"}
            >
              {showRetypePassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <button className="submit" type="submit">Register</button>
        <p className="signin">
          Already have an account? <Link to="/login">Login</Link>
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

export default RegisterPage;