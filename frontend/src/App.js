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
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Homepage />} />
          {/* <Route path="*" element={<Navigate to="/register" />} /> Catch-all route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
