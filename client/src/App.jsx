import { useState } from 'react'
import Home from './pages/Home'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import { Login, Register } from './pages/AuthPages'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        {/* Define routes for each page */}
        <Route path="/" element={<Home />} />
        <Route path="/login/*" element={<Login />} />
        <Route path="/register/*" element={<Register />} />
      </Routes>
    </>
  )
}

export default App
