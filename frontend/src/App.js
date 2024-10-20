import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // Updated imports
import Login from './components/Login';
import axios from 'axios';
import Register from './components/Register';
import Homepage from './components/Homepage';
import LearnMore from './components/LearnMore';
import ReadyToGo from './components/ReadyToGo';
import ProductPage from './components/Product';
import FinanceManager from './components/FinanceManager';
import GetAccessToken from './finance/GetAccessToken';
function App() {

  return (
    <Router>
      <div>

        <Routes> {/* Replace Switch with Routes */}
          <Route path="/signup" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/learn-more" element={<LearnMore/>} />
          <Route path="/ready" element={<ReadyToGo />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/financemanager" element={<FinanceManager />} />
          <Route path="/test" element={<GetAccessToken />} />
          <Route path="/" element={<Homepage />} />
          {/* <Route path="*" element={<Navigate to="/register" />} /> Catch-all route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
