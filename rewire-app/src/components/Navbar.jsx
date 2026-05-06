import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const goSec = (id) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav>
      <div className="logo" onClick={() => navigate('/')}>Re<span>Wire</span></div>
      <ul className="nav-links">
        <li><a onClick={() => goSec('how')}>How it Works</a></li>
        <li><a onClick={() => goSec('cats')}>What We Accept</a></li>
        <li><a onClick={() => goSec('impact')}>Impact</a></li>
        <li><Link to="/user" className="ncta">Schedule Pickup</Link></li>
      </ul>
    </nav>
  );
}