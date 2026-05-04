import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CreateEvent from './pages/CreateEvent'
import EventDetail from './pages/EventDetail'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateEvent />} />
          <Route path="/event/:id" element={<EventDetail />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
