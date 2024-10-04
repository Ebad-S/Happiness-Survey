import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserProfilePage from './pages/UserProfilePage';
import FloatingMenu from './components/FloatingMenu'; 
import Logo from './components/Logo'; 
import './styles/App.css';
import ErrorBoundary from './components/ErrorBoundary';
import { NotFoundPage, ErrorPage, APILimitExceededPage, ServerErrorPage } from './pages/UserMessages';
import AnalysisPage from './pages/AnalysisPage';
import ChartsPage from './pages/ChartsPage';
import Footer from './components/Footer';
import About from './components/About';
import Contact from './components/Contact';

const App: React.FC = () => {
  const [authState, setAuthState] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthState(true);
    }
  }, []);

  const updateAuthState = (status: boolean) => {
    setAuthState(status);
  };

  return (
    <ErrorBoundary>
      <div className="App">
        <Logo className="app-logo" /> 
        <FloatingMenu /> 
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage updateAuthState={updateAuthState} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/api-limit-exceeded" element={<APILimitExceededPage />} />
          <Route path="/server-error" element={<ServerErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/charts" element={<ChartsPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default App;