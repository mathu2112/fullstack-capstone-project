import React, { useState } from 'react';
import { urlConfig } from 'config';                  // absolute import from src
import { useAppContext } from 'context/AuthContext'; // absolute import from src/context
import { useNavigate, Link } from 'react-router-dom';
import './RegisterPage.css';

function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAppContext();

  const handleRegister = async () => {
    try {
      const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const json = await response.json();

      if (json.authtoken) {
        sessionStorage.setItem('auth-token', json.authtoken);
        sessionStorage.setItem('name', firstName);
        sessionStorage.setItem('email', json.email);
        setIsLoggedIn(true);
        navigate('/app');
      } else {
        setErrorMsg(json.error || 'Registration failed.');
        setTimeout(() => setErrorMsg(''), 3000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMsg('Something went wrong. Try again later.');
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="register-card p-4 border rounded">
            <h2 className="text-center mb-4 font-weight-bold">Register</h2>

            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">First Name</label>
              <input
                id="firstName"
                type="text"
                className="form-control"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">Last Name</label>
              <input
                id="lastName"
                type="text"
                className="form-control"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                type="text"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {errorMsg && (
              <div className="text-danger mb-2" style={{ fontSize: '12px', fontStyle: 'italic' }}>
                {errorMsg}
              </div>
            )}

            <button className="btn btn-primary w-100 mb-3" onClick={handleRegister}>
              Register
            </button>

            <p className="mt-4 text-center">
              Already a member? <Link to="/app/login" className="text-primary">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
