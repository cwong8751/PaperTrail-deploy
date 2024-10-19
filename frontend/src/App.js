import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Updated imports
import Login from './components/Login';
import Register from './components/Register';
import Homepage from './components/Homepage';

function App() {
  const isAuthenticated = localStorage.getItem('authToken') !== null;

  return (
    <Router>
      <div className="App">
        <h1>Welcome to My WebApp</h1>
        <Routes> {/* Replace Switch with Routes */}
          <Route path="/register" element={isAuthenticated ? <Navigate to="/home" /> : <Register />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />
          <Route path="/home" element={isAuthenticated ? <Homepage /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/register" />} /> {/* Catch-all route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
