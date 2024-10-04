import React from 'react';
import '../styles/About.css'; 

function About() {
  return (
    <div className="About">
      <h1>About World Happiness Report</h1>
      <p>
        The World Happiness Report is a landmark survey of the state of global happiness. 
        The report continues to gain global recognition as governments, organizations and 
        civil society increasingly use happiness indicators to inform their policy-making decisions.
      </p>
      
      <div className="mission-statement">
        <h2>Our Mission</h2>
        <p>
          To empower individuals and nations with data-driven insights into the factors 
          that contribute to happiness, fostering a global movement towards greater well-being and life satisfaction.
        </p>
      </div>

      <h2>Our Team</h2>
      <div className="team-members">
        <div className="team-member">
          <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="John Doe" />
          <h3>John Doe</h3>
          <p>Lead Researcher</p>
        </div>
        <div className="team-member">
          <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Jane Smith" />
          <h3>Jane Smith</h3>
          <p>Data Analyst</p>
        </div>
        {/* Add more team members as needed */}
      </div>
    </div>
  );
}

export default About;
