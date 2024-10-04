import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userProfileImage from '../assets/userprofile.jpg';  
import '../styles/UserProfilePage.css';  

interface User {
  username: string;
  email?: string;
}

const UserProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({ 
        username: payload.username || payload.email.split('@')[0], // Fallback to email username if no username
        email: payload.email 
      });
    } catch (error) {
      console.error('Error decoding token:', error);
      navigate('/login');
    }
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        
        <div className="profile-title">
          <h1>Your Profile Overview</h1>
          <p>
            Manage your account details, view activity, and personalize your experience. 
            Stay up-to-date with your interactions and make the most of your journey here.
          </p>
        </div>
      </div>
      <div className="profile-content">
        <h2 style={{ textAlign: 'center' }}>User Profile</h2>
        <img src={userProfileImage} alt="User Profile" className="profile-image" />
        <div className="profile-details">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email || 'N/A'}</p>
        </div>
        <div className="profile-stats">
          <div className="stat-item">
            <h3>Surveys Completed</h3>
            <p>15</p>
          </div>
          <div className="stat-item">
            <h3>Happiness Score</h3>
            <p>7.8 / 10</p>
          </div>
        </div>
        <div className="profile-actions">
          <button className="edit-profile-btn">Edit Profile</button>
          <button className="change-password-btn">Change Password</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;