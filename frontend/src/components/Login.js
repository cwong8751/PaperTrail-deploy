import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await axios.post('http://localhost:8090/login', { username, password });

      // Check if the response contains token and username
      if (response.data.token && response.data.username) {
        // Store the token and username in localStorage
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('username', response.data.username);

        // Display success message and navigate to home page
        setSuccessMessage('Login successful!');
        alert("Login successfully");
        navigate('/');
      } else {
        setErrorMessage('Login failed. Please try again.');
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="fixed top-0 z-50 w-full p-4 border-b  bg-white flex justify-start items-center space-x-4 shadow-md">
        <Link className="bg-blue-500 text-white rounded-md px-4 py-2 shadow-md hover:bg-blue-600 transition-all" to="/">
          Return to Home
        </Link>
      </div>
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold">Login</h2>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all"
          >
            Login
          </button>
        </form>

        {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
        {successMessage && <p className="mt-4 text-green-500">{successMessage}</p>}

        <div className="mt-6 text-center">
          <Link to="/register" className="text-blue-500 hover:underline">Don't have an account? Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
