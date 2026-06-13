import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="logo">
          <span className="logo-food">Food</span>
          <span className="logo-bridge">Bridge</span>
        </Link>
        <div className="nav-links">
          {!user ? (
            <>
              <Link to="/login" className="nav-item">Login</Link>
              <Link to="/signup" className="btn btn-primary">Sign Up</Link>
            </>
          ) : (
            <>
              <Link to={`/${user.role}`} className="nav-item">Dashboard</Link>
              <span className="user-info">Hi, {user.username} ({user.role})</span>
              <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
