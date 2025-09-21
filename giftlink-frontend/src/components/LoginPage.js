import React, { useState, useEffect } from 'react';
import { urlConfig } from '../config';
import { useAppContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [incorrect, setIncorrect] = useState('');
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAppContext();

  useEffect(() => {
    if (sessionStorage.getItem('auth-token')) navigate('/app');
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();

      if (json.authtoken) {
        sessionStorage.setItem('auth-token', json.authtoken);
        sessionStorage.setItem('name', json.userName);
        sessionStorage.setItem('email', json.userEmail);
        setIsLoggedIn(true);
        navigate('/app');
      } else {
        setEmail('');
        setPassword('');
        setIncorrect('Wrong password. Try again.');
        setTimeout(() => setIncorrect(''), 2000);
      }
    } catch (err) {
      console.error('Login failed', err);
      setIncorrect('Login failed. Try again later.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="login-card p-4 border rounded">
            <h2 className="text-center mb-4 font-weight-bold">Login</h2>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                type="text"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setIncorrect(''); }}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setIncorrect(''); }}
              />
              <span style={{ color:'red', fontStyle:'italic', fontSize:'12px', display:'block' }}>{incorrect}</span>
            </div>
            <button className="btn btn-primary w-100 mb-3" onClick={handleLogin}>Login</button>
            <p className="mt-4 text-center">
              New here? <Link to="/app/register" className="text-primary">Register Here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
