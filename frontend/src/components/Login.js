import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Updated hook

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // useNavigate hook replaces useHistory

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous errors
    setSuccessMessage(''); // Clear previous success message

    try {
      const response = await axios.post('http://localhost:8090/login', {
        username,
        password
      });

      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        setSuccessMessage('Login successful!');
        alert("Login successfully");

        // Redirect to the homepage after successful login
        navigate('/home'); // useNavigate replaces history.push
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('An error occurred during login.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default Login;
