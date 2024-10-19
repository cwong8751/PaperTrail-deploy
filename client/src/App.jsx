import { useState } from 'react'
import Home from './pages/Home'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import { Login, Register } from './pages/AuthPages'
import { ChatInterface, RealTimeOCR } from './pages/ChatInterface'
function App() {


  return (
    <>
      <Routes>
        {/* Define routes for each page */}
        <Route path="/" element={<Home />} />
        <Route path="/login/*" element={<Login />} />
        <Route path="/register/*" element={<Register />} />
        <Route path="/chat/:userid" element={<ChatInterface />} />
        <Route path="/face-detection/:userid" element={<RealTimeOCR />} />
      </Routes>
    </>
  )
}

export default App
