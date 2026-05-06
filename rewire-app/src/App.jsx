import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import User from './pages/User';
import Recycler from './pages/Recycler';
import Checkout from './pages/Checkout';

function AppContent() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navigate = useNavigate();
  
  // Re-check authentication strictly when needed
  const isAuthenticated = !!localStorage.getItem('rewireToken');

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/" state={{ requireLogin: true }} replace />;
    }
    return children;
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <nav>
        <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
          Re<span>Wire</span>
        </Link>
        <div className="nav-links">
          {isAuthenticated ? (
            <button 
              onClick={handleLogout} 
              className="btn btn-outline btn-sm"
            >
              Logout
            </button>
          ) : (
            <button 
              onClick={() => setIsLoginOpen(true)} 
              className="btn btn-teal btn-sm"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Page Routes */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home openLogin={() => setIsLoginOpen(true)} />} />
          <Route path="/user" element={<ProtectedRoute><User /></ProtectedRoute>} />
          <Route path="/recycler" element={<ProtectedRoute><Recycler /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      {/* Login Modal */}
      {isLoginOpen && <Login onClose={() => setIsLoginOpen(false)} />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;