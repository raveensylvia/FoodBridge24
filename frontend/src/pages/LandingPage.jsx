import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page fade-in">
      <header className="hero">
        <div className="container hero-content">
          <h1>Bridging the Gap Between <br /><span>Abundance</span> and <span>Need</span></h1>
          <p>Join FoodBridge to rescue surplus food and deliver it to those who need it most. A real-time platform for donors, NGOs, and volunteers.</p>
          <div className="hero-btns">
            <Link to="/signup" className="btn btn-primary btn-lg">Get Started</Link>
            <Link to="/login" className="btn btn-outline btn-lg">Login</Link>
          </div>
        </div>
      </header>

      <section className="roles-section">
        <div className="container">
          <h2 className="section-title">How You Can Help</h2>
          <div className="roles-grid">
            <div className="role-card card">
              <div className="role-icon">🍲</div>
              <h3>Donors</h3>
              <p>Restaurants, hotels, or individuals with surplus food can post donations instantly.</p>
              <Link to="/signup?role=donor" className="role-link">Become a Donor →</Link>
            </div>
            <div className="role-card card">
              <div className="role-icon">🏢</div>
              <h3>NGOs</h3>
              <p>Shelters and NGOs can claim available food and manage distributions.</p>
              <Link to="/signup?role=ngo" className="role-link">Join as NGO →</Link>
            </div>
            <div className="role-card card">
              <div className="role-icon">🚚</div>
              <h3>Volunteers</h3>
              <p>Passionate individuals can help by picking up and delivering food.</p>
              <Link to="/signup?role=volunteer" className="role-link">Start Volunteering →</Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 FoodBridge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
