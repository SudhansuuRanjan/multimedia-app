import React, { useState } from 'react'
import Home from './pages/Home'
import Login from './pages/Login'
import PrivateRoute from './components/PrivateRoute'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path='/' element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App