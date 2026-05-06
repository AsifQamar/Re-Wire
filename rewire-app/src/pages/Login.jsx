import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ onClose }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleClose = () => {
    if (onClose) onClose();
    else navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegistering 
      ? { username, email, password, role } 
      : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('rewireToken', data.token);
        localStorage.setItem('rewireUser', JSON.stringify(data));
        
        handleClose();
        if (data.role === 'recycler') navigate('/recycler');
        else navigate('/user');
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Server connection failed');
    }
  };

  return (
    <div className="auth-page" onClick={handleClose}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={handleClose}>&times;</button>
        <h1 className="auth-title">{isRegistering ? 'Register for ReWire' : 'Login to ReWire'}</h1>
        
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegistering && (
            <input 
              type="text" placeholder="Username" 
              value={username} onChange={(e) => setUsername(e.target.value)} required 
            />
          )}
          <input 
            type="email" placeholder="Email" 
            value={email} onChange={(e) => setEmail(e.target.value)} required 
          />
          <input 
            type="password" placeholder="Password" 
            value={password} onChange={(e) => setPassword(e.target.value)} required 
          />
          
          {isRegistering && (
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">Household User</option>
              <option value="recycler">Recycler</option>
            </select>
          )}

          <button type="submit" className="btn btn-teal auth-submit">
            {isRegistering ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <button 
          type="button"
          onClick={() => setIsRegistering(!isRegistering)}
          className="auth-switch"
        >
          {isRegistering ? 'Already have an account? Log in' : 'Need an account? Register'}
        </button>
      </div>
    </div>
  );
}